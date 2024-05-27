"use client";
import Breadcrumbs from "@/components/breadcrumbs";
import Cookies from "js-cookie";
import axios from "axios";
import { INVOICES_API, NOTIFICATION_API } from "@/utils/apiUtil";
import React, { useEffect, useState } from "react";

interface Invoice {
    id: number;
    subscriberName: string;
    subscriberId: number;
    amount: number;
    createdAt: string;
    dueDate: string;
    status: string;
    paymentMethod?: string;
    paymentDate?: string;
}

interface Notification {
    id: number;
    message: string;
    createdAt: string;
}

const TdStyle = {
    ThStyle:
        "border-l border-transparent py-2 px-3 text-white font-medium bg-slate-500",
    TdStyle:
        "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-white dark:border-dark dark:text-dark-7  text-center text-sm font-medium",
    TdButton:
        "inline-block bg-blue-300  border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};

const NotificationPopup: React.FC<{ notifications: Notification[], onClose: () => void }> = ({ notifications, onClose }) => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Notification History</h2>
            <ul className="divide-y divide-gray-300">
                {notifications.map(notification => (
                    <li key={notification.id} className="py-2">
                        <p className="text-gray-700">{notification.message}</p>
                        <p className="text-gray-500 text-sm">{notification.createdAt}</p>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center mt-4">
                <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">Close</button>
            </div>
        </div>
    </div>
);

const Paiements = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [showPopupNotifications, setShowPopupNotifications] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPopupPayment, setShowPopupPayment] = useState(false);
    const [selectedSubscriberId, setSelectedSubscriberId] = useState<number | null>(null);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const cookie = Cookies.get("session") || "{}";
                const session: { access_token: string } = JSON.parse(cookie);
                const headers = {
                    Authorization: `Bearer ${session.access_token}`,
                };
                const response = await axios.get(INVOICES_API, { headers });
                setInvoices(response.data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };
        fetchInvoices();
    }, []);

    const fetchNotifications = async (subscriberId: number) => {
        try {
            const cookie = Cookies.get('session') || '{}';
            const session: { access_token: string } = JSON.parse(cookie);
            const headers = { Authorization: `Bearer ${session.access_token}` };
            const response = await axios.get(`${NOTIFICATION_API}/${subscriberId}`, { headers });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const openPopupNotification = async (subscriberId: number) => {
        setSelectedSubscriberId(subscriberId);
        await fetchNotifications(subscriberId);
        setShowPopupNotifications(true);
    };

    const openPopupPayment = (invoiceId: number) => {
        setSelectedInvoiceId(invoiceId);
        setShowPopupPayment(true);
    };

    const closePopupPayment = () => {
        setShowPopupPayment(false);
        setSelectedInvoiceId(null);
    };

    const closePopupNotifications = () => {
        setShowPopupNotifications(false);
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
                    invoice.id === selectedInvoiceId ? { ...invoice, status: 'paid', paymentMethod: selectedPaymentMethod, paymentDate: new Date().toISOString().split('T')[0] } : invoice
                ));
            } catch (error) {
                console.error('Error updating invoice status:', error);
            }
        }
        closePopupPayment();
    };

    return (
        <>
            <div className="table-wrapper mt-20">
                <div className='flex justify-center mx-2 w-full'>
                    <div className='w-full w-fit rounded-xl overflow-hidden shadow-lg'>
                        <table className='w-full table-auto border-collapse'>
                            <thead className='text-center'>
                            <tr>
                                <th className={TdStyle.ThStyle}>{"Nom d'abonné"}</th>
                                <th className={TdStyle.ThStyle}>Prix</th>
                                <th className={TdStyle.ThStyle}>Date de création de facture</th>
                                <th className={TdStyle.ThStyle}>{"Date d'échéance de la facture"}</th>
                                <th className={TdStyle.ThStyle}>Status de paiement</th>
                                <th className={TdStyle.ThStyle}>Méthode de paiement</th>
                                <th className={TdStyle.ThStyle}>Date de paiement</th>
                                <th className={TdStyle.ThStyle}></th>
                                <th className={TdStyle.ThStyle}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoices.map((invoice, index) => (
                                <tr key={index}>
                                    <td className={TdStyle.TdStyle}>{invoice.subscriberName}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.amount}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.createdAt}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.dueDate}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.status === 'paid' ? 'Payé' : 'En attente'}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.paymentMethod || '-'}</td>
                                    <td className={TdStyle.TdStyle}>{invoice.paymentDate || '-'}</td>
                                    <td className={TdStyle.TdStyle}>
                                        {invoice.status === 'pending' && (
                                            <button onClick={() => openPopupPayment(invoice.id)} className="bg-sky-900 text-white px-3 py-1 rounded-md mr-2">Payer</button>
                                        )}
                                    </td>
                                    <td className={TdStyle.TdStyle}>
                                        <button onClick={() => openPopupNotification(invoice.subscriberId)} className="bg-sky-900 text-white px-3 py-1 rounded-md">Notification</button>
                                        {showPopupNotifications && selectedSubscriberId === invoice.subscriberId && (
                                            <NotificationPopup notifications={notifications} onClose={closePopupNotifications} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showPopupPayment && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-lg font-bold mb-4 text-center">Sélectionner la méthode de paiement</h2>
                        <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange} className="block w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-400">
                            <option value="cash">Payer en cash</option>
                            <option value="cheque">Payer par chèque</option>
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
                breadcrumbs={[{ label: "Payments", href: "/client/paiements" }]}
            />
            <Paiements />
        </main>
    );
}
