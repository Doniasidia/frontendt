"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import React, {ChangeEvent, useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {SUBSCRIPTIONS_API} from "@/utils/apiUtil";
import PaginationBar from "../../../../../components/PaginationBar";

interface Subscription {
    clientName: string;
    planName: string;
    groupName: string | null;
    amount: number;
}

const TdStyle = {
    ThStyle:
        "border-l border-transparent py-2 px-3 text-white font-medium lg:py-4 lg:px-4 bg-cyan-700",
    TdStyle:
        "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-white dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium",
    TdButton:
        "inline-block bg-blue-300 px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};

const Abonnement = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [subscriptionsToDisplay, setSubscriptionsToDisplay] = useState<Subscription[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredSubscriptions, setfilteredSubscriptions] = useState<Subscription[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        const filtered = subscriptions.filter((subscription) =>
            subscription.clientName.toLowerCase().includes(searchQuery.toLowerCase())
        );

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
                const loggedInUserId = Cookies.get("userId");
                const response = await axios.get(`${SUBSCRIPTIONS_API}/subscriber/${loggedInUserId}`);
                setSubscriptions(response.data);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
            }
        };

        fetchSubscriptions();
    }, []);

    return (
        <>
            <div className="flex justify-center pt-8 mx-2 w-full">
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
            <div className="table-wrapper ">
                <div className='flex justify-center mx-2 w-full'>
                    <div className='w-full max-w-[90%] rounded-xl overflow-hidden shadow-lg'>
                        <table className='w-full table-auto border-collapse'>
                            <thead className='text-center'>
                            <tr>
                                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}>Établissement</th>
                                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}>Plan</th>
                                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}>Groupe</th>
                                <th className={`${TdStyle.ThStyle} border-b border-gray-300`}>Prix</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subscriptionsToDisplay.map((subscription: Subscription) => (
                                <tr key={subscription.clientName}>
                                    <td className={`${TdStyle.TdStyle} border-b border-gray-200`}>{subscription.clientName}</td>
                                    <td className={`${TdStyle.TdStyle} border-b border-gray-200`}>{subscription.planName}</td>
                                    <td className={`${TdStyle.TdStyle} border-b border-gray-200`}>{subscription.groupName}</td>
                                    <td className={`${TdStyle.TdStyle} border-b border-gray-200`}>{subscription.amount}</td>
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
        </>
    );
};

export default function Page() {
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[{label: "Abonnements", href: "/subs/abonnement"}]}
            />
            <Abonnement/>
        </main>
    );
}
