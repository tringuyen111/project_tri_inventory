import { InventoryCount } from "../types/inventoryCount"

export const mockInventoryCounts: InventoryCount[] = [
  {
    count_id: "IC-WH01-001",
    wh_id: "WH01",
    wh_name: "Central Distribution",
    scope_type: "Warehouse",
    location_list: [
      { id: "WH01-ZONE-A", name: "Zone A" },
      { id: "WH01-ZONE-B", name: "Zone B" }
    ],
    model_list: [
      { id: "MDL-AX100", name: "Axon Scanner AX100", tracking_type: "Serial" },
      { id: "MDL-PT400", name: "Pallet Truck PT400", tracking_type: "None" }
    ],
    blind_mode: false,
    status: "Submitted",
    snapshot_at: "2024-01-20T02:30:00Z",
    created_by: "James Miller",
    created_at: "2024-01-20T02:35:00Z",
    submitted_by: "Maria Nguyen",
    submitted_at: "2024-01-20T08:10:00Z",
    note: "Cycle count for January week 3",
    zero_required_locations: ["WH01-ZONE-A", "WH01-ZONE-B"],
    zero_completed_locations: ["WH01-ZONE-A"],
    lines: [
      {
        line_id: "L1",
        count_id: "IC-WH01-001",
        model_id: "MDL-AX100",
        model_name: "Axon Scanner AX100",
        location_id: "WH01-ZONE-A",
        location_name: "Zone A",
        uom_id: "EA",
        uom_name: "Each",
        tracking_type: "Serial",
        system_qty: 42,
        counted_qty: 40,
        diff_qty: -2,
        is_zeroed: true,
        is_unlisted: false,
        remark: "Two devices missing from charging dock"
      },
      {
        line_id: "L2",
        count_id: "IC-WH01-001",
        model_id: "MDL-PT400",
        model_name: "Pallet Truck PT400",
        location_id: "WH01-ZONE-B",
        location_name: "Zone B",
        uom_id: "EA",
        uom_name: "Each",
        tracking_type: "None",
        system_qty: 12,
        counted_qty: 12,
        diff_qty: 0,
        is_zeroed: false,
        is_unlisted: false,
        remark: "Need zero confirmation"
      }
    ],
    details: [
      {
        detail_id: "D1",
        line_id: "L1",
        serial_no: "AX100-00045",
        qty: 1,
        location_id: "WH01-ZONE-A",
        location_name: "Zone A",
        scanned_by: "Kevin Tran",
        scanned_at: "2024-01-20T05:20:00Z",
        is_unlisted: false
      },
      {
        detail_id: "D2",
        line_id: "L1",
        serial_no: "AX100-00046",
        qty: 1,
        location_id: "WH01-ZONE-A",
        location_name: "Zone A",
        scanned_by: "Kevin Tran",
        scanned_at: "2024-01-20T05:21:00Z",
        is_unlisted: false
      },
      {
        detail_id: "D3",
        line_id: "L1",
        serial_no: "AX100-00047",
        qty: 1,
        location_id: "WH01-ZONE-A",
        location_name: "Zone A",
        scanned_by: "Kevin Tran",
        scanned_at: "2024-01-20T05:22:00Z",
        is_unlisted: false
      },
      {
        detail_id: "D4",
        line_id: "L2",
        lot_no: "LOT-PT400-202401",
        qty: 12,
        location_id: "WH01-ZONE-B",
        location_name: "Zone B",
        scanned_by: "Olivia Chen",
        scanned_at: "2024-01-20T05:30:00Z",
        is_unlisted: false
      }
    ],
    audit_trail: [
      {
        id: "A1",
        action: "Created count IC-WH01-001",
        actor: "James Miller",
        role: "Inventory Supervisor",
        timestamp: "2024-01-20T02:35:00Z",
        note: "Scope generated from weekly cycle schedule"
      },
      {
        id: "A2",
        action: "Snapshot taken",
        actor: "System",
        role: "WMS",
        timestamp: "2024-01-20T02:35:05Z",
        note: "Frozen quantities captured for all scoped items"
      },
      {
        id: "A3",
        action: "Submitted for review",
        actor: "Maria Nguyen",
        role: "Warehouse Manager",
        timestamp: "2024-01-20T08:10:00Z",
        note: "Pending zero confirmation for Zone B"
      }
    ],
    variance_report_url: undefined
  },
  {
    count_id: "IC-WH02-004",
    wh_id: "WH02",
    wh_name: "Outbound Hub",
    scope_type: "Location",
    location_list: [
      { id: "WH02-RACK-1A", name: "Rack 1A" },
      { id: "WH02-RACK-1B", name: "Rack 1B" },
      { id: "WH02-STAGE-DOCK", name: "Staging Dock" }
    ],
    model_list: [
      { id: "MDL-LT900", name: "Lithium Battery Pack LT900", tracking_type: "Lot" }
    ],
    blind_mode: true,
    status: "Counting",
    snapshot_at: "2024-02-04T01:05:00Z",
    created_by: "Alisha Patel",
    created_at: "2024-02-04T01:07:00Z",
    note: "Blind count for hazmat zone",
    zero_required_locations: ["WH02-RACK-1A", "WH02-RACK-1B", "WH02-STAGE-DOCK"],
    zero_completed_locations: ["WH02-RACK-1A"],
    lines: [
      {
        line_id: "L10",
        count_id: "IC-WH02-004",
        model_id: "MDL-LT900",
        model_name: "Lithium Battery Pack LT900",
        location_id: "WH02-RACK-1A",
        location_name: "Rack 1A",
        uom_id: "CASE",
        uom_name: "Case",
        tracking_type: "Lot",
        system_qty: 96,
        counted_qty: null,
        diff_qty: null,
        is_zeroed: false,
        is_unlisted: false,
        remark: "Awaiting second verifier"
      },
      {
        line_id: "L11",
        count_id: "IC-WH02-004",
        model_id: "MDL-LT900",
        model_name: "Lithium Battery Pack LT900",
        location_id: "WH02-RACK-1B",
        location_name: "Rack 1B",
        uom_id: "CASE",
        uom_name: "Case",
        tracking_type: "Lot",
        system_qty: 64,
        counted_qty: null,
        diff_qty: null,
        is_zeroed: false,
        is_unlisted: false,
        remark: "Blind count in progress"
      }
    ],
    details: [
      {
        detail_id: "D20",
        line_id: "L10",
        lot_no: "LT900-LOT-202402A",
        qty: 48,
        location_id: "WH02-RACK-1A",
        location_name: "Rack 1A",
        scanned_by: "PDA-102",
        scanned_at: "2024-02-04T02:10:00Z",
        is_unlisted: false
      },
      {
        detail_id: "D21",
        line_id: "L10",
        lot_no: "LT900-LOT-202402B",
        qty: 48,
        location_id: "WH02-RACK-1A",
        location_name: "Rack 1A",
        scanned_by: "PDA-102",
        scanned_at: "2024-02-04T02:18:00Z",
        is_unlisted: false
      },
      {
        detail_id: "D22",
        line_id: "L11",
        lot_no: "LT900-LOT-202402C",
        qty: 32,
        location_id: "WH02-RACK-1B",
        location_name: "Rack 1B",
        scanned_by: "PDA-109",
        scanned_at: "2024-02-04T02:25:00Z",
        is_unlisted: false
      }
    ],
    audit_trail: [
      {
        id: "A10",
        action: "Created blind count IC-WH02-004",
        actor: "Alisha Patel",
        role: "Compliance Manager",
        timestamp: "2024-02-04T01:07:00Z",
        note: "Hazmat blind count scheduled"
      },
      {
        id: "A11",
        action: "Snapshot taken",
        actor: "System",
        role: "WMS",
        timestamp: "2024-02-04T01:07:05Z"
      },
      {
        id: "A12",
        action: "Counting in progress",
        actor: "PDA-102",
        role: "PDA",
        timestamp: "2024-02-04T02:10:05Z",
        note: "Lot LT900-LOT-202402A scanned"
      }
    ],
    variance_report_url: undefined
  },
  {
    count_id: "IC-WH03-009",
    wh_id: "WH03",
    wh_name: "Reverse Logistics",
    scope_type: "Model",
    location_list: [
      { id: "WH03-RET-01", name: "Returns Bay 01" }
    ],
    model_list: [
      { id: "MDL-RB200", name: "Router Bundle RB200", tracking_type: "None" },
      { id: "MDL-RB200-LT", name: "Router Bundle RB200 Lot", tracking_type: "Lot" }
    ],
    blind_mode: false,
    status: "Completed",
    snapshot_at: "2023-12-15T10:00:00Z",
    created_by: "Sophie Le",
    created_at: "2023-12-15T10:05:00Z",
    submitted_by: "Sophie Le",
    submitted_at: "2023-12-15T14:20:00Z",
    completed_by: "Aaron Park",
    completed_at: "2023-12-16T09:00:00Z",
    note: "Model based reconciliation for return kits",
    zero_required_locations: ["WH03-RET-01"],
    zero_completed_locations: ["WH03-RET-01"],
    lines: [
      {
        line_id: "L30",
        count_id: "IC-WH03-009",
        model_id: "MDL-RB200",
        model_name: "Router Bundle RB200",
        location_id: "WH03-RET-01",
        location_name: "Returns Bay 01",
        uom_id: "SET",
        uom_name: "Set",
        tracking_type: "None",
        system_qty: 180,
        counted_qty: 178,
        diff_qty: -2,
        is_zeroed: true,
        is_unlisted: false,
        remark: "Two sets missing retail inserts"
      },
      {
        line_id: "L31",
        count_id: "IC-WH03-009",
        model_id: "MDL-RB200-LT",
        model_name: "Router Bundle RB200 Lot",
        location_id: "WH03-RET-01",
        location_name: "Returns Bay 01",
        uom_id: "LOT",
        uom_name: "Lot",
        tracking_type: "Lot",
        system_qty: 20,
        counted_qty: 22,
        diff_qty: 2,
        is_zeroed: true,
        is_unlisted: true,
        remark: "Two extra lots identified during scan"
      }
    ],
    details: [
      {
        detail_id: "D40",
        line_id: "L31",
        lot_no: "RB200-LOT-202312",
        qty: 18,
        location_id: "WH03-RET-01",
        location_name: "Returns Bay 01",
        scanned_by: "PDA-210",
        scanned_at: "2023-12-15T11:10:00Z",
        is_unlisted: false
      },
      {
        detail_id: "D41",
        line_id: "L31",
        lot_no: "RB200-LOT-202312-UNL",
        qty: 2,
        location_id: "WH03-RET-01",
        location_name: "Returns Bay 01",
        scanned_by: "PDA-210",
        scanned_at: "2023-12-15T11:12:00Z",
        is_unlisted: true
      }
    ],
    audit_trail: [
      {
        id: "A30",
        action: "Created count IC-WH03-009",
        actor: "Sophie Le",
        role: "Inventory Analyst",
        timestamp: "2023-12-15T10:05:00Z"
      },
      {
        id: "A31",
        action: "Submitted to manager",
        actor: "Sophie Le",
        role: "Inventory Analyst",
        timestamp: "2023-12-15T14:20:00Z",
        note: "Variance flagged for review"
      },
      {
        id: "A32",
        action: "Manager completed count",
        actor: "Aaron Park",
        role: "Logistics Manager",
        timestamp: "2023-12-16T09:00:00Z",
        note: "Variance report generated and exported"
      }
    ],
    variance_report_url: "https://example.com/variance/IC-WH03-009.xlsx"
  }
]
