//index.tsx
import React from 'react';

const Publicite = () => {
  return (
    <div className="overflow-hidden bg-gradient-to-r  from-cyan-400 to-sky-500  lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center h-screen relative">
        {/* Background Image */}
        <img
          src="/publicite.jpg" 
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50 z-0"
        />

        <div className="relative z-10 text-center space-y-8">
          <h1 className="text-5xl font-extrabold text-white sm:text-7xl lg:text-8xl leading-tight">
            Gérez <span className="text-indigo-200">vos</span> abonnements <br />
            en toute simplicité
          </h1>
          <p className="text-xl text-white lg:text-2xl text-center px-16 ">
            Oubliez la gestion fastidieuse des abonnements. Notre plateforme élégante et intuitive vous aide à simplifier votre vie et celle de vos abonnés.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <p className="text-lg text-white">
                Pour les propriétaires d'établissements:
              </p>
              <a
                href="tel:1234567890"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-900 to-sky-700  text-white font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Contactez l'administrateur
                <svg
                  className="ml-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 5l6-6 6 6 2-2V13l-6 6-6-6z" />
                </svg>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-lg text-white">
                Pour les abonnés:
              </p>
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-900 to-sky-700  text-white font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Créer un compte
                <svg
                  className="ml-4 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center mt-8">
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-4 bg-white text-cyan-700 font-bold text-lg rounded-full shadow-lg hover:bg-cyan-800 hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
              >
                Découvrez nos établissements
                <svg
                  className="ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM3 10a7 7 0 1114 0 7 7 0 01-14 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <p className="text-white text-sm mt-2">
                Découvrez une variété d'établissements où vous pouvez vous abonner pour profiter de nos services.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Publicite;
  