import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            nav('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <form onSubmit={submit} style={{maxWidth:400, margin:'30px auto'}}>
            <h2>Login</h2>
            <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} required />
            <br/>
            <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <br/>
            <button type="submit">Login</button>
        </form>
    );
}
