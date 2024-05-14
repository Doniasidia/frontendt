"use client";

import React, { useState, useEffect,ChangeEvent } from "react";
import Layout from "../subsLayout";
import axios from "axios";
import Cookies from "js-cookie";
import { SUBSCRIPTIONS_API } from "../../../utils/apiUtil";
import PaginationBar from "../../../components/PaginationBar";

interface Subscription {
  clientName: string;
  planName: string;
  groupName: string | null;
  amount: number;
}
const TdStyle = {
  ThStyle:
    "border-l border-transparent py-2 px-3 text-base font-medium lg:py-4 lg:px-4 bg-custom-blue",
  TdStyle:
    "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-sky-100 dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium",
  TdButton:
    "inline-block bg-blue-300 px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};

const Abonnements = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]); // Specify the type of subscriptions
  const [subscriptionsToDisplay, setSubscriptionsToDisplay] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSubscriptions, setfilteredSubscriptions] = useState<Subscription[]>( []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  
  useEffect(() => {
    const filtered = subscriptions.filter((subscription) => {
      return (
         subscription.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    
    setfilteredSubscriptions(filtered);
    setCurrentPage(1);
  }, [searchQuery, subscriptions]);
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const subscriptionsToDisplay = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);
    setSubscriptionsToDisplay(subscriptionsToDisplay);
  }, [currentPage, filteredSubscriptions]);

  
  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const loggedInUserId = Cookies.get("userId"); // Get the logged-in user ID from the cookie
        const response = await axios.get(`${SUBSCRIPTIONS_API}/subscriber/${loggedInUserId}`); // Updated endpoint
        console.log("Response:", response); // Log the response

        setSubscriptions(response.data);
        console.log("Responseeeeeee:", response); // Log the response

      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);
  

  return (
    <Layout activePage="abonnement">
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
                  <th className={TdStyle.ThStyle}>Groupe</th>
                  <th className={TdStyle.ThStyle}>Prix</th>
                  <th className={TdStyle.ThStyle}></th>
                  
                </tr>
              </thead>
              <tbody>
              {filteredSubscriptions
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((subscription: Subscription) => (
                    <tr key={subscription.clientName}>
                    <td className={TdStyle.TdStyle}>{subscription.clientName}</td>
                    <td className={TdStyle.TdStyle}>{subscription.planName}</td>
                    <td className={TdStyle.TdStyle}>{subscription.groupName}</td>
                    <td className={TdStyle.TdStyle}>{subscription.amount}</td>
                    <td className={TdStyle.TdStyle}>
                      <button className={TdStyle.TdButton} >
                        Rénouveler
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
            totalItems={filteredSubscriptions.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Abonnements;
