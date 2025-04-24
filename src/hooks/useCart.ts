import { useState, useEffect, useCallback } from 'react';
import useCartStore from '../store/cartStore';
import { Product } from '../services/api';
import { CartItem } from '../store/cartStore';
import { AddToCartRequest } from '../services/api';

// Interface estendida que inclui a quantidade
interface ExtendedAddToCartRequest extends AddToCartRequest {
  quantity?: number;
}

export const useCart = () => {
  const { 
    cartItems, 
    cartCount, 
    addToCart: addToCartStore, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    addProductToCart: addProductToCartApi
  } = useCartStore();
  
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const calculateTotals = useCallback(() => {
    if (!cartItems.length) {
      setSubtotal(0);
      setTax(0);
      setShipping(0);
      setTotal(0);
      return;
    }

    const itemsSubtotal = cartItems.reduce(
      (sum: number, item: CartItem) => sum + parseFloat(item.product.price) * item.quantity,
      0
    );
    
    const shippingCost = itemsSubtotal > 100 ? 0 : 10;
    const taxAmount = itemsSubtotal * 0.16;
    
    setSubtotal(itemsSubtotal);
    setShipping(shippingCost);
    setTax(taxAmount);
    setTotal(itemsSubtotal + shippingCost + taxAmount);
  }, [cartItems]);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
  };

  const addProductToCart = async (request: ExtendedAddToCartRequest, productData?: Product) => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    
    try {
      const response = await addProductToCartApi(request);
      
      setIsSuccess(true);
      return response;
    } catch (error) {
      setIsError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cartItems,
    cartCount,
    addToCart: addToCartStore,
    removeFromCart,
    updateQuantity,
    clearCart,
    addProductToCart,
    isLoading,
    isSuccess,
    isError,
    subtotal,
    shipping,
    tax,
    total,
    formatPrice,
  };
};

// Exportação padrão para compatibilidade
export default useCart; 