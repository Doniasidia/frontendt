import React, { useEffect, useState } from "react";
import Layout from "../clientLayout";
import { INVOICES_API, NOTIFICATION_API } from "../../../utils/apiUtil";
import axios from "axios";
import Cookies from "js-cookie";

interface Invoice {
  id: number;
  subscriberName: string;
  subscriberId: number;
  amount: number;
  createdAt: string;
  dueDate: string;
  // Add other properties as needed
}

interface Notification {
  id: number;
  message: string;
  createdAt: string;
}

const TdStyle = {
  ThStyle: 'border-l border-transparent py-2 px-3 text-base font-medium lg:py-4 lg:px-4 bg-custom-blue',
  TdStyle: 'text-dark border-b border-l border-transparent border-[#E8E8E8] bg-sky-100 dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium',
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

  const openPopupPayment = () => {
    setShowPopupPayment(true);
  };

  const closePopupPayment = () => {
    setShowPopupPayment(false);
  };

  const closePopupNotifications = () => {
    setShowPopupNotifications(false);
  };

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePaymentSubmit = () => {
    console.log("Payment method:", selectedPaymentMethod);
    closePopupPayment();
  };

  return (
    <Layout activePage="paiement">
      <div className="table-wrapper mt-20">
        <div className='flex justify-center mx-2 w-full'>
          <div className='w-full max-w-[90%] rounded-xl table-wrapper'>
            <table className='w-full table-auto border-collapse rounded-xl'>
              <thead className='text-center bg-primary'>
                <tr>
                  <th className={TdStyle.ThStyle}>Nom d'abonné</th>
                  <th className={TdStyle.ThStyle}>Prix</th>
                  <th className={TdStyle.ThStyle}>Date de création de facture</th>
                  <th className={TdStyle.ThStyle}>Date d'échéance de la facture</th>
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
                    <td className={TdStyle.TdStyle}></td>
                    <td className={TdStyle.TdStyle}></td>
                    <td className={TdStyle.TdStyle}></td>
                    <td className={TdStyle.TdStyle}>
                      <button onClick={openPopupPayment} className="bg-green-500 text-white px-3 py-1 rounded-md mr-2">Payé</button>
                    </td>
                    <td className={TdStyle.TdStyle}>
                      <button onClick={() => openPopupNotification(invoice.subscriberId)} className="bg-blue-500 text-white px-3 py-1 rounded-md">Notification</button>
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
              <option value="cash">Payé en cash</option>
              <option value="cheque">Payé par chèque</option>
            </select>
            <div className="flex justify-center">
              <button onClick={handlePaymentSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">Valider</button>
              <button onClick={closePopupPayment} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-400">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Paiements;
