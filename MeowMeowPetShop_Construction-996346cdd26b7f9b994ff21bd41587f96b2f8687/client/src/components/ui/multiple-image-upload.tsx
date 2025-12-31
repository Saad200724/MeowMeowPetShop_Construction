import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MultipleImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
  disabled?: boolean;
}

export function MultipleImageUpload({ 
  value = [], 
  onChange, 
  maxImages = 3,
  className = '', 
  disabled = false 
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (files: FileList) => {
    const remainingSlots = maxImages - value.length;
    
    if (remainingSlots === 0) {
      toast({
        title: 'Maximum images reached',
        description: `You can only upload up to ${maxImages} images`,
        variant: 'destructive',
      });
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select image files only (PNG, JPG, JPEG, GIF)',
          variant: 'destructive',
        });
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} is larger than 5MB`,
          variant: 'destructive',
        });
        continue;
      }
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      filesToUpload.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const newImages = [...value, ...result.imageUrls];
      
      onChange(newImages);
      
      toast({
        title: 'Upload successful',
        description: `${result.count} image(s) uploaded successfully`,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isUploading) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput) {
      toast({
        title: 'URL required',
        description: 'Please enter an image URL',
        variant: 'destructive',
      });
      return;
    }

    if (value.length >= maxImages) {
      toast({
        title: 'Maximum images reached',
        description: `You can only have up to ${maxImages} images`,
        variant: 'destructive',
      });
      return;
    }

    try {
      new URL(urlInput);
      const newImages = [...value, urlInput];
      onChange(newImages);
      setUrlInput('');
      
      toast({
        title: 'Image added',
        description: 'Image URL added successfully',
      });
    } catch {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid image URL',
        variant: 'destructive',
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
    
    toast({
      title: 'Image removed',
      description: 'Image has been removed successfully',
    });
  };

  const canUploadMore = value.length < maxImages;

  return (
    <div className={className}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2" data-testid="tabs-image-upload">
          <TabsTrigger value="upload" data-testid="tab-upload-file">Upload Files</TabsTrigger>
          <TabsTrigger value="url" data-testid="tab-image-url">Image URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              disabled || !canUploadMore 
                ? 'bg-gray-50 cursor-not-allowed' 
                : 'hover:border-primary cursor-pointer'
            }`}
            onClick={() => canUploadMore && !disabled && fileInputRef.current?.click()}
            data-testid="dropzone-upload"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              {canUploadMore 
                ? `Drag and drop images here, or click to select (${value.length}/${maxImages})`
                : `Maximum ${maxImages} images reached`
              }
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG, GIF up to 5MB each
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              disabled={disabled || !canUploadMore}
              data-testid="input-file-upload"
            />
          </div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={disabled || !canUploadMore}
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
              data-testid="input-image-url"
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || !canUploadMore || !urlInput}
              data-testid="button-add-url"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </div>
          {!canUploadMore && (
            <p className="text-sm text-amber-600">
              Maximum {maxImages} images reached. Remove an image to add more.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Image Previews */}
      {value.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">
            Images ({value.length}/{maxImages})
          </p>
          <div className="grid grid-cols-3 gap-4">
            {value.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg border-2 border-gray-200 overflow-hidden group"
                data-testid={`image-preview-${index}`}
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`button-remove-image-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index === 0 ? 'Main' : `#${index + 1}`}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The first image will be used as the main product image
          </p>
        </div>
      )}

      {isUploading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600 mt-2">Uploading images...</p>
        </div>
      )}
    </div>
  );
}
