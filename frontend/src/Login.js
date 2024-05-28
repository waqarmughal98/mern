// src/components/Login.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  

  useEffect(()=>{
    (async()=>{
      let token =  await window.localStorage.getItem("token");
      if(token){
        navigate("/dashboard")
      }
    })()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
      await axios.post('http://localhost:3000/api/v1/user/login', { email, password }).then((res)=>{
        console.log(res,"response")
        alert("login Successfull")
        window.localStorage.setItem("token", res.data.data.token);
        window.localStorage.setItem("userId", res.data.data.id);
        navigate('/dashboard');
      }).catch((error)=>{
        alert(error.response.data.message)
      })
     
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        <Link to={"/signup"}>want to sign Up?</Link>
      </form>
    </div>
  );
}

export default Login;
