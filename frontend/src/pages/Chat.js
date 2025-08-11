import React, { useEffect, useState, useRef } from 'react';
import { initSocket, getSocket } from '../socket';
import api from '../api/axios';

export default function Chat() {
    const [room, setRoom] = useState('general');
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const socket = initSocket(token);

        socket.on('connect_error', (err) => {
            console.error('Socket connect error', err.message);
        });

        socket.on('message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socket.on('onlineUsers', (users) => {
            setOnlineUsers(users);
        });

        // join room
        socket.emit('joinRoom', room);

        return () => {
            socket.disconnect();
        }
    }, [room]);

    useEffect(() => {
        // load previous messages via REST
        const load = async () => {
            try {
                const res = await api.get(`/messages/${room}`);
                setMessages(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, [room]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = () => {
        if (!text.trim()) return;
        const socket = getSocket();
        socket.emit('chatMessage', { room, text });
        setText('');
    };

    return (
        <div className="flex flex-col md:flex-row mx-auto p-4 gap-6 bg-gray-100" style={{height: '92vh', maxWidth: '100%'}}>
            <div className="flex-1 flex flex-col bg-gray-800 rounded-lg shadow-lg">
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">채팅방: <input value={room} onChange={e=>setRoom(e.target.value)} style={{width:120, color: "#535353"}}/></h3>
                </div>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {messages.map((m, idx) => (
                        <div key={m._id || idx} className="mb-4">
                            {m.system ? (
                                <div className="text-center text-gray-400 text-sm italic my-2">{m.text}</div>
                            ) : (
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                        {m.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-sm">{m.username}</div>
                                        <div className="flex items-end mt-1">
                                            <div className="bg-gray-700 text-white p-3 rounded-lg max-w-sm">
                                                {m.text}
                                            </div>
                                            <span className="text-xs text-gray-500 ml-2">
                                                {new Date(m.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* 메시지 입력 영역 */}
                <div className="p-4 border-t border-gray-700 bg-gray-800 flex items-center gap-2">
                    <input
                        className="flex-1 border-none rounded-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="메시지를 입력하세요."
                        onKeyDown={e => { if (e.key === 'Enter') send(); }}
                    />
                    <button
                        className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                        onClick={send}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45 -mt-1 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 온라인 사용자 목록 */}
            <div className="w-full md:w-64 bg-gray-800 rounded-lg shadow-lg p-4">
                <h4 className="text-xl font-bold text-white mb-4">참여자</h4>
                <ul className="space-y-2">
                    {onlineUsers.map((u, i) => (
                        <li key={i} className="flex items-center text-white">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold mr-2">
                                {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span>{u.username}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}