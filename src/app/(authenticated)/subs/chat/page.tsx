"use client";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, MoveHorizontalIcon, PlusIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { CLIENTS_API, SUBSCRIBERS_API } from "@/utils/apiUtil";

interface Client {
    id: number;
    username: string;
}

interface Message {
    senderId: number;
    recipientId: number;
    content: string;
    senderName?: string;
    senderType: string;
    recipientType: string;
}

export default function Page() {
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [username, setUsername] = useState<string>('');


    useEffect(() => {
        const userIdString = Cookies.get('userId');
        
        const userId = userIdString ? parseInt(userIdString) : null;

        if (userId) {
            const newSocket = io('http://localhost:5000', {
                query: { role: 'subscriber', userId },
            });

            newSocket.on('chat-message', (message: Message) => {
                setReceivedMessages((prevMessages) => [...prevMessages, message]);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, []);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const cookie = Cookies.get('session') || '{}';
                const session = JSON.parse(cookie);
                const headers = { Authorization: `Bearer ${session.access_token}` };
                const response = await axios.get(CLIENTS_API, { headers });
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
        const usernameFromCookie = Cookies.get('username');
        setUsername(usernameFromCookie || '');
    }, []);

    const handleSendMessage = () => {
        if (!selectedClient || !message || !socket) return;

        const userIdString = Cookies.get('userId');
        const userId = userIdString ? parseInt(userIdString) : null;
        const username = Cookies.get('username');

        const newMessage: Message = {
            senderId: userId!,
            recipientId: selectedClient.id,
            content: message,
            senderName: username,
            senderType: 'subscriber',
            recipientType: 'client',
        };

        socket.emit('chat-message', newMessage);
        setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');
    };

    const handleSelectClient = (client: Client) => {
        setSelectedClient(client);
    };

    const filteredClients = clients.filter((client) =>
        client.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="min-h-screen">
        <div className="fixed w-full top-0 py-[30px] bg-white border-b border-gray-200">
            <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                    <AvatarImage alt={username} src="/placeholder-user.jpg" /> {/* Use the dynamically retrieved username */}
                    <AvatarFallback>{username[0]}</AvatarFallback> {/* Use the dynamically retrieved username */}
                </Avatar>
                <div className="flex-1">
                    <div className="font-medium">{username}</div> {/* Use the dynamically retrieved username */}
                    <div className="text-sm text-gray-500">En ligne</div>
                </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoveHorizontalIcon className="w-5 h-5" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Block User</DropdownMenuItem>
                            <DropdownMenuItem>Report Abuse</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="flex flex-col pt-16 pb-36 max-w-2xl">
                <div className="flex-1 overflow-auto p-4">
                    <div className="grid gap-4">
                        {receivedMessages.map((msg: Message, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-4 ${msg.senderType === 'subscriber' ? 'justify-end' : ''}`}
                            >
                                <div className="grid gap-1 text-sm">
                                    <div className={`font-medium ${msg.senderType === 'subscriber' ? 'text-right' : ''}`}>
                                        {msg.senderType === 'subscriber' ? 'You' : msg.senderName}
                                    </div>
                                    <div className={`p-3 rounded-lg max-w-[100%] ${msg.senderType === 'subscriber' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="fixed right-0 top-0 min-h-screen w-[300px] bg-gray-100 hidden md:flex flex-col gap-4 p-4 shrink-0">
                <div className="sticky top-0 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Clients</h2>
                    <Button size="icon" variant="ghost">
                        <PlusIcon className="w-5 h-5" />
                        <span className="sr-only">Add new client</span>
                    </Button>
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border-gray-300 rounded-lg outline-none"
                />
                <div className="flex-1 overflow-y-auto">
                    {filteredClients.map((client) => (
                        <Button
                            key={client.id}
                            className={`flex items-center gap-3 px-8 py-2 hover:bg-gray-200 rounded-md ${selectedClient?.id === client.id ? 'bg-blue-100 font-bold' : ''}`}
                            variant="ghost"
                            onClick={() => handleSelectClient(client)}
                        >
                            <Avatar className="w-8 h-8">
                                <AvatarImage alt={client.username} src="/placeholder-user.jpg" />
                                <AvatarFallback>{client.username[0]}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium w-full flex">{client.username}</div>
                        </Button>
                    ))}
                </div>
            </div>
            {selectedClient && (
                <div className="fixed bottom-0 pb-12 max-w-2xl w-full bg-white p-4 border-t border-gray-200">
                    <div className="relative">
                        <Textarea
                            className="min-h-[48px] rounded-2xl resize-none p-4 border border-gray-200 shadow-sm pr-16"
                            placeholder="Ecrire votre message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            className="absolute top-3 right-3 w-8 h-8"
                            size="icon"
                            type="submit"
                            onClick={handleSendMessage}
                            disabled={!selectedClient || !message}
                        >
                            <ArrowUpIcon className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
}
