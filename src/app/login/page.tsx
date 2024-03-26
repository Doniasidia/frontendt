"use client";
import axios from 'axios';
import { useState } from 'react';

const Login = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginStatus, setLoginStatus] = useState('login');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [recoveryInfo, setRecoveryInfo] = useState('');
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.preventDefault();
    try {
      // Make an HTTP POST request to your backend API for login
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password,
      });
      // If login is successful, redirect the user to the dashboard or another page
      console.log('Login successful!', response.data);
      // Redirect the user to the dashboard or another page
    } catch {
      // Login failed (without displaying a specific message)
      console.log('Login failed!');
      setLoginStatus('failed'); // Update login status to indicate failure (optional)
    }
  };

  const handleForgotPasswordClick = () => {
    setForgotPassword(true);
    setError('');
  };

  const handleRecoverySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate recovery logic
    console.log('Recovery information submitted:', recoveryInfo);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Image Container */}
      <div className="flex-1 hidden md:block h-full">
        {loginStatus === 'login' && !forgotPassword && <img src="/vert.svg" alt="Vertical Image" className="h-full w-full object-cover" />}
        {loginStatus === 'error' && !forgotPassword && <img src="/error img.svg" alt="Error Image" className="h-full w-full object-cover" />}
        {forgotPassword && <img src="/forget password.svg" alt="Forgot Password Image" className="h-full w-full object-cover" />}
      </div>
      {/* Login Form Container */}
      <div className="flex-1 max-w-md h-full flex flex-col justify-center items-center errorImg">
        {!forgotPassword && (
          <form onSubmit={handleSubmit} className="px-4 pt-6 pb-8 mb-4" noValidate>
    <h2 className={`text-center text-2xl mb-6 font-bold ${loginStatus === 'error' && 'text-red-500'}`}>
  {loginStatus === 'login' ? 'Connexion' : loginStatus === 'error' ? 'Erreur' : 'Connexion réussie'}
</h2>

            
            <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
  Email ou numéro de téléphone:
</label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  error && 'border-red-500'
                }`}
                id="email"
                type="text"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Email ou numéro de téléphone"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Mot de passe:
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                  error && 'border-red-500'
                }`}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
              />
              {loginStatus === 'error' && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-20 rounded-xl focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Se connecter
              </button>
            </div>
            {loginStatus === 'login' && (
  <p className="text-center mt-4">
    Vous n'avez pas un compte ?{' '}
    <a href="#" className="text-blue-500 hover:text-blue-700">
      S'inscrire
    </a>
  </p>
)}

            {loginStatus === 'error' && <p className="text-center mt-4"><a href="#" onClick={handleForgotPasswordClick} className="text-blue-500 hover:text-blue-700">Mot de passe oublié ?</a></p>}
          </form>
        )}
        {forgotPassword && (
          <form onSubmit={handleRecoverySubmit} className="px-4 pb-14 mb-14" noValidate>
            <h2 className="text-center text-2xl mb-14 font-bold">Mot de passe oublié</h2>
            <div className="mb-10">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recoveryInfo">
                Email ou numéro de téléphone:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="recoveryInfo"
                type="text"
                value={recoveryInfo}
                onChange={(e) => setRecoveryInfo(e.target.value)}
                placeholder="Email ou num de téléphone"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-xl focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Envoyer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;