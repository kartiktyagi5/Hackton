import React, { useState } from 'react';
import { Users, UserPlus, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import team from '../assets/1.jpeg';

type FormType = 'create' | 'join';

export default function Register() {
  const [formType, setFormType] = useState<FormType>('create');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamCode, setTeamCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [teamSize, setTeamSize] = useState(0); // Track team size after creation
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const tokenData = localStorage.getItem('user');
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
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: 'error', text: 'Please sign in first' });
        return;
      }

      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        setMessage({ type: 'error', text: 'You are already in a team' });
        return;
      }

      const generatedTeamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const generatedInviteLink = `${window.location.origin}/join/${generatedTeamCode}`;

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
      setTeamSize(1); // Initially, only the leader is in the team
      setMessage({ type: 'success', text: 'Team created successfully! Add at least 2 more members to make it valid.' });
      setCreateTeamForm({ teamName: '', leadName: '', collegeName: '', email: tokenData || '' });
    } catch (error) {
      console.error('Error creating team:', error);
      setMessage({ type: 'error', text: 'Failed to create team' });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: 'error', text: 'Please sign in first' });
        return;
      }

      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        setMessage({ type: 'error', text: 'You are already in a team' });
        return;
      }

      const { data: team } = await supabase
        .from('teams')
        .select('*')
        .eq('code', joinTeamForm.teamCode)
        .single();

      if (!team) {
        setMessage({ type: 'error', text: 'Invalid team code' });
        return;
      }

      const { data: members } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team.id);

      if (members && members.length >= 5) {
        setMessage({ type: 'error', text: 'Team is full (max 5 members)' });
        return;
      }

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

      const newTeamSize = (members ? members.length : 0) + 1;
      setMessage({ 
        type: 'success', 
        text: `Successfully joined the team! Current size: ${newTeamSize}/5. ${newTeamSize < 3 ? 'Add more members to reach the minimum of 3.' : 'Team is valid!'}` 
      });
      setJoinTeamForm({ teamCode: '', name: '', collegeName: '', email: tokenData || '' });
    } catch (error) {
      console.error('Error joining team:', error);
      setMessage({ type: 'error', text: 'Failed to join team' });
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
    <section 
      className="min-h-screen py-20 relative bg-gray-900 bg-fixed bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${team})`,
      }}
      id="register"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join the Revolution
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Create or join a team to participate in the hackathon. Teams must have 3-5 members to be valid.
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setFormType('create')}
                className={`flex items-center px-6 py-3 rounded-md transition-all duration-300 ${
                  formType === 'create'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Create Team
              </button>
              <button
                onClick={() => setFormType('join')}
                className={`flex items-center px-6 py-3 rounded-md transition-all duration-300 ${
                  formType === 'join'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Join Team
              </button>
            </div>
          </div>

          {/* On-Screen Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Create Team Form */}
          {formType === 'create' && (
            <div className="grid md:grid-cols-2 gap-8">
              <form onSubmit={handleCreateTeamSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
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
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Team Information</h3>
                {teamCode ? (
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
                          className="flex-1 px-4 py-3 rounded-l-lg bg-gray-50 border border-gray-200"
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
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invite Link
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={inviteLink}
                          readOnly
                          className="flex-1 px-4 py-3 rounded-l-lg bg-gray-50 border border-gray-200"
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
                    <div className="mb-6">
                      <p className={`text-sm ${teamSize < 3 ? 'text-red-600' : 'text-green-600'}`}>
                        Current Team Size: {teamSize}/5 
                        {teamSize < 3 ? ' (Not valid yet - minimum 3 members required)' : ' (Valid team size)'}
                      </p>
                    </div>
                    {/* Guidelines and Procedure */}
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">How to Invite Teammates</h4>
                      <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm">
                        <li>Ask your teammates to sign up on the platform first using their email address.</li>
                        <li>Share the <strong>Invite Link</strong> above with your teammates.</li>
                        <li>Instruct them to go to the "Join Team" section after signing up.</li>
                        <li>They should paste the <strong>Team Code</strong> from the invite link into the "Team Code" field.</li>
                        <li>They’ll need to fill in their name, college, and email, then click "Join Team".</li>
                        <li>Once they join, they’ll be added to your team (minimum 3, maximum 5 members).</li>
                      </ol>
                      <p className="mt-4 text-sm text-gray-600">
                        <strong>Note:</strong> Your team must have at least 3 members to be valid for the hackathon, and cannot exceed 5 members. Invite teammates promptly to meet the minimum requirement.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Users className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-600 text-center">
                      Create a team to get your team code and invite link
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Join Team Form */}
          {formType === 'join' && (
            <div className="max-w-md mx-auto">
              <div className="mb-6 text-center">
                <p className="text-white text-lg font-medium">
                  Before joining, please ensure you’ve signed up with your email address.
                </p>
                <p className="text-gray-300 mt-2">
                  Ask your team leader for the invite link, then paste the team code below. Teams need 3-5 members to be valid.
                </p>
              </div>
              <form onSubmit={handleJoinTeamSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
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
                    placeholder="e.g., X7K9P2"
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
