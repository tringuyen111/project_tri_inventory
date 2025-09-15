import { Location, AssetType } from "../types/location";
import { getActiveWarehouses } from "./mockWarehouseData";

// Mock Asset Types data
export const mockAssetTypes: AssetType[] = [
  {
    code: "RAW_MAT",
    name: "Raw Materials",
    description: "Basic materials used in production",
    status: "Active"
  },
  {
    code: "FIN_PROD",
    name: "Finished Products", 
    description: "Completed goods ready for sale",
    status: "Active"
  },
  {
    code: "SEMI_FIN",
    name: "Semi-Finished Goods",
    description: "Partially completed products",
    status: "Active"
  },
  {
    code: "PACKAGING",
    name: "Packaging Materials",
    description: "Materials used for packaging",
    status: "Active"
  },
  {
    code: "TOOLS",
    name: "Tools & Equipment",
    description: "Tools and small equipment",
    status: "Active"
  },
  {
    code: "SPARE_PARTS",
    name: "Spare Parts",
    description: "Replacement parts for machinery",
    status: "Active"
  },
  {
    code: "CHEMICALS",
    name: "Chemicals",
    description: "Chemical substances",
    status: "Active"
  },
  {
    code: "ELECTRONICS",
    name: "Electronics",
    description: "Electronic components and devices",
    status: "Active"
  },
  {
    code: "TEXTILES",
    name: "Textiles",
    description: "Fabric and textile materials",
    status: "Active"
  },
  {
    code: "HAZARDOUS",
    name: "Hazardous Materials",
    description: "Dangerous or hazardous substances",
    status: "Inactive"
  }
];

// Mock Locations data
export let mockLocations: Location[] = [
  {
    loc_code: "LO_001",
    loc_name: "General Storage Area A",
    wh_code: "WH_001",
    allow_asset_types: [],
    deny_asset_types: ["HAZARDOUS", "CHEMICALS"],
    status: "Active",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z"
  },
  {
    loc_code: "LO_002",
    loc_name: "Raw Materials Section",
    wh_code: "WH_001",
    allow_asset_types: ["RAW_MAT", "PACKAGING"],
    deny_asset_types: [],
    status: "Active",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:30:00Z"
  },
  {
    loc_code: "LO_003",
    loc_name: "Finished Goods Area",
    wh_code: "WH_001",
    allow_asset_types: ["FIN_PROD"],
    deny_asset_types: [],
    status: "Active",
    created_at: "2024-01-15T09:00:00Z",
    updated_at: "2024-01-15T09:00:00Z"
  },
  {
    loc_code: "LO_004",
    loc_name: "Electronics Storage",
    wh_code: "WH_002",
    allow_asset_types: ["ELECTRONICS", "SPARE_PARTS"],
    deny_asset_types: ["CHEMICALS"],
    status: "Active",
    created_at: "2024-01-15T09:30:00Z",
    updated_at: "2024-01-15T09:30:00Z"
  },
  {
    loc_code: "LO_005",
    loc_name: "Old Storage Unit",
    wh_code: "WH_005",
    allow_asset_types: [],
    deny_asset_types: [],
    status: "Inactive",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-20T14:00:00Z"
  },
  {
    loc_code: "LO_006",
    loc_name: "Tools & Equipment Area",
    wh_code: "WH_002",
    allow_asset_types: ["TOOLS", "SPARE_PARTS"],
    deny_asset_types: [],
    status: "Active",
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-16T10:00:00Z"
  },
  {
    loc_code: "LO_007",
    loc_name: "Distribution Zone A",
    wh_code: "WH_003",
    allow_asset_types: ["FIN_PROD", "PACKAGING"],
    deny_asset_types: [],
    status: "Active",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z"
  },
  {
    loc_code: "LO_008",
    loc_name: "Distribution Zone B",
    wh_code: "WH_003",
    allow_asset_types: ["FIN_PROD"],
    deny_asset_types: ["HAZARDOUS"],
    status: "Active",
    created_at: "2024-02-01T11:00:00Z",
    updated_at: "2024-02-01T11:00:00Z"
  },
  {
    loc_code: "LO_009",
    loc_name: "Backup Storage Area",
    wh_code: "WH_005",
    allow_asset_types: [],
    deny_asset_types: [],
    status: "Active",
    created_at: "2024-02-20T09:00:00Z",
    updated_at: "2024-02-20T09:00:00Z"
  }
];

// CRUD Operations for Locations
export const getLocations = (): Location[] => {
  return [...mockLocations];
};

export const getLocationsByWarehouse = (warehouseCode: string): Location[] => {
  return mockLocations.filter(location => 
    location.wh_code === warehouseCode && location.status === "Active"
  );
};

export const getActiveLocations = (): Location[] => {
  return mockLocations.filter(location => location.status === "Active");
};

export const getLocationByCode = (locationCode: string): Location | undefined => {
  return mockLocations.find(location => location.loc_code === locationCode);
};

export const createLocation = (locationData: Omit<Location, 'created_at' | 'updated_at'>): Location => {
  // Check if location code already exists within the same warehouse
  const existingLocation = mockLocations.find(
    loc => loc.loc_code === locationData.loc_code && loc.wh_code === locationData.wh_code
  );
  
  if (existingLocation) {
    throw new Error(`Location code ${locationData.loc_code} already exists in warehouse ${locationData.wh_code}`);
  }

  // Validate loc_code format
  if (!/^LO_\d{3}$/.test(locationData.loc_code)) {
    throw new Error("Location code must follow format LO_999");
  }

  // Validate no duplicate asset types between allow and deny
  const duplicates = locationData.allow_asset_types.filter(code => 
    locationData.deny_asset_types.includes(code)
  );
  if (duplicates.length > 0) {
    throw new Error(`Asset type(s) ${duplicates.join(', ')} cannot appear in both Allow and Deny lists`);
  }

  const now = new Date().toISOString();
  const newLocation: Location = {
    ...locationData,
    created_at: now,
    updated_at: now
  };

  mockLocations.push(newLocation);
  return newLocation;
};

export const updateLocation = (locationCode: string, updateData: Partial<Location>): Location => {
  const index = mockLocations.findIndex(location => location.loc_code === locationCode);
  
  if (index === -1) {
    throw new Error(`Location with code ${locationCode} not found`);
  }

  // Validate no duplicate asset types between allow and deny if provided
  if (updateData.allow_asset_types && updateData.deny_asset_types) {
    const duplicates = updateData.allow_asset_types.filter(code => 
      updateData.deny_asset_types!.includes(code)
    );
    if (duplicates.length > 0) {
      throw new Error(`Asset type(s) ${duplicates.join(', ')} cannot appear in both Allow and Deny lists`);
    }
  }

  const updatedLocation = {
    ...mockLocations[index],
    ...updateData,
    updated_at: new Date().toISOString()
  };

  mockLocations[index] = updatedLocation;
  return updatedLocation;
};

export const deleteLocation = (locationCode: string): boolean => {
  const index = mockLocations.findIndex(location => location.loc_code === locationCode);
  
  if (index === -1) {
    throw new Error(`Location with code ${locationCode} not found`);
  }

  // Note: In a real system, you would check for dependencies before deletion
  // For example, check if location has any assets or open documents
  
  mockLocations.splice(index, 1);
  return true;
};

export const isLocationCodeUnique = (locationCode: string, warehouseCode: string, excludeLocationCode?: string): boolean => {
  return !mockLocations.some(location => 
    location.loc_code === locationCode && 
    location.wh_code === warehouseCode &&
    location.loc_code !== excludeLocationCode
  );
};

// Asset Types operations
export const getAssetTypes = (): AssetType[] => {
  return [...mockAssetTypes];
};

export const getActiveAssetTypes = (): AssetType[] => {
  return mockAssetTypes.filter(assetType => assetType.status === "Active");
};

export const getAssetTypeByCode = (code: string): AssetType | undefined => {
  return mockAssetTypes.find(assetType => assetType.code === code);
};

// Adapter function để convert warehouse data structure từ Warehouse sang format cho Location
export const getWarehousesForLocation = () => {
  // Use ES6 import
  const warehouses = getActiveWarehouses();
  
  // Convert to format expected by Location components
  return warehouses.map((wh: any, index: number) => ({
    id: wh.id, // Unique ID
    wh_code: wh.code,
    wh_name: wh.name,
    organization_name: wh.organizationName,
    branch_name: wh.branchName,
    status: wh.isActive ? 'Active' : 'Inactive',
    unique_key: `warehouse-${wh.id}-${index}` // Absolutely unique key for React
  }));
};