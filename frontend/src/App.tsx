// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.tsx';
import Users from './pages/Users.tsx';
import Login from './pages/Login.tsx';
import User from "./pages/User.tsx";
import Expedition from "./pages/Expedition.tsx";
import Expeditions from "./pages/ExpeditionsList.tsx";

function App() {


  return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/profile" element={<User />} />
                <Route path="/register" element={<Register />} />
                <Route path="/users" element={<Users />} />
                <Route path="/expeditions" element={<Expedition/>}/>
                <Route path="/expeditions_all" element={<Expeditions/>}/>
            </Routes>
        </Router>
  )
}

export default App
