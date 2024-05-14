//client/abonné
"use client";
import React, { useState, ChangeEvent, useEffect, use } from "react";
import Image from "next/image";
import Layout from "../clientLayout";
import axios from "axios";
import { HiMail } from "react-icons/hi";
import PaginationBar from "../../../components/PaginationBar";
import validator from "email-validator";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import MyCalendar from "../../../components/calendar";
import { GROUPS_API, PLANS_API, SUBSCRIBERS_API } from "../../../utils/apiUtil";
import Cookies from "js-cookie";



const TdStyle = {
  ThStyle:
    "border-l border-transparent py-2 px-3 text-base font-medium lg:py-4 lg:px-4 bg-custom-blue",
  TdStyle:
    "text-dark border-b border-l border-transparent border-[#E8E8E8] bg-sky-100 dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium",
  TdButton:
    "inline-block px-6 py-2.5 border rounded-md border-primary text-primary hover:bg-primary hover:text-white font-medium",
};
interface InputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
}

const EmailInput: React.FC<
  InputProps & { formSubmitted: boolean; emailExists: boolean }
> = ({ value, onChange, isValid, formSubmitted, emailExists }) => {
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event); // Propagate the change event to parent component
  };
  return (
    <div className="flex flex-wrap items-center mb-4 relative">
      <label
        htmlFor="email"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Email :
      </label>

      <input
        id="email"
        name="email"
        value={value}
        onChange={handleEmailChange} 
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${
          formSubmitted && !isValid ?  "border-red-500" : ""
        }`}
        placeholder="Enter votre email"
      />
      <div className="flex flex-wrap items-center mb-1 relative">
        <div className="absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none">
          <HiMail className="h-5 w-5 text-gray-400" />
        </div>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"></div>
      </div>
      {formSubmitted && !isValid && value.trim() !== "" && (
        <p className="text-red-500 text-xs italic">
          Veuillez entrer une adresse mail valide.
        </p>
      )}

      {formSubmitted && emailExists && (
        <p className="text-red-500 text-xs italic">Cet email existe déjà.</p>
      )}
    </div>
  );
};

interface Subscriber {
  id: number;
  username: string;
  email: string;
  telephone: string;
  status: string;
  nom: string;
  prenom: string;
  firstname: string;
  groupId: number;
  planId: number;
}

const Subscribers = () => {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [firstname, setfirstname] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");

  const [telephoneIsValid, setTelephoneIsValid] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [formValid, setFormValid] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<
    number | null
  >(null);
  const [selectedSubscriber, setSelectedSubscriber] =
    useState<Subscriber | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const isEmptyusername = !username;
  const isEmptyfirstname = !firstname;
  const isEmptytelephone = !telephone;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [emailExists, setEmailExists] = useState(false);
  const [telephoneExists, setTelephoneExists] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [telephoneError, setTelephoneError] = useState<string>("");
  const [plans, setPlans] = useState<{ id: number; name: string }[]>([]);
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]);
  const [subscribersToDisplay, setSubscribersToDisplay] = useState<
    Subscriber[]
  >([]);

  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState("client"); // Default selected option is "client"
  const [showCalendar, setShowCalendar] = useState(false); // Step 1: Track plan selection state
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [showSuccessNotificationContent, setShowSuccessNotificationContent] =
    useState<string>("");

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId.toString());
    setSelectedPlanId(planId);
    setShowCalendar(true); // Set showCalendar to true when a plan is selected
  };
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Update selectedGroup and selectedPlan based on the selected option
    if (selectedValue === "group") {
      setSelectedGroup(""); // Clear selected group
    } else if (selectedValue === "plan") {
      setSelectedPlan(""); // Clear selected plan
    }
  };
  useEffect(() => {
    // Check if the selectedSubscriber exists and has a groupId or planId
    if (selectedSubscriber && (selectedSubscriber.groupId || selectedSubscriber.planId)) {
      // If the subscriber has a groupId, set selectedOption to "group" and selectedGroup to the subscriber's groupId
      // Otherwise, set selectedOption to "plan" and selectedPlan to the subscriber's planId
      if (selectedSubscriber.groupId) {
        setSelectedOption("group");
        setSelectedGroup(selectedSubscriber.groupId.toString());
      } else {
        setSelectedOption("plan");
        setSelectedPlan(selectedSubscriber.planId.toString());
      }
    }
  }, [selectedSubscriber]);
  

  useEffect(() => {
    const fetchPlansAndGroups = async () => {
      try {
        // Fetch session data from cookies
        const cookie = Cookies.get("session") || "{}";
        const session: Session = await JSON.parse(cookie);
        const headers = {
          Authorization: `Bearer ${session.access_token}`,
        };
        
        // Fetch plans data
        const plansResponse = await axios.get(PLANS_API, { headers });
        setPlans(plansResponse.data);
        
        // Fetch groups data
        const groupsResponse = await axios.get(GROUPS_API, { headers });
        setGroups(groupsResponse.data);
      } catch (error) {
        console.error("Error fetching plans and groups:", error);
      }
    };
  
    fetchPlansAndGroups();
  }, []);
  

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const cookie = Cookies.get("session") || "{}";
        const session: Session = await JSON.parse(cookie);
        const headers = {
          Authorization: `Bearer ${session.access_token}`,
        };
        const response = await axios.get(SUBSCRIBERS_API, { headers });
        setSubscribers(response.data);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };

    // Fetch  from the API when the component mounts
    fetchSubscribers();
  }, []);

  // Update selec  information when selectedId changes
  useEffect(() => {
    if (selectedSubscriberId !== null) {
      const subscriber = subscribers.find(
        (subscriber) => subscriber.id === selectedSubscriberId
      );
      if (subscriber) {
        setSelectedSubscriber(subscriber);
        setUsername(subscriber.username);
        setfirstname(subscriber.firstname);
        setTelephone(subscriber.telephone);
        setEmail(subscriber.email);
      }
    }
  }, [selectedSubscriberId, subscribers]);

  const handleClick = async (subscriberId: number, action: string) => {
    try {
      if (action === "edit") {
        const subscriber = subscribers.find(
          (subscriber) => subscriber.id === subscriberId
        );
        if (subscriber && subscriber.status === "activated") {
          setSelectedSubscriberId(subscriberId);
          setSelectedSubscriber(subscriber);
          setShowEditForm(true);
        }
      } else if (action === "toggle") {
        const updatedSubscriberIndex = subscribers.findIndex(
          (subscriber) => subscriber.id === subscriberId
        );
        if (updatedSubscriberIndex !== -1) {
          const updatedSubscriber = subscribers[updatedSubscriberIndex];
          const newStatus =
            updatedSubscriber.status === "activated"
              ? "deactivated"
              : "activated";
          const cookie = Cookies.get("session") || "{}";
          const session: Session = await JSON.parse(cookie);
          const headers = {
            Authorization: `Bearer ${session.access_token}`,
          };
          const response = await axios.patch(
            `${SUBSCRIBERS_API}/${subscriberId}/status`,
            { status: newStatus, headers }
          );
          const updatedSubscribers = [...subscribers];
          updatedSubscribers[updatedSubscriberIndex] = response.data;
          setSubscribers(updatedSubscribers);
          const { groupId, planId } = response.data;
          setSelectedPlan(planId.toString()); // Update selectedPlan with the chosen plan ID
          setSelectedGroup(groupId.toString());
        }
      }
    } catch (error) {
      console.error("Error handling action:", error);
    }
  };

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = subscribers.filter((subscriber) => {
      return (
        subscriber.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscriber.firstname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredSubscribers(filtered);
    setCurrentPage(1);
  }, [searchQuery, subscribers]);
  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const subscribersToDisplay = filteredSubscribers.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    setSubscribersToDisplay(subscribersToDisplay);
  }, [currentPage, filteredSubscribers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const enteredEmail = event.target.value.toLowerCase(); // Convert entered email to lowercase
    const emailIsValid = validator.validate(enteredEmail); // Check if the entered email is valid
    setEmailExists(
      subscribers.some(
        (subscriber) => subscriber.email.toLowerCase() === enteredEmail
      )
    ); // Check if the entered email already exists
    setEmailIsValid(emailIsValid); // Update the email validity state
    setEmail(event.target.value); // Update the email state
  };

  useEffect(() => {
    if (validator.validate(email)) {
      setEmailIsValid(true);
    } else {
      setEmailIsValid(false);
    }
  }, [email]);
  const handleTelephoneChange = (value: string | undefined) => {
    // Update telephone state
    setTelephone(value || "");

    // Check if the telephone number is valid
    if (!isValidPhoneNumber(value || "")) {
      // Set the error message if the telephone number is invalid
      setTelephoneError("Ce numéro est invalide");
    } else {
      // Clear the error message if the telephone number is valid
      setTelephoneError("");
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form fields to empty values when toggling the form
    setUsername("");
    setfirstname("");
    setTelephone("");
    setEmail("");
    setSelectedPlan("");
    setSelectedGroup("");
    
   

    // Reset form validation states
    setFormValid(true);
    setFormSubmitted(false);
    setEmailIsValid(true);
    setTelephoneIsValid(true);
  };
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isEdit = selectedSubscriberId !== null;

    console.log("Data sent to backend:", {
      username,
      firstname,
      email,
      telephone,
      groupId: selectedGroup,
      planId: selectedPlan,
    });
    // Validate email
    if (!validator.validate(email)) {
      setEmailIsValid(false);
      setFormSubmitted(true);
      return;
    } else {
      setEmailIsValid(true);
    }

    if (!selectedGroup && !selectedPlan) {
      // Display an error message or handle it as needed
      setFormSubmitted(true);
      return;
    }

    // Check if all fields are valid
    if (username && firstname && email && telephone) {
      try {
        if (selectedSubscriberId !== null) {
          // Update existing subscriber
          const cookie = Cookies.get("session") || "{}";
          const session: Session = await JSON.parse(cookie);
          const headers = {
            Authorization: `Bearer ${session.access_token}`,
          };
          const response = await axios.patch(
            `${SUBSCRIBERS_API}/${selectedSubscriberId}`,
            {
              username,
              firstname,
              email: email.trim() === "" ? null : email,
              telephone,
              groupId: selectedGroup,
              planId: selectedPlan,
            },
            { headers }
          );

          // Update local state with modified subscriber
          const updatedSubscribers = subscribers.map((subscriber) => {
            if (subscriber.id === selectedSubscriberId) {
              return response.data;
            }
            return subscriber;
          });

          setSubscribers(updatedSubscribers);
          setShowEditForm(false);
        } else {
          const cookie = Cookies.get("session") || "{}";
          const session: Session = await JSON.parse(cookie);
          const headers = {
            Authorization: `Bearer ${session.access_token}`,
          };
         

          const response = await axios.post(
            SUBSCRIBERS_API,
            {
              username,
              firstname,
              email: email.trim() === "" ? null : email,
              telephone,
              groupId: selectedGroup !== "" ? selectedGroup : undefined,
              planId: selectedPlan !== "" ? selectedPlan : undefined,
            },
            { headers }
          );

          // Update local state with newly created subscriber
          setSubscribers([...subscribers, response.data]);
          setShowForm(false);
        }

        setFormValid(true);
        setShowSuccessNotification(true);
        setShowSuccessNotificationContent(
          isEdit ? "Abonné modifié avec succès" : "Abonné ajouté avec succès"
        );
      } catch (error) {
        console.error("Error creating/modifying subscriber:", error);
      }
    }

    setFormSubmitted(true);
  };
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPlanId = Number(event.target.value); // Convert string to number
    setSelectedPlanId(selectedPlanId); // Update selectedPlanId state
    setSelectedPlan(String(selectedPlanId)); // Update selectedPlan state
  };
  const SuccessNotification = () => {
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white py-4 px-8 rounded-xl shadow-lg text-xl">
        {showSuccessNotificationContent}
      </div>
    );
  };

  return (
    <Layout activePage="Abonnés">
      <div className="flex justify-center pt-14 mx-2 w-full">
        <div className="relative flex items-center  ">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="rechercher par nom ou prénom"
            className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-96"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pb-4">
            <Image src="/searchbar.svg" alt="search" width={15} height={40} />
          </div>
        </div>
      </div>

      <div className=" table-wrapper">
        <div className="flex justify-center mx-2 w-full  ">
          <div className="w-full max-w-[90%] rounded-xl  table-wrapper">
            <table className="w-full table-auto border-collapse rounded-xl ">
              <thead className="text-center bg-primary">
                <tr>
                  <th className={TdStyle.ThStyle}> Nom </th>
                  <th className={TdStyle.ThStyle}> Prénom </th>
                  <th className={TdStyle.ThStyle}> Téléphone </th>
                  <th className={TdStyle.ThStyle}> Email </th>
                  <th className={TdStyle.ThStyle}> Groupe </th>
                  <th className={TdStyle.ThStyle}>Plans </th>

                  <th className={TdStyle.ThStyle}> </th>
                  <th className={TdStyle.ThStyle}> </th>
                  <th className={TdStyle.ThStyle}> </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((subscriber: Subscriber) => (
                    <tr
                      className={
                        subscriber.status === "activated" ? "" : "deleted-row"
                      }
                      key={subscriber.id}
                    >
                      <td className={TdStyle.TdStyle}>{subscriber.username}</td>
                      <td className={TdStyle.TdStyle}>
                        {subscriber.firstname}
                      </td>
                      <td className={TdStyle.TdStyle}>
                        {subscriber.telephone}
                      </td>
                      <td className={TdStyle.TdStyle}>{subscriber.email}</td>
                      <td className={TdStyle.TdStyle}>
                        {
                          groups.find(
                            (group) => group.id === subscriber.groupId
                          )?.name
                        }
                      </td>
                      <td className={TdStyle.TdStyle}>
                        {
                          plans.find((plan) => plan.id === subscriber.planId)
                            ?.name
                        }
                      </td>

                      <td className={TdStyle.TdStyle}> </td>
                      <td className={TdStyle.TdStyle}>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleClick(subscriber.id, "edit")}
                          >
                            <Image
                              src="/file-pen.svg"
                              alt="edit"
                              width={20}
                              height={20}
                            />
                          </button>

                          {showEditForm && selectedSubscriber && (
                            <div
                              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg"
                              style={{
                                width: "28%",
                                height: "100%",
                                overflowY: "scroll",
                                boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              <form
                                className="flex flex-col justify-between h-full"
                                onSubmit={handleSubmit}
                              >
                                <div className="flex justify-end mt-4 mr-4 absolute top-0 right-0">
                                  <Image
                                    src="/close.svg"
                                    alt="close"
                                    width={15}
                                    height={15}
                                    onClick={() => setShowEditForm(false)}
                                    className="cursor-pointer"
                                  />
                                </div>

                                <h2
                                  className="text-lg font-bold mb-4 text-center"
                                  style={{ color: "rgb(27, 158, 246)" }}
                                >
                                  Modifier abonné :
                                </h2>

                                <div className="mb-4">
                                  <label
                                    htmlFor="username"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                  >
                                    Nom *:
                                  </label>
                                  <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) =>
                                      setUsername(e.target.value)
                                    }
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${
                                      formSubmitted && isEmptyusername
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                    placeholder="Entrer votre nom"
                                  />
                                  {formSubmitted && isEmptyusername && (
                                    <p className="text-red-500 text-xs italic">
                                      ce champ est obligatoire.
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center mb-4 relative">
                                  <label
                                    htmlFor="prenom"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                  >
                                    Prénom * :
                                  </label>
                                  <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    value={firstname}
                                    onChange={(e) =>
                                      setfirstname(e.target.value)
                                    }
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${
                                      formSubmitted && isEmptyfirstname
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                    placeholder="Entrer votre prénom "
                                  />
                                  {formSubmitted && isEmptyfirstname && (
                                    <p className="text-red-500 text-xs italic">
                                      ce champ est obligatoire.
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center mb-4 relative">
                                  <label
                                    htmlFor="telephone"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                  >
                                    Téléphone :
                                  </label>
                                  <div className="relative flex items-center">
                                    {/* PhoneInput component */}
                                    <PhoneInput
                                      placeholder="Entrez votre numéro de téléphone"
                                      value={telephone}
                                      onChange={handleTelephoneChange}
                                      error={telephoneError}
                                      style={{
                                        width: "20%",
                                        paddingLeft: "0.75rem",
                                      }} // Adjust width and padding as needed
                                    />
                                  </div>
                                  {/* Display error message if telephoneError is not empty */}
                                  {telephoneError && formSubmitted && (
                                    <p className="text-red-500 text-xs italic">
                                      {telephoneError}
                                    </p>
                                  )}
                                  {/* Display error message if telephone field is empty */}
                                  {formSubmitted && isEmptytelephone && (
                                    <p className="text-red-500 text-xs italic">
                                      Ce champ est obligatoire.
                                    </p>
                                  )}
                                </div>

                                <EmailInput
                                  value={email}
                                  onChange={handleEmailChange}
                                  isValid={emailIsValid}
                                  formSubmitted={formSubmitted}
                                  emailExists={emailExists}
                                />
                                <div>
                                  <input
                                    type="radio"
                                    value="group"
                                    checked={selectedOption === "group"}
                                    onChange={handleOptionChange}
                                  />
                                  <label htmlFor="group">Groupe</label>
                                </div>
                                <div>
                                  <input
                                    type="radio"
                                    value="plan"
                                    checked={selectedOption === "plan"}
                                    onChange={handleOptionChange}
                                  />
                                  <label htmlFor="plan">Plan</label>
                                </div>

                                {selectedOption === "group" && (
                                  <div className="flex flex-wrap items-center mb-4 relative">
                                    <label
                                      htmlFor="group"
                                      className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                      Groupe:
                                    </label>
                                    <select
                                      id="group"
                                      name="group"
                                      value={selectedGroup}
                                      onChange={(e) => {
                                        setSelectedGroup(e.target.value);
                                        setSelectedPlan(""); // Reset selected plan when selecting a group
                                        handleTypeChange;
                                      }}
                                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                                    >
                                      <option value="">
                                        Sélectionner un groupe
                                      </option>
                                      {/* Render your group options here */}
                                      {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                          {group.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}

                                {selectedOption === "plan" && (
                                  <div className="flex flex-wrap items-center mb-4 relative">
                                    <label
                                      htmlFor="plan"
                                      className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                      Plan:
                                    </label>
                                    <select
                                      id="plan"
                                      name="plan"
                                      value={selectedPlan}
                                      onChange={(e) => {
                                        setSelectedPlan(e.target.value);
                                        setSelectedGroup(""); // Reset selected group when selecting a plan
                                        handlePlanSelect(
                                          Number(e.target.value)
                                        );
                                        handleTypeChange;
                                      }}
                                      className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                                    >
                                      <option value="">
                                        Sélectionner un plan
                                      </option>
                                      {/* Render your plan options here */}
                                      {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                          {plan.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                                {showCalendar && selectedPlanId && (
                                  <div className="mb-8">
                                    <MyCalendar
                                      selectedPlanId={selectedPlanId}
                                    />
                                  </div>
                                )}

                                <div className="flex justify-end">
                                  <button
                                    className="button-color text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                                    type="submit"
                                  >
                                    Modifier
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className={TdStyle.TdStyle}>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleClick(subscriber.id, "toggle")}
                            className="toggle-button"
                          >
                            <div
                              className={`toggle-switch ${
                                subscriber.status === "activated"
                                  ? "active"
                                  : ""
                              }`}
                            ></div>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && (
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg"
            style={{
              width: "30%",
              height: "100%",
              overflowY: "scroll",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <form
              className="flex flex-col justify-between h-full"
              onSubmit={handleSubmit}
            >
              <div className="flex justify-end mt-4 mr-4 absolute top-0 right-0">
                <Image
                  src="/close.svg"
                  alt="close"
                  width={15}
                  height={15}
                  onClick={() => setShowForm(false)}
                  className="cursor-pointer"
                />
              </div>

              <h2
                className="text-lg font-bold mb-4 text-center"
                style={{ color: "rgb(27, 158, 246)" }}
              >
                Ajouter abonné :
              </h2>

              <div className="mb-4">
                <label
                  htmlFor="nom"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Nom *:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${
                    formSubmitted && isEmptyusername ? "border-red-500" : ""
                  }`}
                  placeholder="Entrer votre nom"
                />
                {formSubmitted && isEmptyusername && (
                  <p className="text-red-500 text-xs italic">
                    ce champ est obligatoire.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center mb-4 relative">
                <label
                  htmlFor="prenom"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Prénom * :
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => setfirstname(e.target.value)}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 ${
                    formSubmitted && isEmptyfirstname ? "border-red-500" : ""
                  }`}
                  placeholder="Entrer votre prénom "
                />
                {formSubmitted && isEmptyfirstname && (
                  <p className="text-red-500 text-xs italic">
                    ce champ est obligatoire.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center mb-4 relative">
                <label
                  htmlFor="telephone"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Téléphone :
                </label>
                <div className="relative flex items-center">
                  {/* PhoneInput component */}
                  <PhoneInput
                    placeholder="Entrez votre numéro de téléphone"
                    value={telephone}
                    onChange={handleTelephoneChange}
                    error={telephoneError}
                    style={{ width: "20%", paddingLeft: "0.75rem" }} // Adjust width and padding as needed
                  />
                </div>
                {/* Display error message if telephoneError is not empty */}
                {telephoneError && formSubmitted && (
                  <p className="text-red-500 text-xs italic">
                    {telephoneError}
                  </p>
                )}
                {/* Display error message if telephone field is empty */}
                {formSubmitted && isEmptytelephone && (
                  <p className="text-red-500 text-xs italic">
                    Ce champ est obligatoire.
                  </p>
                )}
              </div>

              <EmailInput
                value={email}
                onChange={handleEmailChange}
                isValid={emailIsValid}
                formSubmitted={formSubmitted}
                emailExists={emailExists}
              />
              <div>
                <input
                  type="radio"
                  value="group"
                  checked={selectedOption === "group"}
                  onChange={handleOptionChange}
                />
                <label htmlFor="group">Groupe</label>
              </div>
              <div>
                <input
                  type="radio"
                  value="plan"
                  checked={selectedOption === "plan"}
                  onChange={handleOptionChange}
                />
                <label htmlFor="plan">Plan</label>
              </div>

              {selectedOption === "group" && (
                <div className="flex flex-wrap items-center mb-4 relative">
                  <label
                    htmlFor="group"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Groupe:
                  </label>
                  <select
                    id="group"
                    name="group"
                    value={selectedGroup}
                    onChange={(e) => {
                      setSelectedGroup(e.target.value);
                      setSelectedPlan(""); // Reset selected plan when selecting a group
                    }}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                  >
                    <option value="">Sélectionner un groupe</option>
                    {/* Render your group options here */}
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedOption === "plan" && (
                <div className="flex flex-wrap items-center mb-4 relative">
                  <label
                    htmlFor="plan"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Plan:
                  </label>
                  <select
                    id="plan"
                    name="plan"
                    value={selectedPlan}
                    onChange={(e) => {
                      setSelectedPlan(e.target.value);
                      setSelectedGroup(""); // Reset selected group when selecting a plan
                      handlePlanSelect(Number(e.target.value));
                    }}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500"
                  >
                    <option value="">Sélectionner un plan</option>
                    {/* Render your plan options here */}
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  className="button-color text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        )}
        {showCalendar && selectedPlanId && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6  rounded-xl shadow-lg w-[720px]"
              style={{ overflow: "auto", maxHeight: "500px" }}
            >
              {" "}
              {/* Set the width of the popup */}
              <MyCalendar selectedPlanId={selectedPlanId} />
              <div className="flex justify-center mt-4">
                <button
                  className="button-color text-white font-bold py-2 px-6 rounded-2xl focus:outline-none focus:shadow-outline"
                  onClick={() => setShowCalendar(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-6 right-8 mb-4 mr-4">
          <button
            onClick={toggleForm}
            className="flex items-center button-color font-bold text-white rounded-xl px-4 py-2"
          >
            <span className="mr-2">Ajouter abonné</span>
            <Image
              src="/Add User Male.svg"
              alt="addUser"
              width={20}
              height={20}
            ></Image>
          </button>
        </div>
        <div className="flex justify-center mt-50">
          <PaginationBar
            totalItems={filteredSubscribers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
      {showSuccessNotification && <SuccessNotification />}
    </Layout>
  );
};

export default Subscribers;
