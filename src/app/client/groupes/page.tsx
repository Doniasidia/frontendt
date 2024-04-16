//client/groupes 
"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image'
import Layout from "../clientLayout";
import axios from "axios";
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

interface Groupe {
  id: number;
  name: string; 
  plan: string;
 
  status: string;
 
  nbrab: number;

}


const Groupes = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('');
  const [nbrab, setNbrab] = useState('');
  const [formValid, setFormValid] = useState(true);
  const [groupes, setGroupes] = useState<Groupe []>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedGroupeId, setSelectedGroupeId] = useState<number | null>(null);
  const [selectedGroupe , setSelectedGroupe ] = useState<Groupe  | null>(null);
  const [payes, setPayes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [searchQuery, setSearchQuery] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isEmptyname = !name ;
  const isEmptyplan = !plan ;
  const isEmptynbrab = !nbrab ;
  const isValidnbrab = !isNaN(parseFloat(nbrab));
  const [planExists, setPlanExists] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);







  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/groupes');
        setGroupes(response.data);
      } catch (error) {
        console.error('Error fetching groupes:', error);
      }
    };
  
    fetchGroupes();
  }, []);

  useEffect(() => {
    if (selectedGroupeId !== null) {
      const groupe = groupes.find((groupe) => groupe.id === selectedGroupeId);
      if (groupe) {
        setSelectedGroupe(groupe);
        setName(groupe.name);
        setPlan(groupe.plan);
      
        setNbrab(groupe.nbrab.toString());
      


      }
    }
  }, [selectedGroupeId, groupes]);

  
  const handleClick = async (groupeId: number, action: string) => {
    try {
      if (action === 'edit') {
        const groupe = groupes.find((groupe) => groupe.id === groupeId);
        if (groupe && groupe.status === 'activated') {
          setSelectedGroupeId(groupeId);
          setSelectedGroupe(groupe);
          setShowEditForm(true);
        }
      } else if (action === 'toggle') {
        const updatedGroupeIndex = groupes.findIndex((groupe) =>groupe.id === groupeId);
        if (updatedGroupeIndex !== -1) {
          const updatedGroupe = groupes[updatedGroupeIndex];
          const newStatus = updatedGroupe.status === 'activated' ? 'deactivated' : 'activated';
          const response = await axios.patch(`http://localhost:5000/api/groupes/${groupeId}/status`, { status: newStatus });
          const updatedGroupes = [...groupes];
          updatedGroupes[updatedGroupeIndex] = response.data;
          setGroupes(updatedGroupes);
        }
      }
      else if (action === 'delete') {
        // Supprimer l'entrée de la base de données
        await axios.delete(`http://localhost:5000/api/groupes/${groupeId}`);
        
        // Mettre à jour l'état local pour supprimer l'élément de la liste des groupes
        setGroupes(prevGroupes => prevGroupes.filter(groupe => groupe.id !== groupeId));
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };
  
  
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const filteredGroupes = groupes.filter((groupe) =>
    groupe.name.toLowerCase().includes(searchQuery.toLowerCase())
);
  const handlePageChange = (page: number) => {
  setCurrentPage(page);
};

 


  
  
  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form fields to empty values when toggling the form
    setName('');
    setPlan('');
  
   
    setNbrab('');
  
    setFormSubmitted(false);
    // Reset form validation states as well if needed
    setFormValid(true);
   
   
  };
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    const lowercaseNamee = plan.toLowerCase();
    const planExistsInGroupes = groupes.some(groupe => groupe.plan.toLowerCase() === lowercaseNamee);
    setPlanExists(planExistsInGroupes);
  
    // Convert the entered name to lowercase
    const lowercaseName = name.toLowerCase();
    // Check if any existing name matches the lowercase version of the entered name
    const nameExistsInGroupes = groupes.some(groupe => groupe.name.toLowerCase() === lowercaseName);
    setNameExists(nameExistsInGroupes);
   
    if (name && plan  && nbrab  && !nameExistsInGroupes ) {
      
      console.log('succesfully created');
      setFormValid(true); 
    } 
    setFormSubmitted(true);
    if (nameExistsInGroupes) {
      return;
    }
    try {
      if (selectedGroupeId !== null) {
        // Update existing groupe
        const response = await axios.put(`http://localhost:5000/api/groupes/${selectedGroupeId}`, {
          name,
          plan,
       
         
          nbrab: parseInt(nbrab),
    
        });
        
        // Update local state with modified groupe
        const updatedGroupes = groupes.map(groupe => {
          if (groupe.id === selectedGroupeId) {
            return response.data;
          }
          return groupe;
        });
  
        setGroupes(updatedGroupes);
        setShowEditForm(false);
      } else {
        // Create new groupe
        const response = await axios.post('http://localhost:5000/api/groupes', {
          name,
          plan,
   
       
          nbrab: parseInt(nbrab),
         
        });
  
        // Update local state with newly created groupe
        setGroupes([...groupes, response.data]);
        setShowForm(false);
      }
      setShowSuccessNotification(true);
      setFormValid(true);
    } catch (error) {
      console.error('Error creating/modifying groupe:', error);
    }
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPlan(event.target.value); 
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
       Groupe ajouté avec succès
      </div>
    );
  };

  return (
    <Layout activePage="Groupes"> 
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
                <th className={TdStyle.ThStyle}> Nom  </th>
                <th className={TdStyle.ThStyle}> Plan </th>
            
               
                <th className={TdStyle.ThStyle}> Nombre des abonnés </th>
               
                <th className={TdStyle.ThStyle}> </th>
                <th className={TdStyle.ThStyle}> </th>
              </tr>
            </thead>
            <tbody>
              
           {filteredGroupes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
.map((groupe: Groupe) => (
              <tr className={groupe.status === 'activated' ? '' : 'deleted-row'} key={groupe.id}>

                <td className={TdStyle.TdStyle}>{groupe.name}</td>
                <td className={TdStyle.TdStyle}>{groupe.plan}</td>
               
            
                <td className={TdStyle.TdStyle}>{groupe.nbrab}</td>
             


              
              
                <td className={TdStyle.TdStyle}> 
                <div className="flex items-center justify-center">
                <button onClick={() => handleClick(groupe.id, 'edit')}>
  <Image src='/file-pen.svg' alt='edit' width={20} height={20} />
</button>
                
{showEditForm && selectedGroupe && (
       <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg" style={{ width: '28%', height: '100%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)' }}>
       {/* Form contents */}
       <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
         <div className="flex justify-end mt-2.5 mr-4 absolute top-0 right-0">
           <Image src='/close.svg' alt='close' width={15} height={15} onClick={() => setShowEditForm(false)} className="cursor-pointer" />
         </div>

         <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(27, 158, 246)' }}> Ajouter groupe:</h2>

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
         <div className="flex flex-wrap items-center mb-4 relative">
           <label htmlFor="plan" className="block text-gray-700 text-sm font-bold mb-2">
             Plan:
           </label>
           <input 
             type="text"
             id="plan"
             name="plan"
             value={plan}
             onChange={(e) => setPlan(e.target.value)}
             className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptyname ? 'border-red-500' : ''}`}
             placeholder="Entrer le plan"
           />
            {formSubmitted && isEmptyplan &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            {formSubmitted && planExists && <p className="text-red-500 text-xs italic">Ce plan existe déjà.</p>}

         </div>
       
         <div className="flex flex-wrap items-center mb-4 relative">
           <label htmlFor="nbrab" className="block text-gray-700 text-sm font-bold mb-2">
             Nombre des abonnés:
           </label>
           <input
             type="nbrab"
             id="nbrab"
             name="nbrab"
             value={nbrab}
             onChange={(e) => setNbrab(e.target.value)}
             className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptynbrab ? 'border-red-500' : ''}`}
             placeholder="Entrer le nombre des abonnés"
           />
                    {formSubmitted &&!isValidnbrab &&  <p className="text-red-500 text-xs italic">Veuillez entrer un nombre valide.</p>}

{formSubmitted && isEmptynbrab &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire </p>}
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
    <button onClick={() => handleClick(groupe.id, 'toggle')} className="toggle-button">
  <div className={`toggle-switch ${groupe.status === 'activated' ? 'active' : ''}`}></div>
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

          <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(27, 158, 246)' }}> Ajouter groupe :</h2>

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
          <div className="flex flex-wrap items-center mb-4 relative">
           <label htmlFor="plan" className="block text-gray-700 text-sm font-bold mb-2">
             Plan:
           </label>
           <input 
             type="text"
             id="plan"
             name="plan"
             value={plan}
             onChange={(e) => setPlan(e.target.value)}
             className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptyname ? 'border-red-500' : ''}`}
             placeholder="Entrer le plan"
           />
            {formSubmitted && isEmptyplan &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
            {formSubmitted && planExists && <p className="text-red-500 text-xs italic">Ce plan existe déjà.</p>}

         </div>
          
        
         

          
         
          <div className="mb-2">
            <label htmlFor="nbrab" className="block text-gray-700 text-sm font-bold mb-2">
            Nombre des abonnés:
            </label>
            <input
              type="nbrab"
              id="nbrab"
              name="nbrab"
              value={nbrab}
              onChange={(e) => setNbrab(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${formSubmitted && isEmptynbrab ? 'border-red-500' : ''}`}
              placeholder="Entrer le nombre des abonnés"
            />
                             {formSubmitted &&!isValidnbrab && nbrab.trim() !== '' && <p className="text-red-500 text-xs italic">Veuillez entrer un nombre valide.</p>}

{formSubmitted && isEmptynbrab &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire </p>}    

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
  <span className="mr-2">Ajouter groupe</span>
  <Image src='/add.svg' alt='addGroupe' width={20} height={20} color="white"></Image>
</button>
</div>
<div className="flex justify-center mt-50">
  <PaginationBar
    totalItems={filteredGroupes.length}
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
export default Groupes;
