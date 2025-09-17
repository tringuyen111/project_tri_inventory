import { GoodsIssue } from '../types/goodsIssue'

export const mockGoodsIssues: GoodsIssue[] = [
  {
    issue_no: 'GI-2024-001',
    issue_type: 'SO',
    status: 'Draft',
    partner_name: 'Blue Ocean Supermarket',
    from_wh_name: 'Warehouse District 7',
    to_wh_name: 'Blue Ocean - Go Vap',
    expected_date: '2024-06-22',
    created_at: '2024-06-16T13:25:00Z',
    created_by: 'Vo Hoang C',
    lines: [
      {
        line_id: '1',
        sku: 'SKU-4120',
        product_name: 'Instant Noodles Spicy',
        planned_qty: 300,
        picked_qty: 0,
        uom: 'case'
      },
      {
        line_id: '2',
        sku: 'SKU-4150',
        product_name: 'Instant Noodles Chicken',
        planned_qty: 300,
        picked_qty: 0,
        uom: 'case'
      }
    ]
  },
  {
    issue_no: 'GI-2024-002',
    issue_type: 'SO',
    status: 'Picking',
    partner_name: 'Acme Retailers',
    from_wh_name: 'Central WH',
    to_wh_name: 'Acme - District 1',
    expected_date: '2024-06-18',
    created_at: '2024-06-15T08:42:00Z',
    created_by: 'Nguyen Van A',
    lines: [
      {
        line_id: '1',
        sku: 'SKU-1001',
        product_name: 'Arabica Coffee Beans 1kg',
        planned_qty: 120,
        picked_qty: 115,
        uom: 'bag'
      },
      {
        line_id: '2',
        sku: 'SKU-1045',
        product_name: 'Premium Tea Blend 500g',
        planned_qty: 80,
        picked_qty: 80,
        uom: 'box'
      }
    ]
  },
  {
    issue_no: 'GI-2024-003',
    issue_type: 'Adjustment',
    status: 'AdjustmentRequested',
    partner_name: 'Cycle Count',
    from_wh_name: 'Central WH',
    expected_date: '2024-06-21',
    created_at: '2024-06-16T09:10:00Z',
    created_by: 'Pham Van F',
    lines: [
      {
        line_id: '1',
        sku: 'SKU-3300',
        product_name: 'PET Bottles 500ml',
        planned_qty: 200,
        picked_qty: 0,
        uom: 'pcs'
      }
    ]
  },
  {
    issue_no: 'GI-2024-004',
    issue_type: 'Transfer',
    status: 'Submitted',
    partner_name: 'Internal Transfer',
    from_wh_name: 'Central WH',
    to_wh_name: 'Warehouse District 7',
    expected_date: '2024-06-19',
    created_at: '2024-06-14T10:10:00Z',
    created_by: 'Tran Thi B',
    lines: [
      {
        line_id: '1',
        sku: 'SKU-2090',
        product_name: 'Glass Bottles 330ml',
        planned_qty: 500,
        picked_qty: 500,
        uom: 'pcs'
      },
      {
        line_id: '2',
        sku: 'SKU-3099',
        product_name: 'Bottle Caps - Aluminum',
        planned_qty: 500,
        picked_qty: 498,
        uom: 'pcs'
      }
    ]
  },
  {
    issue_no: 'GI-2024-005',
    issue_type: 'ReturnToSupplier',
    status: 'Approved',
    partner_name: 'Urban Mini Mart',
    from_wh_name: 'Warehouse District 9',
    to_wh_name: 'Vendor Returns',
    expected_date: '2024-06-20',
    created_at: '2024-06-17T07:12:00Z',
    created_by: 'Nguyen Thanh E',
    lines: [
      {
        line_id: '1',
        sku: 'SKU-5200',
        product_name: 'Yogurt Strawberry 6x100ml',
        planned_qty: 200,
        picked_qty: 0,
        uom: 'pack'
      }
    ]
  },
  {
    issue_no: 'GI-2024-006',
    issue_type: 'Manual',
    status: 'Completed',
    partner_name: 'Quality Disposal',
    from_wh_name: 'Central WH',
    to_wh_name: 'Scrap Yard',
    expected_date: '2024-06-12',
    created_at: '2024-06-10T09:05:00Z',
    created_by: 'Le Thi D',
    lines: [
      {
        line_id: '1',
        sku: 'SKU-9001',
        product_name: 'Expired Snack Packs',
        planned_qty: 150,
        picked_qty: 150,
        uom: 'case'
      }
    ]
  },
  {
    issue_no: 'GI-2024-007',
    issue_type: 'SO',
    status: 'Cancelled',
    partner_name: 'Sunrise Convenience',
    from_wh_name: 'Warehouse District 5',
    to_wh_name: 'Sunrise - District 3',
    expected_date: '2024-06-25',
    created_at: '2024-06-18T11:40:00Z',
    created_by: 'Dang Gia H',
    lines: [
      {
        line_id: '1',
        sku: 'SKU-6100',
        product_name: 'Sparkling Water Lime 12x330ml',
        planned_qty: 90,
        picked_qty: 0,
        uom: 'case'
      }
    ]
  }
]
