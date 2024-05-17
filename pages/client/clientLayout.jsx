//clientlayout
"use client";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState , useEffect } from "react";
import { CLIENTS_API } from "../../utils/apiUtil";
import axios from "axios";

const Layout = ({ children, activePage }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [clientId, setClientId] = useState(null);
  const [addressLine, setAddressLine] = useState(""); // Remove explicit type declaration

 
  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUserId = Cookies.get("userId");
      console.log("Logged In User ID:", loggedInUserId);
      if (!loggedInUserId) {
        return;
      }
  
      try {
        const response = await axios.get(`${CLIENTS_API}/${loggedInUserId}`);
        const userData = response.data; 
        const { username, email, telephone, password,addressLine  } = userData;
        setUsername(username);
        setEmail(email);
        setTelephone(telephone);
        setPassword(password);
        setAddressLine(addressLine);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
 
  
 
 
  const handlePhotoChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
    setSelectedPhoto(file); // Update state with the selected file
  };
  

  const handleUsernameClick = () => {
    // Toggle the visibility of the form
    setShowForm(!showForm);
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Ensure loggedInUserId is retrieved before sending the request
    const loggedInUserId = Cookies.get("userId");
    if (!loggedInUserId) {
      console.error("Missing loggedInUserId for update request");
      return; // Handle the case where user ID is not available (e.g., display an error message)
    }
  
    try {
      const response = await axios.patch(`${CLIENTS_API}/${loggedInUserId}`, {
        username,
        email,
        telephone,
        password,
        addressLine,
      });
      console.log("User data updated:", response.data);
  
      // Update the state with the new data (optional)
      setUsername(response.data.username);
      setEmail(response.data.email);
      setTelephone(response.data.telephone);
      setAddressLine(response.data.addressLine);
  
      // Close the form after successful update
      setShowForm(false); 
    } catch (error) {
      console.error("Error updating user data:", error);
  
      // Handle the error here (e.g., display a more specific error message to the user)
      alert(getErrorMsg(error)); // Call a function to handle error messages
    }
  };
  
  // Function to handle error messages based on error object (optional)
  function getErrorMsg(error) {
    if (error.response && error.response.data) {
      return error.response.data.message || "An error occurred while updating your data.";
    } else {
      return "An unexpected error occurred.";
    }
  }
  
  
 
  return (
    <div className="flex h-screen bg-sky-50 p-4">
      {/* Main container */}
      <div className="sidebar bg-white w-41 text-white shadow-lg rounded-xl rounded-tr-none">
        {/* Sidebar container */}
        <div className="flex flex-col h-full justify-between">
          {/* Sidebar content */}
          {/* Navigation links */}
          <div className="flex items-center justify-center py-4">
            <span className="text-2xl font-bold logo-color">USMS</span>
          </div>
          <div className="h-4/5">
            <div className="border-t-2 border-cyan-400 p-4"></div>
            <div className="flex flex-col items-center space-y-2 px-4">
              <Link href="/client/dashboard">
                <button
                  className={
                    activePage === "dashboard"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  Tableau de bord
                </button>
              </Link>
              <Link href="/client/abonne">
                <button
                  className={
                    activePage === "Abonnés"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  Abonnés
                </button>
              </Link>
              <Link href="/client/plans">
                <button
                  className={
                    activePage === "plans"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  Plans d'abonnements
                </button>
              </Link>
              <Link href="/client/paiement">
                <button
                  className={
                    activePage === "paiement"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  Paiement
                </button>
              </Link>
              <Link href="/client/groupes">
                <button
                  className={
                    activePage === "Groups"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  Groupes
                </button>
              </Link>
              <Link href="/client/parametres">
                <button
                  className={
                    activePage === "Parametres"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  Paramètres
                </button>
              </Link>
              <Link href="/client/chat">
                <button
                  className={
                    activePage === "chat"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  chat
                </button>
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="border-t border-gray-300 p-3 w-60"></div>
          </div>
          <div className="flex justify-center items-center mb-4">
            {/* Centered Logout button */}
            <button
  onClick={(e) => {
    e.preventDefault();
    // Clear the session cookie by setting an empty object with an expired expiry date
    Cookies.set("session", JSON.stringify({}), { expires: new Date(0) });
    // Redirect to the login page
    window.location.href = "/login";
  }}
  className="hover:bg-sky-500 hover:text-white py-4 px-12 rounded-lg transition-colors duration-300 bg-white text-gray-600 border border-gray-400"
>
  Déconnecter
</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow ml-auto">
        {/* Content and sidebar container */}
        <div className="bg-white flex items-center justify-between px-4 py-2 text-gray-800 h-16 rounded-xl rounded-l-none">
          {/* Top bar */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* User image and name */}
            <div className="ml-auto flex items-center space-x-2">
              {/* Photo selection and display */}
              <img
                  src="/avatar.svg" // Path to your image in the public folder
                  className="w-10 h-10 rounded-full mr-2"
                />
              {showForm && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-lg">
   <h2 className="text-2xl font-bold mb-4">Modifier vos informations</h2>
<form onSubmit={handleSubmit}>
<div className="mb-4">
      <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Nom:</label>
        <input
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4"> 
      <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email:</label>
        <input
          type="email"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
      <label htmlFor="telephone" className="block text-gray-700 font-medium mb-1">Téléphone:</label>
        <input
          type="tel"
          value={telephone || ""}
          onChange={(e) => setTelephone(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
      <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Mot de passe :</label>
        <input
          type="password"
          value={password || ""}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>
      <div className="mb-4">
      
      <label htmlFor="addressLine" className="block text-gray-700 font-medium mb-1"> Lien:</label>
<input
  type="text"
  value={addressLine || ""} // Use addressLine state or empty string if not set
  onChange={(e) => setAddressLine(e.target.value)}
  className="border border-gray-300 rounded px-3 py-2 w-full"
/>
    </div>
      <div className="text-right">
        {/* Move the button to the right */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Modifier
        </button>
      </div>
    </form>
  </div>
)}

<p className="font-medium" onClick={handleUsernameClick} style={{ cursor: 'pointer' }}>
  {username ? username : "Loading..."}
</p>

            </div>
          </div>
        </div>
        <div className="content-container">
          {/* Content container */}
          {children}
        </div>
      </div>
    </div>
  );
};
export default Layout;
