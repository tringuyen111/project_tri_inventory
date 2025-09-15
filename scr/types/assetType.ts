export interface AssetType {
  asset_type_code: string;
  asset_type_name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface AssetTypeFormData {
  asset_type_code: string;
  asset_type_name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface AssetTypeFilters {
  status: string;
  search: string;
}