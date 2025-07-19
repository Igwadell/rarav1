
import Image from 'next/image';
import { Star, Wifi, Utensils, Tv, Wind, ParkingCircle, Award, User, Calendar as CalendarIcon } from 'lucide-react';
import { propertyService } from '@/lib/data';
import type { Property } from '@/lib/types';
import { notFound } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BookingWidget } from '@/components/booking-widget';

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Wifi': <Wifi className="w-6 h-6" />,
  'Kitchen': <Utensils className="w-6 h-6" />,
  'TV': <Tv className="w-6 h-6" />,
  'Air conditioning': <Wind className="w-6 h-6" />,
  'Free parking': <ParkingCircle className="w-6 h-6" />,
  // Add other icons as needed
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const property: Property | undefined = propertyService.getPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      {/* Title and Info */}
      <div className="mb-4">
        <h1 className="text-4xl font-bold font-headline mb-2">{property.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary" fill="hsl(var(--primary))" />
            <span className="font-semibold text-foreground">{property.rating.toFixed(2)}</span>
            <span>({property.reviewsCount} reviews)</span>
          </div>
          <span>·</span>
          <span>{property.location}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] mb-12 rounded-xl overflow-hidden">
        {property.images.slice(0, 5).map((img, index) => (
          <div
            key={index}
            className={`relative
              ${index === 0 ? 'col-span-2 row-span-2' : ''}
              ${index > 0 ? 'hover:opacity-90 transition-opacity' : ''}
            `}
          >
            <Image
              src={img}
              alt={`${property.title} image ${index + 1}`}
              fill
              className="object-cover"
              data-ai-hint="property interior"
            />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Property Details */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold font-headline">{property.type} in {property.location.split(',')[0]}</h2>
              <p className="text-muted-foreground">
                {property.maxGuests} guests · {property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''} · {property.beds} bed{property.beds > 1 ? 's' : ''} · {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
              </p>
            </div>
             <Avatar className="w-16 h-16">
                <AvatarImage src={property.host.avatar} alt={property.host.name} />
                <AvatarFallback>{property.host.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <Separator className="my-8" />
          
          {/* Host Info */}
          <div className="flex items-center gap-4 mb-8">
            <div>
                 <h3 className="font-semibold text-xl flex items-center gap-2">
                    Hosted by {property.host.name}
                    {property.host.isSuperhost && <Award className="w-5 h-5 text-primary" />}
                </h3>
                 <p className="text-muted-foreground">Joined in {property.host.joinYear}</p>
            </div>
          </div>
          
          <Separator className="my-8" />

          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About this place</h3>
            <p className="text-foreground/80 whitespace-pre-line">{property.description}</p>
          </div>

          <Separator className="my-8" />

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-semibold mb-6">What this place offers</h3>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.slice(0, 6).map((amenity) => (
                <div key={amenity} className="flex items-center gap-4 text-lg">
                  {amenityIcons[amenity] || <Wifi className="w-6 h-6" />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
           <Separator className="my-8" />

            {/* Reviews */}
            <div>
                <h3 className="text-xl font-semibold mb-6">Reviews</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {property.reviews.map(review => (
                        <div key={review.id}>
                            <div className="flex items-center gap-3 mb-2">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={review.author.avatar} alt={review.author.name} />
                                    <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{review.author.name}</p>
                                    <p className="text-sm text-muted-foreground">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />
                                ))}
                            </div>
                            <p className="text-foreground/80">{review.comment}</p>
                        </div>
                    ))}
                 </div>
            </div>

        </div>

        {/* Booking Widget */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
             <BookingWidget property={property} />
          </div>
        </aside>
      </div>
    </div>
  );
}
