import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AllTopics from './AllTopics';
const SelectedGroup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const { id } = useParams();
  const [token, setToken] = useState();
  const [access, setAccess] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    (async () => {
      let id = await window.localStorage.getItem('userId');
      fetchData(id);
    })();
  }, []);

  const axiosInstance = (token) => {
    return axios.create({
      baseURL: 'http://localhost:3000/api/v1/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  };

  console.log(id, 'ids');

  const fetchData = async (userId) => {
    let token = await window.localStorage.getItem('token');
    try {
      const res = await axiosInstance(token).post(
        'group/filter-group-by-id',
        { id }
      );
      setData(res.data.data);
      const members = res.data.data.groupMembers;
      console.log(userId, 'userId');
      let userFound = false;
      members.forEach((item) => {
        if (item.id == userId) {
          setAccess(item.access);
          setStatus(item.status);
          userFound = true;
        }
      });
      if (!userFound) {
        setAccess(false);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const SendRequest = async (groupId) => {
    let token = await window.localStorage.getItem('token');
    try {
      const res = await axiosInstance(token).post(
        'group/send-request-to-join-group',
        { groupId }
      );
      setAccess('pending');
    } catch (error) {
      alert(error.response.data.message);
    }
  };


  return (
    data && (
      <div>
        <div>
          <h1>Group Name: {data.groupName}</h1>
          <h4>Group Name: {data.groupDescription}</h4>
        </div>
        {!access ? (
          <div>
            <button onClick={() => SendRequest(data._id)}>
              Send Request to Join Group
            </button>
          </div>
        ) : access == 'pending' ? (
          <div>
          <button >
              Request in Pending
            </button>
          </div>
        ) : access == 'approved' ? (
          <div>{status == 'admin' ? <div>
            <h4>You are the admin of this group</h4>
             <Link to={`/group/requests/${id}`}>View Group Reqests</Link>
             <AllTopics id={id}/>
          </div> :
           <div>
              <h4>Now You are the member of this group</h4>
              <AllTopics id={id}/>
            </div>
            }</div>
        ) : null}
      </div>
    )
  );
};

export default SelectedGroup;
