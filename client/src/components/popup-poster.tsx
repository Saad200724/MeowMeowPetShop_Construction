import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

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
    localStorage.setItem('popup-poster-closed', new Date().toISOString());
  };

  if (!poster || !poster.isActive || hasClosedToday) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-2xl"
        data-testid="popup-poster-dialog"
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
          aria-label="Close popup"
          data-testid="button-close-popup"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="relative">
          <img
            src={poster.imageUrl}
            alt={poster.title || 'Special Offer'}
            className="w-full h-auto max-h-[90vh] object-contain"
            data-testid="img-popup-poster"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
