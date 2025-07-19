

'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Home, MoreHorizontal, XCircle, CheckCircle, MessageSquare, Send, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { propertyService, bookingService } from "@/lib/data";
import type { Booking, Property, Host } from "@/lib/types";

// Mock Data
const initialUsers = [
    { id: 'U001', name: 'John Doe', email: 'john.d@example.com', joinDate: '2023-01-15', status: 'Active', avatar: 'https://i.pravatar.cc/40?u=U001', role: 'Guest' },
    { id: 'U002', name: 'Jane Smith', email: 'jane.s@example.com', joinDate: '2023-02-20', status: 'Active', avatar: 'https://i.pravatar.cc/40?u=U002', role: 'Guest' },
    { id: 'U003', name: 'Mike Brown', email: 'mike.b@example.com', joinDate: '2023-03-10', status: 'Suspended', avatar: 'https://i.pravatar.cc/40?u=U003', role: 'Guest' },
    { id: 'H001', name: 'Sarah', email: 'sarah.h@example.com', joinDate: '2022-11-05', status: 'Active', avatar: 'https://i.pravatar.cc/40?u=H001', role: 'Host' },
    { id: 'H002', name: 'Mike & Amy', email: 'mike.amy@example.com', joinDate: '2022-10-01', status: 'Active', avatar: 'https://i.pravatar.cc/40?u=H002', role: 'Host' },
    { id: 'H003', name: 'David', email: 'david.r@example.com', joinDate: '2023-01-01', status: 'Active', avatar: 'https://i.pravatar.cc/40?u=H003', role: 'Host' },
    { id: 'H004', name: 'Kenji', email: 'kenji.t@example.com', joinDate: '2021-05-15', status: 'Active', avatar: 'https://i.pravatar.cc/40?u=H004', role: 'Host' },
];

const initialMessages = {
    'U001': [
        { from: 'guest', text: 'Hi, I have a question about my recent booking.', time: '10:30 AM' },
        { from: 'admin', text: 'Hello John, I\'m here to help. What is your question?', time: '10:31 AM' },
        { from: 'guest', text: 'I was charged twice for the service fee. Can you check?', time: '10:32 AM' },
    ],
    'H001': [
        { from: 'user', text: 'I have a guest who left a bad review, but they broke my house rules. Can I contest it?', time: 'Yesterday' },
        { from: 'admin', text: 'Hi Sarah, thank you for reaching out. Please provide the booking ID and details of the rule violation, and we will investigate.', time: 'Yesterday' },
    ],
    'U002': [
        { from: 'user', text: 'Can I change the dates of my upcoming trip?', time: '2 days ago' },
    ],
    'H002': [],
    'H003': [],
    'H004': [],
};

type Conversation = {
    userId: string,
    userName: string,
    userAvatar: string,
    userRole: string,
    lastMessage: string;
    lastMessageTime: string;
};

const initialConversations: Conversation[] = [
    { userId: 'U001', userName: 'John Doe', userAvatar: 'https://i.pravatar.cc/40?u=U001', userRole: 'Guest', lastMessage: 'I was charged twice...', lastMessageTime: '10:32 AM' },
    { userId: 'H001', userName: 'Sarah', userAvatar: 'https://i.pravatar.cc/40?u=H001', userRole: 'Host', lastMessage: 'Hi Sarah, thank you for...', lastMessageTime: 'Yesterday' },
    { userId: 'U002', userName: 'Jane Smith', userAvatar: 'https://i.pravatar.cc/40?u=U002', userRole: 'Guest', lastMessage: 'Can I change the dates...', lastMessageTime: '2 days ago' },
    { userId: 'H002', userName: 'Mike & Amy', userAvatar: 'https://i.pravatar.cc/40?u=H002', userRole: 'Host', lastMessage: 'No messages yet.', lastMessageTime: '' },
    { userId: 'H003', userName: 'David', userAvatar: 'https://i.pravatar.cc/40?u=H003', userRole: 'Host', lastMessage: 'No messages yet.', lastMessageTime: '' },
    { userId: 'H004', userName: 'Kenji', userAvatar: 'https://i.pravatar.cc/40?u=H004', userRole: 'Host', lastMessage: 'No messages yet.', lastMessageTime: '' },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
}


export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [users, setUsers] = useState(initialUsers);
    const [listings, setListings] = useState<Property[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [messages, setMessages] = useState(initialMessages);
    const [conversations, setConversations] = useState(initialConversations);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        setBookings(bookingService.getBookings());
        setListings(propertyService.getProperties());
    }, []);

    const handleApproveBooking = (bookingId: string) => {
        bookingService.updateBookingStatus(bookingId, 'Confirmed');
        setBookings([...bookingService.getBookings()]); // Force re-render with updated list
    };
    
    const handleApproveListing = (listingId: string) => {
        propertyService.updatePropertyStatus(listingId, 'Published');
        setListings([...propertyService.getProperties()]);
    };

    const handleDisableListing = (listingId: string) => {
        propertyService.updatePropertyStatus(listingId, 'Disabled');
        setListings([...propertyService.getProperties()]);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const newMsg = {
            from: 'admin',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const userId = selectedConversation.userId as keyof typeof messages;
        
        // Update the master messages object
        const updatedMessagesForUser = [...(messages[userId] || []), newMsg];
        const updatedMessages = {
            ...messages,
            [userId]: updatedMessagesForUser
        };
        setMessages(updatedMessages);

        // Update the conversations list for the sidebar
        const updatedConversations = conversations.map(convo => {
            if (convo.userId === selectedConversation.userId) {
                return { ...convo, lastMessage: newMsg.text, lastMessageTime: newMsg.time };
            }
            return convo;
        });

        // Sort conversations to bring the most recent one to the top
        const sortedConversations = updatedConversations.sort((a,b) => {
            // Simple time sorting, may need improvement for different date formats
             if (a.lastMessageTime.includes('AM') || a.lastMessageTime.includes('PM')) {
                if (b.lastMessageTime.includes('AM') || b.lastMessageTime.includes('PM')) {
                    return new Date('1970/01/01 ' + b.lastMessageTime).getTime() - new Date('1970/01/01 ' + a.lastMessageTime).getTime();
                }
                return -1;
            }
            return 1;
        });

        setConversations(sortedConversations);
        
        setNewMessage('');
    };

    const handleMessageHost = (hostName: string) => {
        const hostUser = users.find(u => u.name === hostName && u.role === 'Host');
        if (hostUser) {
            const hostConversation = conversations.find(c => c.userId === hostUser.id);
            if (hostConversation) {
                setSelectedConversation(hostConversation);
                setActiveTab("messages");
            }
        }
    };
    
    const getPropertyTitle = (propertyId: string) => {
        return listings.find(p => p.id === propertyId)?.title || 'Unknown Property';
    };

    const totalRevenue = bookings.filter(b => b.status === 'Completed' || b.status === 'Confirmed').reduce((acc, b) => acc + b.amount, 0);
    const totalCommission = totalRevenue * 0.10;

    return (
        <div className="container mx-auto max-w-7xl py-12 px-4">
            <Card className="mb-8 border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline">Admin Dashboard</CardTitle>
                    <CardDescription>Oversee and manage all platform activities.</CardDescription>
                </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="listings">Listings</TabsTrigger>
                    <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-6 space-y-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)} Rwfs</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(totalCommission)} Rwfs</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{users.length}</div>
                                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                                <Home className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{listings.filter(l => l.status === 'Published').length}</div>
                                <p className="text-xs text-muted-foreground">+19% from last month</p>
                            </CardContent>
                        </Card>
                    </div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Pending Bookings</CardTitle>
                            <CardDescription>Bookings that require admin confirmation.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Booking ID</TableHead>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Guest</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.filter(b => b.status === 'Pending Confirmation').map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.id}</TableCell>
                                            <TableCell>{getPropertyTitle(booking.propertyId)}</TableCell>
                                            <TableCell>{booking.guest.name}</TableCell>
                                            <TableCell>{booking.dates.from.toLocaleDateString()} - {booking.dates.to.toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleApproveBooking(booking.id)}><CheckCircle className="mr-2 h-4 w-4 text-green-600" />Approve</Button>
                                                <Button variant="ghost" size="icon" className="text-red-600"><XCircle className="h-4 w-4"/></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {bookings.filter(b => b.status === 'Pending Confirmation').length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">No pending bookings.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Listings</CardTitle>
                            <CardDescription>New listings that require admin approval to go live.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Listing ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Host</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listings.filter(l => l.status === 'Pending Review').map((listing) => (
                                        <TableRow key={listing.id}>
                                            <TableCell className="font-medium">{listing.id}</TableCell>
                                            <TableCell>{listing.title}</TableCell>
                                            <TableCell>{listing.host.name}</TableCell>
                                            <TableCell>{listing.location}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleApproveListing(listing.id)}>
                                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />Approve
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-600"><XCircle className="h-4 w-4"/></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {listings.filter(l => l.status === 'Pending Review').length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">No pending listings.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View, manage, and verify users on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>{user.joinDate}</TableCell>
                                            <TableCell><Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem>Verify User</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Suspend User</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="listings" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Listings Management</CardTitle>
                            <CardDescription>Manage all properties on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Listing ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Host</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {listings.map((listing) => (
                                        <TableRow key={listing.id}>
                                            <TableCell className="font-medium">{listing.id}</TableCell>
                                            <TableCell>{listing.title}</TableCell>
                                            <TableCell>{listing.host.name}</TableCell>
                                            <TableCell>{listing.location}</TableCell>
                                            <TableCell>
                                                <Badge variant={listing.status === 'Published' ? 'default' : (listing.status === 'Pending Review' ? 'secondary' : 'destructive')}>
                                                    {listing.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Listing</DropdownMenuItem>
                                                        {listing.status === 'Pending Review' && <DropdownMenuItem onClick={() => handleApproveListing(listing.id)}>Approve</DropdownMenuItem>}
                                                        <DropdownMenuItem onClick={() => handleMessageHost(listing.host.name)}>Message Host</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDisableListing(listing.id)}>Disable Listing</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                 <TabsContent value="bookings" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Bookings</CardTitle>
                            <CardDescription>A log of all transactions on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Booking ID</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Dates</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount (Rwfs)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell className="font-medium">{booking.id}</TableCell>
                                            <TableCell>{booking.guest.name}</TableCell>
                                            <TableCell>{getPropertyTitle(booking.propertyId)}</TableCell>
                                            <TableCell>{booking.dates.from.toLocaleDateString()} - {booking.dates.to.toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                 <Badge variant={booking.status === 'Completed' ? 'default' : (booking.status === 'Confirmed' ? 'secondary' : 'destructive')}>
                                                    {booking.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{formatCurrency(booking.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="messages" className="mt-6">
                    <Card>
                        <div className="grid grid-cols-12 h-full">
                            <div className="col-span-4 border-r">
                                <CardHeader>
                                    <CardTitle>Conversations</CardTitle>
                                </CardHeader>
                                <ScrollArea className="h-[550px] px-2">
                                    <div className="space-y-1">
                                        {conversations.map(convo => (
                                             <button 
                                                key={convo.userId}
                                                onClick={() => setSelectedConversation(convo)}
                                                className={cn("w-full text-left p-3 rounded-lg hover:bg-muted", selectedConversation?.userId === convo.userId && "bg-muted")}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={convo.userAvatar} />
                                                        <AvatarFallback>{convo.userName.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 overflow-hidden">
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-semibold truncate">{convo.userName}</p>
                                                            <p className="text-xs text-muted-foreground shrink-0">{convo.lastMessageTime}</p>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="col-span-8 flex flex-col h-full">
                                {selectedConversation ? (
                                    <>
                                        <div className="p-4 border-b flex items-center gap-3">
                                             <Avatar className="h-10 w-10">
                                                <AvatarImage src={selectedConversation.userAvatar} />
                                                <AvatarFallback>{selectedConversation.userName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold">{selectedConversation.userName}</p>
                                                <p className="text-sm text-muted-foreground">{selectedConversation.userRole}</p>
                                            </div>
                                        </div>
                                        <ScrollArea className="flex-1 p-6 h-[450px]">
                                            <div className="space-y-4">
                                               {(messages[selectedConversation.userId as keyof typeof messages] || []).map((msg, index) => (
                                                    <div key={index} className={cn("flex", msg.from === 'admin' ? 'justify-end' : 'justify-start')}>
                                                        <div className={cn("p-3 rounded-lg max-w-xs", msg.from === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                                            <p>{msg.text}</p>
                                                            <p className="text-xs opacity-70 mt-1 text-right">{msg.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                        <div className="p-4 border-t bg-background">
                                            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                                                <Input 
                                                    id="admin-message"
                                                    name="admin-message"
                                                    placeholder="Type your message..." 
                                                    className="pr-12"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                />
                                                <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8">
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        <MessageSquare className="h-16 w-16" />
                                        <p className="mt-4 text-lg">Select a conversation to start messaging</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
