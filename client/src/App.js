import { BrowserRouter as Router, Routes, Route, Navigate, Fragment } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import GachaSelect from './components/GachaSelect/GachaSelect';
import { useState } from 'react';
import MyProfile from './components/MyProfile/MyProfile';
import UserProfile from './components/UserProfile/UserProfile';
import GenshinImpact from './components/GenshinImpact/GenshinImpact';
import RequireAuthentication from './components/RequireAuthentication';

const App = () => {
  const [username, setUsername] = useState('loading...');
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/gacha' element={
            <RequireAuthentication setUsername={setUsername}>
              <GachaSelect />
            </RequireAuthentication>
          }/>
          <Route path='/gacha/genshin-impact' element={
            <RequireAuthentication setUsername={setUsername}>
              <GenshinImpact />
            </RequireAuthentication>
          }/>
          <Route path='/user/:username' element={<UserProfile />} />
          <Route path='/user/me' element={
              <RequireAuthentication setUsername={setUsername}>
                  <MyProfile username={username} setUsername={setUsername}/>
              </RequireAuthentication>
          } />
          <Route path='*' element={<Navigate replace to='/gacha' />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
