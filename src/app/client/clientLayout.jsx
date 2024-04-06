// clientlayout.jsx
const Layout = ({ children , activePage}) => {
    return (
        <div className="flex h-screen bg-sky-50 p-4"> {/* Main container */}
            <div className="sidebar bg-white w-41 text-white shadow-lg rounded-xl rounded-tr-none"> {/* Sidebar container */}
                <div className="flex flex-col h-full justify-between"> {/* Sidebar content */}
                    {/* Navigation links */}
                    <div className="flex items-center justify-center py-4">
                        <span className="text-2xl font-bold logo-color">USMS</span>
                    </div>
                    <div className="h-4/5">
                    <div className="border-t-2 border-cyan-400 p-4"></div>
                    <div className="flex flex-col items-center space-y-2 px-4">
                    <a href="#" className={activePage === 'dashboard' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>Tableau de bord</a>                       
                    <a href="#" className={activePage === 'Abonnés' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>Abonnés</a>
                    <a href="#" className={activePage === 'Plans' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>Plans d'abonnements</a>
                    <a href="#" className={activePage === 'abonnements' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>Abonnements</a>
                    <a href="#" className={activePage === 'parametres' ? "navBarButton-bgcolor text-white py-2 px-4 rounded transition-colors duration-300": "navBarButton-hover-bgcolor hover:text-white py-2 px-4 rounded transition-colors duration-300 bg-white text-gray-800"}>paramètres</a>

                    </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="border-t border-gray-400 p-3 w-60"></div>
                    </div>
                    <div className="flex justify-center items-center mb-4"> {/* Centered Logout button */}
                        <a href="#" className="hover:bg-sky-500 hover:text-white py-2 px-12 rounded-lg transition-colors duration-300 bg-white text-gray-600 border border-gray-400 "> Déconnecter</a>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-grow ml-auto"> {/* Content and sidebar container */}
                <div className="bg-white flex items-center justify-between px-4 py-2 text-gray-800 h-16 rounded-xl rounded-l-none"> {/* Top bar */}
                    <div className="flex items-center space-x-4 ml-auto"> {/* User image and name */}
                        <div className="ml-auto flex items-center space-x-2"> {/* Use ml-auto to push content to the right */}
                            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                            <p className="font-medium">Nom d'utilisateur</p> {/* Replace with the user's name */}
                        </div>
                    </div>
                </div>
                <div className="content-container"> {/* Content container */}
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;
