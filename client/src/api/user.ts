import type { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("認証トークンが見つかりません。ログインしてください。");
  }

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'ユーザー一覧の取得に失敗しました');
    }

    const data: User[] = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};