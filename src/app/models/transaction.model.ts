export interface TransactionRequest {
  amount: number;
  category: string;
  description: string;
  date: string; // ISO format
}

export interface Transaction extends TransactionRequest {
  id: number;
}
