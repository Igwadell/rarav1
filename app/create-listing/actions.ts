
'use server';

import { generateListingDescription, type GenerateListingDescriptionInput } from '@/ai/flows/generate-listing-description';
import { z } from 'zod';
import { propertyService } from '@/lib/data';
import type { Property } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const generateDescriptionSchema = z.object({
  propertyType: z.string(),
  location: z.string(),
  numberOfGuests: z.number(),
  numberOfBedrooms: z.number(),
  numberOfBathrooms: z.number(),
  amenities: z.array(z.string()),
  uniqueFeatures: z.string(), // a.k.a the title
});

const createListingSchema = z.object({
  title: z.string(),
  propertyType: z.string(),
  location: z.string(),
  pricePerNight: z.number(),
  numberOfGuests: z.number(),
  numberOfBedrooms: z.number(),
  numberOfBathrooms: z.number(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  description: z.string().optional(),
});


export async function createListingAction(
  input: any,
  action: 'create-listing' | 'generate-description'
) {
  if (action === 'generate-description') {
    const parsedInput = generateDescriptionSchema.safeParse(input);
    if (!parsedInput.success) {
      return { success: false, error: 'Invalid input for description generation.' };
    }
    try {
      const result = await generateListingDescription(parsedInput.data);
      return { success: true, description: result.description };
    } catch (error) {
      console.error('AI generation failed:', error);
      return { success: false, error: 'Failed to generate description due to a server error.' };
    }
  }

  if (action === 'create-listing') {
    const parsedInput = createListingSchema.safeParse(input);

    if (!parsedInput.success) {
      console.log(parsedInput.error.errors);
      return { success: false, error: 'Invalid listing input.' };
    }

    try {
      const { data } = parsedInput;

      // In a real app, this would come from the logged-in user.
      // We are assigning it to the mock host 'H001' so it shows up on the dashboard.
      const host = {
        id: 'H001',
        name: 'Sarah', 
        avatar: 'https://i.pravatar.cc/100?u=H001',
        joinYear: 2018,
        isSuperhost: true,
      };

      const newProperty: Omit<Property, 'id' | 'status'> = {
        title: data.title,
        type: data.propertyType,
        location: data.location,
        coords: { lat: 0, lng: 0 }, // Would need geocoding in a real app
        pricePerNight: data.pricePerNight,
        rating: 0,
        reviewsCount: 0,
        maxGuests: data.numberOfGuests,
        bedrooms: data.numberOfBedrooms,
        beds: data.numberOfBedrooms, // assumption
        bathrooms: data.numberOfBathrooms,
        description: data.description || 'No description provided.',
        host: host,
        amenities: data.amenities,
        images: data.images,
        rules: ['No smoking', 'No parties or events'],
        availability: [],
        reviews: [],
      };
      
      propertyService.addProperty(newProperty);

      // Revalidate paths to show the new data in admin and host dashboards
      revalidatePath('/dashboard/admin');
      revalidatePath('/dashboard/host');

      // Redirect to the host page after successful creation
      // This MUST be inside the try block.
      redirect('/dashboard/host');
      
    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error('Listing creation failed:', error);
        return { success: false, error: 'Failed to create listing due to a server error.' };
    }
  }

  return { success: false, error: 'Invalid action.' };
}
