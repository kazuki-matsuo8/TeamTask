import type { TeamData, Team, User, TeamMember } from '../types';

export const createTeam = async (teamData: TeamData): Promise<Team> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("認証トークンが見つかりません。ログインしてください。");
  }

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ team: teamData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'チームの作成に失敗しました');
    }

    const data: Team = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};

export const inviteUserToTeam = async (teamId: string, userId: number): Promise<User> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("認証トークンが見つかりません。ログインしてください。");
  }

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || '招待に失敗しました');
    }

    const data: User = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};

export const getTeam = async (teamId: string): Promise<Team> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'チーム情報の取得に失敗しました');
    }
    const data: Team = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};


export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'メンバー一覧の取得に失敗しました');
    }
    const data: TeamMember[] = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};

export const removeMemberFromTeam = async (teamId: string, teamUserId: number): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/members/${teamUserId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'メンバーの削除に失敗しました');
    }
    return;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};