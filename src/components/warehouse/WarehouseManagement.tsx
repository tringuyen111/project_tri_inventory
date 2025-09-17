import { useState, useMemo, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { WarehouseForm } from './WarehouseForm'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Filter, X } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockWarehouses } from '../../data/mockWarehouseData'
import { getWarehouseOrganizations } from '../../data/mockOrganizationData'
import { getWarehouseBranches } from '../../data/mockBranchData'
import type { Warehouse, WarehouseFormData } from '../../types/warehouse'

export function WarehouseManagement() {
  const { t, currentLanguage } = useLanguage()
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | undefined>()
  const [deleteWarehouse, setDeleteWarehouse] = useState<Warehouse | undefined>()
  
  // Filters
  const [filterOrg, setFilterOrg] = useState<string>('')
  const [filterBranch, setFilterBranch] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')

  // Get active organizations and branches for filters
  const activeOrganizations = getWarehouseOrganizations().filter(org => org.isActive)
  const activeBranches = getWarehouseBranches().filter(branch => branch.isActive)
  const filteredBranchesForFilter = (filterOrg && filterOrg !== 'all')
    ? activeBranches.filter(branch => branch.organizationId === filterOrg)
    : activeBranches

  const filteredWarehouses = useMemo(() => {
    let filtered = warehouses

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(warehouse =>
        warehouse.code.toLowerCase().includes(query) ||
        warehouse.name.toLowerCase().includes(query) ||
        warehouse.organizationName.toLowerCase().includes(query) ||
        warehouse.branchName.toLowerCase().includes(query)
      )
    }

    // Apply organization filter
    if (filterOrg && filterOrg !== 'all') {
      filtered = filtered.filter(warehouse => warehouse.organizationId === filterOrg)
    }

    // Apply branch filter
    if (filterBranch && filterBranch !== 'all') {
      filtered = filtered.filter(warehouse => warehouse.branchId === filterBranch)
    }

    // Apply status filter
    if (filterStatus && filterStatus !== 'all') {
      const isActive = filterStatus === 'active'
      filtered = filtered.filter(warehouse => warehouse.isActive === isActive)
    }

    return filtered
  }, [warehouses, searchQuery, filterOrg, filterBranch, filterStatus])

  // Reset branch filter when organization filter changes
  useEffect(() => {
    if (filterOrg && filterBranch) {
      const selectedBranch = activeBranches.find(b => b.id === filterBranch)
      if (!selectedBranch || selectedBranch.organizationId !== filterOrg) {
        setFilterBranch('')
      }
    }
  }, [filterOrg, filterBranch, activeBranches])

  const handleCreate = () => {
    setEditingWarehouse(undefined)
    setShowForm(true)
  }

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse)
    setShowForm(true)
  }

  const handleSave = (warehouseData: WarehouseFormData) => {
    const organizations = getWarehouseOrganizations()
    const branches = getWarehouseBranches()
    
    if (editingWarehouse) {
      // Check if code is already used by another warehouse in the same branch
      const existingWarehouse = warehouses.find(
        w => w.code === warehouseData.code && 
            w.branchId === warehouseData.branchId && 
            w.id !== editingWarehouse.id
      )
      if (existingWarehouse) {
        toast.error(t('validation.unique.codeInBranch'))
        return
      }

      // Update existing warehouse
      const org = organizations.find(o => o.id === warehouseData.organizationId)
      const branch = branches.find(b => b.id === warehouseData.branchId)
      
      setWarehouses(prev => prev.map(warehouse =>
        warehouse.id === editingWarehouse.id
          ? {
              ...warehouse,
              ...warehouseData,
              organizationName: org?.name || '',
              branchName: branch?.name || '',
              updatedAt: new Date().toISOString()
            }
          : warehouse
      ))
      toast.success(t('warehouse.updateSuccess'))
    } else {
      // Check if code is already used in the same branch
      const existingWarehouse = warehouses.find(
        w => w.code === warehouseData.code && w.branchId === warehouseData.branchId
      )
      if (existingWarehouse) {
        toast.error(t('validation.unique.codeInBranch'))
        return
      }

      // Create new warehouse
      const org = organizations.find(o => o.id === warehouseData.organizationId)
      const branch = branches.find(b => b.id === warehouseData.branchId)
      
      const newWarehouse: Warehouse = {
        id: (warehouses.length + 1).toString(),
        ...warehouseData,
        organizationName: org?.name || '',
        branchName: branch?.name || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setWarehouses(prev => [...prev, newWarehouse])
      toast.success(t('warehouse.createSuccess'))
    }
  }

  const handleToggleStatus = (warehouse: Warehouse) => {
    if (warehouse.isActive) {
      // Business logic: Check if warehouse has inventory or open documents
      // In a real app, this would be an API call
      const hasInventory = Math.random() > 0.7 // Simulate 30% chance of having inventory
      
      if (hasInventory) {
        toast.error(t('warehouse.cannotDeactivate.hasInventory'))
        return
      }
    }

    setWarehouses(prev => prev.map(w =>
      w.id === warehouse.id
        ? { 
            ...w, 
            isActive: !w.isActive,
            updatedAt: new Date().toISOString()
          }
        : w
    ))
    
    toast.success(
      warehouse.isActive 
        ? t('warehouse.deactivateSuccess')
        : t('warehouse.activateSuccess')
    )
  }

  const handleDelete = (warehouse: Warehouse) => {
    if (warehouse.isActive) {
      toast.error(t('warehouse.cannotDelete.isActive'))
      return
    }
    setDeleteWarehouse(warehouse)
  }

  const confirmDelete = () => {
    if (deleteWarehouse) {
      setWarehouses(prev => prev.filter(w => w.id !== deleteWarehouse.id))
      toast.success(t('warehouse.deleteSuccess'))
      setDeleteWarehouse(undefined)
    }
  }

  const clearFilters = () => {
    setFilterOrg('all')
    setFilterBranch('all')
    setFilterStatus('all')
    setSearchQuery('')
  }

  const hasActiveFilters = (filterOrg && filterOrg !== 'all') || (filterBranch && filterBranch !== 'all') || (filterStatus && filterStatus !== 'all') || searchQuery

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? t('common.active') : t('common.inactive')}
    </Badge>
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>{t('nav.warehouse')}</h1>
          <p className="text-muted-foreground">{t('warehouse.description')}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('warehouse.create')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t('common.searchAndFilter')}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                <X className="h-4 w-4 mr-1" />
                {t('common.clearFilters')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('warehouse.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Organization Filter */}
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.allOrganizations')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allOrganizations')}</SelectItem>
                {activeOrganizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {currentLanguage === 'vi' ? org.nameVi : org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Branch Filter */}
            <Select value={filterBranch} onValueChange={setFilterBranch} disabled={!filterOrg || filterOrg === 'all'}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.allBranches')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allBranches')}</SelectItem>
                {filteredBranchesForFilter.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {currentLanguage === 'vi' ? branch.nameVi : branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t('common.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('common.active')}</SelectItem>
                <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{warehouses.filter(w => w.isActive).length}</div>
            <p className="text-sm text-muted-foreground">{t('warehouse.activeCount')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-sm text-muted-foreground">{t('warehouse.totalCount')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{filteredWarehouses.length}</div>
            <p className="text-sm text-muted-foreground">{t('common.filteredResults')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('warehouse.list')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.code')}</TableHead>
                  <TableHead>{t('common.name')}</TableHead>
                  <TableHead>{t('common.organization')}</TableHead>
                  <TableHead>{t('common.branch')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWarehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      {hasActiveFilters ? t('common.noSearchResults') : t('warehouse.empty')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarehouses.map((warehouse) => (
                    <TableRow key={warehouse.id}>
                      <TableCell className="font-mono">{warehouse.code}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{warehouse.name}</div>
                          {warehouse.address && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {warehouse.address}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{warehouse.organizationName}</TableCell>
                      <TableCell>{warehouse.branchName}</TableCell>
                      <TableCell>{getStatusBadge(warehouse.isActive)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(warehouse)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t('common.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(warehouse)}>
                              {warehouse.isActive ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  {t('common.deactivate')}
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  {t('common.activate')}
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(warehouse)}
                              className="text-destructive"
                              disabled={warehouse.isActive}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('common.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <WarehouseForm
        open={showForm}
        onOpenChange={setShowForm}
        warehouse={editingWarehouse}
        onSave={handleSave}
        organizations={getWarehouseOrganizations()}
        branches={getWarehouseBranches()}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteWarehouse} onOpenChange={() => setDeleteWarehouse(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('warehouse.deleteConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('warehouse.deleteConfirm.description', { name: deleteWarehouse?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}