"use client";
import React, { useState, ChangeEvent } from "react";
import Layout from "../clientLayout";
import Image from 'next/image';
import axios from "axios";

const Abonnements = () => {
    const [telephoneValue, setTelephoneValue] = useState('');
    const [nomValue, setNomValue] = useState('');
    const [prenomValue, setPrenomValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    

    const handleTelephoneChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            setNomValue('');
            setPrenomValue('');
            setEmailValue('');
        }
        setTelephoneValue(event.target.value);
    };

    const handleAjouterClick = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/subscribers/search/${telephoneValue}`);
            const subscriberData = response.data;

            setNomValue(subscriberData.username || '');
            setPrenomValue(subscriberData.FirstName || '');
            setEmailValue(subscriberData.email || ''); 
        } catch (error) {
            console.error('Error fetching subscriber details:', error);
        }
    };

    return (
        <Layout activePage="abonnements">
            <div className="mb-4">
                <p className="mb-2 font-semibold mt-16 ml-14">Numéro de téléphone :</p>
                <div className="flex items-center ml-4 mt-2">

                <input
                    type="text"
                    value={telephoneValue}
                    onChange={handleTelephoneChange}
                    placeholder="Entrez votre numéro de tel"
                    className="border border-gray-300 rounded px-4 py-2 ml-8 mr-8"
                />
                <button onClick={handleAjouterClick} className="flex items-center button-color font-bold text-white rounded-xl px-4 py-2 ">
                 <span className="mr-2">Ajouter</span>
                    <Image src='/Add User Male.svg' alt='addUser' width={20} height={20}></Image>
                </button>
                </div>
            </div>

            <div className=" ml-6 mr-96 p-4 border-blue-500 border-2 rounded-2xl">
                <div className="mt-4 mb-4">
                    <p>Nom : <input type="text" value={nomValue} onChange={(e) => setNomValue(e.target.value)} className="ml-6 mb-4 border border-gray-300 rounded-md px-2 py-1"/></p>
                    <p>Prénom : <input type="text" value={prenomValue} onChange={(e) => setPrenomValue(e.target.value)} className="ml-1 mb-4 border border-gray-300 rounded-md px-2 py-1"/></p>
                    <p>Email : <input type="text" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} className="ml-5 mb-4 border border-gray-300 rounded-md px-2 py-1"/></p>
                </div>
            </div>
                
            
        </Layout>
    );
};

export default Abonnements;
