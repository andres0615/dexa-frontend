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

export const MOVEMENT_STATUSES = {
  PENDIENTE: 1,
  COMPLETADO: 2,
  CANCELADO: 3,
} as const;

// Flag para activar/desactivar el uso de valores demo
export const USE_DEMO_VALUES = true as const;

export const MOVEMENT_DEMO_VALUES = {
  movement_type_id: DEMO_VALUES.movement_type_id,
  adjustment_is_entry: false,
  movement_date: new Date().toISOString().split('T')[0],
  voucher: 'FV-001-00000123',
  source_warehouse_id: null,
  destination_warehouse_id: DEMO_VALUES.destination_warehouse_id,
  original_voucher: null,
  third_party_id: DEMO_VALUES.third_party_id,
  third_party_document: '12345678',
  third_party_phone: '999888777',
  note: 'Compra de prueba — verificar flujo completo',
  valuation_method: 'promedio',
  allow_out_of_stock: false,
  generate_reverse_movement: true,
  observations: 'Observaciones de prueba',
  details: [{ product_id: null, quantity: 1, unit_cost: 0, subtotal: 0 }],
} as const;

export const PRODUCT_DEMO_VALUES = {
  name: "Test",
  category_id: 1,
  unit_of_measurement: "UND",
  cost_price: 10000,
  sale_price: 15000,
  code: "CAM-001",
};

export const USER_DEMO_VALUES = {
  name: "Test",
  email: "test@example.com",
  password: "manzana12345",
  password_confirmation: "manzana12345",
};