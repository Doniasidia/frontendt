"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { INVOICES_API, NOTIFICATION_API } from "@/utils/apiUtil";
import { FaSearch } from "react-icons/fa";
import PaginationBar from "../../../../../components/PaginationBar";
import CardComponent from "../../../../../components/Card";

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
  subscriber: Subscriber; }

interface Subscriber {
    id : number ;
    username : string;
}

interface Notification {
  id: number;
  type: string;
  createdAt: string;
}

const TdStyle = {
  ThStyle: "border-l border-transparent text-white font-medium bg-slate-500",
  TdStyle: "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-white dark:border-dark dark:text-dark-7 py-1 text-center text-sm font-medium",
  TdButton: "inline-block bg-blue-300 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};

const NotificationPopup: React.FC<{ notifications: Notification[], onClose: () => void }> = ({ notifications, onClose }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-center">Historique des notifications</h2>
      <ul className="divide-y divide-gray-300">
        {notifications.map(notification => (
          <li key={notification.id} className="py-2">
            <p className="text-gray-700">{notification.type} :</p>
            <p className="text-gray-500 text-sm">{notification.createdAt}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-4">
        <button onClick={onClose} className="bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">Fermer</button>
      </div>
    </div>
  </div>
);

const Paiement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showPopupPayment, setShowPopupPayment] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPopupNotifications, setShowPopupNotifications] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const cookie = Cookies.get("session") || "{}";
        const session: { access_token: string } = JSON.parse(cookie);
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const response = await axios.get(INVOICES_API, { headers });
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const invoicesToDisplay = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

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
                invoice.id === selectedInvoiceId ? { ...invoice, status: 'paid', paymentMethod: selectedPaymentMethod, paymentDate: new Date().toISOString().split('T')[0] } : invoice
            ));
        } catch (error) {
            console.error('Error updating invoice status:', error);
        }
    }
    closePopupPayment();
};


  const openPopupNotification = async (subscriberId: number) => {
    setSelectedSubscriberId(subscriberId);
    console.log('Selected subscriberId:', subscriberId);  // Console log the selected subscriberId

    try {
        const cookie = Cookies.get('session') || '{}';
        const session: { access_token: string } = JSON.parse(cookie);
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const response = await axios.get(`${NOTIFICATION_API}/${subscriberId}`, { headers });
        setNotifications(response.data);
        setShowPopupNotifications(true);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
  };

  const closePopupNotifications = () => {
    setShowPopupNotifications(false);
  };

  return (
    <>
      <div className="flex justify-center pt-8 mx-2 w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="Rechercher par nom d'abonné"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96 shadow-sm"
          />
          <FaSearch className="absolute right-4 text-gray-400" />
        </div>
      </div>
      <div className="table-wrapper">
        <div className='flex justify-center mx-2 w-full'>
          <div className='w-full max-w-[100%] rounded-xl overflow-hidden shadow-lg'>
            <table className='w-full table-auto border-collapse'>
              <thead className='text-center'>
                <tr>
                  <th className={TdStyle.ThStyle}>Abonné</th>
                  <th className={TdStyle.ThStyle}>Prix (DNT) </th>
                  <th className={TdStyle.ThStyle}>Date de création de facture</th>
                  <th className={TdStyle.ThStyle}>{"Date d'échéance de la facture"}</th>
                  <th className={TdStyle.ThStyle}>Status de paiement</th>
                  <th className={TdStyle.ThStyle}>Date de paiement</th>
                  <th className={TdStyle.ThStyle}>Méthode de paiement</th>
                  <th className={TdStyle.ThStyle}></th>
                  <th className={TdStyle.ThStyle}></th>

                </tr>
              </thead>
              <tbody>
              {invoicesToDisplay.map((invoice, index) => (
  <tr 
    key={index}
    style={invoice.status === 'expired' ? { backgroundColor: '#f5f5f5', opacity: 0.3 } : {}}
  >
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${invoice.status === 'expired' ? 'text-center deactivated-text' : 'text-left'}`}>
      {invoice.subscriberName}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${invoice.status === 'expired' ? 'text-center deactivated-text' : 'text-left'}`}>
      {invoice.amount}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${invoice.status === 'expired' ? 'text-center deactivated-text' : 'text-left'}`}>
      {invoice.createdAt}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${invoice.status === 'expired' ? 'text-center deactivated-text' : 'text-left'}`}>
      {invoice.dueDate}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${invoice.status === 'expired' ? 'text-center deactivated-text' : 'text-left'}`}>
      {invoice.status === 'paid' ? 'Payé' : 'En attente'}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${invoice.status === 'expired' ? 'text-center deactivated-text' : 'text-left'}`}>
      {invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString('fr-FR') : '-'}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${invoice.status === 'expired' ? 'text-center deactivated-text' : 'text-left'}`}>
      {invoice.paymentMethod ? invoice.paymentMethod : '-'}
    </td>
    <td>
      {invoice.status === 'pending' &&(
        <button onClick={() => openPopupPayment(invoice.id)} className="bg-sky-900 text-white px-3 py-0.5 rounded-md mr-2">Payer</button>
      )}
    </td>
    <td className={TdStyle.TdStyle}>
      {invoice.status !== 'expired' && (
        <>
          <button onClick={() => openPopupNotification(invoice.subscriber?.id)} className="bg-sky-900 text-white px-3 py-1 rounded-md">Notification</button>
          {showPopupNotifications && selectedSubscriberId === invoice.subscriber.id && (
            <NotificationPopup notifications={notifications} onClose={closePopupNotifications} />
          )}
        </>
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Sélectionner la méthode de paiement</h2>
            <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange} className="block w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-400">
              <option value="">Sélectionner</option>
              <option value="cash">Payer par cash</option>
              <option value="card">Payer avec carte bancaire</option>
            </select>
            {selectedPaymentMethod === 'card' && (
              <CardComponent />
            )}
            <div className="flex justify-center mt-4">
              <button onClick={handlePaymentSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">Valider</button>
              <button onClick={closePopupPayment} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-400">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Paiement;
