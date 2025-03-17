/*
  # Create teams and team members tables

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text)
      - `code` (text, unique)
      - `leader_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    - `team_members`
      - `id` (uuid, primary key)
      - `team_id` (uuid, references teams)
      - `user_id` (uuid, references auth.users)
      - `college` (text)
      - `joined_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for team creation and member management
    - Ensure team leaders can manage their teams
    - Allow members to view their team details
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  leader_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT teams_leader_unique UNIQUE (leader_id)
);

-- Create team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  college text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  CONSTRAINT team_members_user_unique UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Policies for teams table
CREATE POLICY "Users can create teams"
  ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Team leaders can update their teams"
  ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = leader_id)
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Users can view teams they belong to"
  ON teams
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = leader_id OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Policies for team_members table
CREATE POLICY "Team leaders can manage members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = team_members.team_id
      AND teams.leader_id = auth.uid()
    )
  );

CREATE POLICY "Members can view their team"
  ON team_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Members can remove themselves"
  ON team_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());