import React, { useEffect, useState, useRef } from 'react';
import { initSocket, getSocket } from '../socket';
import api from '../api/axios';

export default function Chat(){
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

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div style={{maxWidth:900, margin:'20px auto', display:'flex', gap:20}}>
            <div style={{flex:1}}>
                <h3>Room: <input value={room} onChange={e=>setRoom(e.target.value)} style={{width:120}}/></h3>
                <div style={{border:'1px solid #ccc', height:400, overflow:'auto', padding:10}}>
                    {messages.map((m, idx) => (
                        <div key={m._id || idx} style={{marginBottom:8}}>
                            {m.system ? <i style={{color:'#666'}}>{m.text}</i> :
                                <div><b>{m.username}</b>: {m.text} <small style={{color:'#888'}}>{new Date(m.createdAt).toLocaleTimeString()}</small></div>
                            }
                        </div>
                    ))}
                    <div ref={bottomRef}/>
                </div>

                <div style={{marginTop:10}}>
                    <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" style={{width:'70%'}} onKeyDown={e=>{ if(e.key==='Enter') send(); }} />
                    <button onClick={send}>Send</button>
                    <button onClick={logout} style={{marginLeft:10}}>Logout</button>
                </div>
            </div>

            <div style={{width:200}}>
                <h4>Online Users</h4>
                <ul>
                    {onlineUsers.map((u, i) => <li key={i}>{u.username}</li>)}
                </ul>
            </div>
        </div>
    )
}
