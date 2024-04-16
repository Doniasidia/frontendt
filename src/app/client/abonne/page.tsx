//client/abonné
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image'
import Layout from "../clientLayout";
import axios from "axios";
import { HiMail } from "react-icons/hi";
import PaginationBar from "../../components/PaginationBar";
import validator from 'email-validator';


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
const TelephoneInput: React.FC<InputProps & { isEmpty: boolean; formSubmitted: boolean; telephoneExists: boolean }> = ({ value, onChange, isValid, isEmpty, formSubmitted, telephoneExists }) => {
  return (
    <div className="flex flex-wrap items-center mb-6 relative">
      <label htmlFor="telephone" className="block text-gray-700 text-sm font-bold mb-2">
        Numéro de téléphone : 
      </label>
      <input        
        id="telephone"
        name="telephone"
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${isValid ? '' : 'border-red-500'}`}
        placeholder="Entrer votre numéro de téléphone"
      />
      {formSubmitted && !isValid && value.trim() !== '' && <p className="text-red-500 text-xs italic">Veuillez entrer un numéro de téléphone valide.</p>}
      {formSubmitted && isEmpty && value.trim() === '' && <p className="text-red-500 text-xs italic">Ce champ est obligatoire.</p>}
      {formSubmitted && telephoneExists && <p className="text-red-500 text-xs italic">Ce numéro de téléphone existe déjà.</p>}
    </div>
  );
}

const EmailInput: React.FC<InputProps & {  formSubmitted: boolean; emailExists: boolean }> = ({ value, onChange, isValid,  formSubmitted, emailExists }) => {
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
        className={`shadow appearance-none border rounded w-full py-2 px-3 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${isValid || value.trim() === '' ? '' : 'border-red-500'}`}
        placeholder="Enter votre email"
      />
      <div className="flex flex-wrap items-center mb-1 relative">
        <div className="absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none">
          <HiMail className="h-5 w-5 text-gray-400" />
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
       
        </div>
      </div>
      {formSubmitted && !isValid  && value.trim() !== '' &&<p className="text-red-500 text-xs italic">Veuillez entrer une adresse mail valide.</p>}
     
      {formSubmitted && emailExists && <p className="text-red-500 text-xs italic">Cet email existe déjà.</p>}
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

  prenom:string;
  FirstName:string;
}

const Subscribers = () => {
  const [showForm, setShowForm] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setprenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');

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

  const [searchQuery, setSearchQuery] = useState('');
const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 7;
const [emailExists, setEmailExists] = useState(false);
const [telephoneExists, setTelephoneExists] = useState(false);
const [showSuccessNotification, setShowSuccessNotification] = useState(false);
const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
const [plans, setPlans] = useState<string[]>([]);
const [groups, setGroups] = useState<string[]>([]);


useEffect(() => {
  const fetchPlansAndGroups = async () => {
    try {
      const plansResponse = await axios.get('http://localhost:5000/api/plans');
      const groupsResponse = await axios.get('http://localhost:5000/api/groupes');
      setPlans(plansResponse.data);
      setGroups(groupsResponse.data);
    } catch (error) {
      console.error('Error fetching plans and groups:', error);
    }
  };

  fetchPlansAndGroups();
}, []);

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
  
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  useEffect(() => {
    const filtered = subscribers.filter((subscriber) => {
      return (
        subscriber.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscriber.FirstName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  
    setFilteredSubscribers(filtered);
  }, [searchQuery, subscribers]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = event.target.value;
    const emailAlreadyExists = subscribers.some(subscriber => subscriber.email === enteredEmail);
    setEmailExists(emailAlreadyExists);
    setEmail(event.target.value);
  };
  const handleTelephoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const enteredTelephone = event.target.value;
    const telephoneAlreadyExists = subscribers.some(subscriber => subscriber.telephone === enteredTelephone);
    setTelephoneExists(telephoneAlreadyExists);
    setTelephone(event.target.value);
  };
   
  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form fields to empty values when toggling the form
    setNom('');
    setprenom('');
    setTelephone('');
    setEmail('');
   
    // Reset form validation states 
    setFormValid(true);
   setFormSubmitted(false);
    setEmailIsValid(true);
    setTelephoneIsValid(true);
  };
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
  
  
  
    if (!validator.validate(email)) {

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
       
      
        });
  
        // Update local state with newly created subscriber
        setSubscribers([...subscribers, response.data]);
        setShowForm(false);
      }
  
      setFormValid(true);
      setShowSuccessNotification(true);
    } catch (error) {
      console.error('Error creating/modifying plan:', error);
    }
  };
  const SuccessNotification = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white py-4 px-8 rounded-xl shadow-lg text-xl">
       Abonné ajouté avec succès
      </div>
    );
  };

  return (
    <Layout activePage="Abonnés"> 
   <div className="flex justify-center pt-14 mx-2 w-full">
    <div className="relative flex items-center  ">
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="rechercher par nom ou prénom"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pb-4">
            <Image src='/searchbar.svg' alt='search' width={15} height={40} />
        </div>
    </div>
</div>

<div className=" table-wrapper">
      <div className='flex justify-center mx-2 w-full  '>
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
                
                <th className={TdStyle.ThStyle}> </th>
                <th className={TdStyle.ThStyle}> </th>
                <th className={TdStyle.ThStyle}> </th>
              </tr>
            </thead>
            <tbody>
              
            {filteredSubscribers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
.map((subscriber: Subscriber) => (
              <tr className={subscriber.status === 'activated' ? '' : 'deleted-row'} key={subscriber.id}>

                <td className={TdStyle.TdStyle}>{subscriber.username}</td>
                <td className={TdStyle.TdStyle}>{subscriber.FirstName}</td>
                <td className={TdStyle.TdStyle}>{subscriber.telephone}</td>
                <td className={TdStyle.TdStyle}>{subscriber.email}</td>
                <td className={TdStyle.TdStyle}>
  <select
    value={selectedGroup || ''}
    onChange={(e) => setSelectedGroup(e.target.value)}
    className="border border-gray-300 rounded-md px-2 py-1"
  >
    <option value="">Select Group</option>
    {groups.map((group) => (
      <option key={group} value={group}>{group}</option>
    ))}
  </select>
</td>
<td className={TdStyle.TdStyle}>
  <select
    value={selectedPlan || ''}
    onChange={(e) => setSelectedPlan(e.target.value)}
    className="border border-gray-300 rounded-md px-2 py-1"
  >
    <option value="">Select Plan</option>
    {plans.map((plan) => (
      <option key={plan} value={plan}>{plan}</option>
    ))}
  </select>
</td>
                
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptynom ? 'border-red-500' : ''}`}
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptyprenom ? 'border-red-500' : ''}`}
                placeholder="Entrer votre prénom "
              />
               {formSubmitted && isEmptyprenom && <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            </div>
           
            <TelephoneInput
      value={telephone}
      onChange={handleTelephoneChange}
      isValid={telephoneIsValid}
      isEmpty={telephone.trim() === ''}
      formSubmitted={formSubmitted}
      telephoneExists={telephoneExists}
    />
           
<EmailInput
      value={email}
      onChange={handleEmailChange}
      isValid={emailIsValid}
     
      formSubmitted={formSubmitted}
      emailExists={emailExists}
    />
          

           
          




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
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptynom ? 'border-red-500' : ''}`}
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
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptyprenom ? 'border-red-500' : ''}`}
                placeholder="Entrer votre prénom "
              />
               {formSubmitted && isEmptyprenom && <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            </div>
            
            <TelephoneInput
      value={telephone}
      onChange={handleTelephoneChange}
      isValid={telephoneIsValid}
      isEmpty={telephone.trim() === ''}
      formSubmitted={formSubmitted}
      telephoneExists={telephoneExists}
    />

           
<EmailInput
      value={email}
      onChange={handleEmailChange}
      isValid={emailIsValid}
      
      formSubmitted={formSubmitted}
      emailExists={emailExists}
    />
<div className="flex flex-wrap items-center mb-4 relative">
    <label htmlFor="selectedGroup" className="block text-gray-700 text-sm font-bold mb-2">
      Groupe :
    </label>
    <select
      id="selectedGroup"
      name="selectedGroup"
      value={selectedGroup || ''}
      onChange={(e) => setSelectedGroup(e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-1"
    >
      <option value="">Sélectionnez un groupe</option>
      {groups.map((group) => (
        <option key={group} value={group}>{group}</option>
      ))}
    </select>
  </div>

  <div className="flex flex-wrap items-center mb-4 relative">
    <label htmlFor="selectedPlan" className="block text-gray-700 text-sm font-bold mb-2">
      Plan :
    </label>
    <select
      id="selectedPlan"
      name="selectedPlan"
      value={selectedPlan || ''}
      onChange={(e) => setSelectedPlan(e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-1"
    >
      <option value="">Sélectionnez un plan</option>
      {plans.map((plan) => (
        <option key={plan} value={plan}>{plan}</option>
      ))}
    </select>
  </div>


          

            
     
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
        <div className="flex justify-center mt-50">
  <PaginationBar
    totalItems={filteredSubscribers.length}
    itemsPerPage={itemsPerPage}
    onPageChange={handlePageChange}
    currentPage={currentPage}
  />
</div>
</div>
{showSuccessNotification && <SuccessNotification />}
    </Layout>
  );
}

export default Subscribers;
