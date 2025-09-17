export interface UoM {
  id: string
  uom_code: string
  uom_name: string
  measure_type: MeasureType
  status: UoMStatus
  created_at: string
  updated_at: string
  is_base_unit?: boolean
}

export interface UoMConversion {
  id: string
  from_uom_id: string
  from_uom: UoM
  to_uom_id: string
  to_uom: UoM
  multiplier: number
  note?: string
  created_at: string
  updated_at: string
  is_system_generated?: boolean // for inverse relationships
}

export type MeasureType = 
  | 'Piece' 
  | 'Weight' 
  | 'Volume' 
  | 'Length' 
  | 'Area' 
  | 'Time' 
  | 'Temperature'

export type UoMStatus = 'Active' | 'Inactive'

export interface UoMFilter {
  measure_type?: MeasureType
  status?: UoMStatus
  search?: string
}

export interface ConversionChain {
  from_uom: UoM
  to_uom: UoM
  total_multiplier: number
  chain: UoMConversion[]
}