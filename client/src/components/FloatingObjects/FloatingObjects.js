import './FloatingObjects.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

const FloatingObjects = (props) => {
  const [images, setImages] = useState(null);

  const fadeIn = e => {
    e.target.classList.remove('loading');
  }

  const generateFloatingObjects = (urls) => {
    let floatingObjects = [];
    for(let i = 0; i < urls.length; i++) {
      floatingObjects.push(
        <img onLoad={e => fadeIn(e)} className='floating loading' key={i} src={urls[i]} alt={urls[i].split('_')[-2]} />
      );
    }
    setImages(floatingObjects);
  }

  const getCharacterPortraits = () => {
    axios.get('/api/genshin-impact/character-portraits')
    .then(res => {
      if(!res.data.error) {
        generateFloatingObjects(res.data.paths)
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    getCharacterPortraits();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="floating-wrap">
      { images }
    </div>
  );
}

export default FloatingObjects;
