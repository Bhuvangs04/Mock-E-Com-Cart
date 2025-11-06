import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';


interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

export const ProductCard = ({ id, name, price, image_url }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();


  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <Badge className="absolute right-2 top-2 bg-primary text-primary-foreground">
            ₹{price.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">{name}</h3>
        <Button
          onClick={() => addToCart(id, name, price)}
          disabled={isLoading}
          className="w-full bg-accent hover:bg-accent/90 transition-all duration-300"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
