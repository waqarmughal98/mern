import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate , useParams} from 'react-router-dom';

const SelectedTopic = () => {

    const navigate = useNavigate()
    const [ data , setData ] = useState([])
    const [ commentText , setCommentText ] = useState("")
    const [comments, setcomments] =useState([])
    const [tempcomments, setTemcomments] =useState([])
     
    useEffect(()=>{
        fetchData()
    },[tempcomments])

    useEffect(()=>{
        fetchTopicData()
    },[])

    const {id, topicId}=useParams()

    const axiosInstance = (token) => {
        return axios.create({
          baseURL: 'http://localhost:3000/api/v1/',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      };


      const AddComments=(e)=>{
        e.preventDefault()
        if(commentText==""){
            alert("kindly first add comment")
        }
        let token= window.localStorage.getItem("token");
      
       axiosInstance(token).post('group/add-comment',{groupId:id,topicId,comment:commentText}).then((res)=>{
        setCommentText("")
        setTemcomments((pre)=>[...pre,commentText])
       }).catch((error)=>{
        console.log(error)
       })
         
      }
    

    const fetchData = async () => {
        let token= window.localStorage.getItem("token");
        try {
          const res = await axiosInstance(token).post('group/get-comments-of-group',{groupId:id,topicId});
          setcomments(res.data.data)
        } catch (error) {
          alert(error.response.data.message);
        }
      };

    const fetchTopicData = async () => {
        let token= window.localStorage.getItem("token");
        try {
          const res = await axiosInstance(token).post('group/get-topic-by-id',{groupId:id,topicId});
          setData(res.data.data)
        } catch (error) {
          alert(error.response.data.message);
        }
      };

  return data && (
    <div>
        <h3>TopicName : {data.topicName}</h3>
        <p>Topic Description : {data.topicDescription}</p>
        
        <form onSubmit={(e)=>AddComments(e)}>
            <input type="text" value={commentText} onChange={(e)=>setCommentText(e.target.value)} />
            <button onClick={(e)=>AddComments(e)}>Add Comment</button>
        </form>
        
        <h3>All Comments</h3>
        
        {
            comments?.length>0 ? (
                <div className='all-groups'> 
                     {
                        comments.map((item, index)=>{
                            return (
                                <div className='group-individual' key={index}>
                                     <h3>Name: {item.name}</h3>
                                     <h3>Comment: {item.comment}</h3>
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

export default SelectedTopic