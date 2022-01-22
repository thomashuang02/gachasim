import './Login.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FloatingObjects from '../FloatingObjects/FloatingObjects';
import TextTransition from "react-text-transition";

const Login = (props) => {
  const textChangeInterval = 2500;
  const messageBank = [
    'dopamine machine',
    'serotonin thrown in',
    'oxytocin ocean',
    'endorphins pourin',
    'lesser displeasure',
    'decoy joy',
    'satisfaction fraction',
    'slight delight',
    'ecstasy with extra fee',
    'blissful abyss hole',
    'material delirium',
    'rapture extractor',
    'laborious euphoria',
    'indiscretion heaven',
    'jubilation station',
    'free glee',
    'mystery felicity',
    'gladness madness',
    'therapized paradise'
  ]
  const [messageNumber, setMessageNumber] = useState(0);
  const generateRandomNumberExcept = (avoid) => {
    const number = Math.floor(Math.random() * messageBank.length);
    return number === avoid ? generateRandomNumberExcept(avoid) : number;
  }
  useEffect(() => {
    const intervalID = setInterval(() =>  {
      setMessageNumber(prevNumber => generateRandomNumberExcept(prevNumber));
    }, textChangeInterval);
    return () => clearInterval(intervalID);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')) {
      navigate('/gacha')
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validateInput = () => {
    if(username.length === 0) {
      setUsernameError('come on, at least try.');
      return false;
    }
    else {
      setUsernameError(null)
    }
    return true;
  }

  const submitLogin = (e) => {
    e.preventDefault();
    if(validateInput()) {
      axios.post(
        '/api/auth/login', 
        {
          username: username,
          password: password
        }
      )
      .then(res => {
        localStorage.setItem('token', res.data.token);
        navigate('/gacha');
      })
      .catch(err => {
        if (err.response.data) {
          setUsernameError(err.response.data.usernameError ? err.response.data.message : null);
          setPasswordError(err.response.data.passwordError ? err.response.data.message : null);
        }
        else {
          throw new Error(err);
        } 
      });
    }
  }

  const fadeIn = e => {
    e.target.classList.remove('loading');
  }

  return (
    <>
    <FloatingObjects />
    <form id='login-form' onSubmit={submitLogin}>
      <img onLoad={e => fadeIn(e)} className='logo loading' src='/images/masterless-starglitter.png' alt='masterless starglitter' />
      <div className='inner-form'>
        <div className='text-centered'>
          <div className='title'>
            <h4>gachasim</h4>
            <span className='note'>by <a href='https://platypus.house/' target='_blank' rel='noreferrer'>patapus</a></span>
          </div>
          <h2 className='changing-message'>
            <TextTransition
              text={ messageBank[messageNumber] }
              springConfig={{ stiffness: 50, damping: 20 }}
              style={{ margin: "0 4px" }}
              direction='down'
              inline
              noOverflow={true}
            />
            !
          </h2>
        </div>
        <div className='form-item'>
          <label htmlFor='login-username'>
            username:
            { usernameError ? <span className="error">{usernameError}</span> : null }
          </label>
          <input id='login-username' name="username" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div className='form-item'>
          <label htmlFor='login-password'>
            password:
            { passwordError ? <span className="error">{passwordError}</span> : null }
          </label>
          <input id='login-password' name="password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className='bottom-container'>
          <button type="submit">login</button>
          <div className='bottom-option'>
            new here? <a href='/register'>sign up!</a>
          </div>
        </div>
      </div>
    </form>
    </>
  );
}

export default Login;
