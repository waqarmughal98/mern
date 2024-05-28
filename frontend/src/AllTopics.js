import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AllTopics = ({id}) => {
    const navigate = useNavigate()
    const [ data , setData ] = useState([])
     
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
    

    const fetchData = async () => {
        let token= window.localStorage.getItem("token");
        try {
          const res = await axiosInstance(token).post('group/get-topics-of-group',{groupId:id});
          setData(res.data.data[0].topics)
        } catch (error) {
          alert(error.response.data.message);
        }
      };

  return (
    <div>
        <Link to={`/add-topic/${id}`}>Add Topic</Link>
        <h3>All Topics</h3>
        {
            data?.length>0 ? (
                <div className='all-groups'> 
                     {
                        data.map((item, index)=>{
                            return (
                                <div className='group-individual' key={index}>
                                     <h3>Name: {item.topicName}</h3>
                                     <p>description: {item.topicDescription}</p>
                                     <Link to={`/topic/${id}/${item.topicId}`} style={{cursor:'pointer'}}>View Topic</Link>
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

export default AllTopics