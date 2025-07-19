import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Property } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from './ui/button';

interface PropertyCardProps {
  property: Property;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
}

export function PropertyCard({ property, className, layout = 'vertical' }: PropertyCardProps) {
  
  if (layout === 'horizontal') {
    return (
       <Card className={cn("overflow-hidden hover:shadow-xl transition-shadow duration-300 border rounded-lg shadow-sm flex cursor-pointer", className)}>
         <div className="flex w-full">
            <div className="w-1/3 relative">
              <Link href={`/listings/${property.id}`} className="block h-full">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover rounded-l-lg"
                  data-ai-hint="property house"
                />
              </Link>
            </div>
            <div className="w-2/3 flex flex-col p-4 justify-between">
                <div>
                    <h3 className="font-bold text-lg leading-tight">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    {property.distance !== undefined && (
                        <p className="text-sm text-muted-foreground mt-1">{property.distance.toFixed(2)} km away</p>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground gap-4 mt-2">
                        <span>{property.bedrooms} beds</span>
                        <span>•</span>
                        <span>{property.bathrooms} baths</span>
                    </div>
                </div>
                <div className="flex justify-between items-end mt-2">
                   <p className="text-lg font-bold text-foreground">{formatCurrency(property.pricePerNight)} <span className="text-sm font-normal text-muted-foreground">Rwfs/night</span></p>
                    <Button asChild size="sm">
                        <Link href={`/listings/${property.id}`}>View Details</Link>
                    </Button>
                </div>
            </div>
         </div>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 rounded-lg shadow-md", className)}>
      <Link href={`/listings/${property.id}`} className="block">
          <CardHeader className="p-0">
            <div className="aspect-square relative">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  data-ai-hint="property house"
                />
            </div>
          </CardHeader>
          <CardContent className="p-4 bg-card">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-headline font-bold leading-tight tracking-tight mb-1 truncate">
                {property.title}
              </CardTitle>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Star className="w-4 h-4 text-primary" fill="hsl(var(--primary))" />
                <span className="font-semibold text-sm">{property.rating.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm truncate">{property.location}</p>
             {property.distance !== undefined && (
              <p className="text-muted-foreground text-sm font-medium">{property.distance.toFixed(2)} km away</p>
            )}
            <p className="mt-2 text-sm">
              <span className="font-bold text-lg">{formatCurrency(property.pricePerNight)} Rwfs</span>
              <span className="text-muted-foreground"> / night</span>
            </p>
          </CardContent>
        </Link>
    </Card>
  );
}
