// components/card.tsx
"use client"
import React from 'react';

const CardComponent = () => {
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "").slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    e.target.value = formattedValue;
    const cardNumberElement = document.getElementById("card-number");
    if (cardNumberElement) {
      cardNumberElement.textContent = formattedValue;
    }
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, "").slice(0, 4);
    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    e.target.value = formattedValue;
    const cardExpiryElement = document.getElementById("card-expiry");
    if (cardExpiryElement) {
      cardExpiryElement.textContent = formattedValue;
    }
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cardNameElement = document.getElementById("card-name");
    if (cardNameElement) {
      cardNameElement.textContent = e.target.value;
    }
  };

  return (
    <>
      <div className="relative h-[240px] w-[380px] bg-gray-900 text-white rounded-2xl overflow-hidden shadow-lg mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-4">
            <div className="text-lg font-semibold" id="card-number">0000 0000 0000 0000</div>
            <div className="flex justify-between">
              <div className="text-sm">
                <div id="card-name">Cardholder</div>
                <div className="text-xs text-gray-400">Cardholder</div>
              </div>
              <div className="text-sm">
                <div id="card-expiry">MM/YY</div>
                <div className="text-xs text-gray-400">Expires</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="space-y-2">
          <label htmlFor="card-number-input" className="block text-sm font-medium text-gray-700">Card Number</label>
          <input
            id="card-number-input"
            type="text"
            maxLength={19}
            placeholder="0000 0000 0000 0000"
            className="block w-full border border-gray-300 rounded-md px-4 py-2 font-mono focus:outline-none focus:ring focus:ring-blue-400"
            onChange={handleCardNumberChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="card-expiry-input" className="block text-sm font-medium text-gray-700">Expiration Date</label>
            <input
              id="card-expiry-input"
              type="text"
              maxLength={5}
              placeholder="MM/YY"
              className="block w-full border border-gray-300 rounded-md px-4 py-2 font-mono focus:outline-none focus:ring focus:ring-blue-400"
              onChange={handleCardExpiryChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700">CVC</label>
            <input
              id="card-cvc"
              type="text"
              maxLength={3}
              placeholder="123"
              className="block w-full border border-gray-300 rounded-md px-4 py-2 font-mono focus:outline-none focus:ring focus:ring-blue-400"
              onChange={(e) => {
                const value = e.target.value.slice(0, 3);
                e.target.value = value;
              }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="card-name-input" className="block text-sm font-medium text-gray-700">Name on Card</label>
          <input
            id="card-name-input"
            type="text"
            placeholder="John Doe"
            className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
            onChange={handleCardNameChange}
          />
        </div>
      </div>
    </>
  );
};

export default CardComponent;
