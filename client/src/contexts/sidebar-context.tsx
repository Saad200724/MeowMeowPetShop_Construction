
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

  // Reset sidebar visibility based on page when location changes
  useEffect(() => {
    if (isHomePage) {
      setIsVisible(true);  // Home page: show sidebar by default
    } else {
      setIsVisible(false); // Other pages: hide sidebar by default
    }
  }, [location, isHomePage]);

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
