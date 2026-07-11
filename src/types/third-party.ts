export interface ThirdParty {
  id: number;
  third_party_type_id: number;
  name: string;
  tax_id: string;
  email: string;
  phone: string;
  address: string;
  is_active: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ThirdPartyFilters {
  third_party_type_id?: number;
  name?: string;
}