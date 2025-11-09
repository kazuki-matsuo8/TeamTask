import type { Team } from '../types';

export const acceptInvitation = async (invitationId: number): Promise<Team> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/invitations/${invitationId}/accept`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors?.join("\n") || '招待の承諾に失敗しました';
      throw new Error(message);
    }
    const data: Team = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};

export const rejectInvitation = async (invitationId: number): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/invitations/${invitationId}/reject`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors?.join("\n") || '招待の拒否に失敗しました';
      throw new Error(message);
    }
    return;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};