"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import React, {ChangeEvent, useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {INVOICES_API} from "@/utils/apiUtil";
import {FaCheckCircle, FaSearch} from "react-icons/fa";
import PaginationBar from "../../../../../components/PaginationBar";

interface Invoice {
    subscriberName: string;
    amount: number;
    createdAt: string;
    dueDate: string;
    clientName: string;
}

const TdStyle = {
    ThStyle:
        "border-l border-transparent py-2 px-3 text-white font-medium lg:py-4 lg:px-4 bg-cyan-700",
    TdStyle:
        "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-white dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium",
    TdButton:
        "inline-block bg-green-500 px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};

const Paiement = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoicesToDisplay, setInvoicesToDisplay] = useState<Invoice[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        const filtered = invoices.filter((invoice) => {
            return invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase());
        });

        setFilteredInvoices(filtered);
        setCurrentPage(1);
    }, [searchQuery, invoices]);

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const invoicesToDisplay = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
        setInvoicesToDisplay(invoicesToDisplay);
    }, [currentPage, filteredInvoices]);

    const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const cookie = Cookies.get("session") || "{}";
                const session: Session = await JSON.parse(cookie);
                const headers = {
                    Authorization: `Bearer ${session.access_token}`,
                };
                const response = await axios.get(INVOICES_API, {headers});
                setInvoices(response.data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };

        // Fetch from the API when the component mounts
        fetchInvoices();
    }, []);

    return (
        <>
            <div className="flex justify-center pt-8 mx-2 w-full">
                <div className="relative flex items-center ">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        placeholder="Rechercher par nom d'établissement"
                        className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96 shadow-sm"
                    />
                    <FaSearch className="absolute right-4 text-gray-400"/>
                </div>
            </div>
            <div className="table-wrapper ">
                <div className='flex justify-center mx-2 w-full'>
                    <div className='w-full max-w-[90%] rounded-xl overflow-hidden shadow-lg'>
                        <table className='w-full table-auto border-collapse'>
                            <thead className='text-center'>
                            <tr>
                                <th className={TdStyle.ThStyle}>Établissement</th>
                                <th className={TdStyle.ThStyle}>{"Prix d'abonnement"}</th>
                                <th className={TdStyle.ThStyle}>Date de création de facture</th>
                                <th className={TdStyle.ThStyle}>{"Date d'échéance de la facture"}</th>
                                <th className={TdStyle.ThStyle}>Status de paiement</th>
                                <th className={TdStyle.ThStyle}>Méthode de paiement</th>
                                <th className={TdStyle.ThStyle}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoicesToDisplay.map((invoice: Invoice) => (
                                <tr key={invoice.clientName} className="bg-white hover:bg-gray-50">
                                    <td className={TdStyle.TdStyle}>{invoice.clientName}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.amount}</td>
                                    <td className={TdStyle.TdStyle}>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                    <td className={TdStyle.TdStyle}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className={TdStyle.TdStyle}><FaCheckCircle className="text-green-500"/></td>
                                    <td className={TdStyle.TdStyle}>Carte de crédit</td>
                                    <td className={TdStyle.TdStyle}>
                                        <button className={TdStyle.TdButton}>Payer</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <PaginationBar
                        totalItems={filteredInvoices.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                    />
                </div>
            </div>
        </>
    );
};

export default function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[{label: "Paiements", href: "/subs/payments"}]}
            />
            <Paiement/>

        </main>
    );
}
