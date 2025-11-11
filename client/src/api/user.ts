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

export const getProfile = async (): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'プロフィールの取得に失敗しました');
    }
    return await response.json();
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};

type ProfileUpdateData = {
  name?: string;
  password?: string;
  password_confirmation?: string;
};

export const updateProfile = async (userData: ProfileUpdateData): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/profile', {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user: userData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'プロフィールの更新に失敗しました');
    }
    return await response.json();
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};