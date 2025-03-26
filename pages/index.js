import React, { useState , useEffect, useContext} from 'react';
import Countdown from 'react-countdown';
import Image from 'next/image';
//Internal Import
import { VotingContext } from '../context/Voter';

import Style from "../styles/index.module.css";
import Card from "../components/Card/Card";

const Index = () => {
  //Access the context
  const {getNewCandidate, candidateArray,voterLength, giveVote,currentAccount, checkIfWalletIsConnected, candidateLength, getAllVoterData} = useContext(VotingContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllVoterData();
    const fetchCandidates = async () => {
      await getNewCandidate();
      setLoading(false);
    };
    fetchCandidates();
  }, []);
// useEffect(() => {
//   const get = async () => {
//     await getNewCandidate();
//     console.log('candidateArray:', candidateArray);
//   };
  
//   get();
// }, []);

return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidateList}>
              <p>
                No Candidate:<span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidateList}>
              <p>
                No Voter:<span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 1000000}/>
            </small>
          </div>
        </div>
      )}
      <Card candidateArray={candidateArray} giveVote={giveVote}/>
    </div>
  );
};

export default Index;
