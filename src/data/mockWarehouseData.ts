import type { Warehouse } from '../types/warehouse'

export const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    code: 'WH01',
    name: 'Main Warehouse',
    organizationId: '1',
    organizationName: 'VNTECH Corporation',
    branchId: '1',
    branchName: 'VNTECH HCM',
    address: '123 Nguyen Van Linh St, District 7, Ho Chi Minh City',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    code: 'WH02',
    name: 'Branch Warehouse',
    organizationId: '1',
    organizationName: 'VNTECH Corporation',
    branchId: '1',
    branchName: 'VNTECH HCM',
    address: '456 Le Van Luong St, District 7, Ho Chi Minh City',
    isActive: true,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    code: 'WH03',
    name: 'Storage Warehouse',
    organizationId: '2',
    organizationName: 'GLOBAL TECH Ltd',
    branchId: '3',
    branchName: 'GLOBAL HN',
    address: '789 Cau Giay St, Cau Giay District, Hanoi',
    isActive: true,
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: '4',
    code: 'WH04',
    name: 'Cold Storage',
    organizationId: '2',
    organizationName: 'GLOBAL TECH Ltd',
    branchId: '4',
    branchName: 'GLOBAL DN',
    address: '321 Bach Dang St, Hai Chau District, Da Nang',
    isActive: false,
    createdAt: '2024-02-10T16:45:00Z',
    updatedAt: '2024-02-15T11:20:00Z'
  },
  {
    id: '5',
    code: 'WH05',
    name: 'Backup Warehouse',
    organizationId: '1',
    organizationName: 'VNTECH Corporation',
    branchId: '2',
    branchName: 'VNTECH HN',
    isActive: true,
    createdAt: '2024-02-20T08:30:00Z',
    updatedAt: '2024-02-20T08:30:00Z'
  }
]

// CRUD Operations for Warehouses
export const getWarehouses = (): Warehouse[] => {
  return [...mockWarehouses];
};

export const getActiveWarehouses = (): Warehouse[] => {
  return mockWarehouses.filter(warehouse => warehouse.isActive);
};

export const getWarehousesByBranch = (branchId: string): Warehouse[] => {
  return mockWarehouses.filter(warehouse => warehouse.branchId === branchId);
};

export const getWarehousesByOrganization = (organizationId: string): Warehouse[] => {
  return mockWarehouses.filter(warehouse => warehouse.organizationId === organizationId);
};

export const getWarehouseByCode = (code: string): Warehouse | undefined => {
  return mockWarehouses.find(warehouse => warehouse.code === code);
};

export const createWarehouse = (warehouseData: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Warehouse => {
  // Check if warehouse code already exists within the same branch
  const existingWarehouse = mockWarehouses.find(
    wh => wh.code === warehouseData.code && wh.branchId === warehouseData.branchId
  );
  
  if (existingWarehouse) {
    throw new Error(`Warehouse code ${warehouseData.code} already exists in this branch`);
  }

  // Validate warehouse code format
  if (!/^WH\d{2}$/.test(warehouseData.code)) {
    throw new Error("Warehouse code must follow format WH99");
  }

  const now = new Date().toISOString();
  const newWarehouse: Warehouse = {
    ...warehouseData,
    id: (mockWarehouses.length + 1).toString(),
    createdAt: now,
    updatedAt: now
  };

  mockWarehouses.push(newWarehouse);
  return newWarehouse;
};

export const updateWarehouse = (warehouseId: string, updateData: Partial<Warehouse>): Warehouse => {
  const index = mockWarehouses.findIndex(warehouse => warehouse.id === warehouseId);
  
  if (index === -1) {
    throw new Error(`Warehouse with ID ${warehouseId} not found`);
  }

  const updatedWarehouse = {
    ...mockWarehouses[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  mockWarehouses[index] = updatedWarehouse;
  return updatedWarehouse;
};

export const deleteWarehouse = (warehouseId: string): boolean => {
  const index = mockWarehouses.findIndex(warehouse => warehouse.id === warehouseId);
  
  if (index === -1) {
    throw new Error(`Warehouse with ID ${warehouseId} not found`);
  }

  // Check if warehouse is active
  if (mockWarehouses[index].isActive) {
    throw new Error("Cannot delete active warehouse. Please deactivate it first.");
  }

  mockWarehouses.splice(index, 1);
  return true;
};

export const isWarehouseCodeUnique = (code: string, branchId: string, excludeWarehouseId?: string): boolean => {
  return !mockWarehouses.some(warehouse => 
    warehouse.code === code && 
    warehouse.branchId === branchId &&
    warehouse.id !== excludeWarehouseId
  );
};