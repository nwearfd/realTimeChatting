import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ token, setToken }) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-gray-800 text-white shadow-lg">
            <div className="flex items-center space-x-4">
                <Link to="/" className="text-xl font-bold hover:text-blue-400 transition-colors">Chat</Link>
                <Link to="/register" className="font-bold hover:text-blue-400 transition-colors">회원가입</Link>
            </div>
            <div>
                {token ? (
                    <button
                        onClick={logout}
                        className="bg-red-600 px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="bg-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">Login</Link>
                )}
            </div>
        </nav>
    );
}