'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin } from 'lucide-react';

export function ShowMoreListingsButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleShowNearby = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation.',
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/listings?lat=${latitude}&lng=${longitude}`);
        // No need to set isLoading to false, page will navigate
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          variant: 'destructive',
          title: 'Could not get location',
          description: 'Please ensure location services are enabled for your browser.',
        });
        // If they deny, take them to the generic listings page
        router.push('/listings');
        setIsLoading(false);
      }
    );
  };

  return (
    <Button onClick={handleShowNearby} size="lg" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Finding...
        </>
      ) : (
        <>
          <MapPin className="mr-2 h-5 w-5" />
          Show Nearby Stays
        </>
      )}
    </Button>
  );
}
