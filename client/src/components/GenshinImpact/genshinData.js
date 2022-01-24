const wishButtonBank = {
  x1: {
    intertwined: {
      sufficient: './assets/buttons/wish_intertwined_x1.png',
      insufficient: './assets/buttons/wish_intertwined_x1_red.png'
    },
    acquaint: {
      sufficient: './assets/buttons/wish_acquaint_x1.png',
      insufficient: './assets/buttons/wish_acquaint_x1_red.png'
    }
  },
  x10: {
    intertwined: {
      sufficient: './assets/buttons/wish_intertwined_x10.png',
      insufficient: './assets/buttons/wish_intertwined_x10_red.png'
    },
    acquaint: {
      sufficient: './assets/buttons/wish_acquaint_x10.png',
      insufficient: './assets/buttons/wish_acquaint_x10_red.png'
    }
  }
}
const wishAnimationBank = {
  single: {
    threeStar: './assets/wish-animations/single_3-star_wish.mp4',
    fourStar: './assets/wish-animations/single_4-star_wish.mp4',
    fiveStar: './assets/wish-animations/single_5-star_wish.mp4',
  },
  multi: {
    fourStar: './assets/wish-animations/multi_4-star_wish.mp4',
    fiveStar: './assets/wish-animations/multi_5-star_wish.mp4'
  }
}
const bannerBank = {
  focus: {
    '2.4.1': [
      {
        name: '2022-01-05_Shenhe',
        imgURL: './assets/wish-banners/character/2022-01-05_Shenhe.png',
      },
      {
        name: '2022-01-05_Xiao',
        imgURL: './assets/wish-banners/character/2022-01-05_Xiao.png',
      },
      {
        name: '2022-01-05_CQ-PJWS',
        imgURL: './assets/wish-banners/weapon/2022-01-05_CQ-PJWS.png',
      },
    ],
    '2.4.2': [
      {
        name: '2022-01-05_Shenhe',
        imgURL: './assets/wish-banners/character/2022-01-05_Shenhe.png',
      },
      {
        name: '2022-01-05_Xiao',
        imgURL: './assets/wish-banners/character/2022-01-05_Xiao.png',
      },
    ],
  },
  standard: {
      name: 'Standard',
      imgURL: './assets/wish-banners/2020-11-11_Standard.png',
      standard: true
  },
}

module.exports = {wishButtonBank, wishAnimationBank, bannerBank};