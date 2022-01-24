import './GachaSelect.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingObjects from '../FloatingObjects/FloatingObjects';
import LogoHeader from '../LogoHeader/LogoHeader';

const GachaOption = props => {
  return (
    <div className='form-item'>
      <button className='gacha-option' type='button' onClick={() => window.location.href=props.href}>{props.name}</button>
    </div>
  )
}

const GachaSelect = (props) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const gachaOptions = [
    {
      name: 'AFK Arena',
      href: 'https://google.com'
    },
    {
      name: 'Another Eden',
      href: 'https://google.com'
    },
    {
      name: 'Arknights',
      href: 'https://google.com'
    },
    {
      name: 'Azure Lane',
      href: 'https://google.com'
    },
    {
      name: 'Cookie Run Kingdom',
      href: 'https://google.com'
    },
    {
      name: 'Epic Seven',
      href: 'https://google.com'
    },
    {
      name: 'Fate/Grand Order',
      href: 'https://google.com'
    },
    {
      name: 'Fire Emblem Heroes',
      href: 'https://google.com'
    },
    {
      name: 'Genshin Impact',
      href: 'gacha/genshin-impact'
    },
    {
      name: 'Granblue Fantasy',
      href: 'https://google.com'
    },
    {
      name: 'Honkai Impact 3rd',
      href: 'https://google.com'
    },
    {
      name: 'Onmyoji',
      href: 'https://google.com'
    },
    {
      name: 'RAID: Shadow Legends',
      href: 'https://google.com'
    },
    {
      name: 'Soccer Spirits',
      href: 'https://google.com'
    },
    {
      name: 'Summoners War',
      href: 'https://google.com'
    },
  ]
  const [search, setSearch] = useState('');
  const filterOptions = str => {
    return gachaOptions.map((option, index) => (
      option.name.toLowerCase().includes(str.toLowerCase()) ? 
      <GachaOption name={option.name} href={option.href} key={index} /> : null
    ));
  }

  const [gachaOptionComponents, setGachaOptionComponents] = useState(filterOptions(''));
  useEffect(() => {
    setGachaOptionComponents(filterOptions(search));
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    <FloatingObjects />
    <LogoHeader />
    <form id='gacha-select-form' onSubmit={(e)=>e.preventDefault()}>
      <div className='inner-form'>
        <div className='menu-bar'>
          <h3 className='menu-name'>Gacha Select</h3>
          <div className='menu-options'>
            <a id='my-profile-button' href={`/user/me`}>my profile</a>
            <a id='logout-button' href='/login' onClick={logout}>logout</a>
          </div>
        </div>
        <div className='form-item' id='gacha-search'>
          <input type='text' name='search' placeholder='search...' value={search} onChange={e => setSearch(e.target.value)}></input>
        </div>
        <div className='gacha-options-container'>
          { gachaOptionComponents }
        </div>
      </div>
    </form>
    </>
  );
}

export default GachaSelect;
