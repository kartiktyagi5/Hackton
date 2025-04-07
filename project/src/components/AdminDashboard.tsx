import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

interface TeamWithMembers {
  id: string;
  name: string;
  code: string;
  problem_statement?: string;
  members: {
    name: string;
    email: string;
    college: string;
    isLeader?: boolean;
  }[];
}

interface DomainStats {
  domain: string;
  problemStatements: { [key: string]: number };
}

export default function AdminDashboard() {
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [teamsWithProblemStatement, setTeamsWithProblemStatement] = useState(0);
  const [domainStats, setDomainStats] = useState<DomainStats[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define domains and problem statements
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
  };

  useEffect(() => {
    loadTeams();
    // Subscribe to real-time updates
    const teamsSubscription = supabase
      .channel('teams-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, (payload) => {
        loadTeams(); // Reload teams on any change
      })
      .subscribe();

    const membersSubscription = supabase
      .channel('team_members-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, (payload) => {
        loadTeams(); // Reload teams on any change to reflect member updates
      })
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(teamsSubscription);
      supabase.removeChannel(membersSubscription);
    };
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);

      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          code,
          problem_statement,
          team_members (
            name,
            email,
            college,
            isLeader
          )
        `);

      if (teamsError) throw teamsError;

      const teamsWithMembers = teamsData?.map(team => ({
        id: team.id,
        name: team.name,
        code: team.code,
        problem_statement: team.problem_statement || '',
        members: team.team_members || [],
      })) || [];

      setTeams(teamsWithMembers);
      setTotalTeams(teamsWithMembers.length);
      setTotalMembers(teamsWithMembers.reduce((sum, team) => sum + team.members.length, 0));
      setTeamsWithProblemStatement(teamsWithMembers.filter(team => team.problem_statement).length);

      // Calculate domain and problem statement statistics
      const stats: DomainStats[] = Object.keys(domains).map(domain => ({
        domain,
        problemStatements: domains[domain].reduce((acc, problem) => {
          acc[problem] = teamsWithMembers.filter(team => team.problem_statement === problem.match(/\(([^)]+)\)/)?.[1]).length;
          return acc;
        }, {} as { [key: string]: number }),
      }));
      setDomainStats(stats);
    } catch (error) {
      console.error('Error loading teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    try {
      const workbook = XLSX.utils.book_new();

      // Create worksheet for teams overview
      const teamsData = teams.map(team => {
        const members = team.members.sort((a, b) => (a.isLeader ? -1 : 1));
        const totalMembers = team.members.length;
        const isValid = totalMembers >= 3 && totalMembers <= 5;

        return {
          'Team Name': team.name,
          'Team Code': team.code,
          'Problem Statement': team.problem_statement || 'Not set',
          'Total Members': totalMembers,
          'Remaining Slots': 5 - totalMembers,
          'Validity': isValid ? 'Valid' : 'Invalid (needs 3-5 members)',
          'Member 1': `${members[0]?.name || ''} (${members[0]?.email || ''})`,
          'Member 2': `${members[1]?.name || ''} (${members[1]?.email || ''})`,
          'Member 3': `${members[2]?.name || ''} (${members[2]?.email || ''})`,
          'Member 4': `${members[3]?.name || ''} (${members[3]?.email || ''})`,
          'Member 5': `${members[4]?.name || ''} (${members[4]?.email || ''})`,
        };
      });

      const teamsSheet = XLSX.utils.json_to_sheet(teamsData);
      XLSX.utils.book_append_sheet(workbook, teamsSheet, 'Teams Overview');

      // Create worksheet for detailed member information
      const membersData = teams.flatMap(team =>
        team.members.map(member => ({
          'Team Name': team.name,
          'Team Code': team.code,
          'Problem Statement': team.problem_statement || 'Not set',
          'Member Name': member.name,
          'Email': member.email,
          'College': member.college,
          'Role': member.isLeader ? 'Leader' : 'Member',
          'Team Validity': team.members.length >= 3 && team.members.length <= 5 ? 'Valid' : 'Invalid',
        }))
      );

      const membersSheet = XLSX.utils.json_to_sheet(membersData);
      XLSX.utils.book_append_sheet(workbook, membersSheet, 'Team Members');

      // Create worksheet for domain and problem statement statistics
      const domainStatsData = domainStats.flatMap(stat =>
        Object.entries(stat.problemStatements).map(([problem, count]) => ({
          Domain: stat.domain,
          'Problem Statement': problem,
          'Teams Selected': count,
        }))
      );
      const domainStatsSheet = XLSX.utils.json_to_sheet(domainStatsData);
      XLSX.utils.book_append_sheet(workbook, domainStatsSheet, 'Domain Stats');

      XLSX.writeFile(workbook, 'teams-report.xlsx');
      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-black hover:bg-blue-500 mr-2"
            >
              Home
            </button>
            <button
              onClick={downloadExcel}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Report
            </button>
          </div>
        </div>

        {/* Cards for Total Teams, Total Members, and Teams with Problem Statement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-600">
            <h3 className="text-lg font-medium text-gray-900">Total Teams Registered</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalTeams}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-600">
            <h3 className="text-lg font-medium text-gray-900">Total Members</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{totalMembers}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-yellow-600">
            <h3 className="text-lg font-medium text-gray-900">Teams with Problem Statement</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{teamsWithProblemStatement}</p>
          </div>
        </div>

        {/* Table for Domain and Problem Statement Distribution */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Domain and Problem Statement Distribution</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem Statement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams Selected</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {domainStats.map(stat =>
                  Object.entries(stat.problemStatements).map(([problem, count]) => (
                    <tr key={`${stat.domain}-${problem}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.domain}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{problem}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => {
            const totalMembers = team.members.length;
            const isValid = totalMembers >= 3 && totalMembers <= 5;

            return (
              <div
                key={team.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden ${
                  !isValid ? 'border-2 border-red-500' : 'border-2 border-transparent'
                }`}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{team.name}</h2>
                      <p className="text-sm text-gray-500">Code: {team.code}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Problem Statement: {team.problem_statement || 'Not set'}
                      </p>
                    </div>
                    <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                      <Users className="w-4 h-4 text-blue-600 mr-1" />
                      <span className="text-sm text-blue-600 font-medium">
                        {totalMembers}/5
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm mt-2 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isValid 
                      ? 'Team is valid (3-5 members)' 
                      : 'Team is not valid (needs 3-5 members)'}
                  </p>
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {team.members.map((member, index) => (
                      <div key={index} className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          <p className="text-xs text-gray-400">{member.college}</p>
                        </div>
                        {member.isLeader && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Leader
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
