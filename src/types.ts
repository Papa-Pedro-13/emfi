export interface Deal {
  id: number;
  name: string;
  price: number;
  task_date?: string;
  created_at?: string;
}

export interface DealDetailsType {
  id: number;
  name: string;
  price: number;
  task_date: string;
  created_at: string;
}
