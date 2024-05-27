// Profile.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CLIENTS_API } from "@/utils/apiUtil";
import Breadcrumbs from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const [client, setClient] = useState({
    username: '',
    email: '',
    telephone: '',
    addressLine : '',
    description : '',
  });

  useEffect(() => {
    const fetchClientData = async () => {
      const loggedInUserId = Cookies.get("userId");
      if (!loggedInUserId) {
        console.error("User ID is missing");
        return;
      }

      try {
        const response = await axios.get(`${CLIENTS_API}/${loggedInUserId}`);
        setClient(response.data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({
      ...prevClient,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loggedInUserId = Cookies.get("userId");
    if (!loggedInUserId) {
      console.error("User ID is missing");
      return;
    }

    try {
      const response = await axios.patch(`${CLIENTS_API}/${loggedInUserId}`, client);
      setClient(response.data);
    } catch (error) {
      console.error("Error updating client data:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier vos informations </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nom d'établissemnt</label>
          <Input
            type="text"
            name="username"
            value={client.username}
            className="w-72"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            name="email"
            value={client.email}
            className="w-72"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <Input
            type="text"
            name="telephone"
            value={client.telephone}
            className="w-72"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <Input
            type="text"
            name="lien"
            value={client.addressLine}
            className="w-72"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <Input
            type="text"
            name="description"
            value={client.description}
            className="w-72"
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit" className="mr-2">Enregistrer</Button>
      </form>
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[{ label: "Profile", href: "/client/profile" }]}
      />
      <Profile />
    </main>
  );
}
