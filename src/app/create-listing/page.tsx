
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Sparkles, Upload, X, CheckCircle, Check } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createListingAction } from './actions';
import { amenityOptions } from '@/lib/data';
import { cn } from '@/lib/utils';
import React from 'react';


const formSchema = z.object({
  propertyType: z.string().min(2, { message: 'Property type must be at least 2 characters.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  pricePerNight: z.coerce.number().min(1, { message: 'Price must be greater than 0.' }),
  numberOfGuests: z.coerce.number().min(1, { message: 'Must accommodate at least 1 guest.' }),
  numberOfBedrooms: z.coerce.number().min(1, { message: 'Must have at least 1 bedroom.' }),
  numberOfBathrooms: z.coerce.number().min(1, { message: 'Must have at least 1 bathroom.' }),
  amenities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one amenity.',
  }),
  images: z.array(z.string()).min(1, { message: 'Please upload at least one image.' }).max(5, {message: 'You can upload a maximum of 5 images.'}),
  description: z.string().optional(),
  title: z.string().min(10, { message: 'Title must be at least 10 characters long.' }),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = {
  DETAILS: 0,
  AMENITIES: 1,
  PHOTOS: 2,
  DESCRIPTION: 3,
  SUBMIT: 4,
};

const stepLabels = ['Details', 'Amenities', 'Photos', 'Description', 'Review'];


const stepFields: Record<number, (keyof FormValues)[]> = {
  [STEPS.DETAILS]: ['title', 'propertyType', 'location', 'pricePerNight', 'numberOfGuests', 'numberOfBedrooms', 'numberOfBathrooms'],
  [STEPS.AMENITIES]: ['amenities'],
  [STEPS.PHOTOS]: ['images'],
  [STEPS.DESCRIPTION]: ['description'],
};


export default function CreateListingPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.DETAILS);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: '',
      location: '',
      pricePerNight: 100,
      numberOfGuests: 1,
      numberOfBedrooms: 1,
      numberOfBathrooms: 1,
      amenities: [],
      images: [],
      description: '',
      title: '',
    },
    mode: 'onChange', // Important for per-step validation to feel responsive
  });
  
  const { watch, setValue, trigger } = form;
  const watchedImages = watch('images');


  async function handleGenerateDescription() {
    setIsGenerating(true);
    const { propertyType, location, numberOfGuests, numberOfBedrooms, numberOfBathrooms, amenities, title } = form.getValues();
    
    // Quick validation
    if (!propertyType || !location || !title) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please fill in the Property Type, Location, and Title before generating a description.'
        });
        setIsGenerating(false);
        return;
    }

    try {
      const result = await createListingAction({
            propertyType,
            location,
            numberOfGuests,
            numberOfBedrooms,
            numberOfBathrooms,
            amenities,
            uniqueFeatures: title, // Using title as a proxy for unique features
      }, 'generate-description');

      if (result.success && result.description) {
        setValue('description', result.description, { shouldValidate: true });
        toast({
          title: 'Description Generated!',
          description: 'The AI-powered description has been added below.',
        });
      } else {
        throw new Error(result.error || 'An unknown error occurred');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const handleNext = async () => {
    const fields = stepFields[currentStep];
    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < STEPS.SUBMIT) {
      setCurrentStep(step => step + 1);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      // The action now handles the redirect.
      // We don't need a `try/catch` here for the redirect itself, 
      // but it's good practice for other potential errors.
      await createListingAction(values, 'create-listing');
      
      // This toast will likely not be seen because of the redirect, but it's good to have.
      toast({
        title: 'Listing Submitted!',
        description: 'Your listing is now pending review. Redirecting you to the host dashboard.',
      });
    } catch (error) {
       // Only catch and handle non-redirect errors.
       if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
         throw error;
       }
       setIsLoading(false); 
       toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred during submission.',
      });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = form.getValues('images');

    if (currentImages.length + files.length > 5) {
        toast({ variant: 'destructive', title: 'Too many images', description: 'You can only upload up to 5 images.'});
        return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('images', [...form.getValues('images'), result], { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    const newImages = form.getValues('images').filter((_, i) => i !== index);
    setValue('images', newImages, { shouldValidate: true });
  }

  const stepContent = () => {
    switch (currentStep) {
      case STEPS.DETAILS:
        return (
          <div className="space-y-8">
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Property Title</FormLabel><FormControl><Input placeholder="e.g., Sunny Loft in the Heart of the City" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid md:grid-cols-2 gap-8">
                <FormField control={form.control} name="propertyType" render={({ field }) => (
                    <FormItem><FormLabel>Property Type</FormLabel><FormControl><Input placeholder="e.g., Apartment, House" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Kigali, Rwanda" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="pricePerNight" render={({ field }) => (
                    <FormItem><FormLabel>Price per Night (Rwf)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="numberOfGuests" render={({ field }) => (
                    <FormItem><FormLabel>Max Guests</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="numberOfBedrooms" render={({ field }) => (
                    <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="numberOfBathrooms" render={({ field }) => (
                    <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </div>
          </div>
        );
      case STEPS.AMENITIES:
        return (
          <FormField control={form.control} name="amenities" render={() => (
              <FormItem>
                <div className="mb-4"><FormLabel className="text-xl font-bold">Amenities</FormLabel><FormDescription>Select all amenities your property offers.</FormDescription></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenityOptions.map((item) => (
                    <FormField key={item} control={form.control} name="amenities" render={({ field }) => (
                        <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0 p-3 rounded-md border hover:bg-muted/50 transition-colors">
                            <FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => (checked ? field.onChange([...field.value, item]) : field.onChange(field.value?.filter((value) => value !== item)))}/></FormControl>
                            <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                    )}/>
                    ))}
                </div>
                <FormMessage />
              </FormItem>
            )}/>
        );
      case STEPS.PHOTOS:
        return (
            <div>
                <FormLabel className="text-xl font-bold">Upload Photos</FormLabel>
                <FormDescription className="mb-4">Add up to 5 photos of your property. The first image will be the main one.</FormDescription>
                <FormField control={form.control} name="images" render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                           {watchedImages.map((img, index) => (
                                <div key={index} className="relative aspect-square group">
                                    <Image src={img} alt={`preview ${index}`} layout="fill" className="object-cover rounded-md" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}><X className="h-4 w-4" /></Button>
                                </div>
                            ))}
                           {watchedImages.length < 5 && (
                             <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Upload</span>
                                <Input id="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} />
                             </label>
                           )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}/>
            </div>
        );
       case STEPS.DESCRIPTION:
        return (
            <div className="space-y-6">
                 <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <div>
                               <FormLabel className="text-xl font-bold">Create your description</FormLabel>
                               <FormDescription>Describe what makes your place special.</FormDescription>
                            </div>
                            <Button type="button" onClick={handleGenerateDescription} disabled={isGenerating}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </Button>
                        </div>
                        <FormControl><Textarea rows={10} placeholder="e.g., 'Stunning ocean view from the balcony', 'Private hot tub', '5-minute walk to the beach'" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        );
       case STEPS.SUBMIT:
            const values = form.getValues();
            return (
                <div>
                    <h3 className="text-2xl font-bold font-headline mb-4">Review Your Listing</h3>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>{values.title}</CardTitle><CardDescription>{values.location}</CardDescription></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2 h-48 mb-4">
                                    <div className="col-span-2 row-span-2 relative"><Image src={values.images[0]} alt="main" layout="fill" className="object-cover rounded-md"/></div>
                                    <div className="relative"><Image src={values.images[1] || 'https://placehold.co/400x300.png'} alt="thumb 1" layout="fill" className="object-cover rounded-md"/></div>
                                    <div className="relative"><Image src={values.images[2] || 'https://placehold.co/400x300.png'} alt="thumb 2" layout="fill" className="object-cover rounded-md"/></div>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{values.description}</p>
                                <hr className="my-4"/>
                                <p><strong>Price:</strong> {values.pricePerNight} Rwf / night</p>
                                <p><strong>Guests:</strong> {values.numberOfGuests}</p>
                                <p><strong>Bedrooms:</strong> {values.numberOfBedrooms}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )
      default:
        return null;
    }
  };

  const Stepper = () => (
    <div className="flex items-center justify-between p-6 pt-0">
      {stepLabels.map((label, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors',
                currentStep > index ? 'bg-primary text-primary-foreground' :
                currentStep === index ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {currentStep > index ? <Check className="w-5 h-5" /> : index + 1}
            </div>
            <p className={cn(
                "mt-2 text-sm text-center",
                currentStep >= index ? 'font-semibold text-foreground' : 'text-muted-foreground'
            )}>
                {label}
            </p>
          </div>
          {index < stepLabels.length - 1 && (
            <div className={cn(
                "flex-1 h-0.5 mx-4",
                currentStep > index ? 'bg-primary' : 'bg-border'
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create your listing</CardTitle>
          <CardDescription>Follow the steps to get your property ready for guests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Stepper />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {stepContent()}
              <div className="flex justify-between items-center pt-8 border-t">
                <Button type="button" variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === STEPS.DETAILS}>
                    <ArrowLeft className="mr-2 h-4 w-4"/> Previous
                </Button>
                 
                {currentStep === STEPS.SUBMIT ? (
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Confirm and Submit'}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                     Next
                    <ArrowRight className="ml-2 h-4 w-4"/>
                  </Button>
                )}

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
