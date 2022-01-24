import './MyProfile.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingObjects from '../FloatingObjects/FloatingObjects';
import ReactTooltip from 'react-tooltip';

const parseDateString = (str) => {
  const parsed = new Date(str);
  const month = parsed.getUTCMonth() + 1; //months from 1-12
  const day = parsed.getUTCDate();
  const year = parsed.getUTCFullYear();
  return `${month}/${day}/${year}`;
}

const MyProfile = (props) => {
    const [username, setUsername] = [props.username, props.setUsername];
    const [dateJoined, setDateJoined] = useState('loading...');

    const navigate = useNavigate();
  
    const getFullUserProfile = () => {
      axios.get(
        '/api/user-profile/full', 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      ).then(res => {
        setUsername(res.data.username);
        setDateJoined(parseDateString(res.data.dateJoined));
      }).catch(err => {
        setUsername(null);
        logout();
      });
    }
  
    useEffect(getFullUserProfile, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    const logout = () => {
      localStorage.removeItem('token');
      navigate('/login');
    }

    const copyURL = () => {
        navigator.clipboard.writeText(`localhost:3000/user/${username}`);
    }

    return (
        <>
        <FloatingObjects />
        <div id='user-profile' className='window'>
            <div className='inner-window'>
                <div className='menu-bar'>
                    <div id='username'>
                        <div id='username-text-container'>
                              <h3 id='username-text' className='menu-name'>
                                  qwe[poiqpweoiqpwoeiqpewiqpowei]
                              </h3>
                        </div>
                        <div id='user-link'>
                            <img data-tip='copy URL' onClick={() => copyURL()} 
                                id='user-link-icon' src='/images/link-icon-colored.png' 
                                alt='copy user profile link' />
                        </div>
                    </div>
                    <div className='menu-options'>
                        <a id='gacha-select-button' href={`/gacha`}>gacha select</a>
                        <a id='logout-button' href='/login' onClick={logout}>logout</a>
                    </div>
                </div>
                <div className='bio'>
                    rolling since {dateJoined}
                </div>
            </div>
        </div>
        <ReactTooltip place='right' effect='solid'/>
        </>
    );
}

export default MyProfile;
