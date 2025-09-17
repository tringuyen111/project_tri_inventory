import { useState, useMemo } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Plus, Search, Edit, Filter, ToggleLeft, ToggleRight } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { ModelAsset, ModelAssetFormData } from '../../types/modelAsset'
import { mockModelAssets, hasModelAssetReferences } from '../../data/mockModelAssetData'
import { getActiveAssetTypes } from '../../data/mockAssetTypeData'
import { getActiveUoMs } from '../../data/mockUomData'
import { ModelAssetForm } from './ModelAssetForm'
import { toast } from 'sonner'

export function ModelAssetManagement() {
  const { language } = useLanguage()
  const [modelAssets, setModelAssets] = useState<ModelAsset[]>(mockModelAssets)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('all')
  const [trackingTypeFilter, setTrackingTypeFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingModelAsset, setEditingModelAsset] = useState<ModelAsset | undefined>()
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [modelAssetToToggle, setModelAssetToToggle] = useState<ModelAsset | undefined>()

  // Get active asset types and UoMs for dropdowns
  const activeAssetTypes = getActiveAssetTypes()
  const activeUoMs = getActiveUoMs()

  const translations = {
    en: {
      title: 'Model Asset Management',
      description: 'Manage Model Assets with tracking methods and units of measure',
      create: 'Create Model Asset',
      search: 'Search model assets...',
      filter: 'Filter',
      status: 'Status',
      assetType: 'Asset Type',
      trackingType: 'Tracking Type',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      serial: 'Serial',
      lot: 'Lot',
      none: 'None',
      code: 'Model Code',
      name: 'Model Name',
      tracking: 'Tracking',
      unitOfMeasure: 'Unit of Measure',
      actions: 'Actions',
      edit: 'Edit',
      toggleStatus: 'Toggle Status',
      toggleStatusTitle: 'Change Model Asset Status',
      toggleStatusMessage: 'Are you sure you want to change the status of this model asset?',
      toggleStatusCancel: 'Cancel',
      toggleStatusConfirm: 'Confirm',
      toggleStatusSuccess: 'Model asset status updated successfully',
      toggleStatusError: 'Cannot deactivate model asset. It is referenced by existing assets or documents.',
      noResults: 'No model assets found',
      showingResults: 'Showing {count} model assets'
    },
    vn: {
      title: 'Quản lý Model Asset',
      description: 'Quản lý Model Assets với phương thức theo dõi và đơn vị tính',
      create: 'Tạo Model Asset',
      search: 'Tìm kiếm model assets...',
      filter: 'Lọc',
      status: 'Trạng thái',
      assetType: 'Loại Asset',
      trackingType: 'Phương thức quản lý',
      all: 'Tất cả',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      serial: 'Serial',
      lot: 'Lot',
      none: 'Không',
      code: 'Mã Model',
      name: 'Tên Model Asset',
      tracking: 'Theo dõi',
      unitOfMeasure: 'Đơn vị tính',
      actions: 'Thao tác',
      edit: 'Sửa',
      toggleStatus: 'Đổi trạng thái',
      toggleStatusTitle: 'Thay đổi trạng thái Model Asset',
      toggleStatusMessage: 'Bạn có chắc chắn muốn thay đổi trạng thái của model asset này không?',
      toggleStatusCancel: 'Hủy',
      toggleStatusConfirm: 'Xác nhận',
      toggleStatusSuccess: 'Cập nhật trạng thái model asset thành công',
      toggleStatusError: 'Không thể hủy kích hoạt model asset. Nó đang được tham chiếu bởi các tài sản hoặc chứng từ hiện có.',
      noResults: 'Không tìm thấy model asset nào',
      showingResults: 'Hiển thị {count} model assets'
    }
  }

  const t = translations[language]

  // Filtered and searched model assets
  const filteredModelAssets = useMemo(() => {
    return modelAssets.filter(modelAsset => {
      const matchesSearch = 
        modelAsset.model_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        modelAsset.model_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || modelAsset.status === statusFilter
      const matchesAssetType = assetTypeFilter === 'all' || modelAsset.asset_type_code === assetTypeFilter
      const matchesTrackingType = trackingTypeFilter === 'all' || modelAsset.tracking_type === trackingTypeFilter

      return matchesSearch && matchesStatus && matchesAssetType && matchesTrackingType
    })
  }, [modelAssets, searchTerm, statusFilter, assetTypeFilter, trackingTypeFilter])

  const handleCreate = () => {
    setEditingModelAsset(undefined)
    setShowForm(true)
  }

  const handleEdit = (modelAsset: ModelAsset) => {
    setEditingModelAsset(modelAsset)
    setShowForm(true)
  }

  const handleToggleStatus = (modelAsset: ModelAsset) => {
    // Check if model asset has references when trying to deactivate
    if (modelAsset.status === 'Active' && hasModelAssetReferences(modelAsset.id)) {
      toast.error(t.toggleStatusError)
      return
    }
    
    setModelAssetToToggle(modelAsset)
    setStatusDialogOpen(true)
  }

  const confirmToggleStatus = () => {
    if (modelAssetToToggle) {
      const newStatus = modelAssetToToggle.status === 'Active' ? 'Inactive' : 'Active'
      setModelAssets(prev => 
        prev.map(ma => 
          ma.id === modelAssetToToggle.id 
            ? { ...ma, status: newStatus, updated_date: new Date().toISOString() }
            : ma
        )
      )
      toast.success(t.toggleStatusSuccess)
      setStatusDialogOpen(false)
      setModelAssetToToggle(undefined)
    }
  }

  const handleSubmit = (data: ModelAssetFormData) => {
    if (editingModelAsset) {
      // Update existing
      setModelAssets(prev =>
        prev.map(ma =>
          ma.id === editingModelAsset.id
            ? {
                ...ma,
                ...data,
                // Find asset type name and UoM name for display
                asset_type_name: activeAssetTypes.find(at => at.asset_type_code === data.asset_type_code)?.asset_type_name,
                uom_name: activeUoMs.find(uom => uom.uom_code === data.uom_code)?.uom_name,
                updated_date: new Date().toISOString()
              }
            : ma
        )
      )
    } else {
      // Create new
      const newModelAsset: ModelAsset = {
        id: (modelAssets.length + 1).toString(),
        ...data,
        asset_type_name: activeAssetTypes.find(at => at.asset_type_code === data.asset_type_code)?.asset_type_name,
        uom_name: activeUoMs.find(uom => uom.uom_code === data.uom_code)?.uom_name,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      }
      setModelAssets(prev => [...prev, newModelAsset])
    }
  }

  // Get existing codes for validation
  const existingCodes = modelAssets
    .filter(ma => !editingModelAsset || ma.id !== editingModelAsset.id)
    .map(ma => ma.model_code)

  const getTrackingTypeLabel = (type: string) => {
    switch(type) {
      case 'Serial': return t.serial
      case 'Lot': return t.lot
      case 'None': return t.none
      default: return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>{t.title}</h1>
        <p className="text-muted-foreground">
          {t.description}
        </p>
      </div>

      {/* Controls Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t.filter}
              </CardTitle>
              <CardDescription>
                {t.showingResults.replace('{count}', filteredModelAssets.length.toString())}
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              {t.create}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            {/* Search */}
            <div className="flex-1 space-y-2">
              <Label>{t.search}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:w-auto w-full">
              {/* Status Filter */}
              <div className="space-y-2">
                <Label>{t.status}</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="status-all" value="all">{t.all}</SelectItem>
                    <SelectItem key="status-active" value="Active">{t.active}</SelectItem>
                    <SelectItem key="status-inactive" value="Inactive">{t.inactive}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Type Filter */}
              <div className="space-y-2">
                <Label>{t.assetType}</Label>
                <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="assettype-all" value="all">{t.all}</SelectItem>
                    {activeAssetTypes.map((assetType) => (
                      <SelectItem key={`assettype-${assetType.asset_type_code}`} value={assetType.asset_type_code}>
                        {assetType.asset_type_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tracking Type Filter */}
              <div className="space-y-2">
                <Label>{t.trackingType}</Label>
                <Select value={trackingTypeFilter} onValueChange={setTrackingTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="tracking-all" value="all">{t.all}</SelectItem>
                    <SelectItem key="tracking-serial" value="Serial">{t.serial}</SelectItem>
                    <SelectItem key="tracking-lot" value="Lot">{t.lot}</SelectItem>
                    <SelectItem key="tracking-none" value="None">{t.none}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {filteredModelAssets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t.noResults}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.code}</TableHead>
                  <TableHead>{t.name}</TableHead>
                  <TableHead>{t.assetType}</TableHead>
                  <TableHead>{t.unitOfMeasure}</TableHead>
                  <TableHead>{t.tracking}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModelAssets.map((modelAsset) => (
                  <TableRow key={modelAsset.id}>
                    <TableCell className="font-mono">
                      {modelAsset.model_code}
                    </TableCell>
                    <TableCell>{modelAsset.model_name}</TableCell>
                    <TableCell>{modelAsset.asset_type_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {modelAsset.uom_name} ({modelAsset.uom_code})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTrackingTypeLabel(modelAsset.tracking_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={modelAsset.status === 'Active' ? 'default' : 'secondary'}>
                        {modelAsset.status === 'Active' ? t.active : t.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(modelAsset)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(modelAsset)}
                          className={modelAsset.status === 'Active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {modelAsset.status === 'Active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ModelAssetForm
        modelAsset={editingModelAsset}
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSubmit}
        existingCodes={existingCodes}
      />

      {/* Status Toggle Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.toggleStatusTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.toggleStatusMessage}
            </AlertDialogDescription>
            {modelAssetToToggle && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <div className="text-sm font-medium">{modelAssetToToggle.model_name}</div>
                <div className="text-xs text-muted-foreground">
                  {language === 'vi' ? 'Trạng thái hiện tại' : 'Current status'}: {modelAssetToToggle.status === 'Active' ? t.active : t.inactive}
                  <br />
                  {language === 'vi' ? 'Trạng thái mới' : 'New status'}: {modelAssetToToggle.status === 'Active' ? t.inactive : t.active}
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.toggleStatusCancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {t.toggleStatusConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}