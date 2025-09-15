import { Lot } from '../types/lot'

export const mockLots: Lot[] = [
  {
    lot_code: 'LOT001',
    model_code: 'MD_004',
    model_name: 'Network Cable Cat6',
    uom_code: 'KG',
    uom_name: 'Kilogram',
    wh_code: 'WH_001',
    wh_name: 'Main Warehouse',
    loc_code: 'LO_001',
    loc_name: 'General Storage Area A',
    received_date: '2024-01-15',
    mfg_date: '2024-01-10',
    exp_date: '2026-01-10',
    status: 'Active',
    qty_onhand: 150,
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z'
  },
  {
    lot_code: 'LOT002',
    model_code: 'MD_004',
    model_name: 'Network Cable Cat6',
    uom_code: 'KG',
    uom_name: 'Kilogram',
    wh_code: 'WH_001',
    wh_name: 'Main Warehouse',
    loc_code: 'LO_002',
    loc_name: 'Raw Materials Section',
    received_date: '2024-02-10',
    mfg_date: '2024-02-05',
    exp_date: '2026-02-05',
    status: 'Active',
    qty_onhand: 75,
    created_at: '2024-02-10T09:30:00Z',
    updated_at: '2024-02-10T09:30:00Z'
  },
  {
    lot_code: 'LOT003',
    model_code: 'MD_007',
    model_name: 'Pharmaceutical Compound A',
    uom_code: 'G',
    uom_name: 'Gram',
    wh_code: 'WH_002',
    wh_name: 'Raw Materials Warehouse',
    loc_code: 'LO_004',
    loc_name: 'Electronics Storage',
    received_date: '2024-01-20',
    mfg_date: '2024-01-15',
    exp_date: '2025-01-15',
    status: 'Active',
    qty_onhand: 200,
    created_at: '2024-01-20T10:15:00Z',
    updated_at: '2024-01-20T10:15:00Z'
  },
  {
    lot_code: 'LOT004',
    model_code: 'MD_008',
    model_name: 'Cotton Fabric Roll',
    uom_code: 'KG',
    uom_name: 'Kilogram',
    wh_code: 'WH_001',
    wh_name: 'Main Warehouse',
    loc_code: 'LO_003',
    loc_name: 'Finished Goods Area',
    received_date: '2024-03-01',
    mfg_date: '2024-02-28',
    exp_date: '2025-02-28',
    status: 'Active',
    qty_onhand: 50,
    created_at: '2024-03-01T11:00:00Z',
    updated_at: '2024-03-01T11:00:00Z'
  },
  {
    lot_code: 'LOT005',
    model_code: 'MD_009',
    model_name: 'Electronic Component Package',
    uom_code: 'BOX',
    uom_name: 'Box',
    wh_code: 'WH_003',
    wh_name: 'Regional Hub',
    loc_code: 'LO_007',
    loc_name: 'Distribution Zone A',
    received_date: '2024-01-05',
    mfg_date: '2024-01-01',
    exp_date: '2026-01-01',
    status: 'Active',
    qty_onhand: 0,
    created_at: '2024-01-05T07:45:00Z',
    updated_at: '2024-03-15T14:20:00Z'
  },
  {
    lot_code: 'LOT006',
    model_code: 'MD_007',
    model_name: 'Pharmaceutical Compound A',
    uom_code: 'G',
    uom_name: 'Gram',
    wh_code: 'WH_002',
    wh_name: 'Raw Materials Warehouse',
    loc_code: 'LO_006',
    loc_name: 'Tools & Equipment Area',
    received_date: '2023-12-15',
    mfg_date: '2023-12-10',
    exp_date: '2024-12-10',
    status: 'Inactive',
    qty_onhand: 0,
    created_at: '2023-12-15T16:30:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  }
]

// Helper function to get lots with FIFO ordering
export const getLotsByFIFO = (modelCode?: string, whCode?: string): Lot[] => {
  let filteredLots = mockLots.filter(lot => lot.status === 'Active' && lot.qty_onhand > 0)
  
  if (modelCode) {
    filteredLots = filteredLots.filter(lot => lot.model_code === modelCode)
  }
  
  if (whCode) {
    filteredLots = filteredLots.filter(lot => lot.wh_code === whCode)
  }
  
  // Sort by received_date (earliest first) for FIFO
  return filteredLots.sort((a, b) => new Date(a.received_date).getTime() - new Date(b.received_date).getTime())
}