"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import React, {ChangeEvent, useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {INVOICES_API} from "@/utils/apiUtil";
import {FaCheckCircle, FaSearch} from "react-icons/fa";
import PaginationBar from "../../../../../components/PaginationBar";

interface Invoice {
    id: number;

    subscriberName: string;
    amount: number;
    createdAt: string;
    dueDate: string;
    clientName: string;
    status: string;
    paymentMethod?: string;
    paymentDate?: string;
}

const TdStyle = {
    ThStyle:
        "border-l border-transparent  text-white font-medium  bg-slate-500",
    TdStyle:
        "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-white dark:border-dark dark:text-dark-7 py-1  text-center text-sm font-medium",
    TdButton:
        "inline-block bg-blue-300  border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};

const Paiement = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [invoicesToDisplay, setInvoicesToDisplay] = useState<Invoice[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [showPopupPayment, setShowPopupPayment] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

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
    const openPopupPayment = (invoiceId: number) => {
        setSelectedInvoiceId(invoiceId);
        setShowPopupPayment(true);
    };

    const closePopupPayment = () => {
        setShowPopupPayment(false);
        setSelectedInvoiceId(null);
    };
    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handlePaymentSubmit = async () => {
        if (selectedInvoiceId) {
            try {
                const cookie = Cookies.get("session") || "{}";
                const session: { access_token: string } = JSON.parse(cookie);
                const headers = {
                    Authorization: `Bearer ${session.access_token}`,
                };
                await axios.patch(`${INVOICES_API}/${selectedInvoiceId}/payment`, {
                    status: 'paid',
                    paymentMethod : selectedPaymentMethod,
                    paymentDate: new Date().toISOString().split('T')[0] ,
                }, { headers });

                // Update invoice status in the state
                setInvoices(invoices.map(invoice =>
                    invoice.id === selectedInvoiceId ? { ...invoice, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] } : invoice
                ));
            } catch (error) {
                console.error('Error updating invoice status:', error);
            }
        }
        closePopupPayment();
    };

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
                    <div className='w-full max-w-[100%] rounded-xl overflow-hidden shadow-lg'>
                        <table className='w-full table-auto border-collapse'>
                            <thead className='text-center'>
                            <tr>
                                <th className={TdStyle.ThStyle}>Établissement</th>
                                <th className={TdStyle.ThStyle}>{"Prix d'abonnement"}</th>
                                <th className={TdStyle.ThStyle}>Date de création de facture</th>
                                <th className={TdStyle.ThStyle}>{"Date d'échéance de la facture"}</th>
                                <th className={TdStyle.ThStyle}>Status de paiement</th>
                                <th className={TdStyle.ThStyle}>Date de paiement</th>
                                <th className={TdStyle.ThStyle}></th>

                            </tr>
                            </thead>
                            <tbody>
                            {invoices.map((invoice, index) => (
                                <tr key={index}>
                                    <td className={TdStyle.TdStyle}>{invoice.clientName}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.amount}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.createdAt}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.dueDate}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.status === 'paid' ? 'Payé' : 'En attente'}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.paymentDate || '-'}</td>
                                    <td >
                                        {invoice.status === 'pending' && (
                                            <button onClick={() => openPopupPayment(invoice.id)} className="bg-sky-900 text-white px-3 py-1 rounded-md mr-2">Payer</button>
                                        )}
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
            {showPopupPayment && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-lg font-bold mb-4 text-center">Sélectionner la méthode de paiement</h2>
                        <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange} className="block w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-400">
                            <option value="card">Payer avec carte bancaire</option>
                        </select>
                        <div className="flex justify-center">
                            <button onClick={handlePaymentSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">Valider</button>
                            <button onClick={closePopupPayment} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-400">Annuler</button>
                        </div>
                    </div>
                </div>
            )}
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
