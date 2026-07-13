export const MOVEMENT_TYPE_IDS = {
  COMPRA: 1,
  VENTA: 2,
  AJUSTE: 3,
  DEVOLUCION: 4,
  TRASLADO: 5,
} as const;

export const TIPOS_TERCERO = {
  PROVEEDOR: 1,
  CLIENTE: 2,
} as const;

export const DEMO_VALUES = {
  source_warehouse_id: 1,
  destination_warehouse_id: 1,
  third_party_id: 1,
  movement_type_id: MOVEMENT_TYPE_IDS.COMPRA,
} as const;