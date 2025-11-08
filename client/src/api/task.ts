import type { Task, User } from '../types';

type TaskData = Task & { users: User[]; };

export const getTasks = async (teamId: string): Promise<TaskData[]> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("認証トークンが見つかりません");

    try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'タスク一覧の取得に失敗しました');
    }
    const data: TaskData[] = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};

type TaskCreateData = {
  title: string;
  content?: string;
  deadline?: string;
  user_ids: number[];
};

export const createTask = async (teamId: string, taskData: TaskCreateData): Promise<TaskData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ task: taskData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'タスクの作成に失敗しました');
    }
    const data: TaskData = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};

type TaskUpdateData = {
  title?: string;
  content?: string;
  status?: string; 
  deadline?: string;
  user_ids?: number[];
};

export const updateTask = async (teamId: string, taskId: number, taskData: TaskUpdateData): Promise<TaskData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ task: taskData }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.errors.join("\n");
        throw new Error(message || 'タスクの更新に失敗しました');
    }
    const data: TaskData = await response.json();
    return data;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};

export const deleteTask = async (teamId: string, taskId: number): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("認証トークンが見つかりません");

  try {
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = response.statusText;
      throw new Error(errorData || 'タスクの削除に失敗しました');
    }
    return;

  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
};