import React, { useEffect, useState } from "react";
import Layout from "../clientLayout";
import { INvOICES_API } from "../../../utils/apiUtil";
import axios from "axios";
import Cookies from "js-cookie";


interface Invoice {
  subscriberName: string;
  amount: number;
  createdAt: string;
  dueDate: string;
  // Add other properties as needed
}

const TdStyle = {
  ThStyle: 'border-l border-transparent py-2 px-3 text-base font-medium lg:py-4 lg:px-4 bg-custom-blue',
  TdStyle: 'text-dark border-b border-l border-transparent border-[#E8E8E8] bg-sky-100 dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium',
};

const Paiements = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]); 
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  



  // Function to fetch invoices data from the API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const cookie = Cookies.get("session") || "{}";
        const session: Session = await JSON.parse(cookie);
        const headers = {
          Authorization: `Bearer ${session.access_token}`,
        };
        const response = await axios.get(INvOICES_API, { headers });
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };

    // Fetch  from the API when the component mounts
    fetchInvoices();
  }, []);
  const openPopup = () => {
    setShowPopup(true);
  };

  // Function to handle closing the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to handle selecting a payment method
  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPaymentMethod(event.target.value);
  };

  // Function to handle payment submission
  const handlePaymentSubmit = () => {
    // Implement your payment submission logic here
    console.log("Payment method:", selectedPaymentMethod);
    // Close the popup after payment submission
    closePopup();
  };
  return (
    <Layout activePage="paiement">
      <div className="table-wrapper mt-20">
        <div className='flex justify-center mx-2 w-full'>
          <div className='w-full max-w-[90%] rounded-xl  table-wrapper'>
            <table className='w-full table-auto border-collapse rounded-xl'>
              <thead className='text-center bg-primary'>
                <tr>
                  <th className={TdStyle.ThStyle}>Nom d'abonné</th>
                  <th className={TdStyle.ThStyle}>Prix</th>
                  <th className={TdStyle.ThStyle}>Date de création de facture</th>
                  <th className={TdStyle.ThStyle}>Date d'échéance de la facture</th>
                  <th className={TdStyle.ThStyle}>Status de paiement</th>
                  <th className={TdStyle.ThStyle}>Méthode de paiement</th>
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
                    <td className={TdStyle.TdStyle}>
                    <button onClick={openPopup} className="bg-green-500 text-white px-3 py-1 rounded-md mr-2">Payé</button>
                    </td>
                    <td className={TdStyle.TdStyle}>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded-md">Notification</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showPopup && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-center">Sélectionner la méthode de paiement</h2>
      <select value={selectedPaymentMethod} onChange={handlePaymentMethodChange} className="block w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-400">
        <option value="cash">Payé en cash</option>
        <option value="cheque">Payé par chèque</option>
      </select>
      <div className="flex justify-center">
        <button onClick={handlePaymentSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">Valider</button>
        <button onClick={closePopup} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-400">Annuler</button>
      </div>
    </div>
  </div>
)}

    </Layout>
  );
}

export default Paiements;