//Plans/page.jsx
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image'
import Layout from "../clientLayout";
import PaginationBar from "../PaginationBar";

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
interface Client {
  nom: string;
  prenom: string;
  // Add other properties as needed
}
const TelephoneInput: React.FC<InputProps> = ({ value, onChange, isValid }) => {
  return (
    <div className="mb-4">
      <label htmlFor="telephone" className="block text-gray-700 text-sm font-bold mb-2">
        Numéro de téléphone : 
      </label>
      <input        
        id="telephone"
        name="telephone"
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-indigo-500 ${isValid ? '' : 'border-red-500'}`}
        placeholder="Entrer votre numéro de téléphone"
      />
      {!isValid && <p className="text-red-500 text-xs italic">Veuillez entrer un numéro de téléphone valide.</p>}
    </div>
  );
}

const EmailInput: React.FC<InputProps> = ({ value, onChange, isValid }) => {
  return (
    <div className="mb-4">
      <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
        Email : 
      </label>
      <input        
        id="email"
        name="email"
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-indigo-500 ${isValid ? '' : 'border-red-500'}`}
        placeholder="Entrer votre email"
      />
      {!isValid && <p className="text-red-500 text-xs italic">Veuillez entrer une adresse email valide.</p>}
    </div>
  );
}

const Plans = () => {
  const [showForm, setShowForm] = useState(false);
  const [nomEtablissement, setNomEtablissement] = useState('');
  const [password, setPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [typepack, setPack] = useState('');
  const [telephoneIsValid, setTelephoneIsValid] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [formValid, setFormValid] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [payes, setPayes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;



  

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  const handleClick = () => {
    setIsActive(!isActive); // Toggle the state when the button is clicked
  };
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handlePageChange = (page: number) => {
  setCurrentPage(page);
};

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, clients.length);
  const visibleClients = clients.slice(startIndex, endIndex);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the form from submitting by default
    if (!nomEtablissement || !email || !telephone || !password || !typepack) {
      window.alert('Veuillez remplir tous les champs.'); // If any field is empty, show alert
      setFormValid(false);
      return; // Exit early if any field is empty
    }
  
    // Validate email
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setEmailIsValid(false);
    } else {
      setEmailIsValid(true);
    }
  
    // Validate telephone
    if (!/^((\+|00)216)?([2579][0-9]{7}|(3[012]|4[01]|8[0128])[0-9]{6}|42[16][0-9]{5})$/.test(telephone)) {
      setTelephoneIsValid(false);
    } else {
      setTelephoneIsValid(true);
    }
  
    // Check if all fields are valid
    if (nomEtablissement && email && telephone && password && typepack) {
      
      console.log('succesfully created');
      setFormValid(true); 
    } 
  };
  

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPack(event.target.value); // Corrected setPack usage
    
    
    
  };
  const filteredClients = clients.filter(client => {
    const fullName = `${client.nom} ${client.prenom}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <Layout activePage="Plans"> 
<div className="flex justify-center mt-8">
    <div className="relative">
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder=""
            className="border border-gray-300 px-20 py-1 rounded-md pl-10" // Adjust padding to make space for the icon
        />
        <div className="absolute inset-y-0 right-3 pl-3 flex items-center pointer-events-none">
            {/* Using the search icon image without importing */}
            <img src="/search.svg" alt="Search" className="h-4 w-4" /> {/* Adjust height and width as needed */}
        </div>
    </div>
</div>
  <div className='flex justify-center pt-6 mx-2 w-full '>
        <div className='w-full max-w-[90%] overflow-x-auto rounded-xl rounded-b-none'>
          <table className='w-full table-auto border-collapse'>
            <thead className='text-center bg-primary'>
              <tr>
                <th className={TdStyle.ThStyle}> Nom  </th>
                <th className={TdStyle.ThStyle}> Type </th>
                <th className={TdStyle.ThStyle}> Prix </th>
                <th className={TdStyle.ThStyle}> Durée de la séance </th>
                <th className={TdStyle.ThStyle}> Nombre des séances </th>
                <th className={TdStyle.ThStyle}> En ligne</th>
            
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={TdStyle.TdStyle}>Ben salah </td>
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
            
                
                
                

              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg" style={{ width: '30%', height: '100%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
          <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
            <div className="flex justify-end mt-2.5 mr-4 absolute top-0 right-0">
              <Image src='/close.svg' alt='close' width={15} height={15} onClick={() => setShowForm(false)} className="cursor-pointer" />
            </div>

            <h2 className="text-lg font-bold mb-2">Ajouter abonné :</h2>

            <div className="mb-2">
              <label htmlFor="nomEtablissement" className="block text-gray-700 text-sm font-bold mb-2">
                Nom:
              </label>
              <input 
                type="text"
                id="nomEtablissement"
                name="nomEtablissement"
                value={nomEtablissement}
                onChange={(e) => setNomEtablissement(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-indigo-500"
                placeholder="Entrer votre nom "
              />
            </div>
            <div className="mb-2">
              <label htmlFor="nomEtablissement" className="block text-gray-700 text-sm font-bold mb-2">
                Prénom:
              </label>
              <input 
                type="text"
                id="nomEtablissement"
                name="nomEtablissement"
                value={nomEtablissement}
                onChange={(e) => setNomEtablissement(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-indigo-500"
                placeholder="Entrer votre prénom "
              />
            </div>
            
            <TelephoneInput value={telephone} onChange={(e) => setTelephone(e.target.value)} isValid={telephoneIsValid} />

            <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} isValid={emailIsValid} />
           

            <div className="mb-2">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Groupe :
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-indigo-500"
                placeholder="Entrer votre mot de passe"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Plans:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-indigo-500"
                placeholder="Entrer votre mot de passe"
              />
            </div>
            <div className="mb-2">
  <input
    type="checkbox"
    id="payes"
    name="payes"
    checked={payes}
    onChange={(e) => setPayes(e.target.checked)}
    className="mr-2 leading-tight focus:outline-none focus:shadow-outline"
  />
  <label htmlFor="payes" className="text-gray-700 text-sm font-bold">
    Payés
  </label>
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
<div className="fixed bottom-6 right-8 mb-0.5 mr-4 mt-40 flex flex-column items-center">
  <button onClick={toggleForm} className="flex items-center button-color font-bold text-white rounded-xl px-4 py-2 mb-2">
    <span className="mr-2">Ajouter</span>
    <Image src='/Add User Male.svg' alt='addUser' width={20} height={20}></Image>
  </button>
  
</div>
<div className="flex justify-center mt-50">
    <PaginationBar
      totalItems={clients.length}
      itemsPerPage={itemsPerPage}
      onPageChange={handlePageChange}
      currentPage={currentPage}
    />
  </div>

    
    </Layout>
      
  );
}

export default Plans;
