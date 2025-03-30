// src/App.js
import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Navbar from './components/Navbar';
import Home from './components/Home/Home';
import Editor from './components/Editor';
import GroupEditor from './components/GroupEditor';
import  useAuth  from './redux/hooks/useAuth'



function App() {
  const { user, UpdateUserLogin} = useAuth()
  const [userId, setuserId] = useState()
  
//   socket.on('connect', () => {
//     // console.log('Connected to server');
// });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/documents/userId?username=${user}`);
        if (!response.ok) {
          throw new Error('Error fetching user ID');
        }
        const data = await response.json();
        // console.log(data._id)
        setuserId(data._id)
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    if(user) fetchUserId()
    const tkn = JSON.parse(localStorage.getItem('token'));

    if(tkn){
      UpdateUserLogin(tkn.username, tkn.token)
      // console.log(tkn.username)
    }
  }, [ ,user])
 
  return (
    <Router>
      <Navbar/>

      <Routes>
        <Route
          path="/"
          element={user? <Home userId={userId}/>: <Navigate to="/login"/>}
        />
        <Route path="/login" element={!user ? <LoginForm />: <Navigate to="/"/>} />
        <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/"/>} />
        <Route path="/myEditor" element={user ? <Editor userId={userId}/> : <Navigate to="/login"/>} />
        <Route path="/groupEditor" element={user ? <GroupEditor /> : <Navigate to="/login"/>} />
      </Routes>
    </Router>
  );
}

export default App;
