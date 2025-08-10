import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <nav style={{padding:10, borderBottom:'1px solid #ddd'}}>
                <Link to="/" style={{marginRight:10}}>Chat</Link>
                <Link to="/login" style={{marginRight:10}}>Login</Link>
                <Link to="/register">Register</Link>
            </nav>
            <Routes>
                <Route path="/" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
            </Routes>
        </Router>
    );
}

export default App;
