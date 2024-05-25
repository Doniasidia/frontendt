//subsLayout
import Link from 'next/link';
import Cookies from "js-cookie";
import { SUBSCRIBERS_API } from "@/utils/apiUtil";
import axios from "axios";
import { useState , useEffect } from "react";

const Layout = ({ children, activePage }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUserId = Cookies.get("userId");
      console.log("Logged In User ID:", loggedInUserId);
      if (!loggedInUserId) {
        return;
      }
  
      try {
        const response = await axios.get(`${SUBSCRIBERS_API}/${loggedInUserId}`);
        const userData = response.data; 
        const { username,firstname, email, telephone, password } = userData;
        setUsername(username);
        setFirstname(firstname);
        setEmail(email);
        setTelephone(telephone);
        setPassword(password);
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
      const response = await axios.patch(`${SUBSCRIBERS_API}/${loggedInUserId}`, {
        username,
        firstname,
        email,
        telephone,
        password,
      });
      console.log("User data updated:", response.data);
  
      // Update the state with the new data (optional)
      setUsername(response.data.username);
      setFirstname(response.data.firstname);
      setEmail(response.data.email);
      setTelephone(response.data.telephone);
  
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
                            
                            <Link href="/subs/abonnement">
                                <button className={activePage === 'abonnement' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>Abonnements</button>
                            </Link>
                            <Link href="/subs/paiement">
                                <button className={activePage === 'paiement' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>Paiement</button>
                            </Link>
                            <Link href="/subs/abonner">
                                <button className={activePage === 'abonner' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>Liste des clients</button>
                            </Link>
                            <Link href="/subs/chat">
                                <button className={activePage === 'chat' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>chat</button>
                            </Link>
                           
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="border-t border-gray-300 p-3 w-60"></div>
                    </div>
                    <div className="flex justify-center items-center mb-4"> {/* Centered Logout button */}
                    <div className="flex justify-center items-center mb-4">
            {/* Centered Logout button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                Cookies.set("session", JSON.stringify({}));
                window.location.href = "/login";
              }}
              className="hover:bg-gray-300 hover:text-white py-2 px-12 rounded-lg transition-colors duration-300 bg-white text-gray-600 border border-gray-400 "
            >
              Déconnecter
            </button>
          </div>
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
                  src="/utilisateur.png" // Path to your image in the public folder
                  className="w-10 h-10 rounded-full mr-2"
                />
          {showForm && (
  <div className="fixedd inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
    <div className="bg-white p-8 rounded-xl shadow-lg z-60">
      <h2 className="text-2xl font-bold mb-4">Modifier vos informations</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur :</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">Prénom :</label>
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone :</label>
          <input
            type="tel"
            id="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-cyan-700 text-white py-2 px-4 rounded-lg hover:bg-cyan-900 transition-colors duration-300"
          >
            Modifier
          </button>
        </div>
      </form>
    </div>
  </div>
)}


              <p className="font-medium" onClick={handleUsernameClick}>
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
