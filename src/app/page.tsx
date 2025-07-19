
import Link from 'next/link';
import Image from 'next/image';
import { propertyService } from '@/lib/data';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { ShowMoreListingsButton } from '@/components/show-more-listings-button';
import { Search, Image as ImageIcon, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Home() {
  const featuredProperties = propertyService.getProperties().filter(p => p.status === 'Published').slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-4">Find your next stay</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Unforgettable trips start with Rara.com. Find adventures nearby or in faraway places and access unique homes, experiences, and places around the world.</p>
           <div className="flex justify-center gap-4 mt-6">
              <Button variant="secondary" asChild>
                  <Link href="/image-search">
                      <ImageIcon className="mr-2 h-5 w-5"/>
                      Search by Image
                  </Link>
              </Button>
              <ShowMoreListingsButton />
           </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold font-headline mb-8 text-center">Featured Stays</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
         <div className="text-center mt-12">
            <Button size="lg" asChild>
                <Link href="/listings">Explore more</Link>
            </Button>
        </div>
      </section>

       {/* How It Works Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl font-bold font-headline mb-8">How Rara.com Works</h2>
            <div className="grid md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                        <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">1. Discover</h3>
                    <p className="text-muted-foreground">Explore a vast collection of unique homes and find the perfect one for you.</p>
                </div>
                <div className="flex flex-col items-center">
                     <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12a10 10 0 0 0-9.94 10A10 10 0 0 0 12 12z"/></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">2. Book</h3>
                    <p className="text-muted-foreground">Book your stay with just a few clicks. It's simple and secure.</p>
                </div>
                 <div className="flex flex-col items-center">
                     <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                        <MapPin className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">3. Travel</h3>
                    <p className="text-muted-foreground">Enjoy your trip with the peace of mind that comes with our support.</p>
                </div>
            </div>
            <div className="mt-12">
                <Button asChild size="lg">
                    <Link href="/create-listing">Host your home</Link>
                </Button>
            </div>
        </div>
      </section>
    </div>
  );
}
