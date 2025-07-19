
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const monthlyEarningsData = [
  { month: 'Jan', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Feb', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Mar', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Apr', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'May', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Jun', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Jul', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Aug', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Sep', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Oct', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Nov', total: Math.floor(Math.random() * 5000000) + 1000000 },
  { month: 'Dec', total: Math.floor(Math.random() * 5000000) + 1000000 },
];

const recentBookings = [
    { id: 'BK001', guest: 'John Doe', dates: '2024-10-15 - 2024-10-20', amount: 1250000, status: 'Completed' },
    { id: 'BK002', guest: 'Jane Smith', dates: '2024-11-01 - 2024-11-05', amount: 720000, status: 'Confirmed' },
    { id: 'BK004', guest: 'Emily White', dates: '2024-09-02 - 2024-09-08', amount: 1500000, status: 'Completed' },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
}

export default function EarningsPage() {
    const searchParams = useSearchParams();
    const listingId = searchParams.get('listing');
    
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
          <CardTitle className="text-3xl font-bold font-headline">Earnings</CardTitle>
          <CardDescription>Review your earnings and financial performance for Listing ID: {listingId || 'N/A'}</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <span className="text-muted-foreground font-bold">Rwfs</span>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12,450,000</div>
                <p className="text-xs text-muted-foreground">All-time earnings for this listing</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Nightly Rate</CardTitle>
                <span className="text-muted-foreground font-bold">Rwfs</span>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">210,000</div>
                <p className="text-xs text-muted-foreground">Based on last 30 days</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <span className="text-muted-foreground font-bold">#</span>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">58</div>
                <p className="text-xs text-muted-foreground">All-time bookings for this listing</p>
            </CardContent>
        </Card>
      </div>

       <Card className="mb-8">
            <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
                <CardDescription>Your revenue over the last 12 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyEarningsData}>
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${formatCurrency(value as number)}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                            Earnings
                                        </span>
                                        <span className="font-bold text-muted-foreground">
                                            {formatCurrency(payload[0].value as number)} Rwfs
                                        </span>
                                        </div>
                                    </div>
                                    </div>
                                )
                                }
                                return null
                            }}
                        />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>A log of recent bookings for this listing.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount (Rwfs)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id}</TableCell>
                            <TableCell>{booking.guest}</TableCell>
                            <TableCell>{booking.dates}</TableCell>
                            <TableCell>{booking.status}</TableCell>
                            <TableCell className="text-right">{formatCurrency(booking.amount)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
