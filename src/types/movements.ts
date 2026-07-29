import type { MovementDetail, CreateMovementDetailPayload } from '@/types/movement-detail';
import type { MovementType } from '@/types/movement-types';
import type { MovementStatus } from '@/types/movement-status';

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
  status_id: number;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  details: MovementDetail[] | null;
  movement_type: MovementType;
  status: MovementStatus;
}

export type CreateMovementPayload =
  Omit<Movement, 'id' | 'created_at' | 'updated_at' | 'status_id' | 'created_by' | 'details' | 'movement_type' | 'status' > & {
    details: CreateMovementDetailPayload[];
  };

export type UpdateMovementPayload = Partial<CreateMovementPayload> & {
    // el status_id es editable
    status_id: number;
  };
