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

interface Subscriber {
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
    timestamp: string;
}

export default function Page() {
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
    const [messagesBySubscriber, setMessagesBySubscriber] = useState<{ [key: number]: Message[] }>({});
    const [socket, setSocket] = useState<Socket | null>(null);
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        const userIdString = Cookies.get('userId');
        const userId = userIdString ? parseInt(userIdString) : null;

        if (userId) {
            const newSocket = io('http://localhost:5000', {
                query: { role: 'client', userId },
            });
            newSocket.on('chat-message', (message: Message) => {
                setMessagesBySubscriber((prevMessages) => {
                    const recipientId = message.senderId === userId ? message.recipientId : message.senderId;
                    return {
                        ...prevMessages,
                        [recipientId]: [...(prevMessages[recipientId] || []), message],
                    };
                });
            });

            newSocket.on('past-messages', (messages: Message[]) => {
                setMessagesBySubscriber((prevMessages) => {
                    const messagesBySubscriber = { ...prevMessages };
                    messages.forEach((message) => {
                        const recipientId = message.senderId === userId ? message.recipientId : message.senderId;
                        if (!messagesBySubscriber[recipientId]) {
                            messagesBySubscriber[recipientId] = [];
                        }
                        messagesBySubscriber[recipientId].push(message);
                    });
                    return messagesBySubscriber;
                });
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
                const cookie = Cookies.get('session') || '{}';
                const session = JSON.parse(cookie);
                const headers = { Authorization: `Bearer ${session.access_token}` };
                const response = await axios.get(SUBSCRIBERS_API, { headers });
                setSubscribers(response.data);
            } catch (error) {
                console.error('Error fetching subscribers:', error);
            }
        };
        fetchSubscribers();
        const usernameFromCookie = Cookies.get('username');
        setUsername(usernameFromCookie || '');
    }, []);

    const handleSendMessage = () => {
        if (!selectedSubscriber || !message || !socket) return;

        const userIdString = Cookies.get('userId');
        const userId = userIdString ? parseInt(userIdString) : null;
        const username = Cookies.get('username');

        const newMessage: Message = {
            senderId: userId!,
            recipientId: selectedSubscriber.id,
            content: message,
            senderName: username,
            senderType: 'client',
            recipientType: 'subscriber',
            timestamp: new Date().toISOString(),
        };

        socket.emit('chat-message', newMessage);
        setMessagesBySubscriber((prevMessages) => ({
            ...prevMessages,
            [selectedSubscriber.id]: [...(prevMessages[selectedSubscriber.id] || []), newMessage],
        }));
        setMessage('');
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleSelectSubscriber = (subscriber: Subscriber) => {
        setSelectedSubscriber(subscriber);
    };

    const filteredSubscribers = subscribers.filter((subscriber) =>
        subscriber.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentMessages = selectedSubscriber ? messagesBySubscriber[selectedSubscriber.id] || [] : [];

    return (
        <main className="min-h-screen">
            <div className="fixed w-full top-0 py-[30px] bg-white border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                        <AvatarImage alt={username} src="/placeholder-user.jpg" />
                        <AvatarFallback>{username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-medium">{username}</div>
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
                        {!selectedSubscriber ? (
                            <div className="text-gray-500 text-center mt-40">
                                Sélectionnez un abonné pour commencer à discuter
                            </div>
                        ) : (
                            currentMessages.map((msg: Message, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-4 ${msg.senderType === 'client' ? 'justify-end' : ''}`}
                                >
                                    <div className="grid gap-1 text-sm">
                                        <div className={`font-medium ${msg.senderType === 'client' ? 'text-right' : ''}`}>
                                            {msg.senderType === 'client' ? 'Moi' : msg.senderName}
                                        </div>
                                        <div className={`p-3 rounded-lg max-w-[100%] ${msg.senderType === 'client' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                            {msg.content}
                                        </div>
                                        <div className={`text-xs text-gray-500 ${msg.senderType === 'client' ? 'text-right' : ''}`}>
                                            {formatTimestamp(msg.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="fixed right-0 top-0 min-h-screen w-[300px] bg-gray-100 hidden md:flex flex-col gap-4 p-4 shrink-0">
                <div className="sticky top-0 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Abonnés</h2>
                    <Button size="icon" variant="ghost">
                        <PlusIcon className="w-5 h-5" />
                        <span className="sr-only">Add new subscriber</span>
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
                    {filteredSubscribers.map((subscriber) => (
                        <Button
                            key={subscriber.id}
                            className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-200 rounded-md ${selectedSubscriber?.id === subscriber.id ? 'bg-blue-100 font-bold' : ''}`}
                            variant="ghost"
                            onClick={() => handleSelectSubscriber(subscriber)}
                        >
                            <Avatar className="w-8 h-8">
                                <AvatarImage alt={subscriber.username} src="/placeholder-user.jpg" />
                                <AvatarFallback>{subscriber.username[0]}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium w-full flex">{subscriber.username}</div>
                        </Button>
                    ))}
                </div>
            </div>
            {selectedSubscriber && (
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
                            disabled={!selectedSubscriber || !message}
                        >
                            <ArrowUpIcon className="w-4 h-4" />
                            <span className="sr-only">Envoyer</span>
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
}

