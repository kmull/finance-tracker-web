export interface BudgetRequest {
  category: string;
  limit: number;
  month: string;
}

export interface Budget extends BudgetRequest {
  id: number;
  categoryDescription: string;
  totalSpent: number;
  exceeded: boolean;
}
