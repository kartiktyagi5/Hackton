import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Users } from 'lucide-react';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  college: string;
  isLeader: boolean;  // Keep isLeader here since it's in team_members
}

interface TeamDetails {
  id: string;
  name: string;
  code: string;
  leader: TeamMember | null;  // Leader is separate
  members: TeamMember[];     // Non-leader members
}

export default function JoinTeamPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    college: ''
  });

  useEffect(() => {
    checkAuth();
    if (code) {
      loadTeamDetails(code);
    }
  }, [code]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (!session) {
      toast.error('Please sign in to join the team');
      navigate('/auth');
    }
  };

  const loadTeamDetails = async (teamCode: string) => {
    try {
      setLoading(true);
      
      // Get team details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('code', teamCode)
        .single();

      if (teamError) {
        toast.error('Team not found');
        navigate('/');
        return;
      }

      // Get team members (including leader)
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamData.id);

      if (!teamMembers) {
        throw new Error('No team members found');
      }

      // Separate leader and members
      const leader = teamMembers.find(member => member.isLeader) || null;
      const members = teamMembers.filter(member => !member.isLeader);

      setTeam({
        id: teamData.id,
        name: teamData.name,
        code: teamData.code,
        leader: leader ? {
          id: leader.user_id,
          name: leader.name,
          email: leader.email,
          college: leader.college,
          isLeader: true
        } : null,
        members: members.map(member => ({
          id: member.user_id,
          name: member.name,
          email: member.email,
          college: member.college,
          isLeader: false
        }))
      });
      
    } catch (error) {
      console.error('Error loading team details:', error);
      toast.error('Failed to load team details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    try {
      setJoining(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to join the team');
        return;
      }

      // Check if team is full (total unique members in team_members)
      const totalMembers = (team.leader ? 1 : 0) + team.members.length;
      if (totalMembers >= 5) {
        toast.error('Team is already full');
        return;
      }

      // Check if user is already in a team
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast.error('You are already in a team');
        return;
      }

      // Join team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          name: userDetails.name,
          email: userDetails.email,
          college: userDetails.college,
          isLeader: false  // New members are not leaders
        });

      if (joinError) throw joinError;

      toast.success('Successfully joined the team!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error joining team:', error);
      toast.error('Failed to join team');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Not Found</h2>
          <p className="text-gray-600">The team you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalMembers = (team.leader ? 1 : 0) + team.members.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Team Header */}
          <div className="bg-blue-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <p className="mt-2 text-blue-100">Team Code: {team.code}</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-full flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>{totalMembers}/5 members</span>
              </div>
            </div>
          </div>

          {/* Team Leader */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold mb-6">Team Leader</h2>
            {team.leader ? (
              <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{team.leader.name}</p>
                  <p className="text-sm text-gray-500">{team.leader.email}</p>
                  <p className="text-sm text-gray-500">{team.leader.college}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  Team Leader
                </span>
              </div>
            ) : (
              <p className="text-gray-500">No leader assigned</p>
            )}
          </div>

          {/* Team Members */}
          <div className="px-6 py-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Team Members ({team.members.length})</h2>
            {team.members.length > 0 ? (
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    <p className="text-sm text-gray-500">{member.college}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No additional members yet</p>
            )}
          </div>

          {/* Join Form */}
          {isAuthenticated && totalMembers < 5 && (
            <div className="px-6 py-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Join This Team</h2>
              <form onSubmit={handleJoinTeam} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College/University
                  </label>
                  <input
                    type="text"
                    required
                    value={userDetails.college}
                    onChange={(e) => setUserDetails({ ...userDetails, college: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={joining}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
                    transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                >
                  {joining ? 'Joining Team...' : 'Join Team'}
                </button>
              </form>
            </div>
          )}

          {totalMembers >= 5 && (
            <div className="px-6 py-8 border-t border-gray-200">
              <div className="text-center text-gray-600">
                <p className="text-lg font-medium">This team is already full</p>
                <p className="mt-2">Teams can have a maximum of 5 members</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
