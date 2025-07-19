'use server';

import { findSimilarListings, type FindSimilarListingsInput } from '@/ai/flows/find-similar-listings';
import { z } from 'zod';

const inputSchema = z.object({
  photoDataUri: z.string(),
});

export async function findSimilarListingsAction(input: FindSimilarListingsInput) {
  const parsedInput = inputSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: 'Invalid input.' };
  }

  try {
    const result = await findSimilarListings(parsedInput.data);
    return { success: true, query: result.query };
  } catch (error) {
    console.error('AI generation failed:', error);
    return { success: false, error: 'Failed to analyze image due to a server error.' };
  }
}
