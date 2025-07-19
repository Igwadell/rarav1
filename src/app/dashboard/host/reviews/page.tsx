

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { propertyService } from '@/lib/data';

export default function ReviewsPage() {
    const searchParams = useSearchParams();
    const listingId = searchParams.get('listing');
    
    // Find the property to get its reviews, fallback to first property if not found
    const property = propertyService.getPropertyById(listingId || '1') || propertyService.getProperties()[0];
    const allReviews = property.reviews;

    const averageRating = allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length;
    
    const ratingDistribution = [
        { star: 5, count: allReviews.filter(r => r.rating >= 5).length },
        { star: 4, count: allReviews.filter(r => r.rating >= 4 && r.rating < 5).length },
        { star: 3, count: allReviews.filter(r => r.rating >= 3 && r.rating < 4).length },
        { star: 2, count: allReviews.filter(r => r.rating >= 2 && r.rating < 3).length },
        { star: 1, count: allReviews.filter(r => r.rating < 2).length },
    ];


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
          <CardTitle className="text-3xl font-bold font-headline">Guest Reviews</CardTitle>
          <CardDescription>See what guests are saying about Listing ID: {listingId || 'N/A'}</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>Overall Rating</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                 <div className="text-6xl font-bold flex items-center justify-center gap-2">
                    {averageRating.toFixed(2)}
                    <Star className="h-12 w-12 text-primary" fill="hsl(var(--primary))" />
                 </div>
                 <p className="text-muted-foreground mt-2">{allReviews.length} total reviews</p>
            </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {ratingDistribution.map(item => (
                        <div key={item.star} className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{item.star} star{item.star > 1 ? 's' : ''}</span>
                            <Progress value={(item.count / allReviews.length) * 100} className="flex-1" />
                            <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>All Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 {allReviews.map(review => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-4">
                             <Avatar className="w-12 h-12">
                                <AvatarImage src={review.author.avatar} alt={review.author.name} />
                                <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div>
                                        <p className="font-semibold">{review.author.name}</p>
                                        <p className="text-sm text-muted-foreground">{review.date}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold">{review.rating.toFixed(1)}</span>
                                        <Star className="w-4 h-4 text-primary" fill="hsl(var(--primary))"/>
                                    </div>
                                </div>
                                <p className="text-foreground/90">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  );
}
