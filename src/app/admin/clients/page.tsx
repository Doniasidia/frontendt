//admin/clients
"use client";
import React, { useState, ChangeEvent, useEffect, use } from "react";
import Image from 'next/image'
import Layout from "../adminLayout";
import axios from "axios";
import { HiEye, HiEyeOff, HiMail } from "react-icons/hi";
import PaginationBar from "../../components/PaginationBar";


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
        {!isValid && value.trim() !== '' && <p className="text-red-500 text-xs italic">Veuillez entrer un numéro de téléphone valide.</p>}
      {formSubmitted && isEmpty &&  value.trim() === '' && <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}

    </div>
    
  );
}

const EmailInput: React.FC<InputProps & { isEmptyemail: boolean; formSubmitted: boolean }> = ({ value, onChange, isValid, isEmptyemail, formSubmitted }) => {
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
          className={`shadow appearance-none border rounded w-full py-2 px-3 pl-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${isValid ? '' : 'border-red-500'}`}
          placeholder="Enter votre email"
        />
          <div className="flex flex-wrap items-center mb-1 relative">
        <div className="absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none">
          <HiMail className="h-5 w-5 text-gray-400" />
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
       
        </div>
      </div>
      {!isValid && value.trim() !== '' && <p className="text-red-500 text-xs italic">Veuillez entrer une adresse mail valide.</p>}
      {formSubmitted && isEmptyemail &&  value.trim() === '' && <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}

    </div>
  );
}
interface Client {
 
  id: number; 
  username: string;
  email: string;
  telephone: string;
  status: string;
  password:string;
  typepack: string; 
  
}

const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [typepack, setPack] = useState('');
  const [telephoneIsValid, setTelephoneIsValid] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [formValid, setFormValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isEmptyusername = !username ;
  const isEmptypassword= !password ;
  const isEmptytypepack=!typepack ;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  





  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
  
    // Fetch clients from the API when the component mounts
    fetchClients();
  }, []);

  // Update selected client information when selectedClientId changes
  useEffect(() => {
    if (selectedClientId !== null) {
      const client = clients.find((client) => client.id === selectedClientId);
      if (client) {
        setSelectedClient(client);
        // Set form fields based on selected client data
        setusername(client.username);
        setEmail(client.email);
        setTelephone(client.telephone);
        setPack(client.typepack);
        // Set password field
        setPassword(client.password || ''); // Use client's password or empty string if undefined
      }
    }
  }, [selectedClientId, clients]);

  
  const handleClick = async (clientId: number, action: string) => {
    try {
      if (action === 'edit') {
        const client = clients.find((client) => client.id === clientId);
        if (client && client.status === 'activated') {
          setSelectedClientId(clientId);
          setSelectedClient(client);
          setShowEditForm(true);
        }
      } else if (action === 'toggle') {
        const updatedClientIndex = clients.findIndex((client) => client.id === clientId);
        if (updatedClientIndex !== -1) {
          const updatedClient = clients[updatedClientIndex];
          const newStatus = updatedClient.status === 'activated' ? 'deactivated' : 'activated';
          const response = await axios.patch(`http://localhost:5000/api/clients/${clientId}/status, { status: newStatus }`);
          const updatedClients = [...clients];
          updatedClients[updatedClientIndex] = response.data;
          setClients(updatedClients);
        }
      }
      
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };
  useEffect(() => {
    const filtered = clients.filter((client) => {
      return (
       ( client.username?.toLowerCase().includes(searchQuery.toLowerCase())) ||
       ( client.email?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
    
    setFilteredClients(filtered);
  }, [searchQuery, clients]);
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
 
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  
  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form fields to empty values when toggling the form
    setusername('');
    setEmail('');
    setTelephone('');
    setPassword('');
    setPack('');
    // Reset form validation states as well if needed
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
    setFormSubmitted(true);
    try {
      if (selectedClientId !== null) {
        // Update existing plan
        const response = await axios.put(`http://localhost:5000/api/clients/${selectedClientId}`, {
          username,
          email,
          telephone,
          typepack,
          password,
        });
        
        // Update local state with modified plan
        const updatedClients = clients.map(client => {
          if (client.id === selectedClientId) {
            return response.data;
          }
          return client;
        });
  
        setClients(updatedClients);
        setShowEditForm(false);
      } else {
        // Create new plan
        const response = await axios.post('http://localhost:5000/api/clients', {
          username,
          email,
          telephone,
          typepack,
          password,
        });
  
        // Update local state with newly created plan
        setClients([...clients, response.data]);
        setShowForm(false);
      }
  
      setFormValid(true);
    } catch (error) {
      console.error('Error creating/modifying plan:', error);
    }
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPack(event.target.value); 
  };

  return (
    <Layout activePage="clients"> 
   <div className="flex justify-center pt-14 mx-2 w-full">
    <div className="relative flex items-center ">
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="recherche par nom établissement ou email"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <Image src='/searchbar.svg' alt='search' width={15} height={40} />
        </div>
    </div>
</div>
<div className=" table-wrapper">
      <div className='flex justify-center mx-2 w-full  '>
        <div className='w-full max-w-[90%] rounded-xl rounded-b-none table-wrapper'>
          <table className='w-full table-auto border-collapse '>
            <thead className='text-center bg-primary'>
              <tr >
                <th className={TdStyle.ThStyle}> Nom établissement </th>
                <th className={TdStyle.ThStyle}> Email </th>
                <th className={TdStyle.ThStyle}> Tel </th>
                <th className={TdStyle.ThStyle}> Packs </th>
                <th className={TdStyle.ThStyle}> </th>
                <th className={TdStyle.ThStyle}> </th>
              </tr>
            </thead>
            <tbody>
              
            {filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((client: Client) => (
              <tr className={client.status === 'activated' ? '' : 'deleted-row'} key={client.id}>

                <td className={TdStyle.TdStyle}>{client.username}</td>
                <td className={TdStyle.TdStyle}>{client.email}</td>
                <td className={TdStyle.TdStyle}>{client.telephone}</td>
                <td className={TdStyle.TdStyle}>
                <div className="flex justify-between items-center">
                  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: '45%' }}>45%</div>
                    
                  </div>
                  <Image src='/circle-plus.svg' alt='add pack' width={20} height={20} style={{ fill: 'blue' }}></Image>
                  </div>
                </td>
              
                <td className={TdStyle.TdStyle}> 
                <div className="flex items-center justify-center">
                <button onClick={() => handleClick(client.id, 'edit')}>
  <Image src='/file-pen.svg' alt='edit' width={20} height={20} />
</button>
                
{showEditForm && selectedClient && (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg" style={{ width: '28%', height: '100%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
        {/* Form contents */}
        <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
          {/* Form fields */}
        
            <div className="flex justify-end mt-4 mr-4 absolute top-0 right-0">
              <Image src='/close.svg' alt='close' width={15} height={15} onClick={() => setShowEditForm(false)} className="cursor-pointer" />
            </div>

            <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(27, 158, 246)' }}>Modifier client :</h2>


            <div className="flex flex-wrap items-center mb-4 relative">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Nom d'établissement :
              </label>
              <input 
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer le nom de l'établissement"
              />
              {formSubmitted && isEmptyusername &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            </div>
          

            <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} isValid={emailIsValid}    isEmptyemail={telephone.trim() === ''}
  formSubmitted={formSubmitted} />
            <TelephoneInput
  value={telephone}
  onChange={(e) => setTelephone(e.target.value)}
  isValid={telephoneIsValid}
  isEmpty={telephone.trim() === ''}
  formSubmitted={formSubmitted} // Pass formSubmitted as a prop
/>

            <div className="flex flex-wrap items-center mb-6 relative">
  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
    Mot de passe :
  </label>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    name="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
    placeholder="Entrer votre mot de passe"
  />
  <button
    type="button"
    className="absolute inset-y-7 right-0 flex items-center px-3 py-5 bg-white-200 text-gray-700 hover:text-gray-900 focus:outline-none"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <HiEye className="text-gray-400" /> : <HiEyeOff className="text-gray-400" />}
  </button>
</div>
{formSubmitted && isEmptypassword &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}

            {/* Select Box */}
            <div className="flex flex-wrap items-center mb-4 relative">
              <label htmlFor="typeClient" className="block text-gray-700 text-sm font-bold mb-2">Packs SMS :</label> 
              <div className="relative" style={{ width: '73%' }}>
                <select
                  id="typeClient"
                  name="typeClient"
                  value={typepack} 
                  onChange={handleTypeChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                >
                  <option value=""></option>
                  <option value="type1">100 SMS</option>
                  <option value="type2">500 SMS</option>
                  <option value="type3">10000 SMS</option>
                 
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4z" /></svg>
                </div>
              </div>
              
            </div>
            {formSubmitted && isEmptytypepack &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}

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
    {/* Toggle button */}
    <button onClick={() => handleClick(client.id, 'toggle')} className="toggle-button">
  <div className={`toggle-switch ${client.status === 'activated' ? 'active' : ''}`}></div>
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

            <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(27, 158, 246)' }}>Ajouter client :</h2>


            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                Nom d'établissement :
              </label>
              <input 
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                placeholder="Entrer le nom de l'établissement"
              />
              {formSubmitted && isEmptyusername &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            </div>
            

            <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} isValid={emailIsValid}    isEmptyemail={telephone.trim() === ''}
  formSubmitted={formSubmitted} />
            <TelephoneInput
  value={telephone}
  onChange={(e) => setTelephone(e.target.value)}
  isValid={telephoneIsValid}
  isEmpty={telephone.trim() === ''}
  formSubmitted={formSubmitted} // Pass formSubmitted as a prop
/>
            <div className="mb-6 relative">
  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
    Mot de passe :
  </label>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    name="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
    placeholder="Entrer votre mot de passe"
  />
  <button
    type="button"
    className="absolute inset-y-7 right-0 flex items-center px-3 py-5 bg-white-200 text-gray-700 hover:text-gray-900 focus:outline-none"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <HiEye className="text-gray-400" /> : <HiEyeOff className="text-gray-400" />}
  </button>
</div>
{formSubmitted && isEmptypassword &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}

            {/* Select Box */}
            <div className="flex items-center mb-4">
              <label htmlFor="typeClient" className="block text-gray-700 text-sm font-bold mb-2">Packs SMS :</label> 
              <div className="relative" style={{ width: '73%' }}>
                <select
                  id="typeClient"
                  name="typeClient"
                  value={typepack} 
                  onChange={handleTypeChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                >
                  <option value=""></option>
                  <option value="type1">100 SMS</option>
                  <option value="type2">500 SMS</option>
                  <option value="type3">10000 SMS</option>
                 
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4z" /></svg>
                </div>
              </div>
             
            </div>
            {formSubmitted && isEmptytypepack &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
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
          <span className="mr-2">Ajouter client</span>
          <Image src='/Add User Male.svg' alt='addUser' width={20} height={20}></Image>
        </button>
        </div>
<div className="flex justify-center mt-50">
  <PaginationBar
    totalItems={filteredClients.length}
    itemsPerPage={itemsPerPage}
    onPageChange={handlePageChange}
    currentPage={currentPage}
  />
</div>
</div>
    </Layout>
  );
}

export default Clients;
