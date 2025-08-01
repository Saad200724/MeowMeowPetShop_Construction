// Utility to get the correct base URL for the application
export function getAppBaseUrl(): string {
  // In production or when accessed via replit.dev domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If we're on a replit.dev domain, use that
    if (hostname.includes('replit.dev')) {
      return `https://${hostname}`;
    }
    
    // If we're on localhost in development, try to get the replit domain
    if (hostname === 'localhost') {
      // Try to get the replit domain from the referer or other hints
      const replitDomain = getReplitDomainFromEnvironment();
      if (replitDomain) {
        return `https://${replitDomain}`;
      }
    }
    
    // Fallback to current origin
    return window.location.origin;
  }
  
  // Server-side fallback
  return 'http://localhost:5000';
}

function getReplitDomainFromEnvironment(): string | null {
  // Try to get the replit domain from various sources
  if (typeof window !== 'undefined') {
    // Check if we have any replit-specific indicators
    const userAgent = window.navigator.userAgent;
    
    // For now, we'll use a more direct approach
    // The user can manually set this if needed
    return null;
  }
  
  return null;
}