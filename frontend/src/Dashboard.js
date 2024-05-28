import React from 'react'
import './App.css'
import { Link , useNavigate } from 'react-router-dom'
const Dashboard = () => {

     const navigate = useNavigate()
    const Logout=()=>{
        window.localStorage.removeItem("token");
        navigate("/")

    }
  return (
    <div>
        <div className='top-bar'>
            <h1>Dashbaord</h1>
            <h3 style={{cursor:'pointer'}} onClick={()=>Logout()}>Logout</h3>
        </div>
        <div className='options'>
            <Link to={"/allgroups"} className='option'>
                <h3>All Groups</h3>
            </Link>
            <Link to={"/create-groups"} className='option'>
                <h3>Create group</h3>
            </Link>
        </div>
    </div>

  )
}

export default Dashboard