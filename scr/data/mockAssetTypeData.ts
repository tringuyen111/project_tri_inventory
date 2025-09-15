import { AssetType, AssetTypeFormData } from '../types/assetType';

// Mock data for asset types
const mockAssetTypes: AssetType[] = [
  {
    asset_type_code: 'FURNITURE',
    asset_type_name: 'Furniture',
    description: 'Office and warehouse furniture including desks, chairs, cabinets',
    status: 'Active',
    created_at: '2024-01-15T08:30:00Z',
    updated_at: '2024-01-15T08:30:00Z',
    created_by: 'admin',
    updated_by: 'admin'
  },
  {
    asset_type_code: 'ELECTRONICS',
    asset_type_name: 'Electronics',
    description: 'Electronic devices and equipment including computers, printers, monitors',
    status: 'Active',
    created_at: '2024-01-16T09:15:00Z',
    updated_at: '2024-01-16T09:15:00Z',
    created_by: 'admin',
    updated_by: 'admin'
  },
  {
    asset_type_code: 'VEHICLES',
    asset_type_name: 'Vehicles',
    description: 'Transportation vehicles including forklifts, trucks, delivery vans',
    status: 'Active',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
    created_by: 'admin',
    updated_by: 'admin'
  },
  {
    asset_type_code: 'MACHINERY',
    asset_type_name: 'Machinery',
    description: 'Industrial machinery and production equipment',
    status: 'Active',
    created_at: '2024-01-18T11:20:00Z',
    updated_at: '2024-01-18T11:20:00Z',
    created_by: 'admin',
    updated_by: 'admin'
  },
  {
    asset_type_code: 'TOOLS',
    asset_type_name: 'Tools',
    description: 'Hand tools and small equipment for maintenance and operations',
    status: 'Inactive',
    created_at: '2024-01-19T14:45:00Z',
    updated_at: '2024-02-01T16:30:00Z',
    created_by: 'admin',
    updated_by: 'manager'
  },
  {
    asset_type_code: 'SOFTWARE',
    asset_type_name: 'Software',
    description: 'Software licenses and digital assets',
    status: 'Active',
    created_at: '2024-01-20T13:10:00Z',
    updated_at: '2024-01-20T13:10:00Z',
    created_by: 'admin',
    updated_by: 'admin'
  }
];

// Mock Model Assets that reference Asset Types (for business logic validation)
const mockModelAssetsReferences: Record<string, number> = {
  'FURNITURE': 5,
  'ELECTRONICS': 12,
  'VEHICLES': 3,
  'MACHINERY': 8,
  'TOOLS': 0, // No references, can be set to inactive
  'SOFTWARE': 7
};

// CRUD operations
export const getAssetTypes = (): AssetType[] => {
  return [...mockAssetTypes];
};

export const getActiveAssetTypes = (): AssetType[] => {
  return mockAssetTypes.filter(assetType => assetType.status === 'Active');
};

export const getAssetTypeByCode = (code: string): AssetType | undefined => {
  return mockAssetTypes.find(assetType => assetType.asset_type_code === code);
};

export const createAssetType = (data: AssetTypeFormData): AssetType => {
  // Check if code already exists
  const existingAssetType = mockAssetTypes.find(at => at.asset_type_code === data.asset_type_code);
  if (existingAssetType) {
    throw new Error('Asset Type Code already exists');
  }

  const newAssetType: AssetType = {
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: 'current_user',
    updated_by: 'current_user'
  };

  mockAssetTypes.push(newAssetType);
  return newAssetType;
};

export const updateAssetType = (code: string, data: Partial<AssetTypeFormData>): AssetType => {
  const index = mockAssetTypes.findIndex(assetType => assetType.asset_type_code === code);
  if (index === -1) {
    throw new Error('Asset Type not found');
  }

  const currentAssetType = mockAssetTypes[index];

  // Business logic: cannot set to Inactive if referenced by Model Assets
  if (data.status === 'Inactive' && currentAssetType.status === 'Active') {
    const referencesCount = mockModelAssetsReferences[code] || 0;
    if (referencesCount > 0) {
      throw new Error(`Cannot set Asset Type to Inactive. It is referenced by ${referencesCount} Model Asset(s).`);
    }
  }

  const updatedAssetType: AssetType = {
    ...currentAssetType,
    ...data,
    asset_type_code: currentAssetType.asset_type_code, // Code cannot be changed
    updated_at: new Date().toISOString(),
    updated_by: 'current_user'
  };

  mockAssetTypes[index] = updatedAssetType;
  return updatedAssetType;
};

export const isAssetTypeCodeUnique = (code: string, excludeCode?: string): boolean => {
  return !mockAssetTypes.some(assetType => 
    assetType.asset_type_code === code && assetType.asset_type_code !== excludeCode
  );
};

export const getModelAssetReferencesCount = (assetTypeCode: string): number => {
  return mockModelAssetsReferences[assetTypeCode] || 0;
};