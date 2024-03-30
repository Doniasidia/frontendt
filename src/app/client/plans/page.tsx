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




const Plans = () => {
  const [showForm, setShowForm] = useState(false);
  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [telephone, setTelephone] = useState('');
  const [nbr, setnbr] = useState('');
  const [duree, setduree] = useState('');
  const [email, setEmail] = useState('');
  const [type, setPack] = useState('');
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
    if (!nom || !duree || !nbr || !prix || !type) {
      window.alert('Veuillez remplir tous les champs.'); // If any field is empty, show alert
      setFormValid(false);
      return; // Exit early if any field is empty
    }
  
    setFormValid(true);
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
                <td className={TdStyle.TdStyle}>ABCD</td>
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

            <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(27, 158, 246)' }}> Ajouter plan d'abonnement :</h2>

            <div className="mb-2">
              <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
                Nom:
              </label>
              <input 
                type="text"
                id="nom"
                name="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
        
              />
            </div>
            {/* Select Box */}
            <div className="mb-2">
              <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                Type:
                </label> 
              <div className="relative" style={{ width: '100%' }}>
                <select
                  id="type"
                  name="type"
                  value={type} 
                  onChange={handleTypeChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                >
                  <option value=""></option>
                  <option value="type1">mensuelle</option>
                  <option value="type2"></option>
                  <option value="type3"></option>
                 
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4z" /></svg>
                </div>
              </div>
            </div>
          
           

            <div className="mb-2">
              <label htmlFor="prix" className="block text-gray-700 text-sm font-bold mb-2">
                Prix :
              </label>
              <input
                type="prix"
                id="prix"
                name="prix"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer votre mot de passe"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="nbr" className="block text-gray-700 text-sm font-bold mb-2">
                Nbr des séances par mois:
              </label>
              <input
                type="nbr"
                id="nbr"
                name="nbr"
                value={nbr}
                onChange={(e) => setnbr(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer votre mot de passe"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="duree" className="block text-gray-700 text-sm font-bold mb-2">
                Durée:
              </label>
              <input
                type="duree"
                id="duree"
                name="duree"
                value={duree}
                onChange={(e) => setduree(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer votre mot de passe"
              />
            </div>
            <div className="mb-2">
      <label className="text-gray-700 text-sm font-bold">Inscription à distance :</label>
      <div>
        <input
          type="radio"
          id="oui"
          name="inscription"
          value="oui"
          checked={payes === true} // This ensures 'payes' is a boolean and updates properly
          onChange={() => setPayes(true)} // Set 'payes' to true when 'Oui' is selected
          className="mr-2 leading-tight focus:outline-none focus:shadow-outline"
        />
        <label htmlFor="oui" className="text-gray-700 text-sm font-bold mr-2">
          Oui
        </label>
        <input
          type="radio"
          id="non"
          name="inscription"
          value="non"
          checked={payes === false} // This ensures 'payes' is a boolean and updates properly
          onChange={() => setPayes(false)} // Set 'payes' to false when 'Non' is selected
          className="mr-2 leading-tight focus:outline-none focus:shadow-outline"
        />
        <label htmlFor="non" className="text-gray-700 text-sm font-bold">
          Non
        </label>
      </div>
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

export default Plans;