import React, { useState } from 'react';
import './login.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";


const Login = ({ onLogin }) => {
  const [name, setName] = useState('');
  const[password,setPassword]=useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && password) {
      onLogin(name,password);
    }
  };

  return (
    <div className='wrapper'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>

        
        <div className="input-box">
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          required 
        />
        <FaUser  className='icon'/>

        </div>

        <div className="input-box">
            <input 
            type="password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder='Password'/>

<FaLock  className='icon'/>
        </div>
        

        
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

export default Login;
