import React from 'react';
import Image from 'next/image';
import Style from './VoterCard.module.css';

import image from '../../assets/Photo/image2.jpg'

import voterCardStyle from './VoterCard.module.css';

const VoterCard = ({voterArray}) => {
  return(<div className={Style.card}>
    {voterArray.map((el, i) => (
<div className={Style.card_box}>
  <div className={Style.image}>
    <img src={el[4]} alt="Profile Photo" />
  </div>
  <div className={Style.card_info}>
    <h2>
      {el[1]} #{el[0]}
    </h2>
    <p>Address:{el[3].slice(0,20)}..</p>
    <p>Details</p>
    <p className={voterCardStyle.vote_Status}>
      {el[6]==true ? "You already Voted" : "Not Voted"}
    </p>
  </div>
</div>
    ))}
  </div>);
};

export default VoterCard;