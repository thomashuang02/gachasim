import './Register.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingObjects from '../FloatingObjects/FloatingObjects';
import axios from 'axios';

const Register = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')) {
      navigate('/gacha');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //https://stackoverflow.com/a/25352300
  function isAlphaNumeric(str) {
    var code, i, len;
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };

  const validateInput = () => {
    let error = false;
    //username is nonempty, no more than 256 characters, and alphanumeric
    if(username.length === 0) {
      setUsernameError('come on, at least try.');
      error = true;
    }
    else if (username.length < 3) {
      setUsernameError(`minimum length: 3`);
      error = true;
    }
    else if (username.length > 256) {
      setUsernameError(`maximum length: 256`);
      error = true;
    }
    else if(!isAlphaNumeric(username)) {
      setUsernameError('keep it alphanumeric.');
      error = true;
    }
    else {
      setUsernameError(null);
    }
    //password is inbetween 8 and 256 characters
    if(password.length < 8) {
      setPasswordError('minimum length: 8');
      error = true;
    }
    else if (password.length > 256) {
      setPasswordError(`maximum length: 256`);
      error = true;
    }
    else {
      setPasswordError(null)
    }
    //passwords match
    if(password !== confirmPassword) {
      setConfirmPasswordError('passwords must match.');
      error = true;
    }
    else {
      setConfirmPasswordError(null)
    }
    return error ? false : true;
  }

  const submitRegister = (e) => {
    e.preventDefault();
    if(validateInput()) {
      axios.post(
        '/api/auth/register', 
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
    <form id='register-form' onSubmit={submitRegister}>
    <img onLoad={e => fadeIn(e)} className='logo loading' src='/images/masterless-starglitter.png' alt='masterless starglitter' />
      <div className='inner-form'>
        <div className='text-centered'>
          <h3>
            let's get rolling!
          </h3>
        </div>
        <div className='form-item'>
          <label htmlFor='register-username'>
            username:
            { usernameError ? <span className="error">{usernameError}</span> : null }
          </label>
          <input id='register-username' name="username" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div className='form-item'>
          <label htmlFor='register-password'>
            password:
            { passwordError ? <span className="error">{passwordError}</span> : null }
          </label>
          <input id='register-password' name="password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className='form-item'>
          <label htmlFor='register-confirm-password'>
            confirm password:
            { confirmPasswordError ? <span className="error">{confirmPasswordError}</span> : null }
          </label>
          <input id='register-confirm-password' name="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
        </div>
        <div className='bottom-container'>
          <button type="submit">register</button>
          <div className='bottom-option'>
            have an account? <a href='/login'>log in!</a>
          </div>
        </div>
      </div>
    </form>
    </>
  );
}

export default Register;
