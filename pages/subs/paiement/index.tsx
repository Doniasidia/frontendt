import Layout from "../subsLayout";
import React, { useEffect, useState ,ChangeEvent} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { INvOICES_API } from "../../../utils/apiUtil";
import PaginationBar from "../../../components/PaginationBar";

interface Invoice {
    subscriberName: string;
    amount: number;
    createdAt: string;
    dueDate: string;
    clientName : string
  }
const TdStyle = {
    ThStyle: 'border-l border-transparent py-2 px-3 text-base font-medium lg:py-4 lg:px-4 bg-custom-blue',
    TdStyle: 'text-dark border-b border-l border-transparent border-[#E8E8E8] bg-sky-100 dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium',
  };
  
const paiement = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]); 
    const [invoicesToDisplay, setInvoicesToDisplay] = useState<Invoice []>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredInvoices, setfilteredInvoices] = useState<Invoice[]>( []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      return (
        invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    
    setfilteredInvoices(filtered);
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
          const response = await axios.get(INvOICES_API, { headers });
          setInvoices(response.data);
        } catch (error) {
          console.error("Error fetching subscribers:", error);
        }
      };
  
      // Fetch  from the API when the component mounts
      fetchInvoices();
    }, []);
    return (
    <Layout activePage="paiement">
       <div className="flex justify-center pt-14 mx-2 w-full">
        <div className="relative flex items-center ">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="rechercher par nom d'établissement"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96"
          />
        </div>
        </div>
      <div className="table-wrapper mt-8">
        <div className='flex justify-center mx-2 w-full'>
          <div className='w-full max-w-[90%] rounded-xl  table-wrapper'>
            <table className='w-full table-auto border-collapse rounded-xl'>
              <thead className='text-center bg-primary'>
                <tr>
                  <th className={TdStyle.ThStyle}>Établissement</th>
                  <th className={TdStyle.ThStyle}>Prix d'abonnement</th>
                  <th className={TdStyle.ThStyle}>Date de création de facture</th>
                  <th className={TdStyle.ThStyle}>Date d'échéance de la facture</th>
                  <th className={TdStyle.ThStyle}>Status de paiement</th>
                  <th className={TdStyle.ThStyle}>Méthode de paiement</th>
                  <th className={TdStyle.ThStyle}></th>
                 
                </tr>
              </thead>
              <tbody>
              {filteredInvoices
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((invoice: Invoice) => (
                    <tr key={invoice.clientName}>
                    <td className={TdStyle.TdStyle}>{invoice.clientName}</td>
                    <td className={TdStyle.TdStyle}>{invoice.amount}</td>
                    <td className={TdStyle.TdStyle}>{invoice.createdAt}</td>
                    <td className={TdStyle.TdStyle}>{invoice.dueDate}</td>
                    <td className={TdStyle.TdStyle}></td>
                    <td className={TdStyle.TdStyle}></td>
                    <td className={TdStyle.TdStyle}>
                    <button  className="bg-green-500 text-white px-3 py-1 rounded-md mr-2">Payé</button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center mt-50">
          <PaginationBar
            totalItems={filteredInvoices.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
     
   
  


    </Layout>
  );
}
export default paiement;
