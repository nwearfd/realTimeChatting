import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header'; // 새롭게 생성할 Header 컴포넌트를 import

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    return (
        <Router>
            <Header token={token} setToken={setToken} />
            <Routes>
                <Route path="/" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register setToken={setToken} />} />
            </Routes>
        </Router>
    );
}

export default App;