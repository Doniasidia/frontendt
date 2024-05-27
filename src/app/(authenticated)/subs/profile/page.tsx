// Profile.tsx
"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { SUBSCRIBERS_API } from "@/utils/apiUtil";
import Breadcrumbs from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const [subscriber, setSubscriber] = useState({
    username: '',
    firstname: '',
    email: '',
    telephone: '',
  });

  useEffect(() => {
    const fetchSubscriberData = async () => {
      const loggedInUserId = Cookies.get("userId");
      if (!loggedInUserId) {
        console.error("User ID is missing");
        return;
      }

      try {
        const response = await axios.get(`${SUBSCRIBERS_API}/${loggedInUserId}`);
        setSubscriber(response.data);
      } catch (error) {
        console.error("Error fetching subscriber data:", error);
      }
    };

    fetchSubscriberData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubscriber((prevSubscriber) => ({
      ...prevSubscriber,
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
      const response = await axios.patch(`${SUBSCRIBERS_API}/${loggedInUserId}`, subscriber);
      setSubscriber(response.data);
    } catch (error) {
      console.error("Error updating subscriber data:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier vos informations </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <Input
            type="text"
            name="username"
            value={subscriber.username}
            className="w-72"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <Input
            type="text"
            name="firstname"
            value={subscriber.firstname}
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
            value={subscriber.email}
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
            value={subscriber.telephone}
            className="w-72"
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit" className="bg-sky-900 mr-2">Enregistrer</Button>
      </form>
    </div>
  );
};

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[{ label: "Mon profile", href: "/subs/profile" }]}
      />
      <Profile />
    </main>
  );
}
