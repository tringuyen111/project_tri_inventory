export interface Warehouse {
  id: string
  code: string
  name: string
  organizationId: string
  organizationName: string
  branchId: string
  branchName: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WarehouseFormData {
  code: string
  name: string
  organizationId: string
  branchId: string
  address?: string
  isActive: boolean
}