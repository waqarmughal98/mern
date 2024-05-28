import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
const GroupRequests = () => {
    
    const navigate = useNavigate()
    const [ data , setData ] = useState([])
    const { id } = useParams();
    useEffect(()=>{
        fetchData()
    },[])

    
  const axiosInstance = (token) => {
    return axios.create({
      baseURL: 'http://localhost:3000/api/v1/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

    const handleRequest= async(requestId,request)=>{
    let token = await window.localStorage.getItem('token');
        try {
        const res = await axiosInstance(token).post(
            'group/handle-request',
            { groupId:id,requestId,request }
        );
          navigate("/allgroups")
        } catch (error) {
        alert(error.response.data.message);
        }

    }


    const fetchData = async () => {
        let token= window.localStorage.getItem("token");
        try {
          const res = await axios.post('http://localhost:3000/api/v1/group/get-group-requests',{groupId:id},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setData(res.data.data)
        } catch (error) {
          alert(error.response.data.message);
        }
      };

  return  (
    <div>
        <h1 style={{marginLeft:'1rem'}}>Group Requests</h1>

        {
            data.length>0 ? (
                <div className='all-groups'> 
                     {
                        data.map((item, index)=>{
                            return (
                                <div className='group-individual' key={index}>
                                     <h3>Name: {item.name}</h3>
                                     <p>Email: {item.email}</p>
                                     <p>Id: {item.id}</p>
                                     <div>
                                        <button onClick={()=>handleRequest(item.id,"approved")}>Approved</button>
                                        <button onClick={()=>handleRequest("denied")}>Denied</button>
                                     </div>
                                </div>
                            )
                        })
                     }
                </div>
            ):
            (
                <p style={{marginLeft:'1rem'}}>.....</p>
            )
        }

    </div>
  )
}

export default GroupRequests