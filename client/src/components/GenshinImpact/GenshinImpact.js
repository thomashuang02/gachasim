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
import genesisCrystal from './assets/items/genesis-crystal.png';
import cancelIcon from './assets/buttons/cancel-icon.png';
import confirmIcon from './assets/buttons/confirm-icon.png';

//modals
import primogemBlurb from './assets/blurbs/primogem-blurb.png';
import acquaintFateBlurb from './assets/blurbs/acquaint-fate-blurb.png';
import intertwinedFateBlurb from './assets/blurbs/intertwined-fate-blurb.png';
import addPrimogemBlurb from './assets/blurbs/add-primogem-blurb.png';
import genesisCrystalBlurb from './assets/blurbs/genesis-crystal-blurb.png';

const CURRENT_VERSION = '2.4.1';
const MAX_PRIMOGEMS = 999999999999;

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

  const [wishX1Button, setWishX1Button] = useState(wishButtonBank.x1.intertwined.sufficient);
  const [wishX10Button, setWishX10Button] = useState(wishButtonBank.x10.intertwined.sufficient);

  /* --------------------------------- banners -------------------------------- */
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

  /* ---------------------------------- fates --------------------------------- */
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

  /* -------------------------------- primogems ------------------------------- */
  const [numPrimogems, setNumPrimogems] = useState(80000);
  const addPrimogems = (n) => {
    setNumPrimogems(prev => prev + n);
  }

  /* ----------------------------- wish animation ----------------------------- */
  const [wishAnimation, setWishAnimation] = useState(wishAnimationBank.multi.fourStar);
  const [showWishAnimation, setShowWishAnimation] = useState(false);

  /* ------------------------------ rolling logic ----------------------------- */
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

  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
  const [addPrimogemModalIsOpen, setAddPrimogemModalIsOpen] = useState(false);

  /* --------------------------------- modals --------------------------------- */
  const generateInfoModal = (src, text) => (
    <div className='blurb-container'>
      <img className='blurb-image info-image' src={src} alt='info modal' />
      { text ? 
      <div className='blurb-num-fates'>
        { text }
      </div> : null}
    </div>
  )
  const [primogemQuantity, setPrimogemQuantity] = useState(1);
  const addPrimogemModal = (
    <div className='blurb-container'>
      <img className='blurb-image add-primogem-image' src={addPrimogemBlurb} alt='add primogem modal' />
      <input id='primogem-quantity' type='number' min='0' placeholder='0' max={MAX_PRIMOGEMS-numPrimogems} value={primogemQuantity} 
        onChange={e=>{
          const newValue = e.target.value;
          console.log(e.target.value);
          setPrimogemQuantity(newValue === '' ? 0 : newValue);
        }}/>

      <div className={`${primogemQuantity <= 0 ? 'unclickable-1' : ''}`} 
        id='decrement-primogem-quantity' onClick={()=>setPrimogemQuantity(prev=>Math.max(prev-1, 0))} />
      <div className={`${primogemQuantity >= MAX_PRIMOGEMS-numPrimogems ? 'unclickable-1' : ''}`}
        id='increment-primogem-quantity' onClick={()=>setPrimogemQuantity(prev=>Math.min(prev+1, MAX_PRIMOGEMS))} />

      <div className={`flash-button ${primogemQuantity <= 0 ? 'unclickable-2' : ''}`} 
        id='minus-100' onClick={
          ()=>setPrimogemQuantity(prev=>Math.max(prev-100, 0))}>
        -100
      </div>
      <div className={`flash-button ${primogemQuantity >= MAX_PRIMOGEMS-numPrimogems ? 'unclickable-2' : ''}`}
        id='plus-100' onClick={
          ()=>setPrimogemQuantity(prev=>Math.min(prev+100, MAX_PRIMOGEMS))}>
        +100
      </div>
      <div className={`flash-button ${primogemQuantity >= MAX_PRIMOGEMS-numPrimogems ? 'unclickable-2' : ''}`} 
        id='max' onClick={
          ()=>setPrimogemQuantity(MAX_PRIMOGEMS-numPrimogems)}>
        Max
      </div>

      <div className='flash-button' id='add-primogem-cancel-button' onClick={()=>closeAddPrimogemModal()}>
        <img id='cancel-icon' src={cancelIcon} alt='cancel' />
        Cancel
      </div>
      <div className={`flash-button ${primogemQuantity <= 0 || numPrimogems >= MAX_PRIMOGEMS ? 'unclickable-2' : ''}`} id='add-primogem-exchange-button' onClick={()=>{addPrimogems(primogemQuantity); closeAddPrimogemModal();}}>
        <img id='confirm-icon' src={confirmIcon} alt='confirm' />
        Exchange
      </div>
    </div>
  );
  const addPrimogemHeader = (
    <div id='add-primogem-header' className='hidden'>
      <span id='primogem-count-container' onClick={()=>showInfoModal(primogemBlurb, false)}>
          <span id='primogem-count-wrapper'>
            <img id='primogem-icon' src={primogemIcon} alt='primogem' />
            <span id='primogem-count'>
              { numPrimogems }
            </span>
          </span>
        </span>
        <span id='genesis-crystal-count-container' onClick={()=>showInfoModal(genesisCrystalBlurb, false)}>
          <img id='genesis-crystal-icon' 
            src={genesisCrystal} 
            alt='genesis crystal' />
          <span id='genesis-crystal-count'>
            &#8734;
          </span>
        </span>
    </div>
  );

  const showAddPrimogemHeader = () => {
    const addPrimogemHeader = document.getElementById('add-primogem-header');
    addPrimogemHeader.classList.remove('hidden');
  }
  const hideAddPrimogemHeader = () => {
    const addPrimogemHeader = document.getElementById('add-primogem-header');
    addPrimogemHeader.classList.add('hidden');
  }

  const [infoBlurbElement, setInfoBlurbElement] = useState(generateInfoModal(primogemBlurb, false));

  const showInfoModal = (src, text) => {
    setInfoBlurbElement(generateInfoModal(src, text));
    setInfoModalIsOpen(true);
  }
  const showAddPrimogemModal = (src, text) => {
    showAddPrimogemHeader();
    setInfoBlurbElement(addPrimogemModal);
    setAddPrimogemModalIsOpen(true);
  }
  const closeInfoModal = () => {
    setInfoModalIsOpen(false);
  }
  const closeAddPrimogemModal = () => {
    setPrimogemQuantity(1);
    hideAddPrimogemHeader();
    setAddPrimogemModalIsOpen(false);
  };

  /* --------------------------------- wish UI -------------------------------- */
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
          <span id='primogem-count-container' onClick={()=>showInfoModal(primogemBlurb, false)}>
            <span id='primogem-count-wrapper'>
              <img id='primogem-icon' src={primogemIcon} alt='primogem' />
              <span id='primogem-count'>
                { numPrimogems }
              </span>
            </span>
            <img id='add-primogem-button' onClick={(e)=>{
                e.stopPropagation();
                showAddPrimogemModal();
              }} src={addPrimogemButton} alt='add primogem button' />
          </span>
          <span id='fate-count-container' onClick={
            isStandard 
            ? ()=>showInfoModal(acquaintFateBlurb, `Owned: ${numAcquaintFates}`) 
            : ()=>showInfoModal(intertwinedFateBlurb, `Owned: ${numIntertwinedFates}`)
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

      { addPrimogemHeader }

      <Modal
        isOpen={addPrimogemModalIsOpen}
        contentLabel='blurb'
        onRequestClose={closeAddPrimogemModal}
        className='blurb-modal'
        overlayClassName='blurb-overlay'
        parentSelector={
          () => document.querySelector('.gacha-area')}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        { addPrimogemModal }
      </Modal>

      <Modal
        isOpen={infoModalIsOpen}
        contentLabel='blurb'
        onRequestClose={closeInfoModal}
        className='blurb-modal'
        overlayClassName='blurb-overlay front'
        parentSelector={
          () => document.querySelector('.gacha-area')}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        { infoBlurbElement }
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
