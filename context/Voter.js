import React, {useState, useEffect} from 'react';
import Web3Modal from 'web3modal';
 import {ethers} from "ethers";
//error comes from line as below as:globSourceImport is not Defined.
// import { create } from "ipfs-http-client";
import axios from  "axios";
import { useRouter } from 'next/router';                                                 
// //Internal Import
 import { VotingAddress , VotingAddressABI} from './constants';
//if write ipfshttpClient in line below it will give error irrespective of line as below is being executed or not.
 
 const fetchContract = (signerOrProvider) => new ethers.Contract(VotingAddress , VotingAddressABI , signerOrProvider);

export const VotingContext = React.createContext();

// const createVoter= async () => {
//   // First, check if Ethereum (MetaMask or other wallet) is available
//   if (window.ethereum) {
//     try {
//       // Initialize a Web3Provider with window.ethereum (MetaMask)
//       const provider = new ethers.BrowserProvider(window.ethereum);

//       // Request account access if necessary
//       await provider.send("eth_requestAccounts", []);

//       // Get the signer from the provider (this represents the connected MetaMask account)
//       const signer = await provider.getSigner();

//       // Check if signer is valid
//       if (!signer) {
//         throw new Error("Signer is not valid.");
//       }

//       // Get the address from the signer
//       const address = await signer.getAddress();
//       console.log("Signer Address:", address);  // Log the signer's address

//       // Create the contract instance with the signer
//       const contract = new ethers.Contract(VotingAddress, VotingAddressABI, signer);
//       console.log("Contract Instance:", contract);

//       // Call the contract method (this is a view function, no gas required)
//       const isVoter = await contract.getVoterLength(); // Pass the address of the signer
//       console.log("Is the signer a voter?", isVoter);

//     } catch (error) {
//       console.error("Error interacting with contract:", error.message);
//     }
//   } else {
//     console.error("Ethereum is not available. Please install MetaMask or another wallet.");
//   }
// };

const createVoter = async(formInput,fileUrl,router) => {
  if (window.ethereum) {
    try {

      const {name,address,position}= formInput;
          console.log(name,address,position,fileUrl);
          if(!name || !address || !position || !fileUrl)return setError("Input data is missing");

          const data = JSON.stringify({ name, address, position, fileUrl});

      // Initialize a provider using MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request access to the user's MetaMask accounts
      await provider.send('eth_requestAccounts', []);

      // Create a signer using the provider
      const signer = await provider.getSigner();

      // Get the user's address (this is the MetaMask account)
      const add = await signer.getAddress();
      console.log("Signer Address:", add);

      // Create a contract instance connected to the signer
      const contract = new ethers.Contract(VotingAddress, VotingAddressABI, signer);
console.log(contract);
      // Call the non-payable function to create a new voter
      const voterAdd = "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097";  // Example address
      
      const url = "jsonData_url_here";  // Example image URL
      const ipfsHash = "QmSomeIPFSHash";  // Example IPFS hash

      const tx = await contract.voterRight(address, name, fileUrl,url);
      console.log("Transaction sent. Waiting for confirmation...");
console.log(tx);
      // Use provider.waitForTransaction to wait for the transaction to be mined
      const receipt = await provider.waitForTransaction(tx.hash, 1, 600000);  // 1 confirmation, timeout after 60 seconds

      if (receipt && receipt.status === 1) {
        console.log("Transaction confirmed!");
      } else {
        console.log("Transaction failed!");
      }


router.push("/voterList");


      // Call the `getVoterLength` function to get the number of voters
      const length = await contract.getVoterLength();
      console.log("Number of voters:", length.toString());
    } catch (error) {
      console.error("Error interacting with the contract:", error.message);
    }
  } else {
    console.log("MetaMask is not available. Please install MetaMask.");
  }
}




export const VotingProvider = ({ children }) => {
const votingTitle = "My first smart contract app";
const router= useRouter();
const [currentAccount, setCurrentAccount]= useState('');
const [candidateLength,setCandidateLength] = useState('');
const pushCandidate= [];
const candidateIndex =[];
const[candidateArray, setCandidateArray] = useState(pushCandidate);
//------end of candidate data

const [error, setError] = useState();
const highestVote =[];
//----Voter Section

const pushVoter=[];
const [voterArray,setVoterArray] = useState(pushVoter);
const [voterAddress, setVoterAddress]= useState([]);
const [voterLength, setVoterLength]= useState('');

//---Connecting Metamask

const checkIfWalletIsConnected = async() =>{
  if(!window.ethereum)return setError("Please install Metamask");

  const account = await window.ethereum.request({method: "eth_accounts"});

  if(account.length){
    setCurrentAccount(account[0]);
  }else{
    setError("Please install Metamask & Connect, Reload");
  }

};

//--Connect Wallet
const connectWallet= async()=>{
  if(!window.ethereum)return setError("Please connect metamask & Connect ,Reload");
  const account = await window.ethereum.request({method: "eth_requestAccounts"});

setCurrentAccount(account[0]);

}
//----Upload to IPFS

const uploadToIPFS = async (file) =>{
try {
  const fileData= new FormData();
  fileData.append("file",file);
  const responseData = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    fileData,
    {
      headers: {
        'pinata_api_key': process.env.NEXT_PUBLIC_PINATA_API_KEY,
        'pinata_secret_api_key': process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
   

  const url = `https://gateway.pinata.cloud/ipfs/${responseData.data.IpfsHash}`;
  console.log(url);
  return url;
} catch (error) {
  setError('Error Uploading file to IPFS');
}
};

// const createVoter = async(formInput,fileUrl,router) =>{
//   try {
//     const {name,address,position}= formInput;
//     console.log(name,address,position,fileUrl);
//     if(!name || !address || !position || !fileUrl)return setError("Input data is missing");
//     console.log('ABI:', JSON.stringify(VotingAddressABI, null, 2));
// //Connecting smart contract

//const web3Modal = new Web3Modal();
// // console.log(web3Modal);

// const connection = await web3Modal.connect();
// console.log('hello');
// const provider = new ethers.providers.Web3Provider(connection);
// console.log("Provider:", provider);
// const signer = provider.getSigner();

// console.log("Signer:", signer);
// console.log("hello i have reached the point you want to reach\n");
// const contract = fetchContract(signer);
// console.log(contract);


//   } catch (error) {
//     console.log('error in creating the voter');
//   }
// }



const getAllVoterData = async() => {
  if (window.ethereum) {
    try {
      // Initialize a provider using MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request access to the user's MetaMask accounts
      await provider.send('eth_requestAccounts', []);

      // Create a signer using the provider
      const signer = await provider.getSigner();

      // Get the user's address (this is the MetaMask account)
      const address = await signer.getAddress();
      console.log("Signer Address:", address);

      // Create a contract instance connected to the signer
      const contract = new ethers.Contract(VotingAddress, VotingAddressABI, signer);
console.log(contract);
   
     

      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);
console.log(voterListData);

voterListData.map(async(el) => {
  const singleVoterData = await contract.getVoterdata(el);
  pushVoter.push(singleVoterData);
  setVoterArray(pushVoter);
  console.log("voterData:" + singleVoterData);
});
const voterList =await contract.getVoterLength();
setVoterLength(voterList);



    } catch (error) {
      console.error("Error interacting with the contract:", error.message);
      setError(error.message);
    }
  } else {
    console.log("MetaMask is not available. Please install MetaMask.");
  }
}


//   useEffect(() =>{
//     getAllVoterData();}
// ,[]);

//--Give Vote

const giveVote= async(id) => {
  if (window.ethereum) {
    try {
   const voterAddress= id.address;
   const voterId = id.id;
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const add = await signer.getAddress();
      console.log("Signer Address:", add);
      const contract = new ethers.Contract(VotingAddress, VotingAddressABI, signer);
console.log("contract:" + contract);
      
const voteredList= await contract.vote(voterAddress, voterId);

      
      const receipt = await provider.waitForTransaction(voteredList.hash, 1, 600000);  

      if (receipt && receipt.status === 1) {
        console.log("Transaction confirmed!");
      } else {
        console.log("Transaction failed!");
      }
      
    } catch (error) {
      console.error("Error interacting with the contract:", error.message);
    }
  } else {
    console.log("MetaMask is not available. Please install MetaMask.");
  }
}

const setCandidate = async(candidateForm,fileUrl, router) => {
  if (window.ethereum) {
    try {
      const {name,address,age}= candidateForm;
      console.log('INPUT DATA:' + name,address,age,fileUrl);
      if(!name || !address || !age || !fileUrl)return setError("Input data is missing");

      // const data = JSON.stringify({ name, address, age, fileUrl});
const FileUrl = '';

      // Initialize a provider using MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request access to the user's MetaMask accounts
      await provider.send('eth_requestAccounts', []);

      // Create a signer using the provider
      const signer = await provider.getSigner();

      // Get the user's address (this is the MetaMask account)
      const add = await signer.getAddress();
      console.log("Signer Address:", add);

      // Create a contract instance connected to the signer
      const contract = new ethers.Contract(VotingAddress, VotingAddressABI, signer);
console.log("contract:" + contract);
      // Call the non-payable function to create a new voter
      

      
      const url = "jsonData_url_here";  // Example image URL
      

      const tx = await contract.setCandidate(address,age,name, fileUrl,url);
      console.log("Transaction sent. Waiting for confirmation...");
console.log(tx);
      // Use provider.waitForTransaction to wait for the transaction to be mined
      const receipt = await provider.waitForTransaction(tx.hash, 1, 600000);  // 1 confirmation, timeout after 60 seconds

      if (receipt && receipt.status === 1) {
        console.log("Transaction confirmed!");
      } else {
        console.log("Transaction failed!");
      }


router.push("/");


      
    } catch (error) {
      console.error("Error interacting with the contract:", error.message);
    }
  } else {
    console.log("MetaMask is not available. Please install MetaMask.");
  }
}

const getNewCandidate = async() =>{
  if(window.ethereum){
  try {
    
    const provider = new ethers.BrowserProvider(window.ethereum);

    // Request access to the user's MetaMask accounts
    await provider.send('eth_requestAccounts', []);

    // Create a signer using the provider
    const signer = await provider.getSigner();

    // Get the user's address (this is the MetaMask account)
    const add = await signer.getAddress();
    console.log("Signer Address:", add);

    // Create a contract instance connected to the signer
    const contract = new ethers.Contract(VotingAddress, VotingAddressABI, signer);

const allCandidate = await contract.getCandidate();
console.log("CandidateData:" + allCandidate);

// allCandidate.map(async(el) => {
// const singleCandidateData = await contract.getCandidatedata(el);
// pushCandidate.push(singleCandidateData);
// console.log('pushCandidate:'+ pushCandidate);
// setCandidateArray(pushCandidate);

// candidateIndex.push(singleCandidateData[2]);
// console.log("singleCandidateData" + singleCandidateData);
// });

const updatedCandidates = await Promise.all(
  allCandidate.map(async (el) => {
    const singleCandidateData = await contract.getCandidatedata(el);
    console.log("Single Candidate Data:", singleCandidateData);
    return singleCandidateData;
  })
);

// Update state with the collected candidates
setCandidateArray(updatedCandidates);
console.log("Updated Candidate Array:", candidateArray);


const allCandidateLength = await contract.getCandidateLength();
console.log("candidate Length:" + allCandidateLength);
setCandidateLength(allCandidateLength);

  } catch (error) {
    console.log("error comes:" + error);
  }}
  else{
    console.log("Connect to metaMask or install Metamask");
  }
}
useEffect(() => {
getNewCandidate()
},[])
  return(<VotingContext.Provider value={{ votingTitle,checkIfWalletIsConnected ,connectWallet ,uploadToIPFS,createVoter,getAllVoterData, giveVote, setCandidate, getNewCandidate,error , voterArray,voterAddress,currentAccount,candidateArray,candidateLength, voterLength}}>
    {children}
  </VotingContext.Provider>);
};

const Voter = () => {
  return(
    <div>
     
    </div>
  )
}
export default Voter;