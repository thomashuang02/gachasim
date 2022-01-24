import './GachaHeader.css';
import { useNavigate } from 'react-router-dom';

const GachaHeader = (props) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
      <div className='gacha-header'>
          <img className='gacha-logo' src={props.logo} alt='gacha logo'/>
          <div className='gacha-header-options'>
              <a id='gacha-select-button' href={`/gacha`}>back to gacha select</a>
              <a id='my-profile-button' href={`/user/me`}>my profile</a>
              <a id='logout-button' href='/login' onClick={logout}>logout</a>
          </div>
      </div>
  );
}

export default GachaHeader;
