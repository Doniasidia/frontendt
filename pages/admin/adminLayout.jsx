//adminLayout
import Link from "next/link";
import Cookies from "js-cookie";

const Layout = ({ children, activePage }) => {
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
              <Link href="/admin/dashboard">
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
              <Link href="/admin/clients">
                <button
                  className={
                    activePage === "clients"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  clients
                </button>
              </Link>
              <Link href="/admin/abonnements">
                <button
                  className={
                    activePage === "abonnements"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  abonnements
                </button>
              </Link>
              <Link href="/admin/parametres">
                <button
                  className={
                    activePage === "parametres"
                      ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300"
                      : "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"
                  }
                >
                  parametres
                </button>
              </Link>
              <Link href="/admin/chat">
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
                Cookies.set("session", JSON.stringify({}));
                window.location.href = "/login";
              }}
              className="hover:bg-sky-500 hover:text-white py-2 px-12 rounded-lg transition-colors duration-300 bg-white text-gray-600 border border-gray-400 "
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
              {/* Use ml-auto to push content to the right */}
              <div className="h-10 w-10 rounded-full bg-gray-300"></div>
              <p className="font-medium">Nom d'utilisateur</p>{" "}
              {/* Replace with the user's name */}
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