"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Layout from "../clientLayout";
import Image from 'next/image';
import axios from "axios";

const Abonnements = () => {
    const [nomValue, setNomValue] = useState('');
    const [prenomValue, setPrenomValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [subscriberData, setSubscriberData] = useState(null); 
    const [showFields, setShowFields] = useState(false); // Flag to control field visibility
    const [selectedRadio, setSelectedRadio] = useState(''); // State to manage selected radio button
    const [error, setError] = useState(''); // State to manage error message

    const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        if (!value) {
            // If search query is empty, reset subscriber data and fields
            setSubscriberData(null);
            setNomValue('');
            setPrenomValue('');
            setEmailValue('');
            setError(''); // Reset error message
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/subscribers/search/${searchQuery}`);
            const data = response.data;

            if (data) {
                setSubscriberData(data);
                setNomValue(data.username || '');
                setPrenomValue(data.FirstName || '');
                setEmailValue(data.email || ''); 
                setShowFields(true); // Set flag to true to show fields
                setError(''); // Reset error message
            } else {
                setSubscriberData(null);
                setNomValue('');
                setPrenomValue('');
                setEmailValue('');
                setShowFields(false); // Set flag to false to hide fields
                setError('abonné nexiste pas'); // Set error message
            }
        } catch (error) {
            console.error('Error fetching subscriber details:', error);
        }
    };

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedRadio(event.target.value);
    };

    return (
        <Layout activePage="abonnements">
            <div className="flex justify-center pt-14 mx-2 w-full">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        onKeyDown={handleKeyPress}
                        className={`border rounded-md px-4 py-2 mb-4 w-96 ${error ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pb-4">
                        <Image src='/searchbar.svg' alt='search' width={15} height={40} />
                    </div>
                </div>
            </div>

            {error && <div className="text-red-500 ml-6 mb-4">{error}</div>}

            {showFields && subscriberData && (
                <div>
                    <div className="ml-6 mr-96 p-4 border-blue-500 border-2 rounded-2xl">
                        <div className="mt-4 mb-4">
                            <p>Nom : <input type="text" value={nomValue} onChange={(e) => setNomValue(e.target.value)} className="ml-6 mb-4 border border-gray-300 rounded-md px-2 py-1"/></p>
                            <p>Prénom : <input type="text" value={prenomValue} onChange={(e) => setPrenomValue(e.target.value)} className="ml-1 mb-4 border border-gray-300 rounded-md px-2 py-1"/></p>
                            <p>Email : <input type="text" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} className="ml-5 mb-4 border border-gray-300 rounded-md px-2 py-1"/></p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-8 m-8">
                        <div className="flex flex-col">
                            <label>
                                <input type="radio" name="group" value="group" checked={selectedRadio === 'group'} onChange={handleRadioChange} />
                                Choisir un groupe
                            </label>
                            {selectedRadio === 'group' && (
                                <select className="w-32" >
                                    <option value="groupe">Groupe 1</option>
                                    
                                </select>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <label>
                                <input type="radio" name="plan" value="plan" checked={selectedRadio === 'plan'} onChange={handleRadioChange} />
                                Choisir un plan
                            </label>
                            {selectedRadio === 'plan' && (
                                <select className="w-32">
                                    <option value="plan">Plan 1</option>
                                    {/* Add more options as needed */}
                                </select>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Abonnements;
