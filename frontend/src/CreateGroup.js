import React, { useState } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
        let token = window.localStorage.getItem("token");
        e.preventDefault();
        
        try {
          const res = await axios.post('http://localhost:3000/api/v1/group/create-group', 
            { groupName, groupDescription },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(res, "response");
          alert("Group Created Successfully");
          navigate('/dashboard');
        } catch (error) {
          alert(error.response.data.message);
        }
      };
  return (
    <div>
    <h2>Create Group</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Group Name:</label>
        <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
      </div>
      <div>
        <label>Group Description:</label>
        <input type="text" value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} required />
      </div>
      <button type="submit">Create Group</button>
    </form>
  </div>
  )
}

export default CreateGroup