// src/components/Dashboard.js
import React, { useEffect, useMemo, useState } from 'react';
import JobTable from '../JobTable/JobTable';
import './Dashboard.css'
import { postData } from '../../RestAPIs/Apis';
const Dashboard = () => {
  // Get the username from the URL parameter
  // const location = useLocation();
  // console.log(location.state)
  // const username = location.state.username;
  const username = "Sriram"

  return (
    useMemo(() => {
      return (
        <div className="dashboard">
          <h1 className="greetingheading">Welcome, {username}!</h1>
          <JobTable />
        </div>
      )
    }, [])
  );
};

export default Dashboard;
