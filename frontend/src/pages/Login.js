import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setToken }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token); // 로그인 성공 시 부모 컴포넌트의 상태 업데이트 함수 호출
            nav('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form onSubmit={submit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
                <div className="mb-4">
                    <input
                        className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="아이디"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="비밀번호"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                    로그인
                </button>
            </form>
        </div>
    );
}