export interface Location {
  loc_code: string;
  loc_name: string;
  wh_code: string;
  allow_asset_types: string[];
  deny_asset_types: string[];
  status: "Active" | "Inactive";
  created_at?: string;
  updated_at?: string;
}

export interface AssetType {
  code: string;
  name: string;
  description?: string;
  status: "Active" | "Inactive";
}

export interface LocationFormData {
  loc_code: string;
  loc_name: string;
  wh_code: string;
  allow_asset_types: string[];
  deny_asset_types: string[];
  status: "Active" | "Inactive";
}

export interface CreateLocationData {
  loc_code: string;
  loc_name: string;
  wh_code: string;
  allow_asset_types: string[];
  deny_asset_types: string[];
  status: "Active" | "Inactive";
}

export interface UpdateLocationData {
  loc_name: string;
  allow_asset_types: string[];
  deny_asset_types: string[];
  status: "Active" | "Inactive";
}