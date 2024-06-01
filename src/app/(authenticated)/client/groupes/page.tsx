"use client";
import Breadcrumbs from "@/components/breadcrumbs";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image'
import axios from "axios";
import { GROUPS_API, PLANS_API } from "@/utils/apiUtil";
import Cookies from "js-cookie";
import MyCalendar from "../../../../../components/calendar";
import PaginationBar from "../../../../../components/PaginationBar";


const TdStyle = {
    ThStyle:
        "border-l border-transparent py-2 px-3 text-white font-medium lg:py-4 lg:px-4 bg-slate-500",
    TdStyle:
        "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-white dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium",
    TdButton:
        "inline-block bg-blue-300 px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};

interface Group {
    id: number;
    name: string;
    plan: string;
    status: string;
    planId: number;
    nbrabonne: number;
    slots : string[];
}

const Groups = () => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [formValid, setFormValid] = useState(true);
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [searchQuery, setSearchQuery] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);
    const isEmptyname = !name;
    const [nameExists, setNameExists] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [groupsToDisplay, setGroupsToDisplay] = useState<Group[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
    const [plans, setPlans] = useState<{ id: number; name: string }[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const [successNotificationActionType, setSuccessNotificationActionType] = useState<string>('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [storedSlots, setStoredSlots] = useState<any[]>([]); // State to store selected slots
    const [showSlotsPopup, setShowSlotsPopup] = useState(false);
const [selectedGroupSlots, setSelectedGroupSlots] = useState<string[]>([]);


const handlePlanSelect = async (planId: number, groupId: number) => {
    setSelectedPlanId(planId);
    setSelectedGroupId(groupId);
    setShowCalendar((prevState) => !prevState); // Toggle showCalendar
};
    const handleSlotsDisplay = (slots: string[]) => {
        setSelectedGroupSlots(slots);
        setShowSlotsPopup(true);
    };
    
    
    const handleSlotsSelect = (slots: string[]) => {
        setStoredSlots(slots);
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const cookie = Cookies.get("session") || "{}";
                const session: Session = await JSON.parse(cookie);
                const headers = {
                    Authorization: `Bearer ${session.access_token}`,
                };

                const plansResponse = await axios.get(PLANS_API, { headers });
                setPlans(plansResponse.data);
            } catch (error) {
                console.error('Error fetching plans', error);
            }
        };

        fetchPlans();
    }, []);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const cookie = Cookies.get("session") || "{}";
                const session: Session = await JSON.parse(cookie);
                const headers = {
                    Authorization: `Bearer ${session.access_token}`,
                };
                const response = await axios.get(GROUPS_API, { headers });
                setGroups(response.data);
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        const filtered = groups.filter((group) => {
            return (
                (group.name?.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });

        setFilteredGroups(filtered);
        setCurrentPage(1);
    }, [searchQuery, groups]);

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const groupsToDisplay = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
        setGroupsToDisplay(groupsToDisplay);
    }, [currentPage, filteredGroups]);

    const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        setName('');
        setSelectedPlan('');
        setFormSubmitted(false);
        setFormValid(true);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const lowercaseName = name.toLowerCase();
        const nameExistsInGroups = groups.some(group => group.name.toLowerCase() === lowercaseName);
        setNameExists(nameExistsInGroups);
    
        if (name && !nameExistsInGroups && selectedPlan) {
            setFormValid(true);
        }
        setFormSubmitted(true);
        if (nameExistsInGroups) {
            return;
        }
        try {
            const cookie = Cookies.get("session") || "{}";
            const session: Session = await JSON.parse(cookie);
            const headers = {
                Authorization: `Bearer ${session.access_token}`,
            };
    
            const response = await axios.post(
                GROUPS_API,
                {
                    name,
                    planId: selectedPlan,
                    slots: storedSlots
                },
                { headers }
            );
    
            setGroups([...groups, response.data]);
            setShowForm(false);
            setShowSuccessNotification(true);
            setFormValid(true);
            setSuccessNotificationActionType("ajouté");
        } catch (error) {
            console.error('Error creating group:', error);
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
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white  py-4 px-8 rounded-xl shadow-lg text-xl">
                {actionType === "ajouté" ? "Groupe ajouté avec succès" : "Groupe modifié avec succès"}
            </div>
        );
    };

    return (
        <>
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
                        <Image src="/searchbar.svg" alt="search" width={15} height={40}/>
                    </div>
                </div>
            </div>
            <div className="table-wrapper ">
                <div className='flex justify-center mx-2 w-full'>
                    <div className='w-full max-w-[100%] rounded-xl overflow-hidden shadow-lg'>
                        <table className='w-full table-auto border-collapse'>
                            <thead className='text-center'>
                            <tr>
                                <th className={TdStyle.ThStyle}> Nom</th>
                                <th className={TdStyle.ThStyle}> Plan</th>
                                <th className={TdStyle.ThStyle}> abonnés</th>
                                <th className={TdStyle.ThStyle}> </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredGroups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((group: Group) => (
                                    <tr className={group.status === 'activated' ? '' : 'deleted-row'} key={group.id}>
                                        <td className={TdStyle.TdStyle}>{group.name}</td>
                                        <td className={TdStyle.TdStyle}>{plans.find(plan => plan.id === group.planId)?.name}</td>
                                        <td className={TdStyle.TdStyle}>{group.nbrabonne}</td>
                                        <td className={TdStyle.TdStyle} >
    <button onClick={() => handleSlotsDisplay(group.slots)} className="bg-sky-900 text-white px-3 py-1 rounded-md">Horaires des séances</button>
</td>                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {showForm && (
                    <div
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg"
                        style={{width: '30%', height: '95%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)'}}>
                        <form className="flex flex-col justify-between h-full" onSubmit={handleSubmit}>
                            <div className="flex justify-end mt-2.5 mr-4 absolute top-0 right-0">
                                <Image src='/close.svg' alt='close' width={15} height={15}
                                       onClick={() => setShowForm(false)} className="cursor-pointer"/>
                            </div>

                            <h2
                                className="text-lg text-cyan-900 font-bold mb-4 text-center"
                            >Ajouter un groupe</h2>

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
                                {formSubmitted && isEmptyname &&
                                    <p className="text-red-500 text-xs italic">ce champ est obligatoire.</p>}
                                {formSubmitted && nameExists &&
                                    <p className="text-red-500 text-xs italic">Ce nom existe déjà.</p>}
                            </div>
                            <div className="flex flex-wrap items-center mb-4 relative">
                                <label htmlFor="plan" className="block text-gray-700 text-sm font-bold mb-2">
                                    Plan:
                                </label>
                                <select
    id="plan"
    name="plan"
    value={selectedPlan}
    onChange={(e) => {
        setSelectedPlan(e.target.value);
        handlePlanSelect(Number(e.target.value), selectedGroupId ?? 0); // Provide a default value of 0 when selectedGroupId is null
    }}
    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
>
    <option value="">Sélectionner un plan</option>
    {plans.map((plan) => (
        <option key={plan.id} value={plan.id}>{plan.name}</option>
    ))}
</select>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className="bg-sky-900 text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                {showCalendar && selectedPlanId && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6  rounded-xl shadow-lg w-[720px]"
                             style={{overflow: 'auto', maxHeight: '500px'}}>
<MyCalendar
    onSlotsSelect={handleSlotsSelect}
    myEventsList={storedSlots}
/>                          <div className="flex justify-center mt-4">
                                <button
                                    className="bg-sky-900 text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                                    onClick={() => setShowCalendar(false)}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showSuccessNotification && <SuccessNotification actionType={successNotificationActionType}/>}
                <div className="fixed bottom-6 right-8 mb-0.5 mr-4 mt-40 flex flex-column items-center">
                    <button onClick={toggleForm}
                            className="flex items-center bg-sky-900 font-bold text-white rounded-xl px-4 py-2 mb-2">
                        <span className="mr-2">Ajouter groupe</span>
                        <Image src='/add.svg' alt='addGroup' width={20} height={20} color="white"></Image>
                    </button>
                </div>
                <div className="flex justify-center mt-50">
                    <PaginationBar
                        totalItems={filteredGroups.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
            {showSlotsPopup && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2>Horaires des séances</h2>
                        <ul>
                            {selectedGroupSlots.map((slot, index) => (
                                <li key={index}>{slot}</li>
                            ))}
                        </ul>
                        <div />         
                       <div className="flex justify-center mt-4">
                        <button onClick={() => setShowSlotsPopup(false)} className="bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 ">Fermer</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[{ label: "Groupes", href: "/client/groupes" }]}
            />
            <Groups />
        </main>
    );
}