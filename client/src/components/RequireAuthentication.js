import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequireAuthentication = props => { 

    const setUsername = props.setUsername;
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

    return (<>{props.children}</>);
}

export default RequireAuthentication;