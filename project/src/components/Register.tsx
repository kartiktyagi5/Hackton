import React, { useState } from 'react';
import { Users, UserPlus, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

type FormType = 'create' | 'join';

export default function Register() {
  const [formType, setFormType] = useState<FormType>('create');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamCode, setTeamCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  // Safely get the auth token from localStorage
const tokenData= localStorage.getItem('user');
  const [createTeamForm, setCreateTeamForm] = useState({
    teamName: '',
    leadName: '',
    collegeName: '',
    email: tokenData || ''
  });

  const [joinTeamForm, setJoinTeamForm] = useState({
    teamCode: '',
    name: '',
    collegeName: '',
    email: tokenData || ''
  });


  const handleCreateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in first');
        return;
      }

      // Check if user is already in a team
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.error('You are already in a team');
        return;
      }

      // Generate unique team code
      const generatedTeamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const generatedInviteLink = `${window.location.origin}/join/${generatedTeamCode}`;

      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: createTeamForm.teamName,
          code: generatedTeamCode,
          leader_id: user.id,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Create or update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: createTeamForm.leadName,
          email: createTeamForm.email,
          college: createTeamForm.collegeName,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Add leader as team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          name: createTeamForm.leadName,
          email: createTeamForm.email,
          college: createTeamForm.collegeName,
          isLeader: true,
        });

      if (memberError) throw memberError;

      setTeamCode(generatedTeamCode);
      setInviteLink(generatedInviteLink);
      toast.success('Team created successfully!');
      setCreateTeamForm({ teamName: '', leadName: '', collegeName: '', email: '' });
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in first');
        return;
      }

      // Check if user is already in a team
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.error('You are already in a team');
        return;
      }

      // Find team by code
      const { data: team } = await supabase
        .from('teams')
        .select('*')
        .eq('code', joinTeamForm.teamCode)
        .single();

      if (!team) {
        toast.error('Invalid team code');
        return;
      }

      // Check team size
      const { data: members } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team.id);

      if (members && members.length >= 5) {
        toast.error('Team is full');
        return;
      }

      // Create or update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: joinTeamForm.name,
          email: joinTeamForm.email,
          college: joinTeamForm.collegeName,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // Join team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          name: joinTeamForm.name,
          email: joinTeamForm.email,
          college: joinTeamForm.collegeName,
        });

      if (joinError) throw joinError;

      toast.success('Successfully joined the team!');
      setJoinTeamForm({ teamCode: '', name: '', collegeName: '', email: '' });
    } catch (error) {
      console.error('Error joining team:', error);
      toast.error('Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
            Join the Revolution
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Create or join a team to participate in the hackathon
          </p>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setFormType('create')}
                className={`flex items-center px-6 py-3 rounded-md transition-all duration-300 ${
                  formType === 'create'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Create Team
              </button>
              <button
                onClick={() => setFormType('join')}
                className={`flex items-center px-6 py-3 rounded-md transition-all duration-300 ${
                  formType === 'join'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Join Team
              </button>
            </div>
          </div>

          {/* Create Team Form */}
          {formType === 'create' && (
            <div className="grid md:grid-cols-2 gap-12">
              <form onSubmit={handleCreateTeamSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={createTeamForm.teamName}
                    onChange={(e) => setCreateTeamForm({ ...createTeamForm, teamName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Lead Name
                  </label>
                  <input
                    type="text"
                    value={createTeamForm.leadName}
                    onChange={(e) => setCreateTeamForm({ ...createTeamForm, leadName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/University
                  </label>
                  <input
                    type="text"
                    value={createTeamForm.collegeName}
                    onChange={(e) => setCreateTeamForm({ ...createTeamForm, collegeName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={createTeamForm.email}
                    onChange={(e) => setCreateTeamForm({ ...createTeamForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                    disabled
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                    transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Creating Team...' : 'Create Team'}
                </button>
              </form>

              {/* Team Code Display */}
              <div className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-6">Team Information</h3>
                {teamCode && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Code
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={teamCode}
                          readOnly
                          className="flex-1 px-4 py-3 rounded-l-lg bg-white border border-r-0 border-gray-200"
                        />
                        <button
                          onClick={() => copyToClipboard(teamCode)}
                          className="px-4 py-3 rounded-r-lg bg-gray-100 border border-gray-200 
                            hover:bg-gray-200 transition-colors"
                        >
                          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invite Link
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={inviteLink}
                          readOnly
                          className="flex-1 px-4 py-3 rounded-l-lg bg-white border border-r-0 border-gray-200"
                        />
                        <button
                          onClick={() => copyToClipboard(inviteLink)}
                          className="px-4 py-3 rounded-r-lg bg-gray-100 border border-gray-200 
                            hover:bg-gray-200 transition-colors"
                        >
                          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {!teamCode && (
                  <p className="text-gray-600">
                    Create a team to get your team code and invite link
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Join Team Form */}
          {formType === 'join' && (
            <form onSubmit={handleJoinTeamSubmit} className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Code
                </label>
                <input
                  type="text"
                  value={joinTeamForm.teamCode}
                  onChange={(e) => setJoinTeamForm({ ...joinTeamForm, teamCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={joinTeamForm.name}
                  onChange={(e) => setJoinTeamForm({ ...joinTeamForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College/University
                </label>
                <input
                  type="text"
                  value={joinTeamForm.collegeName}
                  onChange={(e) => setJoinTeamForm({ ...joinTeamForm, collegeName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={joinTeamForm.email}
                  onChange={(e) => setJoinTeamForm({ ...joinTeamForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                  disabled
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                  transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Joining Team...' : 'Join Team'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
