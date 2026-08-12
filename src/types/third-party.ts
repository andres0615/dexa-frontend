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

// Payload para crear un tercero
export type CreateThirdPartyPayload = Omit<ThirdParty, 'id' | 'created_at' | 'updated_at'>;

// Payload para actualizar un tercero (PUT parcial)
export type UpdateThirdPartyPayload = Partial<Omit<ThirdParty, 'id' | 'created_at' | 'updated_at'>>;