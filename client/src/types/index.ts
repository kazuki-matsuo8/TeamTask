export type SignUpData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type Message = {
  id: number;
  content: string;
  user: {
    id: number;
    name: string;
  };
  created_at: string;
};

export type TeamData = {
  name: string;
  description?: string; 
};

export type Team = {
  id: number;
  name: string;
  description: string | null; 
  created_at: string;
  updated_at: string;
};

// Railsのenumと値を一致させる
export type TaskStatus = "todo" | "inprogress" | "done";

export type Task = {
  id: number;
  title: string;
  content: string | null;
  deadline: string | null;
  status: TaskStatus;
  team_id: number;
  created_at: string;
  updated_at: string;
};

export type Invitation = {
  invitation_id: number;
  team: Team;
};

export type UpcomingTask = Task & {
  users: User[];
  team: Team;
};

export type DashboardData = {
  pending_invitations: Invitation[];
  my_teams: Team[];
  upcoming_tasks: UpcomingTask[];
};