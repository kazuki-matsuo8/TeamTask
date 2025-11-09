import type { Message } from '../types';

export const fetchMessages = async (teamId: string): Promise<Message[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
        const message = errorData.errors.join("\n");
        throw new Error(message || 'メッセージの取得に失敗しました');
    }

    const data: Message[] = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('メッセージの取得に失敗しました');
  }
};

export const createMessage = async (teamId: string, content: string): Promise<Message> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:3000/api/v1/teams/${teamId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: { content },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const message = errorData.errors.join("\n");
      throw new Error(message || 'メッセージの送信に失敗しました');
    }

    const data: Message = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('メッセージの送信に失敗しました');
  }
};