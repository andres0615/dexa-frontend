import type { MovementDetail, CreateMovementDetailPayload } from '@/types/movement-detail';
import type { MovementType } from '@/types/movement-types';
import type { MovementStatus } from '@/types/movement-status';
import type { ThirdParty } from '@/types/third-party';

export interface Movement {
  id: number;
  movement_type_id: number;
  adjustment_is_entry: boolean | null;
  movement_date: string;
  voucher: string | null;
  original_voucher: string | null;
  third_party_id: number | null;
  third_party_document: string | null;
  third_party_phone: string | null;
  note: string | null;
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
  thirdParty: ThirdParty;
}

export type CreateMovementPayload =
  Omit<Movement, 'id' | 'created_at' | 'updated_at' | 'status_id' | 'created_by' | 'details' | 'movement_type' | 'status' > & {
    details: CreateMovementDetailPayload[];
  };

export type UpdateMovementPayload = Partial<CreateMovementPayload> & {
    // el status_id es editable
    status_id: number;
  };

export interface MovementFilters {
  voucher: string | null;
  movement_type_id: number | null;
  date_from: string | null;
  date_to: string | null;
}
