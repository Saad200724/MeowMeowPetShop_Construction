
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';

interface SidebarContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  toggle: () => void;
  isHomePage: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const isHomePage = location === '/';

  // Check if device is mobile (screen width < 768px)
  const isMobile = () => {
    return window.innerWidth < 768;
  };

  // Reset sidebar visibility based on page and device when location changes
  useEffect(() => {
    if (isHomePage && !isMobile()) {
      // Home page on desktop/tablet: show sidebar by default
      setIsVisible(true);
    } else {
      // Other pages or mobile: hide sidebar by default
      setIsVisible(false);
    }
  }, [location, isHomePage]);

  // Handle window resize to adjust sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      if (isHomePage && !isMobile()) {
        setIsVisible(true);
      } else if (isMobile()) {
        setIsVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isHomePage]);

  const toggle = () => setIsVisible(!isVisible);

  return (
    <SidebarContext.Provider value={{ isVisible, setIsVisible, toggle, isHomePage }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
