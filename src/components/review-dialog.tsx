
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitReviewAction } from '@/app/dashboard/user/actions';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';

interface ReviewDialogProps {
  property: Property;
  bookingId: string;
  hasReviewed: boolean;
}

const reviewFormSchema = z.object({
  rating: z.number().min(1, { message: 'Please select a rating.' }),
  comment: z.string().min(10, { message: 'Comment must be at least 10 characters.' }).max(500),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export function ReviewDialog({ property, bookingId, hasReviewed }: ReviewDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const { setValue, watch } = form;
  const currentRating = watch('rating');

  async function onSubmit(values: ReviewFormValues) {
    setIsLoading(true);
    try {
      const result = await submitReviewAction({
        ...values,
        propertyId: property.id,
        bookingId: bookingId,
      });

      if (result.success) {
        toast({
          title: 'Review Submitted!',
          description: 'Thank you for your feedback.',
        });
        setOpen(false);
        form.reset();
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (hasReviewed) {
    return (
      <Button variant="outline" size="sm" className="mt-2" disabled>
        Review Submitted
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          Leave a review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a review for {property.title}</DialogTitle>
          <DialogDescription>
            Share your experience to help other travelers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <div
                      className="flex items-center gap-2"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-8 w-8 cursor-pointer transition-colors',
                            (hoverRating || currentRating) >= star
                              ? 'text-primary fill-primary'
                              : 'text-muted-foreground/50'
                          )}
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => setValue('rating', star, { shouldValidate: true })}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your stay..."
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
