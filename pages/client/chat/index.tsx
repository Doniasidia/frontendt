// client.chat
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import { CLIENTS_API, SUBSCRIBERS_API } from "@/utils/apiUtil";
import Layout from "../clientLayout";

interface Subscriber {
  id: number;
  username: string;
}

interface Message {
  senderId: number;
  recipientId: number;
  content: string;
  senderName?: string;
  senderType?: string;
  recipientType?: string;
}

const ClientChat = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedSubscriber, setSelectedSubscriber] =
    useState<Subscriber | null>(null);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const userIdString = Cookies.get("userId");
    const userId = userIdString ? parseInt(userIdString) : null;

    if (userId) {
      const newSocket = io("http://localhost:5000", {
        query: { role: "client", userId },
      });

      newSocket.on("chat-message", (message: Message) => {
        setReceivedMessages((prevMessages) => [...prevMessages, message]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const cookie = Cookies.get("session") || "{}";
        const session = JSON.parse(cookie);
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const response = await axios.get(SUBSCRIBERS_API, { headers });
        setSubscribers(response.data);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };
    fetchSubscribers();
  }, []);

  const handleSendMessage = () => {
    if (!selectedSubscriber || !message || !socket) return;

    const userIdString = Cookies.get("userId");
    const userId = userIdString ? parseInt(userIdString) : null;

    const username = Cookies.get("username");

    const newMessage: Message = {
      senderId: userId!,
      recipientId: selectedSubscriber.id,
      content: message,
      senderName: username,
      senderType: "client",
      recipientType: "subscriber",
    };

    // Emit the message to the server
    socket.emit("chat-message", newMessage);

    // Display the client's message in the chat window
    setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);

    setMessage("");
  };

  const handleSelectSubscriber = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
  };
  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout activePage="chat">
         {" "}
      <div className="flex h-screen pb-20">
        <div className="w-72 border-t border-l border-r border-b border-gray-300 flex flex-col order-2">
                 {" "}
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border-gray-300 outline-none"
          />
                 {" "}
          <div className="flex-1 overflow-y-auto">
            {filteredSubscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className={`p-2 flex items-center cursor-pointer hover:bg-gray-200 ${
                  selectedSubscriber?.id === subscriber.id
                    ? "bg-gray-100 font-bold"
                    : ""
                }`} // Add dynamic class based on selectedSubscriber
                onClick={() => handleSelectSubscriber(subscriber)}
              >
                <img
                  src="/avatar.svg"
                  alt={subscriber.username}
                  className="w-10 h-10 rounded-full mr-2"
                />
                {subscriber.username}
              </div>
            ))}
                   {" "}
          </div>
               {" "}
        </div>
             {" "}
        <div className="flex-1 flex flex-col">
                 {" "}
          <div className="flex-1 p-4 overflow-y-auto">
                     {" "}
            {selectedSubscriber && (
              <div>
                {receivedMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 flex items-center ${
                      msg.senderType === "client"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="ml-2">
                      {msg.senderName}: {msg.content}
                    </div>
                  </div>
                ))}
                           {" "}
              </div>
            )}
                   {" "}
          </div>
                 {" "}
          <div className="p-2 border-t border-gray-300 flex items-center">
                     {" "}
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 p-2 border-none outline-none resize-none"
            />
                     {" "}
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded flex-shrink-0"
              disabled={!selectedSubscriber || !message}
            >
                          Envoyer          {" "}
            </button>
                   {" "}
          </div>
               {" "}
        </div>
           {" "}
      </div>
    </Layout>
  );
};

export default ClientChat;
