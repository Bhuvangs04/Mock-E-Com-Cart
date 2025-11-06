// src/components/CheckoutModal.jsx (Updated)

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { CheckCircle } from 'lucide-react';

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutModal = ({ open, onOpenChange }: CheckoutModalProps) => {
  const { checkout, isLoading, cart, clearCart } = useCart();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [receipt, setReceipt] = useState<any>(null);

  const handleClose = (newOpenState: boolean) => {
    if (newOpenState === false) {
      setReceipt(null);
      setFormData({ name: '', email: '' });
      onOpenChange(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.total <= 0) {
      alert("Cannot checkout with an empty cart!");
      return;
    }

    try {
      const receiptData = await checkout(formData);
      receiptData.finalTotal = parseFloat(receiptData.finalTotal).toFixed(2);
      setReceipt(receiptData);

    } catch (error) {
      console.error("Checkout Error:", error);
    }
  };

  const handleContinueShopping = () => {
    clearCart();
    setReceipt(null);
    setFormData({ name: '', email: '' });
    onOpenChange(false);
  };



  if (receipt) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl">Order Confirmed! </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-secondary p-4">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-semibold">{receipt.orderId}</p>
            </div>

    
            <div className="space-y-1 text-sm">
              <p>Customer: <span className="font-semibold">{receipt.customer.name}</span></p>
              <p>Email: <span className="font-semibold">{receipt.customer.email}</span></p>
              <p className="text-muted-foreground">Status: {receipt.status}</p>
            </div>

            <div className="border-y py-3 space-y-2">
              <h3 className="font-semibold">Order Breakdown:</h3>
              {receipt.items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.qty}x {item.name}</span>
                  <span className="font-medium">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

      
            <div className="flex justify-between text-xl font-bold pt-2">
              <span>Final Total:</span>
              <span className="text-primary">₹{receipt.finalTotal}</span>
            </div>

            <Button onClick={handleContinueShopping} className="w-full bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Test"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="test@gmail.com"
            />
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary">₹{cart.total.toFixed(2)}</span>
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90"
            disabled={isLoading || cart.total <= 0 || !formData.name || !formData.email}
          >
            {isLoading ? 'Processing...' : `Pay ₹${cart.total.toFixed(2)} (Mock)`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};