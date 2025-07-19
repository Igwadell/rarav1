
'use server';

import { z } from 'zod';
import { propertyService } from '@/lib/data';
import { revalidatePath } from 'next/cache';

const reviewSchema = z.object({
  propertyId: z.string(),
  bookingId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, { message: 'Review must be at least 10 characters.' }).max(500),
});

export async function submitReviewAction(input: any) {
  const parsedInput = reviewSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: 'Invalid review input.' };
  }

  try {
    const { propertyId, bookingId, rating, comment } = parsedInput.data;
    
    // In a real app, you'd verify the user owns this booking before allowing a review.
    
    propertyService.addReview(propertyId, {
      bookingId,
      rating,
      comment,
    });

    // Revalidate the listing page to show the new review
    revalidatePath(`/listings/${propertyId}`);
    // Revalidate the user dashboard to update the 'Leave a review' button state
    revalidatePath('/dashboard/user');
    
    return { success: true };

  } catch (error) {
    console.error('Review submission failed:', error);
    return { success: false, error: 'Failed to submit review due to a server error.' };
  }
}
