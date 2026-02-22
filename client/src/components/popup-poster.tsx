import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Dialog, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PopupPoster {
  _id: string;
  imageUrl: string;
  title?: string;
  linkUrl?: string;
  isActive: boolean;
}

export default function PopupPoster() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClosedToday, setHasClosedToday] = useState(false);

  const { data: poster } = useQuery<PopupPoster | null>({
    queryKey: ['/api/popup-posters/active'],
  });

  useEffect(() => {
    if (poster && poster.isActive) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [poster]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!poster || !poster.isActive) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50 z-[9998]" />
        <DialogPrimitive.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className={cn(
            "fixed left-[50%] top-[50%] z-[9999] w-[90vw] max-w-lg translate-x-[-50%] translate-y-[-50%] p-0 overflow-hidden border-none bg-white dark:bg-gray-900 shadow-2xl rounded-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          data-testid="popup-poster-dialog"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-3 right-3 z-[10010] rounded-full bg-white/90 dark:bg-gray-800/90 p-2 text-gray-700 dark:text-gray-200 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-105"
            aria-label="Close popup"
            data-testid="button-close-popup"
          >
            <X className="w-5 h-5" />
          </button>
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden aspect-square flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              if (poster.linkUrl) {
                console.log('Popup poster clicked, redirecting to:', poster.linkUrl);
                // Pure redirection using a hidden anchor tag to ensure standard browser behavior
                const a = document.createElement('a');
                a.href = poster.linkUrl;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            }}
          >
            <img
              src={poster.imageUrl}
              alt={poster.title || 'Special Offer'}
              className="w-full h-full object-cover"
              data-testid="img-popup-poster"
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
