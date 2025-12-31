import {
  Home,
  Search,
  Grid3X3,
  User,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/cart-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { useChat } from "@/contexts/chat-context";

const logoPath = "/logo.png";

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { state: cartState } = useCart();
  const { toggle: toggleSidebar } = useSidebar();
  const { openChat, isChatOpen } = useChat();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleCategoriesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleSidebar();
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[1001] safe-area-pb">
      <div className="flex items-center justify-around py-1 px-2">
        {/* Categories */}
        <button
          onClick={handleCategoriesClick}
          className="flex flex-col items-center justify-center py-2 px-3 transition-colors"
          data-testid="mobile-nav-categories"
        >
          <Grid3X3 size={18} className="text-gray-600" />
          <span className="text-xs text-gray-600 mt-1">Categories</span>
        </button>

        {/* Search */}
        <button
          onClick={() => {
            const searchInput = document.querySelector('[data-testid="input-mobile-search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
            isActive("/products") ? "text-[#26732d]" : "text-gray-600"
          }`}
          data-testid="mobile-nav-search"
        >
          <Search size={18} />
          <span className="text-xs mt-1">Search</span>
        </button>

        {/* Home with Logo */}
        <Link href="/">
          <div
            className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
              isActive("/") ? "text-[#26732d]" : "text-gray-600"
            }`}
            data-testid="mobile-nav-home"
          >
            <img src={logoPath} alt="Home" className="w-10 h-10" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>

        {/* My Profile */}
        <Link href="/dashboard">
          <div
            className={`flex flex-col items-center justify-center py-2 px-3 transition-colors ${
              isActive("/dashboard") || isActive("/profile")
                ? "text-[#26732d]"
                : "text-gray-600"
            }`}
            data-testid="mobile-nav-profile"
          >
            <User size={18} />
            <span className="text-xs mt-1">My Profile</span>
          </div>
        </Link>

        {/* Chat */}
        <button
          onClick={openChat}
          className={`flex flex-col items-center justify-center py-2 px-3 transition-colors relative ${
            isChatOpen ? "text-[#26732d]" : "text-gray-600"
          }`}
          data-testid="mobile-nav-chat"
        >
          <MessageCircle size={18} />
          <span className="text-xs mt-1">Chat</span>
        </button>
      </div>
    </div>
  );
}
