
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CalendarDays, BedDouble, Percent } from 'lucide-react';
import { isPast, isSameDay, addDays, getYear, startOfYear } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

// Mock data: booked dates for the entire year
const allBookedDates: Date[] = [];
for (let i = 0; i < 60; i++) {
    allBookedDates.push(addDays(startOfYear(new Date()), Math.floor(Math.random() * 365)));
}
const manuallyBlockedDates: Date[] = [];
for (let i = 0; i < 20; i++) {
    manuallyBlockedDates.push(addDays(startOfYear(new Date()), Math.floor(Math.random() * 365)));
}

export default function OccupancyPage() {
    const searchParams = useSearchParams();
    const listingId = searchParams.get('listing');
    const currentYear = getYear(new Date());

    const totalDays = 365;
    const totalBookedDays = allBookedDates.length;
    const totalBlockedDays = manuallyBlockedDates.length;
    const annualOccupancy = Math.round((totalBookedDays / totalDays) * 100);

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/host">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Occupancy</CardTitle>
          <CardDescription>
            Review your occupancy rates and calendar for Listing ID: {listingId || 'N/A'}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Occupancy Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{annualOccupancy}%</div>
            <p className="text-xs text-muted-foreground">For {currentYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nights Booked</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookedDays}</div>
            <p className="text-xs text-muted-foreground">In {currentYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manually Blocked Days</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlockedDays}</div>
            <p className="text-xs text-muted-foreground">In {currentYear}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Full Year Calendar</CardTitle>
          <CardDescription>An overview of your listing's availability for {currentYear}.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
            <Calendar
                numberOfMonths={12}
                mode="multiple"
                defaultMonth={startOfYear(new Date())}
                disabled={[
                    ...allBookedDates,
                    ...manuallyBlockedDates,
                    (date) => isPast(date) && !isSameDay(date, new Date())
                ]}
                selected={[...allBookedDates, ...manuallyBlockedDates]}
                modifiers={{
                    booked: allBookedDates,
                    blocked: manuallyBlockedDates,
                }}
                 modifiersClassNames={{
                    booked: 'bg-primary text-primary-foreground',
                    blocked: 'bg-muted text-muted-foreground line-through',
                }}
                className="p-0"
            />
            <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-primary" />
                    <span className="text-sm text-muted-foreground">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm bg-muted" />
                    <span className="text-sm text-muted-foreground">Blocked</span>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
