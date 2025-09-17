export interface Organization {
  id: string
  organization_code: string
  organization_name: string
  address?: string
  contact?: string
  status: 'Active' | 'Inactive'
  created_at?: Date
  updated_at?: Date
}

export interface CreateOrganizationRequest {
  organization_code: string
  organization_name: string
  address?: string
  contact?: string
  status: 'Active' | 'Inactive'
}

export interface UpdateOrganizationRequest {
  organization_name: string
  address?: string
  contact?: string
  status: 'Active' | 'Inactive'
}

export interface OrganizationFormData {
  organization_code: string
  organization_name: string
  address: string
  contact: string
  status: 'Active' | 'Inactive'
}