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
import closeButton from './assets/buttons/close-wish-button.png';
import primogemIcon from './assets/items/primogem.png';
import intertwinedFate from './assets/items/intertwined-fate.png';
import acquaintFate from './assets/items/acquaint-fate.png';
import addPrimogemButton from './assets/buttons/add-primogem-button.png';
import skipWishArrow from './assets/buttons/skip-wish-arrow.png';
import genesisCrystal from './assets/items/genesis-crystal.png';
import cancelIcon from './assets/buttons/cancel-icon.png';
import confirmIcon from './assets/buttons/confirm-icon.png';
import ratingStar from './assets/items/rating-star.png';

//modals
import primogemBlurb from './assets/modals/primogem-blurb.png';
import acquaintFateBlurb from './assets/modals/acquaint-fate-blurb.png';
import intertwinedFateBlurb from './assets/modals/intertwined-fate-blurb.png';
import addPrimogemBlurb from './assets/modals/add-primogem-blurb.png';
import genesisCrystalBlurb from './assets/modals/genesis-crystal-blurb.png';
import buyAcquaintFate from './assets/modals/buy-acquaint-fate.png';
import buyAcquaintFateHover from './assets/modals/buy-acquaint-fate-hover.png';
import buyIntertwinedFate from './assets/modals/buy-intertwined-fate.png';
import buyIntertwinedFateHover from './assets/modals/buy-intertwined-fate-hover.png';
import purchaseWithPrimogems from './assets/modals/purchase-with-primogems.png';
import ribbonBar from './assets/modals/ribbon-bar.png';
import itemToPurchase from './assets/modals/item-to-purchase.png';

const CURRENT_VERSION = '2.4.1';
const MAX_PRIMOGEMS = 999999999999;

/* -------------------------------- API calls ------------------------------- */
const getProfile = async () => {
  const res = await axios.get('/api/genshin-impact/profile', 
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  return res.data;
}

/* ---------------------------- useful functions ---------------------------- */
const fadeBannerIn = () => {
  const bannerImageContainer = document.getElementById('banner-image-container');
  bannerImageContainer.classList.remove('banner-sweeping');
}

const showSkipWishButton = () => {
  const skipWishButton = document.getElementById('skip-wish-animation-button');
  skipWishButton.classList.remove('hidden');
}

/* ----------------------------- top right menu ----------------------------- */
const TopRightMenu = (props) => {
  const navigate = useNavigate();
  return (
    <div id='top-right-menu'>
      <PrimogemCount id='shop-modal-primogem-count' showInfoModal={props.showInfoModal} numPrimogems={props.numPrimogems} showAddPrimogemModal={props.showAddPrimogemModal} />
      <span id='fate-count-container' onClick={
        props.isStandard 
        ? ()=>props.showInfoModal(acquaintFateBlurb, `Owned: ${props.numAcquaintFates}`) 
        : ()=>props.showInfoModal(intertwinedFateBlurb, `Owned: ${props.numIntertwinedFates}`)
        }>
        <img id='fate-icon' 
          src={props.isStandard ? acquaintFate : intertwinedFate} 
          alt={`${props.isStandard ? 'acquaint fate' : 'intertwined fate'}`} />
        <span id='fate-count'>
          { props.NUM_FATES }
        </span>
      </span>
      <img id='close-wish-button' src={closeButton} onClick={()=>navigate('/gacha')} alt='close wish button' />
    </div>
  )
}

/* ------------------------- cancel/confirm buttons ------------------------- */
const CancelButton = props => (
  <div className={`flash-button cancel-button ${props.class}`} id={`${props.id}`} onClick={()=>props.onClick()}>
    <img id='cancel-icon' src={cancelIcon} alt='cancel' />
    {props.text}
  </div>
)
const ConfirmButton = props => (
  <div className={`flash-button confirm-button ${props.class}`} id={`${props.id}`} onClick={()=>props.onClick()}>
    <img id='confirm-icon' src={confirmIcon} alt='confirm' />
    {props.text}
  </div>
)

/* ----------------------- primogem counter component ----------------------- */
const PrimogemCount = props =>(
  <span id={`${props.id}`} className={`primogem-count-container ${props.className}`} onClick={()=>props.showInfoModal(primogemBlurb, false)}>
    <span id='primogem-count-wrapper'>
      <img id='primogem-icon' src={primogemIcon} alt='primogem' />
      <span id='primogem-count'>
        { props.numPrimogems }
      </span>
    </span>
    {props.noAdd ? null : 
    <img id='add-primogem-button' onClick={(e)=>{
        e.stopPropagation();
        props.showAddPrimogemModal();
      }} src={addPrimogemButton} alt='add primogem button' /> }
  </span>
)

/* -------------------------- info modal component -------------------------- */
const InfoModal = (props) => (
  <div className='blurb-container'>
    <img className='blurb-image info-image' src={props.src} alt='info modal' />
    { props.text ? 
    <div className='blurb-num-fates'>
      { props.text }
    </div> : null}
  </div>
)

/* -------------------------- shop modal component -------------------------- */
const ShopModal = (props) => {
  const toggleAcquaintFateImg = () => {
    const regular = document.body.querySelector('#buy-acquaint-fate');
    const hovered = document.body.querySelector('#buy-acquaint-fate-hover');
    regular.classList.toggle('hidden');
    hovered.classList.toggle('hidden');
  }
  const toggleIntertwinedFateImg = () => {
    const regular = document.body.querySelector('#buy-intertwined-fate');
    const hovered = document.body.querySelector('#buy-intertwined-fate-hover');
    regular.classList.toggle('hidden');
    hovered.classList.toggle('hidden');
  }
  return (
    <>
    <div className='blurb-container z1'>
      <div id='purchase-with-primogems-container'>
        <img id='purchase-with-primogems' src={purchaseWithPrimogems} alt='purchase with primogems' />
        <img id='ribbon-bar' src={ribbonBar} alt='ribbon bar' />
      </div>
      <div id='buy-options'>
        <div id='buy-acquaint-fate-container' onClick={()=>props.showItemToPurchaseModal()} onMouseOver={()=>toggleAcquaintFateImg()} onMouseOut={()=>toggleAcquaintFateImg()}>
          <img id='buy-acquaint-fate' src={buyAcquaintFate} alt='buy acquaint fate' />
          <img id='buy-acquaint-fate-hover' className='hidden' src={buyAcquaintFateHover} alt='buy acquaint fate hover' />
        </div>
        <div id='buy-intertwined-fate-container' onClick={()=>props.showItemToPurchaseModal()} onMouseOver={()=>toggleIntertwinedFateImg()} onMouseOut={()=>toggleIntertwinedFateImg()}>
          <img id='buy-intertwined-fate' src={buyIntertwinedFate} alt='buy intertwined fate' />
          <img id='buy-intertwined-fate-hover' className='hidden' src={buyIntertwinedFateHover} alt='buy intertwined fate hover' /></div>
      </div>
    </div>
    </>
    );
}

/* --------------------------- shop modal header ---------------------------- */
const ShopModalHeader = (props) => (
  <div id='shop-modal-header' className={`${props.hidden ? 'hidden' : null} ${props.className}`}>
    <PrimogemCount id='shop-modal-primogem-count' showInfoModal={props.showInfoModal} numPrimogems={props.numPrimogems} showAddPrimogemModal={props.showAddPrimogemModal} />
    <img id='close-shop-modal' src={closeButton} onClick={()=>props.closeShopModal()} alt='close shop modal' />
  </div>
);

/* ---------------------- add primogem modal component ---------------------- */
const AddPrimogemModal = (props) => {
  const [primogemQuantity, setPrimogemQuantity] = useState(1);
  const numPrimogems = props.numPrimogems;
  const closeAddPrimogemModal = props.closeAddPrimogemModal;
  const addPrimogems = props.addPrimogems;
  
  return (
  <div className='blurb-container z2'>
    <img className='blurb-image add-primogem-image' src={addPrimogemBlurb} alt='add primogem modal' />
    <input id='primogem-quantity' type='number' min='0' placeholder='0' max={MAX_PRIMOGEMS-numPrimogems} value={primogemQuantity} 
      onChange={e=>{
        const newValue = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
        e.target.value = newValue;
        setPrimogemQuantity(newValue);
      }}/>

    <div className={`${primogemQuantity <= 0 ? 'unclickable-1' : ''}`} 
      id='decrement-primogem-quantity' onClick={()=>setPrimogemQuantity(prev=>Math.max(prev-1, 0))} />
    <div className={`${primogemQuantity >= MAX_PRIMOGEMS-numPrimogems ? 'unclickable-1' : ''}`}
      id='increment-primogem-quantity' onClick={()=>setPrimogemQuantity(prev=>Math.min(prev+1, MAX_PRIMOGEMS))} />

    <div className={`genshin-small-button-gray flash-button ${primogemQuantity <= 0 ? 'unclickable-2' : ''}`} 
      id='minus-100' onClick={
        ()=>setPrimogemQuantity(prev=>Math.max(prev-100, 0))}>
      -100
    </div>
    <div className={`genshin-small-button-gray flash-button ${primogemQuantity >= MAX_PRIMOGEMS-numPrimogems ? 'unclickable-2' : ''}`}
      id='plus-100' onClick={
        ()=>setPrimogemQuantity(prev=>Math.min(prev+100, MAX_PRIMOGEMS))}>
      +100
    </div>
    <div className={`genshin-small-button-gray flash-button ${primogemQuantity >= MAX_PRIMOGEMS-numPrimogems ? 'unclickable-2' : ''}`} 
      id='max' onClick={
        ()=>setPrimogemQuantity(MAX_PRIMOGEMS-numPrimogems)}>
      Max
    </div>

    <div id='genesis-crystals-consumed'>
      Consume
      &nbsp;
      <img id='small-genesis-crystal' 
          src={genesisCrystal} 
          alt='genesis crystal' />
      &nbsp;&nbsp;
      {primogemQuantity}
    </div>

    <CancelButton id='add-primogem-cancel-button' onClick={closeAddPrimogemModal} text='Cancel' />
    <ConfirmButton id='add-primogem-confirm-button' class={`${primogemQuantity <= 0 || numPrimogems >= MAX_PRIMOGEMS ? 'unclickable-2' : ''}`}
      onClick={()=>{addPrimogems(primogemQuantity); closeAddPrimogemModal();}} text='Exchange'/>
  </div>)
};

/* ---------------------- header for add primogem menu ---------------------- */
const AddPrimogemHeader = (props) => (
  <div id='add-primogem-header' className={`add-primogem-header ${props.hidden ? 'hidden' : null} ${props.className}`}>
    <PrimogemCount id='shop-modal-primogem-count' showInfoModal={props.showInfoModal} numPrimogems={props.numPrimogems} noAdd/>
    <span id='genesis-crystal-count-container' onClick={()=>props.showInfoModal(genesisCrystalBlurb, false)}>
      <img id='genesis-crystal-icon' 
        src={genesisCrystal} 
        alt='genesis crystal' />
      <span id='genesis-crystal-count'>
        &#8734;
      </span>
    </span>
  </div>
);

/* ------------------------- item to purchase modal ------------------------- */
const ItemToPurchaseModal = (props) => {
  const [quantity, setQuantity] = useState(1);

  return (
  <div className='blurb-container'>
    <img className='blurb-image item-to-purchase-image' src={itemToPurchase} alt='item to purchase' />
    <div className='purchase-item-info-container' onClick={()=>props.openInfoModal()}>
      <img className='genshin-item-image' src={props.imgSrc} alt={props.itemName} />
      <div className='genshin-item-info'>
        <div className='genshin-item-name'>
          {props.itemName}
        </div>
        <div className='genshin-item-star-rating'>
          <img className='rating-star' src={ratingStar} alt='star' />
          <img className='rating-star' src={ratingStar} alt='star' />
          <img className='rating-star' src={ratingStar} alt='star' />
          <img className='rating-star' src={ratingStar} alt='star' />
          <img className='rating-star' src={ratingStar} alt='star' />
        </div>
        <div className='genshin-item-description-wrapper masked-overflow'>
          <div className='genshin-item-description'>
            A fateful stone that connects dreams. Its glimmers can entwine fates and connect dreams, just as how its glimmers link stars into the shapes of a heart's desires.
          </div>
        </div>
      </div>
      <PrimogemCount className={props.numPrimogems/props.primogemPrice >= 1 ? null : 'insufficient-red'} id='item-to-purchase-primogem-count' showInfoModal={props.showInfoModal} numPrimogems={props.numPrimogems} noAdd/>
      <div className='info-icon'>
        <div className='info-icon-dot' />
        <div className='info-icon-line' />
      </div>
    </div>
    <div id='item-to-purchase-quantity'>{quantity}</div>
    <input type='range' id='quantity-to-purchase' className='genshin-slider' min='1' max={`${Math.max((props.numPrimogems / props.primogemPrice), 1)}`} value={quantity} onChange={e=>setQuantity(e.target.value)}/>
    <CancelButton id='item-to-purchase-cancel-button' onClick={()=>props.closeItemToPurchaseModal()} text='Cancel' />
    <ConfirmButton id='item-to-purchase-confirm-button' onClick={()=>{console.log('try to buy item'); props.closeItemToPurchaseModal();}} text='Purchase'/>
  </div>)
};

/* ------------------------- item to purchase header ------------------------ */
const ItemToPurchaseHeader = (props) => (
  <div id='item-to-purchase-header' className={`${props.hidden ? 'hidden' : null} ${props.className}`}>
    <span id='shop-modal-primogem-count'  onClick={()=>props.showInfoModal(primogemBlurb, false)}>
      <span id='primogem-count-wrapper'>
        <img id='primogem-icon' src={primogemIcon} alt='primogem' />
        <span id='primogem-count'>
          { props.numPrimogems }
        </span>
      </span>
      <img id='add-primogem-button' onClick={(e)=>{
          e.stopPropagation();
          props.showAddPrimogemModal();
        }} src={addPrimogemButton} alt='add primogem button' />
    </span>
  </div>
);

/* ------------------------ wish animation component ------------------------ */
const WishAnimation = (props) => (
  <>
    <div id='skip-wish-animation-button' className='hidden' onClick={()=>props.setShowWishAnimation(false)}>
      Skip <img id='skip-wish-arrow' src={skipWishArrow} alt='skip wish'></img>
    </div>
    <video onClick={()=>showSkipWishButton()}autoPlay muted id='wish-animation' onEnded={()=>props.setShowWishAnimation(false)}>
      <source src={require(`${props.wishAnimation}`)} type='video/mp4' />
    </video>
  </>
);

const GenshinImpact = (props) => {
  /* ------------------------------ wish buttons ------------------------------ */
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
  const [numAcquaintFates, setNumAcquaintFates] = useState(0);
  const [numIntertwinedFates, setNumIntertwinedFates] = useState(0);
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
  const [numPrimogems, setNumPrimogems] = useState(0);
  const modifyPrimogems = (n) => {
    modifyUser({
      numPrimogems: numPrimogems + n
    });
  }
  
  /* -------------------------------- user info ------------------------------- */
  const updateUser = async (updatedUser) => {
    let user;
    if(updatedUser) {
      user = updatedUser;
    }
    else {
      user = await getProfile();
    }
    setNumPrimogems(user.numPrimogems);
    setNumAcquaintFates(user.numAcquaintFates);
    setNumIntertwinedFates(user.numIntertwinedFates);
  }
  //update user on initial page load
  useEffect(() => {
    updateUser();
  }, []);
  const modifyUser = async newProps => {
    const res = await axios.post('/api/genshin-impact/modify-user', newProps, 
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    updateUser(res.data);
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

  /* --------------------------------- modals --------------------------------- */
  const [NUM_MODALS_OPEN, SET_NUM_MODALS_OPEN] = useState(0);
  const INCREMENT_MODALS_OPEN = () => SET_NUM_MODALS_OPEN(prev => prev + 1);
  const DECREMENT_MODALS_OPEN = () => SET_NUM_MODALS_OPEN(prev => Math.max(prev - 1, 0));
  const [MODAL_Z_INDICES, SET_MODAL_Z_INDICES] = useState({
    info: 0,
    addPrimogem: 0,
    shop: 0,
    itemToPurchase: 0
  });
  const updateZIndex = (type) => {
    INCREMENT_MODALS_OPEN();
    SET_MODAL_Z_INDICES(prev => ({...prev, [type]: NUM_MODALS_OPEN}));
  }
  const resetZIndex = (type) => {
    DECREMENT_MODALS_OPEN();
    SET_MODAL_Z_INDICES(prev => ({...prev, [type]: 0}));
  }

  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
  const [addPrimogemModalIsOpen, setAddPrimogemModalIsOpen] = useState(false);
  const [shopModalIsOpen, setShopModalIsOpen] = useState(false);
  const [itemToPurchaseModalIsOpen, setItemToPurchaseModalIsOpen] = useState(false);

  const showAddPrimogemHeader = () => {
    const addPrimogemHeader = document.getElementById('add-primogem-header');
    addPrimogemHeader.classList.remove('hidden');
  }
  const hideAddPrimogemHeader = () => {
    const addPrimogemHeader = document.getElementById('add-primogem-header');
    addPrimogemHeader.classList.add('hidden');
  }
  const showShopModalHeader = () => {
    const shopModalHeader = document.getElementById('shop-modal-header');
    shopModalHeader.classList.remove('hidden');
  }
  const hideShopModalHeader = () => {
    const shopModalHeader = document.getElementById('shop-modal-header');
    shopModalHeader.classList.add('hidden');
  }
  const showItemToPurchaseHeader = () => {
    const itemToPurchaseHeader = document.getElementById('item-to-purchase-header');
    itemToPurchaseHeader.classList.remove('hidden');
  }
  const hideItemToPurchaseHeader = () => {
    const itemToPurchaseHeader = document.getElementById('item-to-purchase-header');
    itemToPurchaseHeader.classList.add('hidden');
  }

  const [infoBlurbElement, setInfoBlurbElement] = useState(<InfoModal src={primogemBlurb} text={false} />);

  //info modal
  const showInfoModal = (src, text) => {
    updateZIndex('info');
    setInfoBlurbElement(<InfoModal src={src} text={text} />);
    setInfoModalIsOpen(true);
  }
  const closeInfoModal = () => {
    resetZIndex('info');
    setInfoModalIsOpen(false);
  }

  //add primogem modal
  const showAddPrimogemModal = () => {
    updateZIndex('addPrimogem');
    showAddPrimogemHeader();
    setAddPrimogemModalIsOpen(true);
  }
  const closeAddPrimogemModal = () => {
    resetZIndex('addPrimogem');
    hideAddPrimogemHeader();
    setAddPrimogemModalIsOpen(false);
  };

  //shop modal
  const showShopModal = () => {
    updateZIndex('shop');
    showShopModalHeader();
    setShopModalIsOpen(true);
  }
  const closeShopModal = () => {
    resetZIndex('shop');
    hideShopModalHeader()
    setShopModalIsOpen(false);
  };

  //item to purchase modal
  const showItemToPurchaseModal = () => {
    updateZIndex('itemToPurchase');
    showItemToPurchaseHeader();
    setItemToPurchaseModalIsOpen(true);
  }
  const closeItemToPurchaseModal = () => {
    resetZIndex('itemToPurchase');
    hideItemToPurchaseHeader();
    setItemToPurchaseModalIsOpen(false);
  }

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
        <TopRightMenu showInfoModal={showInfoModal} numPrimogems={numPrimogems} showAddPrimogemModal={showAddPrimogemModal}
          isStandard={isStandard} numAcquaintFates={numAcquaintFates} numIntertwinedFates={numIntertwinedFates} NUM_FATES={NUM_FATES}/>
      </div>

      <Modal
        isOpen={infoModalIsOpen}
        contentLabel='blurb'
        onRequestClose={closeInfoModal}
        className='blurb-modal'
        overlayClassName={`blurb-overlay z${MODAL_Z_INDICES.info}`}
        parentSelector={
          () => document.querySelector('.gacha-area')}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        { infoBlurbElement }
      </Modal>

      <Modal
        isOpen={shopModalIsOpen}
        contentLabel='blurb'
        onRequestClose={closeShopModal}
        className='blurb-modal'
        overlayClassName={`blurb-overlay blur-backdrop z${MODAL_Z_INDICES.shop}`}
        parentSelector={
          () => document.querySelector('.gacha-area')}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        <ShopModal showItemToPurchaseModal={showItemToPurchaseModal} />
      </Modal>
      <ShopModalHeader hidden={!shopModalIsOpen} className={`z${MODAL_Z_INDICES.shop + 1}`} closeShopModal={closeShopModal} showInfoModal={showInfoModal} numPrimogems={numPrimogems} showAddPrimogemModal={showAddPrimogemModal} />
      
      <Modal
        isOpen={addPrimogemModalIsOpen}
        contentLabel='blurb'
        onRequestClose={closeAddPrimogemModal}
        className='blurb-modal'
        overlayClassName={`blurb-overlay z${MODAL_Z_INDICES.addPrimogem}`}
        parentSelector={
          () => document.querySelector('.gacha-area')}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        <AddPrimogemModal addPrimogems={modifyPrimogems} numPrimogems={numPrimogems} closeAddPrimogemModal={closeAddPrimogemModal} />
      </Modal>
      <AddPrimogemHeader hidden={!addPrimogemModalIsOpen} className={`z${MODAL_Z_INDICES.addPrimogem + 1}`} numPrimogems={numPrimogems} showInfoModal={showInfoModal} />

      <Modal
        isOpen={itemToPurchaseModalIsOpen}
        contentLabel='blurb'
        onRequestClose={closeItemToPurchaseModal}
        className='blurb-modal'
        overlayClassName={`blurb-overlay z${MODAL_Z_INDICES.itemToPurchase}`}
        parentSelector={
          () => document.querySelector('.gacha-area')}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        <ItemToPurchaseModal closeItemToPurchaseModal={closeItemToPurchaseModal} numPrimogems={numPrimogems} 
          itemName={'Intertwined Fate'} primogemPrice={160} imgSrc={intertwinedFate} openInfoModal={()=>showInfoModal(intertwinedFateBlurb, `Owned: ${numIntertwinedFates}`)} />
      </Modal>
      <ItemToPurchaseHeader hidden={!itemToPurchaseModalIsOpen} className={`z${MODAL_Z_INDICES.itemToPurchase + 1}`} numPrimogems={numPrimogems} showInfoModal={showInfoModal} showAddPrimogemModal={showAddPrimogemModal} />

      <img id='change-banner-left' src={changeBannerLeft} alt='change banner left' onClick={()=>rotateBanner(false)}/>

      <div key={activeBannerIndex} id='banner-image-container' className={`banner-sweeping ${isStandard ? 'standard-banner' : null}`}>
        <img id='banner-image' 
          onLoad={() => fadeBannerIn()}
          src={require(`${activeBanner.imgURL}`)} 
          alt='banner' />
      </div>

      <img id='change-banner-right' src={changeBannerRight} alt='change banner right' onClick={()=>rotateBanner(true)}/>

      <div id='genshin-shop-button' className='genshin-small-button' onClick={()=>showShopModal()}>Shop</div>

      <div className='wish-buttons'>
        <img className='wish-button' onClick={()=>roll1x()} src={require(`${wishX1Button}`)} alt='wish x1'/>
        <img className='wish-button' onClick={()=>roll10x()} src={require(`${wishX10Button}`)} alt='wish x10'/>
      </div>
    </>
  );

  return (
    <div id='genshin-wish-page' className='gacha-page'>
      <GachaHeader logo={GenshinImpactLogo} />
      <div className='gacha-area'>
        {
          showWishAnimation 
          ?
          <WishAnimation wishAnimation={wishAnimation} setShowWishAnimation={setShowWishAnimation} />
          :
          wishUI
        }
      </div>
    </div>
  );
}

export default GenshinImpact;
