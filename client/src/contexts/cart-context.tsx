import { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
  weight?: string | null;
  color?: string | null;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  appliedCoupon: AppliedCoupon | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; appliedCoupon: AppliedCoupon | null } }
  | { type: 'APPLY_COUPON'; payload: AppliedCoupon }
  | { type: 'REMOVE_COUPON' };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  getFinalTotal: () => number;
  calculateDeliveryFee: (location: 'Inside Dhaka' | 'Outside Dhaka', district?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'meow-meow-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // If item exists, increase quantity (up to max stock)
        const newQuantity = Math.min(existingItem.quantity + 1, existingItem.maxStock);
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      } else {
        // Add new item with quantity 1
        const newItem: CartItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const updatedItems = state.items.filter(item => item.id !== id);
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
        };
      }
      
      const updatedItems = state.items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.maxStock) }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
        appliedCoupon: null,
      };
    
    case 'LOAD_CART': {
      const { items, appliedCoupon } = action.payload;
      return {
        items,
        total: calculateTotal(items),
        itemCount: calculateItemCount(items),
        appliedCoupon,
      };
    }
    
    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupon: action.payload,
      };
      
    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupon: null,
      };
    
    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    appliedCoupon: null,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Support both old format (just items array) and new format (object with items and coupon)
        if (Array.isArray(parsedCart)) {
          dispatch({ type: 'LOAD_CART', payload: { items: parsedCart, appliedCoupon: null } });
        } else {
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items: state.items,
        appliedCoupon: state.appliedCoupon
      }));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items, state.appliedCoupon]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (id: string): number => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const applyCoupon = (coupon: AppliedCoupon) => {
    dispatch({ type: 'APPLY_COUPON', payload: coupon });
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const getFinalTotal = (): number => {
    return state.appliedCoupon ? Math.max(0, state.total - state.appliedCoupon.discount) : state.total;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    applyCoupon,
    removeCoupon,
    getFinalTotal,
    calculateDeliveryFee: (location: 'Inside Dhaka' | 'Outside Dhaka', district?: string) => {
      const totalWeight = state.items.reduce((sum, item) => {
        const weightNum = parseFloat(item.weight?.replace(/[^0-9.]/g, '') || '0');
        return sum + (weightNum * (item.quantity || 1));
      }, 0);

      const normalizedDistrict = district?.toLowerCase() || '';
      const isDhakaCity = normalizedDistrict === 'dhaka city';
      
      // Dhaka City: 80tk up to 2kg, +20tk per additional kg
      // Dhaka City: 80tk up to 2kg, +20tk per additional kg
      if (isDhakaCity) {
        const baseFee = 80;
        if (totalWeight <= 2) return baseFee;
        const extraWeight = Math.ceil(totalWeight - 2);
        return baseFee + (extraWeight * 20);
      } else {
        // Others (including Dhaka Sub-Urban): 130tk up to 1kg, +20tk per additional kg
        const baseFee = 130;
        if (totalWeight <= 1) return baseFee;
        const extraWeight = Math.ceil(totalWeight - 1);
        return baseFee + (extraWeight * 20);
      }
    }
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}