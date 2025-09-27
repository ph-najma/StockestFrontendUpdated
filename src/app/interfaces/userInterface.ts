// auth.models.ts
import { Stock } from '../services/api.service';
import { IOrder } from '../services/order.service';
export interface LoginData {
  email: string;
  password: string;
}

export interface AdminLoginData {
  email: string;
  password: string;
}
export interface ResponseModel<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface LoginResponseData {
  token: string;
  message?: string;
}

export type LoginResponse = ResponseModel<LoginResponseData>;

export interface GoogleLoginResponse {
  token: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}
// portfolio.models.ts
export interface PortfolioItem {
  stock: Stock; // The stock details (e.g., stock ID)
  quantity: number; // The quantity of the stock
  currentValue: number; // The current value of the stock
  overallProfit: number; // The overall profit from the stock
  todaysProfit: number; // Today's profit from the stock
}

export interface PortfolioSummary {
  totalPortfolioValue: number;
  overallProfit: number;
  todaysProfit: number;
}

export interface PortfolioResponse {
  portfolio: PortfolioItem[];
  totalPortfolioValue: number;
  overallProfit: number;
  todaysProfit: number;
}
export type PortfolioResponseModel = ResponseModel<PortfolioResponse>;

export interface OrderResponseData {
  currentPage: number;
  orders: IOrder[];
  totalOrders: number;
  totalPages: number;
}
export interface OrderResponse {
  success: boolean;
  message: string;
  data: OrderResponseData;
}
