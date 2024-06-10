"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import React, { ChangeEvent, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { SUBSCRIPTIONS_API } from "@/utils/apiUtil";
import PaginationBar from "../../../../../components/PaginationBar";


interface Subscription {
  clientName: string;
  planName: string;
  groupName: string | null;
  amount: number;
  subscriber : Subscriber;
  status : string;
  slots : string[]

}
interface Subscriber{
  id : number ;
}

const TdStyle = {
  ThStyle:
    "border-l border-transparent py-2 px-3 text-white font-medium lg:py-4 lg:px-4 bg-slate-500",
  TdStyle:
    "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-white dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium",
  TdButton:
    "inline-block bg-blue-300 px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};

const Abonnement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [showSlotsPopup, setShowSlotsPopup] = useState(false);
  const [selectedSubscriberSlots, setSelectedSubscriberSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const loggedInUserId = Cookies.get("userId");
        const response = await axios.get(`${SUBSCRIPTIONS_API}/subscriber/${loggedInUserId}`);
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSlotsDisplay = (slots: string[]) => {
    setSelectedSubscriberSlots(slots);
    setShowSlotsPopup(true);
  };

  const filteredSubscriptions = subscriptions.filter((subscription) =>
    subscription.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const subscriptionsToDisplay = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);

return (
  <>
    <div className="flex justify-center pt-8 mx-2 w-full">
      <div className="relative flex items-center ">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Rechercher par nom d'établissement"
          className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96"
        />
      </div>
    </div>
    <div className="table-wrapper">
      <div className='flex justify-center mx-2 w-full'>
        <div className='w-full max-w-[90%] rounded-xl overflow-hidden shadow-lg'>
          <table className='w-full table-auto border-collapse'>
            <thead className='text-center'>
              <tr>
                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}>Établissement</th>
                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}>Plan d&#39;abonnement</th>
                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}>Groupe</th>
                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}>Prix (DNT)</th>
                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}></th>

              </tr>
            </thead>
            <tbody>
            
            {subscriptionsToDisplay.map((subscription: Subscription, index) => (
  <tr 
    key={index} 
    style={subscription.status === 'deactivated' ? { backgroundColor: '#f5f5f5', opacity: 0.3 } : {}}
  >
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${subscription.status === 'deactivated' ? 'text-center deactivated-text' : 'text-left'}`}>
      {subscription.clientName}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${subscription.status === 'deactivated' ? 'text-center deactivated-text' : 'text-left'}`}>
      {subscription.planName}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${subscription.status === 'deactivated' ? 'text-center deactivated-text' : 'text-left'}`}>
      {subscription.groupName}
    </td>
    <td className={`${TdStyle.TdStyle} border-b border-gray-200 ${subscription.status === 'deactivated' ? 'text-center deactivated-text' : 'text-left'}`}>
      {subscription.amount}
    </td>
    <td className={subscription.status === 'activated' ? TdStyle.TdStyle : ''}>
      {subscription.status === 'activated' && (
        <button onClick={() => handleSlotsDisplay(subscription.slots)} className="bg-sky-900 text-white px-3 py-1 rounded-md">
          Horaires des séances
        </button>
      )}
    </td>
  </tr>
))}



</tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <PaginationBar
          totalItems={filteredSubscriptions.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>
    </div>
    {showSlotsPopup && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2>Horaires des séances</h2>
                        <ul>
                            {selectedSubscriberSlots.map((slot, index) => (
                                <li key={index}>{slot}</li>
                            ))}
                        </ul>
                        <div />         
                       <div className="flex justify-center mt-4">
                        <button onClick={() => setShowSlotsPopup(false)} className="bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 ">Fermer</button>
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
      breadcrumbs={[{ label: "Abonnements", href: "/subs/abonnement" }]}
    />
    <Abonnement />
  </main>
);
}

