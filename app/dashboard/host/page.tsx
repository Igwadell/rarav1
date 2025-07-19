

'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Star,
  MessageSquare,
  PlusCircle,
  BarChart2,
  Send,
} from 'lucide-react';
import {
  addDays,
  isSameDay,
  isPast,
  getDaysInMonth,
  isWithinInterval,
} from 'date-fns';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { propertyService, bookingService, messageService } from '@/lib/data';
import type { Property, Booking, Conversation } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

// Mock data specific to the host
const MOCK_HOST_ID = 'H001';
const MOCK_HOST_NAME = 'Sarah';

export default function HostDashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [hostProperties, setHostProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  

  // Set initial state after the component has mounted on the client
  useEffect(() => {
    const properties = propertyService.getPropertiesByHostId(MOCK_HOST_ID);
    setHostProperties(properties);
    if (properties.length > 0) {
      setSelectedProperty(properties[0]);
    }
    setBookings(bookingService.getBookingsByHostId(MOCK_HOST_ID));
    
    const hostConversations = messageService.getConversationsForUser(MOCK_HOST_ID);
    setConversations(hostConversations);
    
    // Set initial selected conversation if there are any
    if (hostConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(hostConversations[0]);
    }

    setIsClient(true);
  }, [selectedConversation]);


  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    messageService.addMessage({
      conversationId: selectedConversation.id,
      from: { id: MOCK_HOST_ID, name: MOCK_HOST_NAME, type: 'host' },
      text: newMessage,
    });
    
    // Re-fetch conversations to update the UI
    const updatedConversations = messageService.getConversationsForUser(MOCK_HOST_ID);
    setConversations(updatedConversations);

    // Update the selected conversation view with the new message
    const updatedSelected = updatedConversations.find(c => c.id === selectedConversation.id);
    setSelectedConversation(updatedSelected || null);

    setNewMessage('');
  };


  if (!isClient) {
    return <DashboardSkeleton />;
  }
  
  if (!selectedProperty) {
      return (
          <div className="container mx-auto max-w-screen-2xl py-8 px-4 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No listings found</h2>
              <p className="text-muted-foreground">Create a listing to get started as a host.</p>
              <Button asChild className="mt-6">
                <Link href="/create-listing">
                    <PlusCircle className="mr-2" /> Create New Listing
                </Link>
            </Button>
          </div>
      )
  }

  const MainDashboardView = () => (
    <div className="space-y-8">
        <PerformanceCard property={selectedProperty} bookings={bookings} />
        <ManageAvailabilityCard property={selectedProperty} bookings={bookings} />
    </div>
  );


  return (
    <div className="container mx-auto max-w-screen-2xl py-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Host Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your listings and view your performance.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <MessagingSheet 
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  setSelectedConversation={setSelectedConversation}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                />
                <Button asChild>
                    <Link href="/create-listing">
                        <PlusCircle className="mr-2" /> Create New Listing
                    </Link>
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Sidebar: Listing Selector */}
            <div className="lg:col-span-1">
                <MyListings
                    properties={hostProperties}
                    selectedProperty={selectedProperty}
                    onSelectProperty={(p) => {
                      setSelectedProperty(p);
                    }}
                />
            </div>

            {/* Main Content Area */}
            <main className="lg:col-span-3">
                <MainDashboardView />
            </main>
        </div>
    </div>
  );
}

// Sub-components for the dashboard

const MessagingSheet = ({ conversations, selectedConversation, setSelectedConversation, newMessage, setNewMessage, handleSendMessage }: any) => (
  <Sheet>
    <SheetTrigger asChild>
        <Button variant="outline">
            <MessageSquare className="mr-2" />
            Messages ({conversations.filter((c: Conversation) => c.messages.length > 0).length})
        </Button>
    </SheetTrigger>
    <SheetContent className="w-full sm:max-w-none md:w-[800px] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
            <SheetTitle>Your Messages</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-12 flex-1 overflow-hidden">
            <div className="col-span-4 border-r">
                <ScrollArea className="h-full px-2">
                    <div className="space-y-1 py-2">
                        {conversations.map((convo: Conversation) => (
                            <button 
                                key={convo.id}
                                onClick={() => setSelectedConversation(convo)}
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
                    </div>
                </ScrollArea>
            </div>
            <div className="col-span-8 flex flex-col h-full">
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
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                {selectedConversation.messages.map((msg: any, index: number) => (
                                    <div key={index} className={cn("flex", msg.from.type === 'host' ? 'justify-end' : 'justify-start')}>
                                        <div className={cn("p-3 rounded-lg max-w-xs", msg.from.type === 'host' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                            <p>{msg.text}</p>
                                            <p className="text-xs opacity-70 mt-1 text-right">{msg.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <SheetFooter className="p-4 border-t bg-background">
                            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative w-full">
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
                        </SheetFooter>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                        <MessageSquare className="h-16 w-16" />
                        <p className="mt-4 text-lg">Select a conversation</p>
                        <p className="text-sm">Your messages with guests will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    </SheetContent>
  </Sheet>
);

const MyListings = ({ properties, selectedProperty, onSelectProperty }: { properties: Property[], selectedProperty: Property | null, onSelectProperty: (p: Property) => void }) => (
    <Card>
        <CardHeader>
            <CardTitle>My Listings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {properties.map(prop => (
                <button
                    key={prop.id}
                    className={cn(
                        "w-full text-left p-3 rounded-lg border transition-colors",
                        selectedProperty?.id === prop.id
                            ? "bg-muted border-primary ring-2 ring-primary"
                            : "hover:bg-muted/50"
                    )}
                    onClick={() => onSelectProperty(prop)}
                >
                    <div className="flex gap-4">
                        <div className="relative w-24 h-20 rounded-md overflow-hidden shrink-0">
                            <Image src={prop.images[0]} alt={prop.title} fill className="object-cover" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-semibold truncate">{prop.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{prop.location}</p>
                             <div className="flex items-center gap-1 text-sm mt-1">
                                <Star className="w-4 h-4 text-primary" fill="hsl(var(--primary))" />
                                <span className="font-semibold">{prop.rating.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </CardContent>
    </Card>
);

const PerformanceCard = ({ property, bookings }: { property: Property, bookings: Booking[] }) => {
  const [occupancyRate, setOccupancyRate] = useState(0);

  useEffect(() => {
    const today = new Date();
    const daysInMonth = getDaysInMonth(today);
    const confirmedBookings = bookings.filter(b => b.propertyId === property.id && (b.status === 'Confirmed' || b.status === 'Completed'));
    
    let bookedDays = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(today.getFullYear(), today.getMonth(), i);
      if (confirmedBookings.some(booking => isWithinInterval(day, booking.dates))) {
        bookedDays++;
      }
    }
    setOccupancyRate(Math.round((bookedDays / daysInMonth) * 100));
  }, [property, bookings]);

  const performanceItems = useMemo(() => [
    { title: 'Total Earnings', value: `12,450,000 Rwfs`, icon: BarChart2, href: `/dashboard/host/earnings?listing=${property?.id}` },
    { title: 'Occupancy Rate', value: `${occupancyRate}%`, icon: Users, href: `/dashboard/host/occupancy?listing=${property?.id}` },
    { title: 'Overall Rating', value: property?.rating.toFixed(2) || 'N/A', icon: Star, href: `/dashboard/host/reviews?listing=${property?.id}` },
  ], [property, occupancyRate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {performanceItems.map(item => (
          <Link href={item.href} key={item.title}>
            <Card className="hover:bg-muted/50 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

const ManageAvailabilityCard = ({ property, bookings }: { property: Property, bookings: Booking[] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [blockedDates, setBlockedDates] = useState<Date[]>([addDays(new Date(), 20), addDays(new Date(), 21)]);

  const bookedDaysForProperty = useMemo(() => {
    const confirmedBookings = bookings.filter(b => b.propertyId === property.id && (b.status === 'Confirmed' || b.status === 'Completed'));
    return confirmedBookings.map(b => b.dates);
  }, [property, bookings]);

  const handleBlock = () => {
    if (!selectedDates?.from) return;
    const from = selectedDates.from;
    const to = selectedDates.to || from;
    const datesToBlock: Date[] = [];
    let currentDate = from;
    while (currentDate <= to) {
      datesToBlock.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    setBlockedDates(prev => [...prev, ...datesToBlock]);
    setSelectedDates(undefined);
  };

  const handleUnblock = () => {
    if (!selectedDates?.from) return;
    const from = selectedDates.from;
    const to = selectedDates.to || from;
    setBlockedDates(prev => prev.filter(blockedDate => {
      return !isWithinInterval(blockedDate, { start: from, end: to });
    }));
    setSelectedDates(undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Availability</CardTitle>
        <CardDescription>Select dates to block or unblock them.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-8">
        <Calendar
          mode="range"
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          selected={selectedDates}
          onSelect={setSelectedDates}
          disabled={[
            ...bookedDaysForProperty, 
            ...blockedDates, 
            (date) => isPast(date) && !isSameDay(date, new Date())
          ]}
          modifiers={{
            booked: bookedDaysForProperty,
            blocked: blockedDates,
          }}
          modifiersClassNames={{
            booked: 'bg-destructive/20 text-destructive-foreground line-through',
            blocked: 'bg-muted-foreground/20 text-muted-foreground line-through',
          }}
        />
        <div className="flex-1 space-y-4">
            <div className="space-y-2">
                <Button onClick={handleBlock} className="w-full" disabled={!selectedDates}>Block Selected Dates</Button>
                <Button onClick={handleUnblock} variant="outline" className="w-full" disabled={!selectedDates}>Unblock Selected Dates</Button>
            </div>
             <div className="space-y-2 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-destructive/20" />
                    <span className="text-sm text-muted-foreground">Booked by a guest</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-muted-foreground/20" />
                    <span className="text-sm text-muted-foreground">Manually blocked</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};


const DashboardSkeleton = () => (
    <div className="container mx-auto max-w-screen-2xl py-8 px-4">
        <div className="flex justify-between items-center mb-8">
            <div>
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-11 w-44" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            </div>
            <main className="lg:col-span-3">
                <div className="space-y-8">
                    <Card>
                        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                        <CardContent><Skeleton className="h-80 w-full" /></CardContent>
                    </Card>
                </div>
            </main>
        </div>
    </div>
);


    
