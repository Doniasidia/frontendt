"use client";
import React, { useState, useEffect,ChangeEvent } from "react";
import Layout from "../subsLayout";
import axios from "axios";
import { CLIENTS_API, PLANS_API } from "../../../utils/apiUtil"; 
import PaginationBar from "../../../components/PaginationBar";
interface Plan {
  id: number;
  name: string;
  amount: number;
  createdBy: Client;
}
  interface Client {
    id: number;
    username: string;
    addressLine : string;
    description : string;

    }
    const TdStyle = {
      ThStyle:
        "border-l border-transparent py-2 px-3 text-base font-medium lg:py-4 lg:px-4 bg-custom-blue",
      TdStyle:
        "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-sky-100 dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium",
      TdButton:
        "inline-block bg-blue-300 px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
    };
const Abonner = () => {
  const [plans, setPlans] = useState<Plan[]>([]); 
  const [abonnerToDisplay, setAbonnersToDisplay] = useState<Plan[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredAbonners, setfilteredAbonners] = useState<Plan[]>( []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  useEffect(() => {
    const filtered = plans.filter((plan) => {
      return (
        plan.createdBy.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    
    setfilteredAbonners(filtered);
    setCurrentPage(1);
  }, [searchQuery, plans]);
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const abonnersToDisplay = filteredAbonners.slice(indexOfFirstItem, indexOfLastItem);
    setAbonnersToDisplay(abonnersToDisplay);
  }, [currentPage, filteredAbonners]);

  
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get<Plan[]>(`${PLANS_API}/allplans`); 
        console.log("fetched successfully:", response.data); 
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);
  

  return (
    <Layout activePage="abonner">
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
      <div className="table-wrapper">
        <div className="flex justify-center mx-2 w-full">
          <div className="w-full max-w-[90%] rounded-xl rounded-b-none table-wrapper">
            <table className="w-full table-auto border-collapse">
              <thead className="text-center bg-primary">
                <tr>
              <th className={TdStyle.ThStyle}>Établissement</th>
              <th className={TdStyle.ThStyle}>Plan</th>
              <th className={TdStyle.ThStyle}>Prix d'abonnement</th>
              <th className={TdStyle.ThStyle}> Site web ou page</th>
              <th className={TdStyle.ThStyle}>Description</th>
              <th className={TdStyle.ThStyle}></th>

              

              

            </tr>
          </thead>
          <tbody>
          {filteredAbonners
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((plan: Plan) => (
                    <tr key={plan.createdBy.username}>
                    <td className={TdStyle.TdStyle}>{plan.createdBy.username}</td>
                  <td className={TdStyle.TdStyle}>{plan.name}</td>
                <td className={TdStyle.TdStyle}>{plan.amount}</td>
                <td className={TdStyle.TdStyle}>
  <a href={`http://${plan.createdBy.addressLine}`} target="_blank" rel="noopener noreferrer" className="link">
    {plan.createdBy.addressLine}
  </a>
</td>
<td className={TdStyle.TdStyle}>{plan.createdBy.description}</td>
                <td className={TdStyle.TdStyle}>
                      <button className={TdStyle.TdButton} >
                        s'abonner
                      </button>
                    </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
     </div>
     <div className="flex justify-center mt-50">
          <PaginationBar
            totalItems={filteredAbonners.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
    </div>
    </Layout>
  );
};

export default Abonner;
