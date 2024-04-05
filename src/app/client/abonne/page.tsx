//client/abonné
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image'
import Layout from "../clientLayout";
import axios from "axios";
import { HiMail } from "react-icons/hi";



const TdStyle = {
  ThStyle : 'border-l border-transparent py-2 px-3 text-base font-medium lg:py-4 lg:px-4 bg-custom-blue' ,
  TdStyle: 'text-dark border-b border-l border-transparent border-[#E8E8E8] bg-sky-100 dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium',
  TdButton: 'inline-block px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium',
};
interface InputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
}
const TelephoneInput: React.FC<InputProps & { isEmpty: boolean; formSubmitted: boolean }> = ({ value, onChange, isValid, isEmpty, formSubmitted }) => {

  return (
    <div className="flex flex-wrap items-center mb-6 relative">
      <label htmlFor="telephone" className="block text-gray-700 text-sm font-bold mb-2">
        Numéro de téléphone *: 
      </label>
      <input        
        id="telephone"
        name="telephone"
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${isValid ? '' : 'border-red-500'}`}
        placeholder="Entrer votre numéro de téléphone"
      />
        {!isValid && value.trim() !== '' && <p className="text-red-500 text-xs italic">Veuillez entrer un numéro de téléphone valide.</p>}
      {formSubmitted && isEmpty &&  value.trim() === '' &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
    </div>
  );
}

const EmailInput: React.FC<InputProps> = ({ value, onChange, isValid }) => {
  return (
    <div className="flex flex-wrap items-center mb-4 relative">
      <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
        Email : 
      </label>
    
        <input        
          id="email"
          name="email"
          value={value}
          onChange={onChange}
          //className={shadow appearance-none border rounded w-full py-2 px-3 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${isValid ? '' : 'border-red-500'}}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${isValid || value.trim() === ''? '' : 'border-red-500'}`}

          placeholder="Enter votre email"
        />
          <div className="flex flex-wrap items-center mb-1 relative">
        <div className="absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none">
          <HiMail className="h-5 w-5 text-gray-400" />
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
       
        </div>
      </div>
      {!isValid && value.trim() !== '' && <p className="text-red-500 text-xs italic">Veuillez entrer une adresse email valide.</p>}
    </div>
  );
}

interface Subscriber {
 
  id: number; 
  username: string;
  email: string;
  telephone: string;
  status: string;
  nom: string;
  enLigne: string; 
  prenom:string;
  FirstName:string;
}

const Subscribers = () => {
  const [showForm, setShowForm] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setprenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [enLigne, setenLigne] = useState('');
  const [telephoneIsValid, setTelephoneIsValid] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [formValid, setFormValid] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<number | null>(null);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isEmptynom = !nom ;
  const isEmptyprenom= !prenom ;
  const isEmptytelephone=!telephone ;
  const isEmptyradio=!enLigne ;




  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/subscribers');
        setSubscribers(response.data);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      }
    };
  
    // Fetch  from the API when the component mounts
    fetchSubscribers();
  }, []);

  // Update selec  information when selectedId changes
  useEffect(() => {
    if (selectedSubscriberId !== null) {
      const subscriber = subscribers.find((subscriber) => subscriber.id === selectedSubscriberId);
      if (subscriber) {
        setSelectedSubscriber(subscriber);
        setNom(subscriber.username);
        setprenom(subscriber.FirstName);
        setTelephone(subscriber.telephone);
        setEmail(subscriber.email);
        setenLigne(subscriber.enLigne);
        
      }
    }
  }, [selectedSubscriberId, subscribers]);

  
  const handleClick = async (subscriberId: number, action: string) => {
    try {
      if (action === 'edit') {
        const subscriber = subscribers.find((subscriber) => subscriber.id === subscriberId);
        if (subscriber && subscriber.status === 'activated') {
          setSelectedSubscriberId(subscriberId);
          setSelectedSubscriber(subscriber);
          setShowEditForm(true);
        }
      } else if (action === 'toggle') {
        const updatedSubscriberIndex = subscribers.findIndex((subscriber) => subscriber.id === subscriberId);
        if (updatedSubscriberIndex !== -1) {
          const updatedSubscriber = subscribers[updatedSubscriberIndex];
          const newStatus = updatedSubscriber.status === 'activated' ? 'deactivated' : 'activated';
          const response = await axios.patch(`http://localhost:5000/api/subscribers/${subscriberId}/status`, { status: newStatus });
          const updatedSubscribers = [...subscribers];
          updatedSubscribers[updatedSubscriberIndex] = response.data;
          setSubscribers(updatedSubscribers);
        }
      }
      
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };
  
  
  
  
  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form fields to empty values when toggling the form
    setNom('');
    setprenom('');
    setTelephone('');
    setEmail('');
    setenLigne('');
    // Reset form validation states 
    setFormValid(true);
   setFormSubmitted(false);
    setEmailIsValid(true);
    setTelephoneIsValid(true);
  };
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
  
  
  
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setEmailIsValid(false);
    } else {
      setEmailIsValid(true);
    }
  
    if (!/^((\+|00)216)?([2579][0-9]{7}|(3[012]|4[01]|8[0128])[0-9]{6}|42[16][0-9]{5})$/.test(telephone)) {
      setTelephoneIsValid(false);
    } else {
      setTelephoneIsValid(true);
    }
      // Check if all fields are valid
      if (nom && email && telephone && prenom ) {
      
        console.log('succesfully created');
        setFormValid(true); 
      } 
      setFormSubmitted(true);
  
    try {
      if (selectedSubscriberId !== null) {
        // Update existing plan
        const response = await axios.put(`http://localhost:5000/api/subscribers/${selectedSubscriberId}`, {
          nom,
          prenom,
          email: email.trim() === '' ? null : email,
          telephone,
          enLigne,
      
        });
        
        // Update local state with modified plan
        const updatedSubscribers = subscribers.map(subscriber => {
          if (subscriber.id === selectedSubscriberId) {
            return response.data;
          }
          return subscriber;
        });
  
        setSubscribers(updatedSubscribers);
        setShowEditForm(false);
      } else {
        // Create new subscriber
        const response = await axios.post('http://localhost:5000/api/subscribers', {
          nom,
          prenom,
          email: email.trim() === '' ? null : email,
          telephone,
          enLigne,
      
        });
  
        // Update local state with newly created subscriber
        setSubscribers([...subscribers, response.data]);
        setShowForm(false);
      }
  
      setFormValid(true);
    } catch (error) {
      console.error('Error creating/modifying plan:', error);
    }
  };
 

  return (
    <Layout activePage="Abonnés"> 
<div className=" table-wrapper">
      <div className='flex justify-center pt-14 mx-2 w-full  '>
        <div className='w-full max-w-[90%] rounded-xl  table-wrapper'>
          <table className='w-full table-auto border-collapse rounded-xl '>
            <thead className='text-center bg-primary'>
              <tr >
                <th className={TdStyle.ThStyle}> Nom  </th>
                <th className={TdStyle.ThStyle}> Prénom </th>
                <th className={TdStyle.ThStyle}> Téléphone </th>
                <th className={TdStyle.ThStyle}> Email </th>
                <th className={TdStyle.ThStyle}> Groupe </th>
                <th className={TdStyle.ThStyle}>Plans </th>
                <th className={TdStyle.ThStyle}> Payés </th>
                <th className={TdStyle.ThStyle}> </th>
                <th className={TdStyle.ThStyle}> </th>
                <th className={TdStyle.ThStyle}> </th>
              </tr>
            </thead>
            <tbody>
              
            {subscribers.map((subscriber: Subscriber) => (
              <tr className={subscriber.status === 'activated' ? '' : 'deleted-row'} key={subscriber.id}>

                <td className={TdStyle.TdStyle}>{subscriber.username}</td>
                <td className={TdStyle.TdStyle}>{subscriber.FirstName}</td>
                <td className={TdStyle.TdStyle}>{subscriber.telephone}</td>
                <td className={TdStyle.TdStyle}>{subscriber.email}</td>
                <td className={TdStyle.TdStyle}> </td>  
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}>{subscriber.enLigne} </td>
                <td className={TdStyle.TdStyle}>  </td>
                <td className={TdStyle.TdStyle}> 
                <div className="flex items-center justify-center">
                <button onClick={() => handleClick(subscriber.id, 'edit')}>
  <Image src='/file-pen.svg' alt='edit' width={20} height={20} />
</button>
                
{showEditForm && selectedSubscriber && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg" style={{ width: '28%', height: '100%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
        
        <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
          
        
            <div className="flex justify-end mt-4 mr-4 absolute top-0 right-0">
              <Image src='/close.svg' alt='close' width={15} height={15} onClick={() => setShowEditForm(false)} className="cursor-pointer" />
            </div>

            <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(27, 158, 246)' }}>Modifier abonné :</h2>


            <div className="flex flex-wrap items-center mb-4 relative">
              <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
                Nom *  :
              </label>
              <input 
                type="text"
                id="nom"
                name="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer votre nom "
              />
               
            </div>
            {formSubmitted && isEmptyprenom &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            <div className="flex flex-wrap items-center mb-4 relative">
              <label htmlFor="prenom" className="block text-gray-700 text-sm font-bold mb-2">
                Prénom *:
              </label>
              <input 
                type="text"
                id="prenom"
                name="prenom"
                value={prenom}
                onChange={(e) => setprenom(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer votre prénom "
              />
            </div>
            {formSubmitted && isEmptyprenom && <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            <TelephoneInput
  value={telephone}
  onChange={(e) => setTelephone(e.target.value)}
  isValid={telephoneIsValid}
  isEmpty={telephone.trim() === ''}
  formSubmitted={formSubmitted} 
/>
<EmailInput value={email} onChange={(e) => setEmail(e.target.value)} isValid={emailIsValid} />
          

           
          
<div className="flex items-center mb-4">
  <span className="block text-gray-700 text-sm font-bold mr-2">Paiement en ligne :</span>
  <label className="inline-flex items-center">
    <input
      type="radio"
      name="enLigne"
      value="oui"
      checked={enLigne === 'oui'}
      onChange={(e) => setenLigne(e.target.value)}
      className="form-radio h-5 w-5 text-blue-600"
    />
    <span className="ml-2 text-gray-700">Oui</span>
  </label>
  <label className="inline-flex items-center ml-4">
    <input
      type="radio"
      name="enLigne"
      value="non"
      checked={enLigne === 'non'}
      onChange={(e) => setenLigne(e.target.value)}
      className="form-radio h-5 w-5 text-blue-600"
    />
    <span className="ml-2 text-gray-700">Non</span>
  </label>
</div>
{formSubmitted && isEmptyradio && (
  (enLigne.trim() === '') &&
  <p className="text-red-500 text-xs italic">Ce champ est obligatoire.</p>
)}



            <div className="flex justify-end">
              <button
                className="button-color text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Modifier
              </button>
            </div>
          
        </form>
      </div>
    )}
                </div>
                </td>
              
                <td className={TdStyle.TdStyle}><div className="flex items-center justify-center">
   
    <button onClick={() => handleClick(subscriber.id, 'toggle')} className="toggle-button">
  <div className={`toggle-switch ${subscriber.status === 'activated' ? 'active' : ''}`}></div>
</button>





  </div></td>
  
              </tr>
            ))}
            
            
            </tbody>
            
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg" style={{ width: '28%', height: '100%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
          <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
            <div className="flex justify-end mt-4 mr-4 absolute top-0 right-0">
              <Image src='/close.svg' alt='close' width={15} height={15} onClick={() => setShowForm(false)} className="cursor-pointer" />
            </div>

            <h2 className="text-lg font-bold mb-4 text-center" style={{ color: 'rgb(27, 158, 246)' }}>Ajouter abonné :</h2>


            <div className="mb-4">
              <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
                Nom *:
              </label>
              <input 
                type="text"
                id="nom"
                name="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer votre nom"

              />
              {formSubmitted && isEmptynom && <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            </div>
            <div className="flex flex-wrap items-center mb-4 relative">
              <label htmlFor="prenom" className="block text-gray-700 text-sm font-bold mb-2">
                Prénom * :
              </label>
              <input 
                type="text"
                id="prenom"
                name="prenom"
                value={prenom}
                onChange={(e) => setprenom(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer votre prénom "
              />
            </div>
            {formSubmitted && isEmptyprenom && <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            <TelephoneInput
  value={telephone}
  onChange={(e) => setTelephone(e.target.value)}
  isValid={telephoneIsValid}
  isEmpty={telephone.trim() === ''}
  formSubmitted={formSubmitted} // Pass formSubmitted as a prop
/>
<EmailInput value={email} onChange={(e) => setEmail(e.target.value)} isValid={emailIsValid} />


          

            
           {/* Radio Buttons for Payment en ligne */}
<div className="flex items-center mb-4">
  <span className="block text-gray-700 text-sm font-bold mr-2">Paiement en ligne :</span>
  <label className="inline-flex items-center">
    <input
      type="radio"
      name="enLigne"
      value="oui"
      checked={enLigne === 'oui'}
      onChange={(e) => setenLigne(e.target.value)}
      className="form-radio h-5 w-5 text-blue-600"
    />
    <span className="ml-2 text-gray-700">Oui</span>
  </label>
  <label className="inline-flex items-center ml-4">
    <input
      type="radio"
      name="enLigne"
      value="non"
      checked={enLigne === 'non'}
      onChange={(e) => setenLigne(e.target.value)}
      className="form-radio h-5 w-5 text-blue-600"
    />
    <span className="ml-2 text-gray-700">Non</span>
  </label>
</div>
{formSubmitted && isEmptyradio && (
  (enLigne.trim() === '') &&
  <p className="text-red-500 text-xs italic">Ce champ est obligatoire.</p>
)}

            <div className="flex justify-end">
              <button
                className="button-color text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="fixed bottom-6 right-8 mb-4 mr-4">
        <button onClick={toggleForm} className="flex items-center button-color font-bold text-white rounded-xl px-4 py-2">
          <span className="mr-2">Ajouter abonné</span>
          <Image src='/Add User Male.svg' alt='addUser' width={20} height={20}></Image>
        </button>
      </div>
      </div>
    </Layout>
  );
}

export default Subscribers;
