import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { VotingContext } from '../context/Voter';
import Style from '../styles/allowedVoter.module.css';
import images from '../assets/images';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import image from '../assets/Photo/gallery.webp';
import voter_image from '../assets/Photo/block.png';

const allowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();
  const { uploadToIPFS, createVoter, voterArray, getAllVoterData } = useContext(VotingContext);

  //---- Fetch Voter Data on Component Mount
  useEffect(() => {
    getAllVoterData();
  }, []);

  //---- Handle Image Drop
  const onDrop = useCallback(async (acceptedFiles) => {
    const url = await uploadToIPFS(acceptedFiles[0]);
    setFileUrl(url);
    console.log("File uploaded to IPFS:", url); // Debugging file upload
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  // Handle Button Click to create voter
  const handleCreateVoter = async () => {
    if (!formInput.name || !formInput.address || !formInput.position || !fileUrl) {
      console.error("Missing information: ", formInput, fileUrl); // Debugging missing data
      return;
    }

    console.log("Creating voter with data:", formInput, fileUrl); // Debugging before creation
    await createVoter(formInput, fileUrl, router); // Make sure this function handles async operations
  };

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>Name: <span>{formInput.name}</span></p>
              <p>Address: <span>{formInput.address.slice(0, 20)}</span></p>
              <p>Position: <span>{formInput.position}</span></p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create candidate for Voting</h4>
              <p>Blockchain voting Organization, provide Ethereum Blockchain ecosystem</p>
              <p className={Style.sideInfo_para}>Contract Candidate List</p>
            </div>
            <div className={Style.card}>
              {voterArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[4]} alt="Profile Photo" />
                  </div>
                  <div className={Style.card_info}>
                    <p>Name: {el[1]}#{el[0]}</p>
                    <p>Address: {el[3].slice(0, 7)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Create New Voter</h1>
          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={Style.voter__container__box__div__info}>
                  <p>Upload File: JPG, PNG ,GIF, WEBM Max 10MB</p>
                  <div className={Style.voter__container__box__div__image}>
                    <Image src={image} width={150} height={150} objectFit='contain' alt="File upload" />
                  </div>
                  <p>Drag & Drop File</p>
                  <p>or Browse media on your Device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input__container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Voter name"
            handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
          />

          <Input
            inputType="text"
            title="Address"
            placeholder="Voter Address"
            handleClick={(e) => setFormInput({ ...formInput, address: e.target.value })}
          />

          <Input
            inputType="text"
            title="Position"
            placeholder="Voter Age"
            handleClick={(e) => setFormInput({ ...formInput, position: e.target.value })}
          />

          <div className={Style.Button}>
            <Button btnName="Authorized Voter" handleClick={handleCreateVoter} />
          </div>
        </div>
      </div>

      <div className={Style.createdVoter}>
        <div className={Style.createdVoter__info}>
          <Image src={voter_image} alt="User Profile" />
          <p>Notice for User</p>
          <p>Organizer :<span>0x5FbDB2afecb367f032d93F6315..</span></p>
          <p>Only Organizer of voting Contract can create Voter</p>
        </div>
      </div>
    </div>
  );
};

export default allowedVoters;
