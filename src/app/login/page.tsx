// components/Login.js
"use client";
import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate login logic
    if (username === 'admin' && password === 'password') {
      setError('');
      console.log('Login successful!');
    } else {
      setError('Invalid email or password');
      // Clear username and password fields
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Image Container */}
      <div className="flex-1 hidden md:block">
        <img src="/vert.svg" alt="Vertical Image" className="h-full w-full object-cover" />
      </div>
      {/* Login Form Container */}
      <div className="flex-1 max-w-md">
      <form onSubmit={handleSubmit} className="px-4 pt-6 pb-8 mb-4" noValidate>
          <h2 className="text-center text-xl mb-4 font-bold">Connexion</h2>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Email:
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                error && 'border-red-500'
              }`}
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Se connecter
            </button>
          </div>
          <p className="text-center mt-4">Vous n'avez pas un compte? <a href="#">S'inscrire</a></p>
        
        </form>
      </div>
    </div>
  );
};

export default Login;
