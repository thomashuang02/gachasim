import './GenshinImpact.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import GenshinImpactLogo from './assets/genshin-impact-logo.png';
import GachaHeader from '../GachaHeader/GachaHeader';
import {wishButtonBank, bannerBank} from './genshinData';

//permanent buttons
import wishIcon from './assets/wish-icon.png';
import changeBannerLeft from './assets/buttons/change-banner-left.png';
import changeBannerRight from './assets/buttons/change-banner-right.png';
import e from 'cors';

const CURRENT_VERSION = '2.4.1';

const fadeBannerIn = () => {
  const bannerImageContainer = document.getElementById('banner-image-container');
  bannerImageContainer.classList.remove('banner-sweeping');
}

const GenshinImpact = (props) => {
  const [wishX1Button, setWishX1Button] = useState(wishButtonBank.x1.intertwined.sufficient);
  const [wishX10Button, setWishX10Button] = useState(wishButtonBank.x10.intertwined.sufficient);
  const [activeVersionBanners, setActiveVersionBanners] = useState(bannerBank.focus[CURRENT_VERSION]);
  //make sure that when active version banners change, active banner index is reset to 0!

  const availableBanners = [...activeVersionBanners, bannerBank.standard];

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const activeBanner = availableBanners[activeBannerIndex];
  const isStandard = activeBanner.standard ? true : false;

  const rotateBanner = right => {
    const numBanners = availableBanners.length;
    setActiveBannerIndex(prev => (numBanners + prev + (right ? 1: -1)) % numBanners);
  }

  const [showWishAnimation, setShowWishAnimation] = useState(false);

  const roll10x = () => {
    setShowWishAnimation(true);
  }

  return (
    <div id='genshin-wish-page' className='gacha-page'>
      <GachaHeader logo={GenshinImpactLogo} />
      <div className='gacha-area'>
        {
          showWishAnimation 
          ?
          <video autoPlay muted id='wish-animation' onEnded={()=>setShowWishAnimation(false)}>
            <source src={require('./assets/wish-animations/multi_5-star_wish.mp4')} type='video/mp4' />
          </video>
          :
          <>
            <div className='wish-title-container'>
              <img className='wish-icon' src={wishIcon} alt='wish icon'/>
              <span className='wish-title'>
                Wish
              </span>
            </div>

            <img id='change-banner-left' src={changeBannerLeft} alt='change banner left' onClick={()=>rotateBanner(false)}/>

            <div key={activeBannerIndex} id='banner-image-container' className={`banner-sweeping ${isStandard ? 'standard-banner' : null}`}>
              <img id='banner-image' 
                onLoad={() => fadeBannerIn()}
                src={require(`${activeBanner.imgURL}`)} 
                alt='banner' />
            </div>

            <img id='change-banner-right' src={changeBannerRight} alt='change banner right' onClick={()=>rotateBanner(true)}/>

            <div className='wish-buttons'>
              {/* wish 1x */}
              <img className='wish-button' src={require(`${wishX1Button}`)} alt='wish x1'/>
              {/* wish 10x */}
              <img className='wish-button' onClick={()=>roll10x()} src={require(`${wishX10Button}`)} alt='wish x10'/>
            </div>
          </>
        }
      </div>
    </div>
  );
}

export default GenshinImpact;
