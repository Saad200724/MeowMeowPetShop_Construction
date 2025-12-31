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
  isActive: boolean;
}

export default function PopupPoster() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClosedToday, setHasClosedToday] = useState(false);

  const { data: poster } = useQuery<PopupPoster | null>({
    queryKey: ['/api/popup-posters/active'],
  });

  useEffect(() => {
    const closedTimestamp = localStorage.getItem('popup-poster-closed');
    const today = new Date().toDateString();

    if (closedTimestamp) {
      const closedDate = new Date(closedTimestamp).toDateString();
      if (closedDate === today) {
        setHasClosedToday(true);
        return;
      }
    }

    if (poster && poster.isActive && !hasClosedToday) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [poster, hasClosedToday]);

  const handleClose = () => {
    setIsOpen(false);
    setHasClosedToday(true);
    localStorage.setItem('popup-poster-closed', new Date().toISOString());
  };

  if (!poster || !poster.isActive || hasClosedToday) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-[9999] w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] p-0 overflow-hidden border-none bg-white dark:bg-gray-900 shadow-2xl rounded-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
          data-testid="popup-poster-dialog"
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-[10000] rounded-full bg-white/90 dark:bg-gray-800/90 p-2.5 text-gray-700 dark:text-gray-200 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
            aria-label="Close popup"
            data-testid="button-close-popup"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
            <img
              src={poster.imageUrl}
              alt={poster.title || 'Special Offer'}
              className="w-full h-auto max-h-[85vh] object-contain"
              data-testid="img-popup-poster"
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
