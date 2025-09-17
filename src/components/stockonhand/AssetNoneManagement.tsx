import { useState, useMemo } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { AssetNone, AssetNoneFormData, AssetNoneUpdateData } from '../../types/assetNone'
import { mockAssetNones, hasAssetNoneInventoryMovement, assetNoneExistsAtLocation } from '../../data/mockAssetNoneData'
import { mockModelAssets } from '../../data/mockModelAssetData'
import { mockWarehouses } from '../../data/mockWarehouseData'
import { mockLocations } from '../../data/mockLocationData'
import { AssetNoneForm } from './AssetNoneForm'
import { Plus, Search, Pencil, Trash2, List, AlertTriangle, X } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

export function AssetNoneManagement() {
  const { language } = useLanguage()
  const [assetNones, setAssetNones] = useState<AssetNone[]>(mockAssetNones)
  const [searchTerm, setSearchTerm] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<AssetNone | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const translations = {
    en: {
      title: 'Asset (None) Management',
      description: 'Manage asset inventory with bulk quantity tracking',
      addNew: 'Add New Record',
      search: 'Search by model code...',
      filterWarehouse: 'All Warehouses',
      filterLocation: 'All Locations',
      filterStatus: 'All Statuses',
      tableHeaders: {
        modelCode: 'Model Code',
        modelName: 'Model Name',
        warehouse: 'Warehouse',
        location: 'Location',
        qtyOnhand: 'Qty On-Hand',
        uom: 'UoM',
        status: 'Status',
        actions: 'Actions'
      },
      actions: {
        edit: 'Edit',
        delete: 'Delete'
      },
      confirmDelete: {
        title: 'Confirm Deletion',
        description: 'Are you sure you want to delete this asset record?',
        cannotDelete: 'Cannot delete record with inventory',
        cannotDeleteDesc: 'This record has quantity on-hand and cannot be deleted. Set status to Inactive instead.',
        cancel: 'Cancel',
        delete: 'Delete'
      },
      editDialog: {
        title: 'Edit Asset Status',
        status: 'Status',
        cancel: 'Cancel',
        save: 'Save Changes',
        saving: 'Saving...'
      },
      messages: {
        createSuccess: 'Asset record created successfully',
        updateSuccess: 'Asset record updated successfully',
        deleteSuccess: 'Asset record deleted successfully',
        createError: 'Error creating asset record',
        updateError: 'Error updating asset record',
        deleteError: 'Error deleting asset record',
        duplicateLocation: 'This model already has a record at this location'
      },
      empty: {
        title: 'No Asset Records Found',
        description: 'No asset records match your current filters.',
        createFirst: 'Create your first asset record to get started.'
      }
    },
    vn: {
      title: 'Quản lý Asset (None)',
      description: 'Quản lý tồn kho asset theo số lượng bulk',
      addNew: 'Thêm bản ghi mới',
      search: 'Tìm kiếm theo mã model...',
      filterWarehouse: 'Tất cả kho',
      filterLocation: 'Tất cả vị trí',
      filterStatus: 'Tất cả trạng thái',
      tableHeaders: {
        modelCode: 'Mã Model',
        modelName: 'Tên Model',
        warehouse: 'Kho',
        location: 'Vị trí',
        qtyOnhand: 'SL Tồn kho',
        uom: 'Đơn vị',
        status: 'Trạng thái',
        actions: 'Thao tác'
      },
      actions: {
        edit: 'Sửa',
        delete: 'Xóa'
      },
      confirmDelete: {
        title: 'Xác nhận xóa',
        description: 'Bạn có chắc chắn muốn xóa bản ghi asset này?',
        cannotDelete: 'Không thể xóa bản ghi có tồn kho',
        cannotDeleteDesc: 'Bản ghi này có số lượng tồn kho và không thể xóa. Hãy đặt trạng thái thành Không hoạt động.',
        cancel: 'Hủy',
        delete: 'Xóa'
      },
      editDialog: {
        title: 'Sửa trạng thái Asset',
        status: 'Trạng thái',
        cancel: 'Hủy',
        save: 'Lưu thay đổi',
        saving: 'Đang lưu...'
      },
      messages: {
        createSuccess: 'Tạo bản ghi asset thành công',
        updateSuccess: 'Cập nhật bản ghi asset thành công',
        deleteSuccess: 'Xóa bản ghi asset thành công',
        createError: 'Lỗi tạo bản ghi asset',
        updateError: 'Lỗi cập nhật bản ghi asset',
        deleteError: 'Lỗi xóa bản ghi asset',
        duplicateLocation: 'Model này đã có bản ghi tại vị trí này'
      },
      empty: {
        title: 'Không tìm thấy bản ghi Asset',
        description: 'Không có bản ghi asset nào khớp với bộ lọc hiện tại.',
        createFirst: 'Tạo bản ghi asset đầu tiên để bắt đầu.'
      }
    }
  }

  const t = translations[language]

  // Get all model assets
  const allModelAssets = mockModelAssets

  // Filter assets based on search and filters
  const filteredAssets = useMemo(() => {
    return assetNones.filter(asset => {
      const matchesSearch = !searchTerm || 
        asset.model_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model_name?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesWarehouse = !warehouseFilter || asset.wh_code === warehouseFilter
      const matchesLocation = !locationFilter || asset.location_code === locationFilter
      const matchesStatus = !statusFilter || asset.status === statusFilter

      return matchesSearch && matchesWarehouse && matchesLocation && matchesStatus
    })
  }, [assetNones, searchTerm, warehouseFilter, locationFilter, statusFilter])

  // Get active warehouses for filter
  const activeWarehouses = mockWarehouses.filter(wh => wh.isActive === true)

  // Get locations for filter (filtered by warehouse if selected)
  const availableLocations = useMemo(() => {
    if (warehouseFilter) {
      return mockLocations.filter(loc => loc.wh_code === warehouseFilter && loc.status === 'Active')
    }
    return mockLocations.filter(loc => loc.status === 'Active')
  }, [warehouseFilter])

  const handleCreate = async (data: AssetNoneFormData) => {
    setIsSubmitting(true)
    try {
      // Check for duplicate location
      if (assetNoneExistsAtLocation(data.model_code, data.wh_code, data.location_code)) {
        toast.error(t.messages.duplicateLocation)
        return
      }

      // Get model details
      const model = allModelAssets.find(m => m.model_code === data.model_code)
      const warehouse = activeWarehouses.find(w => w.code === data.wh_code)
      const location = mockLocations.find(l => l.loc_code === data.location_code)

      const newAsset: AssetNone = {
        id: Date.now().toString(),
        model_code: data.model_code,
        model_name: model?.model_name,
        uom_code: model?.uom_code,
        uom_name: model?.uom_name,
        wh_code: data.wh_code,
        wh_name: warehouse?.name,
        location_code: data.location_code,
        location_name: location?.loc_name,
        qty_onhand: 0, // Always start with 0
        status: data.status,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      }

      setAssetNones(prev => [...prev, newAsset])
      setShowCreateForm(false)
      toast.success(t.messages.createSuccess)
    } catch (error) {
      toast.error(t.messages.createError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: AssetNoneUpdateData) => {
    if (!editingAsset) return

    setIsSubmitting(true)
    try {
      const updatedAsset: AssetNone = {
        ...editingAsset,
        status: data.status,
        updated_date: new Date().toISOString()
      }

      setAssetNones(prev =>
        prev.map(asset => asset.id === editingAsset.id ? updatedAsset : asset)
      )
      setEditingAsset(null)
      toast.success(t.messages.updateSuccess)
    } catch (error) {
      toast.error(t.messages.updateError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (asset: AssetNone) => {
    // Check if asset has inventory
    if (hasAssetNoneInventoryMovement(asset.id)) {
      return // Cannot delete
    }

    try {
      setAssetNones(prev => prev.filter(a => a.id !== asset.id))
      toast.success(t.messages.deleteSuccess)
    } catch (error) {
      toast.error(t.messages.deleteError)
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    )
  }

  const getQuantityBadge = (qty: number) => {
    if (qty === 0) {
      return <Badge variant="outline">{qty}</Badge>
    } else if (qty > 0 && qty <= 10) {
      return <Badge variant="destructive">{qty}</Badge>
    } else {
      return <Badge variant="default">{qty}</Badge>
    }
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1>{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t.addNew}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Warehouse Filter */}
            <div className="relative">
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterWarehouse} />
                </SelectTrigger>
                <SelectContent>
                  {activeWarehouses.map((warehouse) => (
                    <SelectItem key={`mgmt-warehouse-${warehouse.id}`} value={warehouse.code}>
                      {warehouse.code} - {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {warehouseFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => setWarehouseFilter('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterLocation} />
                </SelectTrigger>
                <SelectContent>
                  {availableLocations.map((location) => (
                    <SelectItem key={`mgmt-location-${location.loc_code}`} value={location.loc_code}>
                      {location.loc_code} - {location.loc_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {locationFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => setLocationFilter('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t.filterStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="active" value="Active">Active</SelectItem>
                  <SelectItem key="inactive" value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {statusFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => setStatusFilter('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardContent className="p-0">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3>{t.empty.title}</h3>
              <p className="text-muted-foreground mb-4">
                {assetNones.length === 0 ? t.empty.createFirst : t.empty.description}
              </p>
              {assetNones.length === 0 && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addNew}
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.tableHeaders.modelCode}</TableHead>
                  <TableHead>{t.tableHeaders.modelName}</TableHead>
                  <TableHead>{t.tableHeaders.warehouse}</TableHead>
                  <TableHead>{t.tableHeaders.location}</TableHead>
                  <TableHead className="text-center">{t.tableHeaders.qtyOnhand}</TableHead>
                  <TableHead>{t.tableHeaders.uom}</TableHead>
                  <TableHead>{t.tableHeaders.status}</TableHead>
                  <TableHead className="text-center">{t.tableHeaders.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-mono">{asset.model_code}</TableCell>
                    <TableCell>{asset.model_name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{asset.wh_code}</div>
                        <div className="text-sm text-muted-foreground">{asset.wh_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{asset.location_code}</div>
                        <div className="text-sm text-muted-foreground">{asset.location_name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getQuantityBadge(asset.qty_onhand)}
                    </TableCell>
                    <TableCell>
                      {asset.uom_name && (
                        <Badge variant="outline">{asset.uom_name}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAsset(asset)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            {hasAssetNoneInventoryMovement(asset.id) ? (
                              <>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                    {t.confirmDelete.cannotDelete}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t.confirmDelete.cannotDeleteDesc}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t.confirmDelete.cancel}</AlertDialogCancel>
                                </AlertDialogFooter>
                              </>
                            ) : (
                              <>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t.confirmDelete.title}</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {t.confirmDelete.description}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t.confirmDelete.cancel}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(asset)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {t.confirmDelete.delete}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </>
                            )}
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.addNew}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>
          <AssetNoneForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            isSubmitting={isSubmitting}
            showCard={false}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editDialog.title}</DialogTitle>
          </DialogHeader>
          {editingAsset && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.editDialog.status}</label>
                <Select
                  value={editingAsset.status}
                  onValueChange={(value) => 
                    setEditingAsset(prev => prev ? { ...prev, status: value as 'Active' | 'Inactive' } : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="edit-active" value="Active">Active</SelectItem>
                    <SelectItem key="edit-inactive" value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingAsset(null)}>
                  {t.editDialog.cancel}
                </Button>
                <Button 
                  onClick={() => handleEdit({ status: editingAsset.status })}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.editDialog.saving : t.editDialog.save}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}