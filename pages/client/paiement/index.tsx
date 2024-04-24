//client/paiement 
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image'
import Layout from "../clientLayout";
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

interface Paiement {
  id: number;
  name: string; 

 
  status: string;

 


}


const Paiements = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [formValid, setFormValid] = useState(true);
  const [paiements, setPaiements] = useState<Paiement []>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedPaiementId, setSelectedPaiementId] = useState<number | null>(null);
  const [selectedPaiement , setSelectedPaiement ] = useState<Paiement  | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isEmptyname = !name ;
  const [nameExists, setNameExists] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [paiementsToDisplay, setPaiementsToDisplay] = useState<Paiement[]>([]);
  const [filteredPaiements, setFilteredPaiements] = useState<Paiement[]>([]);
  const [successNotificationActionType, setSuccessNotificationActionType] = useState<string>('');

  
  

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/paiements');
        setPaiements(response.data);
      } catch (error) {
        console.error('Error fetching paiements:', error);
      }
    };
  
    fetchPaiements();
  }, []);

  useEffect(() => {
    if (selectedPaiementId !== null) {
      const paiement = paiements.find((paiement) => paiement.id === selectedPaiementId);
      if (paiement) {
        setSelectedPaiement(paiement);
        setName(paiement.name);
       
      
     
      


      }
    }
  }, [selectedPaiementId, paiements]);

  
  const handleClick = async (paiementId: number, action: string) => {
    try {
      if (action === 'edit') {
        const paiement = paiements.find((paiement) => paiement.id === paiementId);
        if (paiement && paiement.status === 'activated') {
          setSelectedPaiementId(paiementId);
          setSelectedPaiement(paiement);
          setShowEditForm(true);
        }
      } else if (action === 'toggle') {
        const updatedPaiementIndex = paiements.findIndex((paiement) =>paiement.id === paiementId);
        if (updatedPaiementIndex !== -1) {
          const updatedPaiement = paiements[updatedPaiementIndex];
          const newStatus = updatedPaiement.status === 'activated' ? 'deactivated' : 'activated';
          const response = await axios.patch(`http://localhost:5000/api/paiements/${paiementId}/status`, { status: newStatus });
          const updatedPaiements = [...paiements];
          updatedPaiements[updatedPaiementIndex] = response.data;
          setPaiements(updatedPaiements);
        }
      }
      else if (action === 'delete') {
        // Supprimer l'entrée de la base de données
        await axios.delete(`http://localhost:5000/api/paiements/${paiementId}`);
        
        // Mettre à jour l'état local pour supprimer l'élément de la liste 
        setPaiements(prevPaiements => prevPaiements.filter(paiement => paiement.id !== paiementId));
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };
  
  useEffect(() => {
    const filtered = paiements.filter((paiement) => {
      return (
       ( paiement.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      
      );
    });
    
    setFilteredPaiements(filtered);
    setCurrentPage(1);
  }, [searchQuery, paiements]);
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paiementsToDisplay = filteredPaiements.slice(indexOfFirstItem, indexOfLastItem);
    setPaiementsToDisplay(paiementsToDisplay);
  }, [currentPage, filteredPaiements]);
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
    const lowercaseName = name.toLowerCase();
    // Check if any existing name matches the lowercase version of the entered name
    const nameExistsInPaiements = paiements.some(paiement => paiement.name.toLowerCase() === lowercaseName);
    setNameExists(nameExistsInPaiements);
   
    if (name     && !nameExistsInPaiements   ) {
      
      console.log('succesfully created');
      setFormValid(true); 
    } 
    setFormSubmitted(true);
    if (nameExistsInPaiements) {
      return;
    }
    try {
      if (selectedPaiementId !== null) {
        // Update existing 
        const response = await axios.patch(`http://localhost:5000/api/paiements/${selectedPaiementId}`, {
          name,
         
      
    
        });
        
        // Update local state with modified 
        const updatedPaiements = paiements.map(paiement => {
          if (paiement.id === selectedPaiementId) {
            return response.data;
          }
          return paiement;
        });
  
        setPaiements(updatedPaiements);
        setShowEditForm(false);
      } else {
        // Create new
        const response = await axios.post('http://localhost:5000/api/paiements', {
          name,
          
   
       
          
         
        });
  
        // Update local state with newly created
        setPaiements([...paiements, response.data]);
        setShowForm(false);
      }
      setShowSuccessNotification(true);
      setFormValid(true);
      setShowSuccessNotification(true);
setSuccessNotificationActionType(selectedPaiementId !== null ? "modifié" : "ajouté");
    } catch (error) {
      console.error('Error creating/modifying paiement:', error);
    }
  };

  

  const SuccessNotification = ({ actionType }: { actionType: string }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white py-4 px-8 rounded-xl shadow-lg text-xl">
        {actionType === "ajouté" ? "Client ajouté avec succès" : "Client modifié avec succès"}
      </div>
    );
  };
  
  return (
    <Layout activePage="paiement"> 
   <div className="flex justify-center pt-14 mx-2 w-full">
    <div className="relative flex items-center ">
        <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="rechercher par nom "
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
                <th className={TdStyle.ThStyle}> Nom d'abonné  </th>
                <th className={TdStyle.ThStyle}> Prix </th>
                <th className={TdStyle.ThStyle}> Date de facture </th>
                <th className={TdStyle.ThStyle}> Status de Paiement </th>
                <th className={TdStyle.ThStyle}> Notification </th>
            
               
               
               
                <th className={TdStyle.ThStyle}> </th>
                <th className={TdStyle.ThStyle}> </th>
              </tr>
            </thead>
            <tbody>
              
           {filteredPaiements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
.map((paiement: Paiement) => (
              <tr className={paiement.status === 'activated' ? '' : 'deleted-row'} key={paiement.id}>

                <td className={TdStyle.TdStyle}>{paiement.name}</td>
                <td className={TdStyle.TdStyle}></td>
               
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
                <td className={TdStyle.TdStyle}></td>
            
             


              
              
                <td className={TdStyle.TdStyle}> 
                <div className="flex items-center justify-center">
                <button onClick={() => handleClick(paiement.id, 'edit')}>
  <Image src='/file-pen.svg' alt='edit' width={20} height={20} />
</button>
                
{showEditForm && selectedPaiement && (
       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg" style={{ width: '28%', height: '100%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
       {/* Form contents */}
       <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
         <div className="flex justify-end mt-2.5 mr-4 absolute top-0 right-0">
           <Image src='/close.svg' alt='close' width={15} height={15} onClick={() => setShowEditForm(false)} className="cursor-pointer" />
         </div>

         <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(27, 158, 246)' }}> Payer:</h2>

         <div className="flex flex-wrap items-center mb-4 relative">
           <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
             Nom:
           </label>
           <input 
             type="text"
             id="name"
             name="name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptyname ? 'border-red-500' : ''}`}
             placeholder="Entrer le nom"
           />
            {formSubmitted && isEmptyname &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            {formSubmitted && nameExists && <p className="text-red-500 text-xs italic">Ce nom existe déjà.</p>}
         </div> 

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
    <button onClick={() => handleClick(paiement.id, 'toggle')} className="toggle-button">
  <div className={`toggle-switch ${paiement.status === 'activated' ? 'active' : ''}`}></div>
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptyname ? 'border-red-500' : ''}`}
              placeholder="Entrer le nom"
            />
                        {formSubmitted && isEmptyname &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
                        {formSubmitted &&nameExists && <p className="text-red-500 text-xs italic">Ce nom existe déjà.</p>}
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
    {showSuccessNotification && <SuccessNotification actionType={successNotificationActionType} />}

<div className="fixed bottom-6 right-8 mb-0.5 mr-4 mt-40 flex flex-column items-center">
<button onClick={toggleForm} className="flex items-center button-color font-bold text-white rounded-xl px-4 py-2 mb-2">
  <span className="mr-2">Ajouter </span>
  <Image src='/add.svg' alt='add' width={20} height={20} color="white"></Image>
</button>
</div>
<div className="flex justify-center mt-50">
  <PaginationBar
    totalItems={filteredPaiements.length}
    itemsPerPage={itemsPerPage}
    onPageChange={handlePageChange}
    currentPage={currentPage}
  />
</div>
</div>

</Layout>
 );
    }
export default Paiements;
