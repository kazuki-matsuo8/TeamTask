import type { TeamData, Team } from '../types';

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