import { GoodsIssue } from '../types/goodsIssue'

export const mockGoodsIssues: GoodsIssue[] = [
  {
    issue_no: 'GI-2024-001',
    issue_type: 'Sales Order',
    status: 'Picking',
    partner_name: 'Acme Retailers',
    from_wh_name: 'Central WH',
    to_wh_name: 'Acme - District 1',
    expected_date: '2024-06-18',
    created_at: '2024-06-15T08:42:00Z',
    created_by: 'Nguyen Van A',
    statusHistory: [
      {
        status: 'Draft',
        changedAt: '2024-06-14T07:30:00Z',
        changedBy: 'Nguyen Van A'
      },
      {
        status: 'Picking',
        changedAt: '2024-06-15T09:00:00Z',
        changedBy: 'Nguyen Van A'
      }
    ],
    lines: [
      {
        line_id: '1',
        sku: 'SKU-1001',
        product_name: 'Arabica Coffee Beans 1kg',
        planned_qty: 120,
        picked_qty: 115,
        uom: 'bag',
        tracking_type: 'SERIAL',
        serials: Array.from({ length: 115 }, (_, index) => `ACB-2024-${index + 1}`),
        lot_allocations: []
      },
      {
        line_id: '2',
        sku: 'SKU-1045',
        product_name: 'Premium Tea Blend 500g',
        planned_qty: 80,
        picked_qty: 80,
        uom: 'box',
        tracking_type: 'NONE',
        serials: [],
        lot_allocations: []
      }
    ]
  },
  {
    issue_no: 'GI-2024-002',
    issue_type: 'Transfer',
    status: 'Approved',
    partner_name: 'Internal Transfer',
    from_wh_name: 'Central WH',
    to_wh_name: 'Warehouse District 7',
    expected_date: '2024-06-19',
    created_at: '2024-06-14T10:10:00Z',
    created_by: 'Tran Thi B',
    statusHistory: [
      {
        status: 'Draft',
        changedAt: '2024-06-13T09:20:00Z',
        changedBy: 'Tran Thi B'
      },
      {
        status: 'Picking',
        changedAt: '2024-06-14T10:20:00Z',
        changedBy: 'Tran Thi B'
      },
      {
        status: 'Submitted',
        changedAt: '2024-06-15T15:35:00Z',
        changedBy: 'Tran Thi B'
      },
      {
        status: 'Approved',
        changedAt: '2024-06-16T11:10:00Z',
        changedBy: 'Warehouse Manager'
      }
    ],
    lines: [
      {
        line_id: '1',
        sku: 'SKU-2090',
        product_name: 'Glass Bottles 330ml',
        planned_qty: 500,
        picked_qty: 500,
        uom: 'pcs',
        tracking_type: 'LOT',
        serials: [],
        lot_allocations: [
          { lotNumber: 'LOT001', quantity: 300 },
          { lotNumber: 'LOT002', quantity: 200 }
        ]
      },
      {
        line_id: '2',
        sku: 'SKU-3099',
        product_name: 'Bottle Caps - Aluminum',
        planned_qty: 500,
        picked_qty: 498,
        uom: 'pcs',
        tracking_type: 'NONE',
        serials: [],
        lot_allocations: []
      }
    ]
  },
  {
    issue_no: 'GI-2024-003',
    issue_type: 'Sales Order',
    status: 'Draft',
    partner_name: 'Blue Ocean Supermarket',
    from_wh_name: 'Warehouse District 7',
    to_wh_name: 'Blue Ocean - Go Vap',
    expected_date: '2024-06-22',
    created_at: '2024-06-16T13:25:00Z',
    created_by: 'Vo Hoang C',
    statusHistory: [
      {
        status: 'Draft',
        changedAt: '2024-06-16T13:25:00Z',
        changedBy: 'Vo Hoang C'
      }
    ],
    lines: [
      {
        line_id: '1',
        sku: 'SKU-4120',
        product_name: 'Instant Noodles Spicy',
        planned_qty: 300,
        picked_qty: 0,
        uom: 'case',
        tracking_type: 'LOT',
        serials: [],
        lot_allocations: []
      },
      {
        line_id: '2',
        sku: 'SKU-4150',
        product_name: 'Instant Noodles Chicken',
        planned_qty: 300,
        picked_qty: 0,
        uom: 'case',
        tracking_type: 'NONE',
        serials: [],
        lot_allocations: []
      }
    ]
  },
  {
    issue_no: 'GI-2024-004',
    issue_type: 'Manual',
    status: 'Completed',
    partner_name: 'Quality Disposal',
    from_wh_name: 'Central WH',
    to_wh_name: 'Scrap Yard',
    expected_date: '2024-06-12',
    created_at: '2024-06-10T09:05:00Z',
    created_by: 'Le Thi D',
    statusHistory: [
      {
        status: 'Draft',
        changedAt: '2024-06-09T08:00:00Z',
        changedBy: 'Le Thi D'
      },
      {
        status: 'Picking',
        changedAt: '2024-06-10T09:05:00Z',
        changedBy: 'Le Thi D'
      },
      {
        status: 'Submitted',
        changedAt: '2024-06-10T12:30:00Z',
        changedBy: 'Le Thi D'
      },
      {
        status: 'Approved',
        changedAt: '2024-06-10T15:45:00Z',
        changedBy: 'Warehouse Manager'
      },
      {
        status: 'Completed',
        changedAt: '2024-06-11T09:15:00Z',
        changedBy: 'Finance Controller'
      }
    ],
    lines: [
      {
        line_id: '1',
        sku: 'SKU-9001',
        product_name: 'Expired Snack Packs',
        planned_qty: 150,
        picked_qty: 150,
        uom: 'case',
        tracking_type: 'NONE',
        serials: [],
        lot_allocations: []
      }
    ]
  },
  {
    issue_no: 'GI-2024-005',
    issue_type: 'Return',
    status: 'Cancelled',
    partner_name: 'Urban Mini Mart',
    from_wh_name: 'Warehouse District 9',
    to_wh_name: 'Vendor Returns',
    expected_date: '2024-06-20',
    created_at: '2024-06-17T07:12:00Z',
    created_by: 'Nguyen Thanh E',
    statusHistory: [
      {
        status: 'Draft',
        changedAt: '2024-06-17T07:12:00Z',
        changedBy: 'Nguyen Thanh E'
      },
      {
        status: 'Cancelled',
        changedAt: '2024-06-17T09:45:00Z',
        changedBy: 'Nguyen Thanh E',
        note: 'Return order closed by customer request'
      }
    ],
    lines: [
      {
        line_id: '1',
        sku: 'SKU-5200',
        product_name: 'Yogurt Strawberry 6x100ml',
        planned_qty: 200,
        picked_qty: 0,
        uom: 'pack',
        tracking_type: 'LOT',
        serials: [],
        lot_allocations: []
      }
    ]
  }
]
