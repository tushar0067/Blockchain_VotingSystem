import React , {useEffect} from 'react';
 import Image from 'next/image';
import Style from './Card.module.css';
import image2 from '../../assets/Photo/image2.jpg';

const Card = ({candidateArray, giveVote}) => {
 
console.log('card candidateArray:' + candidateArray);
console.log("hello");
  return(<div className={Style.card}>
    {/* <Image src={image2} alt="profile" /> */}
    {candidateArray.map((el ,i) =>(
<div key={i+ 1} className={Style.card_box}>
  <div className={Style.image}>
    <img src={el[3]} alt="profile" />
  </div>
<div className={Style.card_info}>
  <h1>
    {el[1]} #{el[2]}

  </h1>
  <p>{el[0]}</p>
  <p>Address:{el[6].slice(0,20)}.. </p>
  <p className={Style.total}>Total Vote</p>
</div>
<div className={Style.card_vote}>
  <p>{el[4]} </p>
</div>
<div className={Style.card_button}>
  <button onClick={() => giveVote({id:el[2], address:el[6]})} > Give Vote</button>
</div>
</div>
    ))
    }
  </div>);
};

export default Card;