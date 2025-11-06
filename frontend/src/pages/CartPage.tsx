import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CheckoutModal } from '@/components/CheckoutModal';
import { toast } from 'sonner';

export const CartPage = () => {
  const { cart, removeFromCart, isLoading, fetchCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const API_BASE = 'http://localhost:5000';

  const updateQuantity = async (productId: number, newQty: number) => {
    if (newQty < 1) {
      await removeFromCart(productId);
      return;
    }

    setUpdatingId(productId);
    try {
      const response = await fetch(`${API_BASE}/api/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: newQty }),
      });

      if (response.ok) {
        await fetchCart(); 
        toast.success('Cart updated');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update quantity');
      }
    } catch (err) {
      toast.error('Network error updating quantity');
      console.error('Quantity update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <ShoppingBag className="mb-4 h-20 w-20 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Add some products to get started!</p>
        <Link to="/">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={updatingId === item.productId || isLoading}
                        onClick={() => updateQuantity(item.productId, item.qty - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={updatingId === item.productId || isLoading}
                        onClick={() => updateQuantity(item.productId, item.qty + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="mt-2 text-lg font-bold text-primary">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.productId)}
                    disabled={isLoading || updatingId === item.productId}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold">₹{cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Shipping</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{cart.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent/90"
                onClick={() => setIsCheckoutOpen(true)}
                disabled={isLoading || updatingId !== null}
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <CheckoutModal open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </div>
  );
};
