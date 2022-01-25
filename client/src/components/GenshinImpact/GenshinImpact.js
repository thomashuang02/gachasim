import './GenshinImpact.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import GenshinImpactLogo from './assets/genshin-impact-logo.png';
import GachaHeader from '../GachaHeader/GachaHeader';
import {wishButtonBank, wishAnimationBank, bannerBank} from './genshinData';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

//permanent icons
import wishIcon from './assets/wish-icon.png';
import changeBannerLeft from './assets/buttons/change-banner-left.png';
import changeBannerRight from './assets/buttons/change-banner-right.png';
import closeWishButton from './assets/buttons/close-wish-button.png';
import primogemIcon from './assets/items/primogem.png';
import intertwinedFate from './assets/items/intertwined-fate.png';
import acquaintFate from './assets/items/acquaint-fate.png';
import addPrimogemButton from './assets/buttons/add-primogem-button.png';
import skipWishArrow from './assets/buttons/skip-wish-arrow.png';
import primogemBlurb from './assets/blurbs/primogem-blurb.png';
import acquaintFateBlurb from './assets/blurbs/acquaint-fate-blurb.png';
import intertwinedFateBlurb from './assets/blurbs/intertwined-fate-blurb.png';

const CURRENT_VERSION = '2.4.1';


const fadeBannerIn = () => {
  const bannerImageContainer = document.getElementById('banner-image-container');
  bannerImageContainer.classList.remove('banner-sweeping');
}

const showSkipWishButton = () => {
  const skipWishButton = document.getElementById('skip-wish-animation-button');
  skipWishButton.classList.remove('hidden');
}

const GenshinImpact = (props) => {
  const navigate = useNavigate();

  //WISH BUTTONS
  const [wishX1Button, setWishX1Button] = useState(wishButtonBank.x1.intertwined.sufficient);
  const [wishX10Button, setWishX10Button] = useState(wishButtonBank.x10.intertwined.sufficient);

  //BANNERS
  const [activeVersionBanners, setActiveVersionBanners] = useState(bannerBank.focus[CURRENT_VERSION]);
  //NOTE: make sure that when active version banners change, active banner index is reset to 0!
  const availableBanners = [...activeVersionBanners, bannerBank.standard];
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const activeBanner = availableBanners[activeBannerIndex];

  const isStandard = activeBanner.standard ? true : false;

  const rotateBanner = right => {
    const numBanners = availableBanners.length;
    setActiveBannerIndex(prev => (numBanners + prev + (right ? 1: -1)) % numBanners);
  }

  //FATES
  const [numAcquaintFates, setNumAcquaintFates] = useState(3);
  const [numIntertwinedFates, setNumIntertwinedFates] = useState(226);
  const [NUM_FATES, SET_NUM_FATES] = isStandard ? [numAcquaintFates, setNumAcquaintFates] : [numIntertwinedFates, setNumIntertwinedFates];

  useEffect(() => {
    if(isStandard) {
      if(numAcquaintFates >= 10) {
        setWishX1Button(wishButtonBank.x1.acquaint.sufficient);
        setWishX10Button(wishButtonBank.x10.acquaint.sufficient);
      }
      else if(numAcquaintFates > 0) {
        setWishX1Button(wishButtonBank.x1.acquaint.sufficient);
        setWishX10Button(wishButtonBank.x10.acquaint.insufficient);
      }
      else {
        setWishX1Button(wishButtonBank.x1.acquaint.insufficient);
        setWishX10Button(wishButtonBank.x10.acquaint.insufficient);
      }
    }
    else {
      if(numIntertwinedFates >= 10) {
        setWishX1Button(wishButtonBank.x1.intertwined.sufficient);
        setWishX10Button(wishButtonBank.x10.intertwined.sufficient);
      }
      else if(numIntertwinedFates > 0) {
        setWishX1Button(wishButtonBank.x1.intertwined.sufficient);
        setWishX10Button(wishButtonBank.x10.intertwined.insufficient);
      }
      else {
        setWishX1Button(wishButtonBank.x1.intertwined.insufficient);
        setWishX10Button(wishButtonBank.x10.intertwined.insufficient);
      }
    }
  }, [activeBanner, numAcquaintFates, numIntertwinedFates]); // eslint-disable-line react-hooks/exhaustive-deps

  //PRIMOGEMS
  const [numPrimogems, setNumPrimogems] = useState(160000);

  //WISH ANIMATION
  const [wishAnimation, setWishAnimation] = useState(wishAnimationBank.multi.fourStar);
  const [showWishAnimation, setShowWishAnimation] = useState(false);

  //ROLLING
  const roll10x = () => {
    if(NUM_FATES >= 10) {
      const rolledFiveStar = false;

      //DO ROLLING
      SET_NUM_FATES(prev => prev - 10);

      //if 4-star
      if(!rolledFiveStar) {
        setWishAnimation(wishAnimationBank.multi.fourStar);
      }
      //if 5-star
      else {
        setWishAnimation(wishAnimationBank.multi.fiveStar);
      }
      setShowWishAnimation(true);
    }
    else {
      alert('Not enough fates!');
    }
  }
  const roll1x = () => {
    if(NUM_FATES >= 1) {
      const starValue = 3;

      //DO ROLLING
      SET_NUM_FATES(prev => prev - 1);

      //if 3-star
      if(starValue === 3) {
        setWishAnimation(wishAnimationBank.single.threeStar);
      }
      //if 4-star
      else if(starValue === 4) {
        setWishAnimation(wishAnimationBank.single.fourStar);
      }
      //if 5-star
      else {
        setWishAnimation(wishAnimationBank.single.fiveStar);
      }
      setShowWishAnimation(true);
    }
    else {
      alert('Not enough fates!');
    }
  }

  const [blurbSrc, setBlurbSrc] = useState(primogemBlurb);
  const [blurbText, setBlurbText] = useState(null);
  const [blurbIsOpen, setBlurbIsOpen] = useState(false);
  const showBlurb = (src, text) => {
    setBlurbSrc(src);
    setBlurbText(text);
    setBlurbIsOpen(true);
  }
  const closeBlurb = () => setBlurbIsOpen(false);

  const wishUI = (
    <>
      <div className='top-menu-container'>
        <div id='wish-title-container'>
          <img id='wish-icon' src={wishIcon} alt='wish icon'/>
          <span id='wish-title'>
            Wish
          </span>
        </div>

        <div id='top-right-menu'>
          <span id='primogem-count-container' onClick={()=>showBlurb(primogemBlurb, false)}>
            <span id='primogem-count-wrapper'>
              <img id='primogem-icon' src={primogemIcon} alt='primogem' />
              <span id='primogem-count'>
                { numPrimogems }
              </span>
            </span>
            <img id='add-primogem-button' onClick={(e)=>{
                e.stopPropagation();
                console.log('add primogems')}
              } src={addPrimogemButton} alt='add primogem button' />
          </span>
          <span id='fate-count-container' onClick={
            isStandard 
            ? ()=>showBlurb(acquaintFateBlurb, `Owned: ${numAcquaintFates}`) 
            : ()=>showBlurb(intertwinedFateBlurb, `Owned: ${numIntertwinedFates}`)
            }>
            <img id='fate-icon' 
              src={isStandard ? acquaintFate : intertwinedFate} 
              alt={`${isStandard ? 'acquaint fate' : 'intertwined fate'}`} />
            <span id='fate-count'>
              { NUM_FATES }
            </span>
          </span>
          <img id='close-wish-button' src={closeWishButton} onClick={()=>navigate('/gacha')} alt='close wish button' />
        </div>
      </div>

      <Modal
        isOpen={blurbIsOpen}
        contentLabel='blurb'
        onRequestClose={closeBlurb}
        className='blurb-modal'
        overlayClassName='blurb-overlay'
        parentSelector={
          () => document.querySelector('.gacha-area')}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        <div className='blurb-container'>
          <img className='blurb-image' src={blurbSrc} alt='blurb' />
          { blurbText ? 
          <div className='blurb-text'>
            { blurbText }
          </div> : null}
        </div>
      </Modal>

      <img id='change-banner-left' src={changeBannerLeft} alt='change banner left' onClick={()=>rotateBanner(false)}/>

      <div key={activeBannerIndex} id='banner-image-container' className={`banner-sweeping ${isStandard ? 'standard-banner' : null}`}>
        <img id='banner-image' 
          onLoad={() => fadeBannerIn()}
          src={require(`${activeBanner.imgURL}`)} 
          alt='banner' />
      </div>

      <img id='change-banner-right' src={changeBannerRight} alt='change banner right' onClick={()=>rotateBanner(true)}/>

      <div className='wish-buttons'>
        <img className='wish-button' onClick={()=>roll1x()} src={require(`${wishX1Button}`)} alt='wish x1'/>
        <img className='wish-button' onClick={()=>roll10x()} src={require(`${wishX10Button}`)} alt='wish x10'/>
      </div>
    </>
  );

  const wishAnimationComponent = (
    <>
      <div id='skip-wish-animation-button' className='hidden' onClick={()=>setShowWishAnimation(false)}>
        Skip <img id='skip-wish-arrow' src={skipWishArrow} alt='skip wish'></img>
      </div>
      <video onClick={()=>showSkipWishButton()}autoPlay muted id='wish-animation' onEnded={()=>setShowWishAnimation(false)}>
        <source src={require(`${wishAnimation}`)} type='video/mp4' />
      </video>
    </>
  );

  return (
    <div id='genshin-wish-page' className='gacha-page'>
      <GachaHeader logo={GenshinImpactLogo} />
      <div className='gacha-area'>
        {
          showWishAnimation 
          ?
          wishAnimationComponent
          :
          wishUI
        }
      </div>
    </div>
  );
}

export default GenshinImpact;
