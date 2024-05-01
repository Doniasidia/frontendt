//subs/abonnements
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image'
import Layout from "../subsLayout";
import axios from "axios";
import PaginationBar from "../../../components/PaginationBar";


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

interface Abonnement {
  id: number;
  name: string; 

 
  status: string;

 


}


const Abonnements = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [formValid, setFormValid] = useState(true);
  const [abonnements, setAbonnements] = useState<Abonnement []>([]);

  const [selectedAbonnementId, setSelectedAbonnementId] = useState<number | null>(null);
  const [selectedAbonnement , setSelectedAbonnement ] = useState< Abonnement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [abonnementsToDisplay, setAbonnementsToDisplay] = useState< Abonnement[]>([]);
  const [filteredAbonnements, setFilteredAbonnements] = useState< Abonnement[]>([]);
 

  
  

  useEffect(() => {
    const fetchAbonnements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/abonnements');
        setAbonnements(response.data);
      } catch (error) {
        console.error('Error fetching abonnements:', error);
      }
    };
  
    fetchAbonnements();
  }, []);

  useEffect(() => {
    if (selectedAbonnementId !== null) {
      const abonnement = abonnements.find((abonnement) => abonnement.id === selectedAbonnementId);
      if (abonnement) {
        setSelectedAbonnement(abonnement);
        setName(abonnement.name);
       
      
     
      


      }
    }
  }, [selectedAbonnementId, abonnements]);

  
  const handleClick = async (abonnementId: number, action: string) => {
    try {
      if (action === 'edit') {
        const abonnement = abonnements.find((abonnement) => abonnement.id === abonnementId);
        if (abonnement && abonnement.status === 'activated') {
          setSelectedAbonnementId(abonnementId);
          setSelectedAbonnement(abonnement);
         
        }
      } else if (action === 'toggle') {
        const updatedAbonnementIndex = abonnements.findIndex((abonnement) =>abonnement.id === abonnementId);
        if (updatedAbonnementIndex !== -1) {
          const updatedAbonnement = abonnements[updatedAbonnementIndex];
          const newStatus = updatedAbonnement.status === 'activated' ? 'deactivated' : 'activated';
          const response = await axios.patch(`http://localhost:5000/api/abonnements/${abonnementId}/status`, { status: newStatus });
          const updatedAbonnements = [...abonnements];
          updatedAbonnements[updatedAbonnementIndex] = response.data;
          setAbonnements(updatedAbonnements);
        }
      }
      else if (action === 'delete') {
        // Supprimer l'entrée de la base de données
        await axios.delete(`http://localhost:5000/api/abonnements/${abonnementId}`);
        
        // Mettre à jour l'état local pour supprimer l'élément de la liste 
        setAbonnements(prevAbonnements => prevAbonnements.filter(abonnement => abonnement.id !== abonnementId));
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };
  
  useEffect(() => {
    const filtered = abonnements.filter((abonnement) => {
      return (
       ( abonnement.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      
      );
    });
    
    setFilteredAbonnements(filtered);
    setCurrentPage(1);
  }, [searchQuery, abonnements]);
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const abonnementsToDisplay = filteredAbonnements.slice(indexOfFirstItem, indexOfLastItem);
    setAbonnementsToDisplay(abonnementsToDisplay);
  }, [currentPage, filteredAbonnements]);
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (page: number) => {
  setCurrentPage(page);
};

 


  
  
  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form fields to empty values when toggling the form
    setName('');
   
  
   
  
  
    setFormSubmitted(false);
    // Reset form validation states as well if needed
    setFormValid(true);
   
   
  };
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
   
  
    // Convert the entered name to lowercase
 
   
    if (name       ) {
      
      console.log('succesfully created');
      setFormValid(true); 
    } 
    setFormSubmitted(true);
   
    try {
      if (selectedAbonnementId !== null) {
        // Update existing 
        const response = await axios.patch(`http://localhost:5000/api/abonnements/${selectedAbonnementId}`, {
          name,
         
      
    
        });
        
        // Update local state with modified 
        const updatedAbonnements = abonnements.map(abonnement => {
          if (abonnement.id === selectedAbonnementId) {
            return response.data;
          }

          return abonnement;
        });
  
        setAbonnements(updatedAbonnements);
      
      } else {
        // Create new
        const response = await axios.post('http://localhost:5000/api/abonnements', {
          name,
          
   
       
          
         
        });
  
        // Update local state with newly created
        setAbonnements([...abonnements, response.data]);
        setShowForm(false);
      }
      
      setFormValid(true);
    

    } catch (error) {
      console.error('Error creating/modifying abonnement:', error);
    }
  };

  

 
  
  return (
    <Layout activePage="abonnement"> 
   <div className="flex justify-center pt-14 mx-2 w-full">
    <div className="relative flex items-center ">
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="rechercher par client "
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pb-4">
            <Image src='/searchbar.svg' alt='search' width={15} height={40} />
        </div>
    </div>
</div>

<div className=" table-wrapper">
      <div className='flex justify-center mx-2 w-full'>
        <div className='w-full max-w-[90%] rounded-xl rounded-b-none table-wrapper'>
          <table className='w-full table-auto border-collapse '>
            <thead className='text-center bg-primary'>
              <tr >
                <th className={TdStyle.ThStyle}> Client  </th>
                <th className={TdStyle.ThStyle}> Plan  </th>
                <th className={TdStyle.ThStyle}> Groupe  </th>
                <th className={TdStyle.ThStyle}> Prix </th>
          
            
               
               
               
               
                <th className={TdStyle.ThStyle}> </th>
              </tr>
            </thead>
            <tbody>
              
           {filteredAbonnements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
.map((abonnement:  Abonnement) => (
              <tr className={abonnement.status === 'activated' ? '' : 'deleted-row'} key={abonnement.id}>

                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
              
            
             


              
              
              
                <td className={TdStyle.TdStyle}><div className="flex items-center justify-center">
    {/* Toggle button */}
    <button onClick={() => handleClick(abonnement.id, 'toggle')} className="toggle-button">
  <div className={`toggle-switch ${abonnement.status === 'activated' ? 'active' : ''}`}></div>
</button>





  </div></td>
  
              </tr>
            ))}
            
            
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

          <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(27, 158, 246)' }}> Ajouter  :</h2>

          <div className="mb-2">
            <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
              Nom:
            </label>
            <input 
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500`}
              placeholder="Entrer le nom"
            />
                       
          </div>
          
        </form>
      </div>
    )}



<div className="flex justify-center mt-50">
  <PaginationBar
    totalItems={filteredAbonnements.length}
    itemsPerPage={itemsPerPage}
    onPageChange={handlePageChange}
    currentPage={currentPage}
  />
</div>
</div>

</Layout>
 );
    }
export default Abonnements;
