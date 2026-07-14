export interface MovementDetail {
  id: number;
  movement_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  keyId?: string; // key para el front
}

export type CreateMovementDetailPayload =
  Omit<MovementDetail, 'id' | 'movement_id' | 'created_at' | 'updated_at'>;