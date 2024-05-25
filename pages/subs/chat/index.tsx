// subscriber.chat
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import Layout from "../subsLayout";
import {
  CHAT_API,
  CHAT_SOCKET_API,
  CLIENTS_API,
  SUBSCRIBERS_API,
} from "@/utils/apiUtil";

interface Client {
  id: number;
  username: string;
}

interface Message {
  senderId: string;
  recipientId: string;
  content: string;
  senderName?: string;
  senderType?: string;
  recipientType?: string;
}

const socket = io(`${CHAT_SOCKET_API}`, {
  autoConnect: true,
});

const SubscriberChat = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);

  useEffect(() => {
    const userIdString = Cookies.get("userId");
    const userId = userIdString ? parseInt(userIdString) : null;

    if (userId) {
      socket?.on("recMessage", (message: Message) => {
        setReceivedMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket?.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const cookie = Cookies.get("session") || "{}";
        const session = JSON.parse(cookie);
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const response = await axios.get(CLIENTS_API, { headers });
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const cookie = Cookies.get("session") || "{}";
        const session = JSON.parse(cookie);
        const headers = { Authorization: `Bearer ${session.access_token}` };
        const response = await axios.get(CHAT_API, { headers });
        setReceivedMessages(
          response.data.map((message: any) => {
            return {
              senderId: message.id,
              recipientId: message.id,
              content: message.text,
              senderName: "Admin",
              senderType: "admin",
              recipientType: "subscriber",
            };
          })
        );
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleSendMessage = () => {
    if (!selectedClient || !message || !socket) return;

    const userIdString = Cookies.get("userId");
    const userId = userIdString ? parseInt(userIdString) : null;

    const newMessage: Message = {
      senderId: String(userId!),
      recipientId: String(selectedClient.id),
      content: message,
      senderType: "subscriber",
      recipientType: "client",
    };

    setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);

    // Emit the message to the server
    socket.emit("sendMessage", { email: "email@email.com", text: message });
    setMessage("");
  };

  const filteredClients = clients.filter((client) =>
    client.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout activePage="chat">
      <div className="flex h-screen pb-20">
        <div className="w-72 border-t border-l border-r border-b border-gray-300 flex flex-col order-2">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border-gray-300 outline-none"
          />
          <div className="flex-1 overflow-y-auto">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`p-2 flex items-center cursor-pointer hover:bg-gray-200 ${
                  selectedClient?.id === client.id
                    ? "bg-gray-100 font-bold"
                    : ""
                }`}
                onClick={() => handleSelectClient(client)}
              >
                <img
                  src="/utilisateur.png"
                  alt={client.username}
                  className="w-10 h-10 rounded-full mr-2"
                />
                {client.username}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedClient && (
              <div>
                {receivedMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 flex items-center ${
                      msg.senderType === "subscriber"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="ml-2">
                      {msg.senderName}: {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-300 flex items-center">
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 p-2 border-none outline-none resize-none"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded flex-shrink-0"
              disabled={!selectedClient || !message}
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriberChat;
