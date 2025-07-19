
'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/lib/types';
import { addDays, differenceInCalendarDays, isWithinInterval } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Phone, Landmark, Copy, Loader2, PartyPopper } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bookingService } from '@/lib/data';

interface BookingWidgetProps {
  property: Property;
}

export function BookingWidget({ property }: BookingWidgetProps) {
  const { toast } = useToast();
  const today = new Date();
  
  const [allBookedDates, setAllBookedDates] = useState<DateRange[]>([]);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'bank'>('momo');

  useEffect(() => {
    // Fetch all confirmed bookings for this property
    const bookingsForProperty = bookingService.getBookings()
      .filter(b => b.propertyId === property.id && (b.status === 'Confirmed' || b.status === 'Completed'));
    setAllBookedDates(bookingsForProperty.map(b => b.dates));
  }, [property.id]);


  const defaultSelected: DateRange = {
    from: addDays(today, 2), // Default to a future date
    to: addDays(today, 6),
  };

  const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
  const [numberOfNights, setNumberOfNights] = useState(4);
  const [totalPrice, setTotalPrice] = useState(0);

  const platformFee = 0.10; // 10%

  useEffect(() => {
    if (range?.from && range?.to) {
      const nights = differenceInCalendarDays(range.to, range.from);
      if (nights > 0) {
        setNumberOfNights(nights);
        const subtotal = nights * property.pricePerNight;
        const fee = subtotal * platformFee;
        setTotalPrice(subtotal + fee);
      } else {
        setNumberOfNights(0);
        setTotalPrice(0);
      }
    } else {
      setNumberOfNights(0);
      setTotalPrice(0);
    }
  }, [range, property.pricePerNight, platformFee]);

  const handleConfirmAndPay = () => {
    if (!range?.from || !range?.to) return;
    setIsProcessing(true);
    toast({
        title: 'Submitting Booking Request',
        description: 'Your request is being sent to the admin for confirmation.',
    });

    // Simulate API call
    setTimeout(() => {
        bookingService.addBooking({
            propertyId: property.id,
            guest: { name: 'John Doe', id: 'U001' }, // Mock guest
            host: { name: property.host.name, id: property.host.id },
            dates: { from: range.from!, to: range.to! },
            amount: totalPrice,
            status: 'Pending Confirmation'
        });
        
        setIsProcessing(false);
        setIsBookingConfirmed(true);
    }, 2000);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  const isDateBooked = (date: Date) => {
    return allBookedDates.some(bookedRange => isWithinInterval(date, bookedRange));
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' Rwfs';
  }

  if (isBookingConfirmed) {
      return (
        <Card className="shadow-lg p-2 rounded-xl border-2 border-primary">
            <CardContent className="p-4 text-center">
                <PartyPopper className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold font-headline mb-2">Request Sent!</h3>
                <p className="text-muted-foreground mb-4">Your booking is pending confirmation from the platform admin. You will be notified once it's approved.</p>
                <Button variant="outline" onClick={() => setIsBookingConfirmed(false)}>Book another trip</Button>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="shadow-lg p-2 rounded-xl border-2">
      <CardContent className="p-4">
        <div className="flex justify-between items-baseline mb-4">
          <p>
            <span className="text-2xl font-bold">{formatCurrency(property.pricePerNight)}</span>
            <span className="text-muted-foreground"> / night</span>
          </p>
        </div>

        <Calendar
          initialFocus
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          numberOfMonths={1}
          disabled={[{ before: today }, isDateBooked]}
        />

        <Sheet>
            <SheetTrigger asChild>
                <Button disabled={numberOfNights <= 0} className="w-full text-lg py-6 mt-4">
                    Reserve
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full md:w-[480px] flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-headline">Confirm and pay</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto pr-6 -mr-6">
                    <div className="grid gap-8 py-8">
                        <div>
                            <h3 className="font-bold mb-4">Your trip</h3>
                            <div className="flex justify-between">
                                <p className="font-semibold">Dates</p>
                                <p>{range?.from?.toLocaleDateString()} - {range?.to?.toLocaleDateString()}</p>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                    {formatCurrency(property.pricePerNight)} x {numberOfNights} nights
                                    </span>
                                    <span>{formatCurrency(property.pricePerNight * numberOfNights)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                    Platform service fee
                                    </span>
                                    <span>{formatCurrency(property.pricePerNight * numberOfNights * platformFee)}</span>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-bold mb-4">Pay with</h3>
                            <Tabs 
                                defaultValue={paymentMethod} 
                                onValueChange={(value) => setPaymentMethod(value as any)}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="momo">Mobile Money</TabsTrigger>
                                    <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="momo" className="pt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center p-3 rounded-md bg-muted">
                                            <Phone className="h-8 w-8 text-muted-foreground mr-4" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Please send the total amount using the details below.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                             <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Account Name:</span>
                                                <span className="font-mono">Igwaneza Eric</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Momo Pay Code:</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-base">180490</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('180490')}><Copy className="h-3 w-3" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                 <TabsContent value="bank" className="pt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center p-3 rounded-md bg-muted">
                                            <Landmark className="h-8 w-8 text-muted-foreground mr-4" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Please transfer the total amount to the bank account below. Use your name as the payment reference.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="font-semibold">Equity Bank</div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Account Name:</span>
                                                <span className="font-mono">Igwaneza Eric</span>
                                            </div>
                                             <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Account (USD):</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono">4011112941857</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('4011112941857')}><Copy className="h-3 w-3" /></Button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Account (Rwf):</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono">4009100885074</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('4009100885074')}><Copy className="h-3 w-3" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground pt-2">Your booking will be confirmed once payment is received.</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <SheetFooter className="pt-4 border-t">
                    <SheetClose asChild>
                        <Button onClick={handleConfirmAndPay} disabled={isProcessing} className="w-full text-lg py-6">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Confirm and Pay'
                            )}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
        
        <p className="text-center text-sm text-muted-foreground mt-2">You won't be charged yet</p>

        <Separator className="my-4" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {formatCurrency(property.pricePerNight)} x {numberOfNights} nights
            </span>
            <span>{formatCurrency(property.pricePerNight * numberOfNights)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Platform service fee
            </span>
            <span>{formatCurrency(property.pricePerNight * numberOfNights * platformFee)}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
