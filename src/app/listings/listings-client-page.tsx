

'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { apiRequest } from '@/lib/utils';
import type { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property-card';
import { ListingFilters } from '@/components/listing-filters';
import { Ban } from 'lucide-react';
import Image from 'next/image';

const filterProperties = (
  properties: Property[],
  search: string | null,
  minPrice: number | null,
  maxPrice: number | null
): Property[] => {
  // Only show published properties on the public listings page
  let publiclyVisibleProperties = properties.filter(p => p.status === 'Published');

  return publiclyVisibleProperties.filter((property) => {
    // Price filter
    if (minPrice && property.pricePerNight < minPrice) return false;
    if (maxPrice && property.pricePerNight > maxPrice) return false;

    // Search filter
    if (search) {
      const searchWords = search.toLowerCase().split(' ').filter(Boolean);
      if (searchWords.length > 0) {
        const propertyText = `${property.title} ${property.location} ${property.description}`.toLowerCase();
        // Check if at least one of the search words is present in the property text
        const matches = searchWords.some(word => propertyText.includes(word));
        if (!matches) {
          return false;
        }
      }
    }

    return true;
  });
};

export default function ListingsClientPage() {
  const searchParams = useSearchParams();

  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);


  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;

  const userLocation = lat && lng ? { lat, lng } : null;

  useEffect(() => {
    async function fetchListings() {
      try {
        const listings = await apiRequest('/api/listings');
        setFilteredProperties((listings as Property[]).filter((p) => (p as any).status === 'Published'));
      } catch (e) {
        setFilteredProperties([]);
      }
    }
    fetchListings();
    // Retrieve image from sessionStorage
    const storedImage = sessionStorage.getItem('imageSearchPreview');
    if (storedImage) {
      setImageUrl(storedImage);
      // Clean up sessionStorage after retrieving the image
      sessionStorage.removeItem('imageSearchPreview');
    }

    let properties = [...allProperties];

    if (userLocation) {
      // Haversine formula to calculate distance
      const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
      };

      properties = properties.map(prop => ({
        ...prop,
        distance: getDistance(userLocation.lat, userLocation.lng, prop.coords.lat, prop.coords.lng),
      })).sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }
    
    const filtered = filterProperties(properties, search, minPrice, maxPrice);
    setFilteredProperties(filtered);
  }, [search, minPrice, maxPrice, userLocation, allProperties]);


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <ListingFilters />
          </div>
        </aside>
        
        <main className="lg:col-span-3">
          {imageUrl && (
            <div className="mb-6">
              <h2 className="text-xl font-bold font-headline mb-2">Results for your image search</h2>
              <div className="relative aspect-video max-w-md rounded-lg overflow-hidden border">
                <Image src={imageUrl} alt="Uploaded image for search" layout="fill" objectFit="cover" />
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold font-headline mb-1">
            {search ? `Results for "${search}"` : (userLocation ? 'Stays Near You' : 'All Stays')}
          </h1>
          <p className="text-muted-foreground mb-4">
            Showing {filteredProperties.length} properties.
          </p>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Ban className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No properties found matching your criteria.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
