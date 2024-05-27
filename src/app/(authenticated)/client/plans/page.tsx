"use client"

import Breadcrumbs from "@/components/breadcrumbs";
import React, {ChangeEvent, useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {PLANS_API} from "@/utils/apiUtil";

import Image from "next/image";
import PaginationBar from "../../../../../components/PaginationBar";

const TdStyle = {
    ThStyle:
        "border-l border-transparent py-2 px-3 text-white font-medium lg:py-4 lg:px-4 bg-slate-500",
    TdStyle:
        "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-white dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium",
    TdButton:
        "inline-block bg-blue-300 px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};
interface InputProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    isValid: boolean;
}

interface Plan {
    id: number;
    name: string;
    type: string;
    amount: number;
    status: string;
    duration: string;
    nbrseance: number;
    enligne: string;
    startDate : string;
    endDate : string

}


const Plans = () => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [nbrseance, setNbrseance] = useState('');
    const [enligne, setEnligne]= useState('');
    const [formValid, setFormValid] = useState(true);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [payes, setPayes] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [searchQuery, setSearchQuery] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const isEmptyname = !name ;
    const isEmptytype = !type ;
    const isEmptyamount = !amount ;
    const isEmptyduration = !duration ;
    const isEmptynbrseance = !nbrseance ;
    const isEmptyradio = !enligne ;
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const isValidamount = !isNaN(parseFloat(amount));
    const isValidnbrseance = !isNaN(parseFloat(nbrseance));
    const [showPopup, setShowPopup] = useState(false); // State variable to track whether to show the pop-up form
    const [selectedRowData, setSelectedRowData] = useState<Plan | null>(null);

    const [isPersonalized, setIsPersonalized] = useState(false);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [isValidDate, setIsValidDate] = useState(false);
    const isEmptyhours = !hours;
    const isEmptyminutes = !minutes;

    const isEmptyStartDate = !startDate;
    const isEmptyEndDate = !endDate;
    const [plansToDisplay, setPlansToDisplay] = useState<Plan[]>([]);
    const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);











    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const cookie = Cookies.get("session") || "{}";
                const session: Session = await JSON.parse(cookie);
                const headers = {
                    Authorization: `Bearer ${session.access_token}`,
                };
                const response = await axios.get(PLANS_API, { headers });
                setPlans(response.data);
            } catch (error) {
                console.error("Error fetching plans:", error);
            }
        };

        // Fetch  from the API when the component mounts
        fetchPlans();
    }, []);

    useEffect(() => {
        if (selectedPlanId !== null) {
            const plan = plans.find((plan) => plan.id === selectedPlanId);
            if (plan) {
                setSelectedPlan(plan);
                setName(plan.name);
                setType(plan.type);
                setAmount(plan.amount.toString());

                setNbrseance(plan.nbrseance.toString());
                setEnligne(plan.enligne.toString());
                const [hrs, mins] = plan.duration.split(':');
                setHours(hrs);
                setMinutes(mins);


            }
        }
    }, [selectedPlanId, plans]);




    const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };
    useEffect(() => {
        const filtered = plans.filter((plan) => {
            return (
                ( plan.name?.toLowerCase().includes(searchQuery.toLowerCase()))

            );
        });

        setFilteredPlans(filtered);
        setCurrentPage(1);
    }, [searchQuery, plans]);
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const plansToDisplay = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);
        setPlansToDisplay(plansToDisplay);
    }, [currentPage, filteredPlans]);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHours(event.target.value);
    };

    const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMinutes(event.target.value);
    };
    const handlePersonnaliseClick = (rowData: Plan) => {
        setSelectedRowData(rowData);
        setShowPopup(true);
    };





    const toggleForm = () => {
        setShowForm(!showForm);
        // Reset form fields to empty values when toggling the form
        setName('');
        setType('');
        setAmount('');
        setDuration('');
        setNbrseance('');
        setEnligne('');
        setHours('');
        setMinutes('');

        setFormSubmitted(false);
        // Reset form validation states as well if needed
        setFormValid(true);
        setIsPersonalized(false);
        setStartDate('');
        setEndDate('');




    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Concatenate hours, minutes, and seconds into a single string representing the duration
        const durationString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;



        // Now, you can set the duration state with the concatenated string
        setDuration(durationString);
        if (startDate && endDate) {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            if (startDateObj >= endDateObj) {
                setFormValid(false); // Set form to invalid state
                setIsValidDate(false); // Set a dedicated state for date validation error
                return; // Exit the function if dates are invalid
            } else {
                setFormValid(true); // Reset form valid state if dates are valid
                setIsValidDate(true);
            }
        }

        if (name && type && amount && duration && nbrseance ) {

            console.log('succesfully created');
            setFormValid(true);
        }
        setFormSubmitted(true);
        try {
            if (selectedPlanId !== null) {
                const cookie = Cookies.get("session") || "{}";
                const session: Session = await JSON.parse(cookie);
                const headers = {
                    Authorization: `Bearer ${session.access_token}`,
                };
                const response = await axios.patch(
                    `${PLANS_API}/${selectedPlanId}`,
                    {
                        name,
                        type,
                        amount: parseFloat(amount), // Parse amount to float
                        duration: durationString,
                        nbrseance: parseInt(nbrseance),
                        enligne,
                        startDate: startDate || null, // If startDate is empty, send null instead
                        endDate: endDate || null,
                    },
                    { headers }
                );


                // Update local state with modified plan
                const updatedPlans = plans.map(plan => {
                    if (plan.id === selectedPlanId) {
                        return response.data;
                    }
                    return plan;
                });

                setPlans(updatedPlans);
                setShowEditForm(false);
            } else {

                const cookie = Cookies.get("session") || "{}";
                const session: Session = await JSON.parse(cookie);
                const headers = {
                    Authorization: `Bearer ${session.access_token}`,
                };

                const response = await axios.post(
                    PLANS_API,
                    {
                        name,
                        type,
                        startDate: startDate || null, // If startDate is empty, send null instead
                        endDate: endDate || null,
                        amount: parseFloat(amount), // Parse amount to float
                        duration: durationString,
                        nbrseance: parseInt(nbrseance),
                        enligne
                    },
                    { headers }
                );


                // Update local state with newly created plan
                setPlans([...plans, response.data]);
                setShowForm(false);
            }

            setFormValid(true);
        } catch (error) {
            console.error('Error creating/modifying plan:', error);
        }
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value);
        setIsPersonalized(event.target.value === 'personnalisé');
    };

    return (
        <>
            {showPopup && selectedRowData && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-lg font-bold mb-4 text-center">détails du plan personnalisé</h2>

                        <p>Date de début: {selectedRowData.startDate}</p>
                        <p>Date de fin: {selectedRowData.endDate}</p>
                        <div className="flex justify-center mt-4">
                            <button
                                className="button-color text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                                onClick={() => setShowPopup(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center pt-8 mx-2 w-full">
                <div className="relative flex items-center ">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="rechercher par nom "
                        className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pb-4">
                        <Image src="/searchbar.svg" alt="search" width={15} height={40} />
                    </div>
                </div>
            </div>
            <div className="table-wrapper ">
                <div className='flex justify-center mx-2 w-full'>
                    <div className='w-full max-w-[90%] rounded-xl overflow-hidden shadow-lg'>
                        <table className='w-full table-auto border-collapse'>
                            <thead className='text-center'>
                            <tr >
                                <th className={TdStyle.ThStyle}> Nom  </th>
                                <th className={TdStyle.ThStyle}> Type </th>
                                <th className={TdStyle.ThStyle}> Prix </th>
                                <th className={TdStyle.ThStyle}> Durée de la séance </th>
                                <th className={TdStyle.ThStyle}> Nombre des séances </th>
                                <th className={TdStyle.ThStyle}> Paiement en ligne </th>

                            </tr>
                            </thead>
                            <tbody>

                            {filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((plan: Plan) => (
                                    <tr className={plan.status === 'activated' ? '' : 'deleted-row'} key={plan.id}>

                                        <td className={TdStyle.TdStyle}>{plan.name}</td>
                                        <td className={TdStyle.TdStyle}>{plan.type === 'personnalisé' ? <button onClick={() => handlePersonnaliseClick(plan)}>personnalisé</button> : plan.type}</td>

                                        <td className={TdStyle.TdStyle}>{plan.amount}</td>
                                        <td className={TdStyle.TdStyle}>{plan.duration}</td>
                                        <td className={TdStyle.TdStyle}>{plan.nbrseance}</td>
                                        <td className={TdStyle.TdStyle}>{plan.enligne === 'oui' ? 'Oui' : 'Non'}</td>


                                    </tr>
                                ))}


                            </tbody>

                        </table>
                    </div>
                </div>

                {showForm && (
                    <div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg overflow-y-auto"
                        style={{
                            width: "30%",
                            maxHeight: "95%",
                            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
                        }}
                    >

                        <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
                            <div className="flex justify-end mt-2.5 mr-4 absolute top-0 right-0">
                                <Image src='/close.svg' alt='close' width={15} height={15} onClick={() => setShowForm(false)} className="cursor-pointer" />
                            </div>

                            <h2
                                className="text-lg text-cyan-900 font-bold mb-4 text-center"
                               
                            >{"Ajouter un plan d'abonnement"}</h2>

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
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${formSubmitted && isEmptyname ? 'border-red-500' : ''}`}
                                    placeholder="Entrer le nom"
                                />
                                {formSubmitted && isEmptyname &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}

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
                                        className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${formSubmitted && isEmptytype ? 'border-red-500' : ''}`}
                                    >
                                        <option value=""></option>
                                        <option value="Par session">Par session</option>
                                        <option value="mensuel">Mensuel</option>
                                        <option value="annuel">Annuel</option>
                                        <option value="personnalisé">Personnalisé</option>


                                    </select>

                                </div>
                                {formSubmitted && isEmptytype &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
                            </div>


                            {isPersonalized && (
                                <>
                                    <div className="mb-2">
                                        <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                                            Date de début :
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                                        />

                                        {formSubmitted && isEmptyStartDate &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                                            Date de fin :
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            name="endDate"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline `}
                                        />
                                        {formSubmitted && !isValidDate &&
                                            <p className="text-red-500 text-xs italic">cette date est invalide</p>}
                                        {formSubmitted && isEmptyEndDate && isEmptyStartDate&&<p className="text-red-500 text-xs italic">Ce champ est obligatoire.</p>}
                                    </div>
                                </>
                            )}


                            <div className="mb-2">
                                <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
                                    Prix :
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => setAmount((e.target.value))}

                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${formSubmitted && isEmptyamount ? 'border-red-500' : ''}`}
                                    placeholder="Enter le prix"
                                />

                                {formSubmitted &&!isValidamount && amount.trim() !== '' && <p className="text-red-500 text-xs italic">Veuillez entrer un prix valide.</p>}

                                {formSubmitted && isEmptyamount &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire </p>}

                            </div>
                            <div className="mb-2">
                                <label htmlFor="duree" className="block text-gray-700 text-sm font-bold mb-2">
                                    Durée (hh:mm):
                                </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        id="hours"
                                        name="hours"
                                        min="0"
                                        value={hours}
                                        onChange={handleHoursChange}
                                        className={`shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${formSubmitted && isEmptyhours ? 'border-red-500' : ''}`}
                                        placeholder="Heures"
                                    />
                                    <span className="mx-2">:</span>
                                    <input
                                        type="number"
                                        id="minutes"
                                        name="minutes"
                                        min="0"
                                        max="59"
                                        value={minutes}
                                        onChange={handleMinutesChange}
                                        className={`shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${formSubmitted && isEmptyminutes ? 'border-red-500' : ''}`}
                                        placeholder="Minutes"
                                    />
                                </div>
                            </div>

                            {formSubmitted && isEmptyhours && isEmptyminutes &&   <p className="text-red-500 text-xs italic">ce champ est obligatoire </p>}


                            <div className="mb-2">
                                <label htmlFor="nbrseance" className="block text-gray-700 text-sm font-bold mb-2">
                                    Nombre des séances par mois:
                                </label>
                                <input
                                    type="nbrseance"
                                    id="nbrseance"
                                    name="nbrseance"
                                    value={nbrseance}
                                    onChange={(e) => setNbrseance(e.target.value)}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline  ${formSubmitted && isEmptynbrseance ? 'border-red-500' : ''}`}
                                    placeholder="Entrer le nombre des séances"
                                />


                            </div>
                            {formSubmitted &&!isValidnbrseance && nbrseance.trim() !== '' && <p className="text-red-500 text-xs italic">Veuillez entrer nombre valide.</p>}

                            {formSubmitted && isEmptynbrseance &&  <p className="text-red-500 text-xs italic">ce champ est obligatoire </p>}

                            <div className="flex items-center mb-4">
                                <span className="block text-gray-700 text-sm font-bold mr-2">Paiement en ligne :</span>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="enLigne"
                                        value="oui"
                                        checked={enligne === 'oui'}
                                        onChange={(e) => setEnligne(e.target.value)}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Oui</span>
                                </label>
                                <label className="inline-flex items-center ml-4">
                                    <input
                                        type="radio"
                                        name="enLigne"
                                        value="non"
                                        checked={enligne === 'non'}
                                        onChange={(e) => setEnligne(e.target.value)}
                                        className="form-radio h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Non</span>
                                </label>
                            </div>
                            {formSubmitted && isEmptyradio && (
                                (enligne.trim() === '') &&
                                <p className="text-red-500 text-xs italic">Ce champ est obligatoire.</p>
                            )}

                            <div className="flex justify-end">
                                <button
                                    className="bg-sky-900	 text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Ajouter
                                </button>
                            </div>

                        </form>
                    </div>
                )}
                <div className="fixed bottom-6 right-8 mb-0.5 mr-4 mt-40 flex flex-column items-center">
                    <button onClick={toggleForm} className="flex items-center bg-sky-900 font-bold text-white rounded-xl px-4 py-2 mb-2">
                        <span className="mr-2">Ajouter</span>
                        <Image src='/Add User Male.svg' alt='addUser' width={20} height={20}></Image>
                    </button>
                </div>
                <div className="flex justify-center mt-50">
                    <PaginationBar
                        totalItems={filteredPlans.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </>
    );
}

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[{ label: "Subscription Plans", href: "/client/plans" }]}
      />
        <Plans/>
    </main>
  );
}
