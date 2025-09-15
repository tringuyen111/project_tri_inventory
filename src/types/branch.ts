export interface Branch {
  id: string
  branch_code: string
  branch_name: string
  organization_id: string
  organization_name?: string // For display purposes
  address?: string
  contact?: string
  status: 'Active' | 'Inactive'
  created_at?: Date
  updated_at?: Date
}

export interface CreateBranchRequest {
  branch_code: string
  branch_name: string
  organization_id: string
  address?: string
  contact?: string
  status: 'Active' | 'Inactive'
}

export interface UpdateBranchRequest {
  branch_name: string
  address?: string
  contact?: string
  status: 'Active' | 'Inactive'
}

export interface BranchFormData {
  branch_code: string
  branch_name: string
  organization_id: string
  address: string
  contact: string
  status: 'Active' | 'Inactive'
}