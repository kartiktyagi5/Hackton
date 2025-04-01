import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import TeamChat from './TeamChat'; // Import the TeamChat component

interface Team {
  id: string;
  name: string;
  code: string;
  leader_id: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  college: string;
  isLeader?: boolean;
}

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setCurrentUserId(user.id);

      let currentTeam = null;

      // Check if user is a team leader
      const { data: leaderTeam } = await supabase
        .from('teams')
        .select('*')
        .eq('leader_id', user.id)
        .single();

      if (leaderTeam) {
        currentTeam = leaderTeam;
      } else {
        // Check if user is a team member
        const { data: memberTeam } = await supabase
          .from('team_members')
          .select(`team_id, teams (*)`)
          .eq('user_id', user.id)
          .single();

        if (memberTeam) {
          currentTeam = memberTeam.teams;
        }
      }

      if (currentTeam) {
        setTeam(currentTeam);

        // Fetch team members
        const { data: teamMembers } = await supabase
          .from('team_members')
          .select(`id, user_id, name, email, college, isLeader`)
          .eq('team_id', currentTeam.id);

        let allMembers: TeamMember[] = teamMembers || [];

        // Fetch leader details and include in member list
        const { data: leaderData } = await supabase
          .from('user_profiles')
          .select('user_id, full_name, email, college')
          .eq('user_id', currentTeam.leader_id)
          .single();

        if (leaderData) {
          const leaderMember: TeamMember = {
            id: leaderData.user_id,
            user_id: leaderData.user_id,
            name: leaderData.full_name,
            email: leaderData.email,
            college: leaderData.college,
            isLeader: true
          };

          const isLeaderInList = allMembers.some(
            (member) => member.user_id === leaderMember.user_id
          );
          if (!isLeaderInList) {
            allMembers.unshift(leaderMember); // Add leader at the top
          }
        }

        setMembers(allMembers);
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Successfully left the team');
      setTeam(null);
      setMembers([]);
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error('Failed to leave team');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onLogout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalMembers = members.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Team Dashboard</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-black"
              >
                Home
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {team ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: Team Info */}
            <div className="bg-white shadow rounded-lg p-6">
              {/* Team Info */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Team: {team.name}</h2>
                <p className="text-sm text-gray-500">Team Code: {team.code}</p>
                <div className="flex items-center mt-2">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-sm text-gray-500">Total Members: {totalMembers}/5</p>
                </div>
                <p className={`text-sm mt-1 ${totalMembers < 3 ? 'text-red-600' : 'text-green-600'}`}>
                  {totalMembers < 3 
                    ? `Team is not valid yet (minimum 3 members required)` 
                    : `Team is valid (3-5 members)`}
                </p>
              </div>

              {/* Team Members */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-sm text-gray-500">{member.college}</p>
                      {member.isLeader && (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                          Leader
                        </span>
                      )}
                    </div>
                    {!member.isLeader && member.user_id === currentUserId && (
                      <button
                        onClick={handleLeaveTeam}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Leave Team
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              {totalMembers < 3 && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-sm text-yellow-700">
                    Your team needs at least 3 members to be valid for the hackathon. Share your team code ({team.code}) with others to invite them!
                  </p>
                </div>
              )}
            </div>

            {/* Right column: Team Chat */}
            <div>
              {team && currentUserId && (
                <TeamChat teamId={team.id} currentUserId={currentUserId} />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Team Found</h2>
            <p className="text-gray-600">Create or join a team to get started.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Register
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
