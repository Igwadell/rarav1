
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { findSimilarListingsAction } from './actions';
import { cn } from '@/lib/utils';

export default function ImageSearchPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload an image file (PNG, JPG, etc.).',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };


  const handleSearch = async () => {
    if (!selectedFile || !previewUrl) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image to search.',
      });
      return;
    }

    setIsLoading(true);

    try {
        const photoDataUri = previewUrl;
        const result = await findSimilarListingsAction({ photoDataUri });
        
        if (result.success && result.query) {
          toast({
            title: 'Analysis Complete!',
            description: `Searching for listings similar to: "${result.query}"`,
          });
          
          // Store the image in sessionStorage to avoid long URLs
          sessionStorage.setItem('imageSearchPreview', photoDataUri);

          const params = new URLSearchParams();
          params.set('search', result.query);
          
          router.push(`/listings?${params.toString()}`);
        } else {
          throw new Error(result.error || 'Failed to generate search query.');
        }
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: error instanceof Error ? error.message : String(error),
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Find Stays with a Photo</CardTitle>
          <CardDescription>Upload a photo of a property you like, and our AI will find similar listings for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <div 
              className={cn(
                "mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors",
                isDragging ? "border-primary bg-primary/10" : "border-border",
                "min-h-[256px]" 
              )}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEvents}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center w-full">
                {previewUrl ? (
                  <div className="relative aspect-video w-full">
                    <Image src={previewUrl} alt="Preview" layout="fill" objectFit="contain" className="rounded-md" />
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-background rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
             {previewUrl && !isLoading && (
                <Button variant="link" onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}>
                    Remove Image
                </Button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={isLoading || !selectedFile} className="w-full text-lg py-6">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Find Similar Listings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
