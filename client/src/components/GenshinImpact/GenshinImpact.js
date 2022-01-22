import './GenshinImpact.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GenshinImpactLogo from './assets/genshin-impact-logo.png';
import GachaHeader from '../GachaHeader/GachaHeader';

const GenshinImpact = (props) => {
  const [username, setUsername] = [props.username, props.setUsername];

  const navigate = useNavigate();

  const getUser = () => {
    axios.get(
      '/api/auth/current-user', 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    ).then(res => {
      setUsername(res.data.username);
    }).catch(err => {
      setUsername(null);
      navigate('/login');
    })
  }

  useEffect(getUser, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GachaHeader username={username} logo={GenshinImpactLogo} />
  );
}

export default GenshinImpact;
