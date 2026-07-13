export interface Movement {
  id: number;
  movement_type_id: number;
  adjustment_is_entry: boolean | null;
  movement_date: string;
  voucher: string | null;
  source_warehouse_id: number | null;
  destination_warehouse_id: number | null;
  original_voucher: string | null;
  third_party_id: number | null;
  third_party_document: string | null;
  third_party_phone: string | null;
  note: string | null;
  valuation_method: string;
  allow_out_of_stock: boolean;
  generate_reverse_movement: boolean;
  observations: string | null;
  total: string;
  status: string;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export type CreateMovementPayload =
  Omit<Movement, 'id' | 'created_at' | 'updated_at' | 'total' | 'status' | 'created_by'>;

export type UpdateMovementPayload = Partial<CreateMovementPayload>;
