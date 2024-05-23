//subs/abonner
import React, { useState, useEffect, ChangeEvent } from "react";
import Layout from "../subsLayout";
import axios from "axios";
import { PLANS_API, SUBSCRIPTIONS_API } from "../../../utils/apiUtil";
import PaginationBar from "../../../components/PaginationBar";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";

interface Plan {
  id: number;
  name: string;
  amount: number;
  createdBy: Client;
  type : string;
}

interface Client {
  id: number;
  username: string;
  addressLine: string;
  description: string;
}

const TdStyle = {
  ThStyle:
    'py-4 px-6 text-base font-medium text-white bg-cyan-700',
  TdStyle:
    'py-3 px-6 text-sm font-medium text-gray-700 bg-white border-b border-gray-200',
  TdButton:
    'bg-green-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-green-600 transition-colors duration-300',
};

const Abonner = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get<Plan[]>(`${PLANS_API}/allplans`);
        console.log("Fetched successfully:", response.data);
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubscribeClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return;

    try {
      const loggedInUserId = Cookies.get("userId");
      const subscriberName = Cookies.get("username");
      console.log("userid", loggedInUserId);

      console.log("Subscriber Name:", subscriberName);
      if (!subscriberName) {
        throw new Error("Subscriber name not found in cookies.");
      }

      let startDate = new Date();
      let endDate = new Date();

      // Set endDate based on the type of plan
      switch (selectedPlan.type) {
        case "mensuel":
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        case "annuel":
          endDate.setFullYear(startDate.getFullYear() + 1);
          break;
        case "Par session":
          endDate.setDate(startDate.getDate() + 1);
          break;
        default:
          throw new Error("Invalid plan type");
      }
      const amount = Number(selectedPlan.amount); // Ensure amount is a number


      const response = await axios.post(`${SUBSCRIPTIONS_API}`, {
        subscriberId: Number(loggedInUserId),
        amount: amount, 
        subscriberName: subscriberName,
        clientName: selectedPlan.createdBy.username,
        planName: selectedPlan.name,
        startDate: new Date(), 
        endDate: endDate,
        type: selectedPlan.type,
        createdById : selectedPlan.createdBy.id
      });

      console.log("Subscription created successfully:", response.data);
      setShowConfirmation(false);
      window.location.href = `paiement/`;
    } catch (error) {
      console.error("Error creating subscription or invoice:", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedPlan(null);
  };

  // Filter plans based on the search query
  const filteredPlans = plans.filter((plan) =>
    plan.createdBy.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine the plans to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const plansToDisplay = filteredPlans.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Layout activePage="abonner">
      <div className="flex justify-center pt-8 mx-2 w-full">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="Rechercher par nom d'établissement"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96 shadow-sm"
          />
          <FaSearch className="absolute right-4 text-gray-400" />
        </div>
      </div>
      <div className="table-wrapper ">
        <div className='flex justify-center mx-2 w-full'>
          <div className='w-full max-w-[90%] rounded-xl overflow-hidden shadow-lg'>
            <table className='w-full table-auto border-collapse'>
              <thead className='text-center'>
                <tr>
                  <th className={TdStyle.ThStyle}>Établissement</th>
                  <th className={TdStyle.ThStyle}>Plan</th>
                  <th className={TdStyle.ThStyle}>Prix d'abonnement</th>
                  <th className={TdStyle.ThStyle}>Site web ou page</th>
                  <th className={TdStyle.ThStyle}>Description</th>
                  <th className={TdStyle.ThStyle}></th>
                </tr>
              </thead>
              <tbody>
                {plansToDisplay.map((plan) => (
                  <tr key={plan.id} className="bg-white hover:bg-gray-50">
                    <td className={TdStyle.TdStyle}>{plan.createdBy.username}</td>
                    <td className={TdStyle.TdStyle}>{plan.name}</td>
                    <td className={TdStyle.TdStyle}>{plan.amount}</td>
                    <td className={TdStyle.TdStyle}>
                      <a
                        href={`http://${plan.createdBy.addressLine}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {plan.createdBy.addressLine}
                      </a>
                    </td>
                    <td className={TdStyle.TdStyle}>{plan.createdBy.description}</td>
                    <td className={TdStyle.TdStyle}>
                      <button
                        className={TdStyle.TdButton}
                        onClick={() => handleSubscribeClick(plan)}
                      >
                        s'abonner
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <PaginationBar
            totalItems={filteredPlans.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
            <p>Voulez-vous vraiment vous abonner à ce plan ?</p>
            <div className="flex justify-end mt-4">
              <button
                className="mr-4 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-300"
                onClick={handleCancel}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                onClick={handleConfirmSubscription}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Abonner;
