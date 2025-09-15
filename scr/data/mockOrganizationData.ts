import { Organization } from '../types/organization'

// Warehouse-compatible organization interface  
interface WarehouseOrganization {
  id: string
  code: string
  name: string
  nameVi: string
  isActive: boolean
}

export const mockOrganizations: Organization[] = [
  {
    id: '1',
    organization_code: 'VN_001',
    organization_name: 'VNTECH Corporation',
    address: '123 Business District, Ho Chi Minh City, Vietnam',
    contact: '+84 28 1234 5678',
    status: 'Active',
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15')
  },
  {
    id: '2',
    organization_code: 'GL_001',
    organization_name: 'GLOBAL TECH Ltd',
    address: '456 Industrial Zone, Binh Duong Province, Vietnam',
    contact: '+84 274 987 6543',
    status: 'Active',
    created_at: new Date('2024-02-01'),
    updated_at: new Date('2024-02-01')
  },
  {
    id: '3',
    organization_code: 'SG_001',
    organization_name: 'Saigon Innovation Hub',
    address: '789 Commercial Center, District 1, Ho Chi Minh City',
    contact: '+84 28 9876 5432',
    status: 'Inactive',
    created_at: new Date('2024-02-15'),
    updated_at: new Date('2024-02-15')
  }
]

// Convert to warehouse-compatible format
export const getWarehouseOrganizations = (): WarehouseOrganization[] => {
  return mockOrganizations.map(org => ({
    id: org.id,
    code: org.organization_code,
    name: org.organization_name,
    nameVi: org.organization_name, // Same for now, can be different Vietnamese names
    isActive: org.status === 'Active'
  }))
}

export const getOrganizations = (): Promise<Organization[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrganizations)
    }, 300)
  })
}

export const createOrganization = (data: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Promise<Organization> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check for duplicate organization code
      const exists = mockOrganizations.some(org => org.organization_code === data.organization_code)
      if (exists) {
        reject(new Error('Organization code already exists'))
        return
      }

      const newOrganization: Organization = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      mockOrganizations.push(newOrganization)
      resolve(newOrganization)
    }, 500)
  })
}

export const updateOrganization = (id: string, data: Partial<Organization>): Promise<Organization> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOrganizations.findIndex(org => org.id === id)
      if (index === -1) {
        reject(new Error('Organization not found'))
        return
      }

      // Check business logic: cannot deactivate if has active branches/warehouses
      if (data.status === 'Inactive') {
        // Simulate checking for dependent entities
        const hasActiveDependencies = Math.random() > 0.7 // 30% chance of having dependencies
        if (hasActiveDependencies) {
          reject(new Error('Cannot deactivate organization with active branches or warehouses'))
          return
        }
      }

      mockOrganizations[index] = {
        ...mockOrganizations[index],
        ...data,
        updated_at: new Date()
      }
      
      resolve(mockOrganizations[index])
    }, 500)
  })
}

export const deleteOrganization = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockOrganizations.findIndex(org => org.id === id)
      if (index === -1) {
        reject(new Error('Organization not found'))
        return
      }

      // Check if organization has dependencies
      const hasDependencies = Math.random() > 0.8 // 20% chance of having dependencies
      if (hasDependencies) {
        reject(new Error('Cannot delete organization with existing branches or warehouses'))
        return
      }

      mockOrganizations.splice(index, 1)
      resolve()
    }, 500)
  })
}