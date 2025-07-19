
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageSquare, Send, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { propertyService, bookingService, messageService } from "@/lib/data";
import { PropertyCard } from '@/components/property-card';
import type { Booking, Property, Conversation } from '@/lib/types';
import { ReviewDialog } from '@/components/review-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';


const savedListings = [propertyService.getPropertyById('3'), propertyService.getPropertyById('5')].filter(Boolean) as Property[];


export default function UserDashboardPage() {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const guestId = 'U001'; // Mock current user's ID
  const guestName = "John Doe";

  useEffect(() => {
    // In a real app, you'd fetch this for the current user
    const userBookings = bookingService.getBookingsByGuestId(guestId);
    setMyBookings(userBookings);

    const userConversations = messageService.getConversationsForUser(guestId);
    setConversations(userConversations);
    
    // Set initial selected conversation if there are any
    if (userConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(userConversations[0]);
    }

  }, [guestId, selectedConversation]); 

  const upcomingTrips = myBookings.filter(b => b.status === 'Confirmed' && b.dates.from > new Date());
  const pastTrips = myBookings.filter(b => b.status === 'Completed' || b.dates.to <= new Date());
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    messageService.addMessage({
      conversationId: selectedConversation.id,
      from: { id: guestId, name: guestName, type: 'guest' },
      text: newMessage,
    });
    
    // Re-fetch conversations to update the UI
    const updatedConversations = messageService.getConversationsForUser(guestId);
    setConversations(updatedConversations);

    // Update the selected conversation view with the new message
    const updatedSelected = updatedConversations.find(c => c.id === selectedConversation.id);
    setSelectedConversation(updatedSelected || null);

    setNewMessage('');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Profile & Trips */}
            <div className="lg:col-span-4 space-y-8">
                <Card>
                    <CardHeader className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src="https://i.pravatar.cc/100?u=U001" alt="Jane Doe" data-ai-hint="person face" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl font-bold font-headline">{guestName}</CardTitle>
                    <CardDescription>Joined in 2023</CardDescription>
                    </CardHeader>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>My Trips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4 -mr-4">
                            <h3 className="font-semibold mb-2">Upcoming</h3>
                            {upcomingTrips.length > 0 ? upcomingTrips.map(trip => {
                                const property = propertyService.getPropertyById(trip.propertyId);
                                if (!property) return null;
                                return (
                                    <Link href={`/listings/${property.id}`} key={trip.id} className="block group mb-4">
                                        <div className="flex gap-4 p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="relative w-24 h-20 rounded-md overflow-hidden">
                                                <Image src={property.images[0]} alt={property.title} fill className="object-cover" data-ai-hint="house exterior"/>
                                            </div>
                                            <div>
                                                <p className="font-bold group-hover:underline text-sm">{property.title}</p>
                                                <p className="text-xs text-muted-foreground mt-1">Dates: {trip.dates.from.toLocaleDateString()} - {trip.dates.to.toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }) : <p className="text-sm text-muted-foreground">No upcoming trips.</p>}

                            <h3 className="font-semibold mb-2 mt-4">Past</h3>
                            {pastTrips.length > 0 ? pastTrips.map(trip => {
                                const property = propertyService.getPropertyById(trip.propertyId);
                                if (!property) return null;
                                const hasReviewed = property.reviews.some(review => review.bookingId === trip.id);
                                return (
                                    <div key={trip.id} className="block group mb-4">
                                        <div className="flex gap-4 p-2 border rounded-lg">
                                            <Link href={`/listings/${property.id}`} className="flex-none w-24 h-20 relative rounded-md overflow-hidden">
                                                <Image src={property.images[0]} alt={property.title} fill className="object-cover" data-ai-hint="apartment building"/>
                                            </Link>
                                            <div className="flex-grow">
                                                <Link href={`/listings/${property.id}`}><p className="font-bold group-hover:underline text-sm">{property.title}</p></Link>
                                                <p className="text-xs text-muted-foreground mt-1">Dates: {trip.dates.from.toLocaleDateString()} - {trip.dates.to.toLocaleDateString()}</p>
                                                <ReviewDialog property={property} bookingId={trip.id} hasReviewed={hasReviewed} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <p className="text-sm text-muted-foreground">No past trips.</p>}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Middle & Right Columns: Messaging */}
            <div className="lg:col-span-8">
                 <Card className="h-full">
                    <div className="grid grid-cols-12 h-full">
                        {/* Conversation List */}
                        <div className="col-span-12 md:col-span-4 border-r">
                             <CardHeader>
                                <CardTitle>Messages</CardTitle>
                            </CardHeader>
                            <ScrollArea className="h-[600px] px-2">
                                {conversations.map(convo => (
                                     <button 
                                        key={convo.id}
                                        onClick={() => handleSelectConversation(convo)}
                                        className={cn("w-full text-left p-3 rounded-lg hover:bg-muted", selectedConversation?.id === convo.id && "bg-muted")}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={convo.participant.avatar} />
                                                <AvatarFallback>{convo.participant.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center">
                                                    <p className="font-semibold truncate">{convo.participant.name}</p>
                                                    <p className="text-xs text-muted-foreground shrink-0">{convo.messages[convo.messages.length - 1]?.time}</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">{convo.messages[convo.messages.length - 1]?.text}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </ScrollArea>
                        </div>
                        
                        {/* Chat View */}
                        <div className="col-span-12 md:col-span-8 flex flex-col h-full">
                            {selectedConversation ? (
                                <>
                                    <div className="p-4 border-b flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={selectedConversation.participant.avatar} />
                                            <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold">{selectedConversation.participant.name}</p>
                                            {selectedConversation.subject && <p className="text-sm text-muted-foreground">Re: {selectedConversation.subject}</p>}
                                        </div>
                                    </div>
                                    <ScrollArea className="flex-1 p-6 h-[500px]">
                                        <div className="space-y-4">
                                            {selectedConversation.messages.map((msg, index) => (
                                                <div key={index} className={cn("flex", msg.from.type === 'guest' ? 'justify-end' : 'justify-start')}>
                                                    <div className={cn("p-3 rounded-lg max-w-xs", msg.from.type === 'guest' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
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
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                                    <MessageSquare className="h-16 w-16" />
                                    <p className="mt-4 text-lg">Select a conversation</p>
                                    <p className="text-sm">Your messages with hosts and our Help Center will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                 </Card>
            </div>
        </div>
    </div>
  );
}

    