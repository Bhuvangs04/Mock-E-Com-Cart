import { ShoppingCart, Store, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const { cart } = useCart();
  const itemCount = cart.items.reduce((sum, item) => sum + item.qty, 0);


  

  

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 shrink-0">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold hidden sm:inline">VibeShop</span>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative shrink-0">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-accent px-1 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
