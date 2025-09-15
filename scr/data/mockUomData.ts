import { UoM, UoMConversion, MeasureType } from '../types/uom'

export const mockUoMs: UoM[] = [
  // Piece units
  {
    id: '1',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    measure_type: 'Piece',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_base_unit: true
  },
  {
    id: '2',
    uom_code: 'BOX',
    uom_name: 'Box',
    measure_type: 'Piece',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    uom_code: 'CASE',
    uom_name: 'Case',
    measure_type: 'Piece',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    uom_code: 'PALLET',
    uom_name: 'Pallet',
    measure_type: 'Piece',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  // Weight units
  {
    id: '5',
    uom_code: 'G',
    uom_name: 'Gram',
    measure_type: 'Weight',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_base_unit: true
  },
  {
    id: '6',
    uom_code: 'KG',
    uom_name: 'Kilogram',
    measure_type: 'Weight',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    uom_code: 'TON',
    uom_name: 'Metric Ton',
    measure_type: 'Weight',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  // Volume units
  {
    id: '8',
    uom_code: 'ML',
    uom_name: 'Milliliter',
    measure_type: 'Volume',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_base_unit: true
  },
  {
    id: '9',
    uom_code: 'L',
    uom_name: 'Liter',
    measure_type: 'Volume',
    status: 'Active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const mockConversions: UoMConversion[] = [
  // Piece conversions
  {
    id: '1',
    from_uom_id: '2',
    from_uom: mockUoMs[1], // BOX
    to_uom_id: '1',
    to_uom: mockUoMs[0], // PCS
    multiplier: 12,
    note: '1 Box = 12 Pieces',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    from_uom_id: '1',
    from_uom: mockUoMs[0], // PCS
    to_uom_id: '2',
    to_uom: mockUoMs[1], // BOX
    multiplier: 1/12,
    note: 'Auto-generated inverse',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_system_generated: true
  },
  {
    id: '3',
    from_uom_id: '3',
    from_uom: mockUoMs[2], // CASE
    to_uom_id: '2',
    to_uom: mockUoMs[1], // BOX
    multiplier: 6,
    note: '1 Case = 6 Boxes',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    from_uom_id: '2',
    from_uom: mockUoMs[1], // BOX
    to_uom_id: '3',
    to_uom: mockUoMs[2], // CASE
    multiplier: 1/6,
    note: 'Auto-generated inverse',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_system_generated: true
  },
  {
    id: '5',
    from_uom_id: '4',
    from_uom: mockUoMs[3], // PALLET
    to_uom_id: '3',
    to_uom: mockUoMs[2], // CASE
    multiplier: 8,
    note: '1 Pallet = 8 Cases',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    from_uom_id: '3',
    from_uom: mockUoMs[2], // CASE
    to_uom_id: '4',
    to_uom: mockUoMs[3], // PALLET
    multiplier: 1/8,
    note: 'Auto-generated inverse',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_system_generated: true
  },
  // Weight conversions
  {
    id: '7',
    from_uom_id: '6',
    from_uom: mockUoMs[5], // KG
    to_uom_id: '5',
    to_uom: mockUoMs[4], // G
    multiplier: 1000,
    note: '1 KG = 1000 G',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    from_uom_id: '5',
    from_uom: mockUoMs[4], // G
    to_uom_id: '6',
    to_uom: mockUoMs[5], // KG
    multiplier: 0.001,
    note: 'Auto-generated inverse',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_system_generated: true
  },
  {
    id: '9',
    from_uom_id: '7',
    from_uom: mockUoMs[6], // TON
    to_uom_id: '6',
    to_uom: mockUoMs[5], // KG
    multiplier: 1000,
    note: '1 Ton = 1000 KG',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    from_uom_id: '6',
    from_uom: mockUoMs[5], // KG
    to_uom_id: '7',
    to_uom: mockUoMs[6], // TON
    multiplier: 0.001,
    note: 'Auto-generated inverse',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_system_generated: true
  },
  // Volume conversions
  {
    id: '11',
    from_uom_id: '9',
    from_uom: mockUoMs[8], // L
    to_uom_id: '8',
    to_uom: mockUoMs[7], // ML
    multiplier: 1000,
    note: '1 L = 1000 ML',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '12',
    from_uom_id: '8',
    from_uom: mockUoMs[7], // ML
    to_uom_id: '9',
    to_uom: mockUoMs[8], // L
    multiplier: 0.001,
    note: 'Auto-generated inverse',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    is_system_generated: true
  }
]

export const measureTypes: MeasureType[] = [
  'Piece',
  'Weight', 
  'Volume',
  'Length',
  'Area',
  'Time',
  'Temperature'
]

// Function to get active UoMs only
export function getActiveUoMs(): UoM[] {
  return mockUoMs.filter(uom => uom.status === 'Active')
}