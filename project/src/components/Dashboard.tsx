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
  problem_statement?: string; // Add problem_statement to the Team interface
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

const domains = {
  'SDRE': [
    'EV Route & Charging Optimization (SDRE-1)',
    'Carbon Footprint Tracker (SDRE-2)',
    'Community-Based Food Donation Platform (SDRE-3)',
    'EV Subscription & Roadside Assistance Platform (SDRE-4)',
    'Sustainable Waste Management System (SDRE-5)',
  ],
  'AFGI': [
    'Agricultural Product Marketplace (AFGI-1)',
    'AI-Powered Pest & Disease Detection (AFGI-2)',
    'Waste Reduction & Circular Economy (AFGI-3)',
    'Digital Crop Monitoring System for Food Security (AFGI-4)',
    'Urban Farming Management Software (AFGI-5)',
  ],
  'MHB': [
    'Patient Appointment Scheduling System (MHB-1)',
    'Medical Research Data Management System (MHB-2)',
    'Bioinformatics Data Visualization Tool (MHB-3)',
    'Nutrition & Diet Management (MHB-4)',
    'Real-Time Blood Bank & Organ Donation Registry (MHB-5)',
  ],
  'SEFB': [
    'Financial Literacy Mobile App (SEFB-1)',
    'Business Performance Analytics Tool (SEFB-2)',
    'FinTech: SME Financial Management & Credit Access (SEFB-3)',
    'The Ultimate Startup Ecosystem Platform (SEFB-4)',
    'Startup & Business Education Hub (SEFB-5)',
  ],
  'OISSEE':[
    'Open Innovation,Student Startup and Entrepreneurial Ecosystems(OISSEE-1)',
  ],
};

export default function Dashboard({ onLogout }: DashboardProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Define deadline in UTC to avoid time zone issues
  const deadline = new Date('2025-04-12T06:59:59Z'); // April 11, 2025, 11:59 PM PDT = April 12, 2025, 06:59 AM UTC
  const currentDate = new Date(); // Current date in local time
  const currentTimestamp = currentDate.getTime();
  const deadlineTimestamp = deadline.getTime();

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

        // Set initial selected domain and problem if problem_statement exists
        if (currentTeam.problem_statement) {
          const [domain, problemCode] = currentTeam.problem_statement.split('-');
          const problemIndex = parseInt(problemCode) - 1;
          setSelectedDomain(domain);
          setSelectedProblem(domains[domain][problemIndex] || '');
        }
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

  const handleProblemStatementSave = async () => {
    if (!team || !selectedProblem) return;

    try {
      setSaving(true);
      const problemCode = selectedProblem.match(/\(([^)]+)\)/)?.[1]; // Extract code like "SDRE-1"
      const { error } = await supabase
        .from('teams')
        .update({ problem_statement: problemCode })
        .eq('id', team.id);

      if (error) throw error;

      setTeam({ ...team, problem_statement: problemCode });
      toast.success('Problem statement updated successfully');
    } catch (error) {
      console.error('Error saving problem statement:', error);
      toast.error('Failed to update problem statement');
    } finally {
      setSaving(false);
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
  const isLeader = currentUserId === team?.leader_id; // Determine if the current user is the leader
  const canEditProblemStatement = isLeader && currentTimestamp < deadlineTimestamp;

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

              {/* Problem Statement */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Problem Statement</h3>
                {isLeader ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Domain</label>
                        <select
                          value={selectedDomain}
                          onChange={(e) => {
                            setSelectedDomain(e.target.value);
                            setSelectedProblem(''); // Reset problem when domain changes
                          }}
                          disabled={!canEditProblemStatement}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        >
                          <option value="">Select a domain</option>
                          {Object.keys(domains).map((domain) => (
                            <option key={domain} value={domain}>{domain}</option>
                          ))}
                        </select>
                      </div>
                      {selectedDomain && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select Problem Statement</label>
                          <select
                            value={selectedProblem}
                            onChange={(e) => setSelectedProblem(e.target.value)}
                            disabled={!canEditProblemStatement}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          >
                            <option value="">Select a problem statement</option>
                            {domains[selectedDomain].map((problem) => (
                              <option key={problem} value={problem}>{problem}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    {canEditProblemStatement ? (
                      <button
                        onClick={handleProblemStatementSave}
                        disabled={saving || !selectedProblem}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Problem Statement'}
                      </button>
                    ) : (
                      <p className="mt-4 text-sm text-red-600">
                        Problem statement selection is locked after April 11, 2025.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-600">
                    Selected Problem Statement: {team.problem_statement ? 
                      domains[team.problem_statement.split('-')[0]]?.find(p => p.includes(team.problem_statement)) || 'Not set' 
                      : 'Not set'}
                    <br />
                    <span className="text-xs text-gray-500">Only the team leader can set the problem statement.</span>
                  </p>
                )}
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
