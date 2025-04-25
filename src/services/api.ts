import axios from 'axios';

const API_BASE_URL = 'https://itx-frontend-test.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface Product {
  id: string;
  brand: string;
  model: string;
  price: string;
  imgUrl: string;
  options: {
    colors: Array<{
      code: number;
      name: string;
    }>;
    storages: Array<{
      code: number;
      name: string;
    }>;
  };
}

export interface AddToCartRequest {
  id: string;
  colorCode: number;
  storageCode: number;
}

export interface AddToCartResponse {
  count: number;
}

export interface CheckoutRequest {
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  items: Array<{
    id: string;
    colorCode: number;
    storageCode: number;
    quantity: number;
  }>;
}

export interface CheckoutResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/product');
  return response.data;
};

export const fetchProductDetails = async (productId: string): Promise<Product> => {
  const response = await api.get<Product>(`/product/${productId}`);
  return response.data;
};

export const addToCart = async (request: AddToCartRequest): Promise<AddToCartResponse> => {
  const response = await api.post<AddToCartResponse>('/cart', request);
  return response.data;
};

export const processCheckout = async (request: CheckoutRequest): Promise<CheckoutResponse> => {
  try {
    const response = await api.post<CheckoutResponse>('/checkout', request);
    return response.data;
  } catch (error) {
    console.error('Error al procesar el checkout:', error);
    return {
      success: false,
      message: 'Error al procesar el checkout'
    };
  }
};

export default api; 