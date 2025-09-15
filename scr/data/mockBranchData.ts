import { Branch } from '../types/branch'
import { mockOrganizations } from './mockOrganizationData'

// Warehouse-compatible branch interface
interface WarehouseBranch {
  id: string
  code: string
  name: string
  nameVi: string
  organizationId: string
  isActive: boolean
}

export const mockBranches: Branch[] = [
  {
    id: '1',
    branch_code: 'VN_001',
    branch_name: 'VNTECH HCM',
    organization_id: '1',
    organization_name: 'VNTECH Corporation',
    address: '123 Business District, Floor 1, Ho Chi Minh City, Vietnam',
    contact: '+84 28 1234 5678 ext 101',
    status: 'Active',
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20')
  },
  {
    id: '2',
    branch_code: 'VN_002',
    branch_name: 'VNTECH HN',
    organization_id: '1',
    organization_name: 'VNTECH Corporation',
    address: '456 Cau Giay District, Hanoi, Vietnam',
    contact: '+84 24 1234 5678 ext 201',
    status: 'Active',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01')
  },
  {
    id: '3',
    branch_code: 'GL_001',
    branch_name: 'GLOBAL HN',
    organization_id: '2',
    organization_name: 'GLOBAL TECH Ltd',
    address: '789 Ba Dinh District, Hanoi, Vietnam',
    contact: '+84 24 987 6543 ext 100',
    status: 'Active',
    created_at: new Date('2024-02-05'),
    updated_at: new Date('2024-02-05')
  },
  {
    id: '4',
    branch_code: 'GL_002',
    branch_name: 'GLOBAL DN',
    organization_id: '2',
    organization_name: 'GLOBAL TECH Ltd',
    address: '321 Hai Chau District, Da Nang, Vietnam',
    contact: '+84 236 987 6543 ext 200',
    status: 'Active',
    created_at: new Date('2024-02-10'),
    updated_at: new Date('2024-02-10')
  },
  {
    id: '5',
    branch_code: 'SG_001',
    branch_name: 'Saigon Central',
    organization_id: '3',
    organization_name: 'Saigon Innovation Hub',
    address: '789 District 1, Ho Chi Minh City',
    contact: '+84 28 9876 5432 ext 101',
    status: 'Inactive',
    created_at: new Date('2024-02-20'),
    updated_at: new Date('2024-02-20')
  }
]

// Convert to warehouse-compatible format
export const getWarehouseBranches = (): WarehouseBranch[] => {
  return mockBranches.map(branch => ({
    id: branch.id,
    code: branch.branch_code,
    name: branch.branch_name,
    nameVi: branch.branch_name, // Same for now, can be different Vietnamese names
    organizationId: branch.organization_id,
    isActive: branch.status === 'Active'
  }))
}

// Helper function to get organization name by ID
const getOrganizationName = (organizationId: string): string => {
  const org = mockOrganizations.find(o => o.id === organizationId)
  return org?.organization_name || 'Unknown Organization'
}

// Ensure all branches have organization names populated
mockBranches.forEach(branch => {
  if (!branch.organization_name) {
    branch.organization_name = getOrganizationName(branch.organization_id)
  }
})

export const getBranches = (): Promise<Branch[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Populate organization names dynamically
      const branchesWithOrgNames = mockBranches.map(branch => ({
        ...branch,
        organization_name: getOrganizationName(branch.organization_id)
      }))
      resolve(branchesWithOrgNames)
    }, 300)
  })
}

export const getActiveOrganizations = () => {
  return mockOrganizations.filter(org => org.status === 'Active')
}

export const createBranch = (data: Omit<Branch, 'id' | 'created_at' | 'updated_at' | 'organization_name'>): Promise<Branch> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check for duplicate branch code within the same organization
      const exists = mockBranches.some(branch => 
        branch.branch_code === data.branch_code && branch.organization_id === data.organization_id
      )
      if (exists) {
        reject(new Error('Branch code already exists in this organization'))
        return
      }

      // Verify organization exists and is active
      const organization = mockOrganizations.find(org => org.id === data.organization_id && org.status === 'Active')
      if (!organization) {
        reject(new Error('Organization not found or inactive'))
        return
      }

      const newBranch: Branch = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        organization_name: organization.organization_name,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      mockBranches.push(newBranch)
      resolve(newBranch)
    }, 500)
  })
}

export const updateBranch = (id: string, data: Partial<Branch>): Promise<Branch> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockBranches.findIndex(branch => branch.id === id)
      if (index === -1) {
        reject(new Error('Branch not found'))
        return
      }

      // Check business logic: cannot deactivate if has active warehouses
      if (data.status === 'Inactive') {
        // Simulate checking for dependent warehouses
        const hasActiveWarehouses = Math.random() > 0.7 // 30% chance of having active warehouses
        if (hasActiveWarehouses) {
          reject(new Error('Cannot deactivate branch with active warehouses'))
          return
        }
      }

      mockBranches[index] = {
        ...mockBranches[index],
        ...data,
        organization_name: getOrganizationName(mockBranches[index].organization_id),
        updated_at: new Date()
      }
      
      resolve(mockBranches[index])
    }, 500)
  })
}

export const deleteBranch = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockBranches.findIndex(branch => branch.id === id)
      if (index === -1) {
        reject(new Error('Branch not found'))
        return
      }

      // Check if branch has dependencies (warehouses)
      const hasDependencies = Math.random() > 0.8 // 20% chance of having dependencies
      if (hasDependencies) {
        reject(new Error('Cannot delete branch with existing warehouses'))
        return
      }

      mockBranches.splice(index, 1)
      resolve()
    }, 500)
  })
}