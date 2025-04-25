import { useState } from 'react';
import { processCheckout, CheckoutRequest, CheckoutResponse } from '../services/api';
import useCart from './useCart';

interface UseCheckoutReturn {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  orderData: CheckoutResponse | null;
  submitCheckout: (customerDetails: CheckoutRequest['customerDetails']) => Promise<CheckoutResponse>;
}

const useCheckout = (): UseCheckoutReturn => {
  const { cartItems, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [orderData, setOrderData] = useState<CheckoutResponse | null>(null);

  const submitCheckout = async (customerDetails: CheckoutRequest['customerDetails']): Promise<CheckoutResponse> => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    
    try {
      const checkoutItems = cartItems.map(item => ({
        id: item.product.id,
        colorCode: item.colorCode,
        storageCode: item.storageCode,
        quantity: item.quantity
      }));

      const checkoutRequest: CheckoutRequest = {
        customerDetails,
        items: checkoutItems
      };

      const response = await processCheckout(checkoutRequest);
      
      setOrderData(response);
      setIsSuccess(response.success);
      
      if (response.success) {
        clearCart();
      }
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido en el proceso de checkout');
      setError(error);
      setIsError(true);
      
      return {
        success: false,
        message: error.message
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSuccess,
    isError,
    error,
    orderData,
    submitCheckout
  };
};

export default useCheckout; 