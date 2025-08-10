import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { username, password });
            localStorage.setItem('token', res.data.token);
            nav('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Register failed');
        }
    }

    return (
        <form onSubmit={submit} style={{maxWidth:400, margin:'30px auto'}}>
            <h2>Register</h2>
            <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} required />
            <br/>
            <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            <br/>
            <button type="submit">Register</button>
        </form>
    )
}
