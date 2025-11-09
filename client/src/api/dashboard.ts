import type { DashboardData } from '../types';

export const fetchDashboardData = async (): Promise<DashboardData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch('http://127.0.0.1:3000/api/v1/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors?.join("\n") || 'ダッシュボード情報の取得に失敗しました';
      throw new Error(message);
    }
    const data: DashboardData = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};