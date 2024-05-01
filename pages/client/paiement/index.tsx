import React, { useEffect, useState } from "react";
import Layout from "../clientLayout";

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
  const [invoices, setInvoices] = useState<Invoice[]>([]); // Specify the type of invoices as Invoice[]

  useEffect(() => {
    // Fetch invoices data from API
    // Replace 'fetchInvoicesData' with your actual function to fetch invoices data
    fetchInvoicesData().then(data => {
      setInvoices(data);
    }).catch(error => {
      console.error('Error fetching invoices:', error);
    });
  }, []);

  // Function to fetch invoices data from the API
  const fetchInvoicesData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/invoices');
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return []; // Return empty array in case of error
    }
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
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md mr-2">Payé</button>
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
    </Layout>
  );
}

export default Paiements;
