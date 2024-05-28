import React, { useState } from 'react';
import axios from 'axios';
import { Link , useNavigate , useParams } from 'react-router-dom';
const AddTopic = () => {
    const [topicName, settopicName] = useState('');
    const [topicDescription, settopicDescription] = useState('');
    const navigate = useNavigate();
    const { id } = useParams()
  
    const handleSubmit = async (e) => {
        let token = window.localStorage.getItem("token");
        e.preventDefault();
        
        try {
          const res = await axios.post('http://localhost:3000/api/v1/group/add-topic', 
            { groupId:id, topicName, topicDescription },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log(res, "response");
          alert("topic Created Successfully");
          navigate(`/group/${id}`);
        } catch (error) {
          alert(error.response.data.message);
        }
      };
  return (
    <div>
    <h2>Add topic</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Topic Name:</label>
        <input type="text" value={topicName} onChange={(e) => settopicName(e.target.value)} required />
      </div>
      <div>
        <label>Topic Description:</label>
        <input type="text" value={topicDescription} onChange={(e) => settopicDescription(e.target.value)} required />
      </div>
      <button type="submit">Create topic</button>
    </form>
  </div>
  )
}

export default AddTopic