import { Suspense } from 'react';
import ListingsClientPage from './listings-client-page';
import { Skeleton } from '@/components/ui/skeleton';

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsSkeleton />}>
      <ListingsClientPage />
    </Suspense>
  );
}

function ListingsSkeleton() {
  return (
     <div className="flex flex-col md:flex-row h-[calc(100vh-8.1rem)]">
      <aside className="w-full md:w-1/2 lg:w-2/5 p-4 overflow-y-auto">
        <Skeleton className="h-12 w-full mb-6" />
        <Skeleton className="h-8 w-1/2 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <Skeleton className="h-32 w-1/3" />
              <div className="w-2/3 space-y-2">
                 <Skeleton className="h-6 w-full" />
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-4 w-1/2" />
                 <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className="w-full md:w-1/2 lg:w-3/5 h-full">
         <Skeleton className="h-full w-full" />
      </main>
    </div>
  )
}
