import type { SignUpData } from '../types';

export const signUp = async (userData: SignUpData) => {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/v1/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user: {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    password_confirmation: userData.password_confirmation,
                },
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '登録に失敗しました');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API呼び出しエラー:', error);
        throw error;
    }
};