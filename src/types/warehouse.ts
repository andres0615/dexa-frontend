export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
