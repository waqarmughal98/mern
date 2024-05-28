import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const AllGroup = () => {
    
    const navigate = useNavigate()
    const [ data , setData ] = useState([])
     
    useEffect(()=>{
        fetchData()
    },[])


    const fetchData = async () => {
        let token= window.localStorage.getItem("token");
        try {
          const res = await axios.get('http://localhost:3000/api/v1/group/all-groups',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setData(res.data.data)
        } catch (error) {
          alert(error.response.data.message);
        }
      };

  return  (
    <div>
        <h1 style={{marginLeft:'1rem'}}>All Groups</h1>

        {
            data.length>0 ? (
                <div className='all-groups'> 
                     {
                        data.map((item, index)=>{
                            return (
                                <div className='group-individual' key={index}>
                                     <h3>Name: {item.groupName}</h3>
                                     <p>Description: {item.groupDescription}</p>
                                     <Link to={`/group/${item._id}`} style={{cursor:'pointer'}}>Vist Group</Link>
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

export default AllGroup