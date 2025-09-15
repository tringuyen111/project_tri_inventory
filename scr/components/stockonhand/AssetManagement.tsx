import { useState, useMemo } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Plus, Search, Edit, Filter, ToggleLeft, ToggleRight, History } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { Asset, AssetUpdateData } from '../../types/asset'
import { mockAssets, getAssetHistory } from '../../data/mockAssetData'
import { getActiveWarehouses } from '../../data/mockWarehouseData'
import { getLocationsByWarehouse } from '../../data/mockLocationData'
import { getActivePartners } from '../../data/mockPartnerData'
import { getActiveModelAssetsByTracking } from '../../data/mockModelAssetData'
import { AssetForm } from './AssetForm'
import { AssetEditForm } from './AssetEditForm'
import { AssetHistoryDialog } from './AssetHistoryDialog'
import { toast } from 'sonner'

export function AssetManagement() {
  const { language } = useLanguage()
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all')
  const [modelFilter, setModelFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>()
  const [showEditForm, setShowEditForm] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [assetToToggle, setAssetToToggle] = useState<Asset | undefined>()
  const [showHistory, setShowHistory] = useState(false)
  const [selectedAssetForHistory, setSelectedAssetForHistory] = useState<Asset | undefined>()

  // Get data for dropdowns
  const activeWarehouses = getActiveWarehouses()
  const activePartners = getActivePartners()
  const serialModelAssets = getActiveModelAssetsByTracking('Serial')

  const translations = {
    en: {
      title: 'Asset Management (Serial)',
      description: 'Manage individual assets with unique serial numbers',
      create: 'Create Asset',
      search: 'Search assets...',
      filter: 'Filter',
      status: 'Status',
      warehouse: 'Warehouse',
      model: 'Model Asset',
      all: 'All',
      inStock: 'In Stock',
      issued: 'Issued',
      disposed: 'Disposed',
      lost: 'Lost',
      assetId: 'Asset ID',
      serialNumber: 'Serial Number',
      location: 'Location',
      partner: 'Partner',
      uom: 'UoM',
      actions: 'Actions',
      edit: 'Edit',
      toggleStatus: 'Toggle Status',
      viewHistory: 'View History',
      toggleStatusTitle: 'Change Asset Status',
      toggleStatusMessage: 'Are you sure you want to change the status of this asset?',
      toggleStatusCancel: 'Cancel',
      toggleStatusConfirm: 'Confirm',
      toggleStatusSuccess: 'Asset status updated successfully',
      noResults: 'No assets found',
      showingResults: 'Showing {count} assets',
      currentStatus: 'Current status',
      newStatus: 'New status'
    },
    vn: {
      title: 'Quản lý Asset (Serial)',
      description: 'Quản lý tài sản cá nhân với số serial duy nhất',
      create: 'Tạo Asset',
      search: 'Tìm kiếm assets...',
      filter: 'Lọc',
      status: 'Trạng thái',
      warehouse: 'Kho',
      model: 'Model Asset',
      all: 'Tất cả',
      inStock: 'Trong kho',
      issued: 'Đã xuất',
      disposed: 'Đã thanh lý',
      lost: 'Đã mất',
      assetId: 'Mã Asset',
      serialNumber: 'Số Serial',
      location: 'Vị trí',
      partner: 'Đối tác',
      uom: 'ĐVT',
      actions: 'Thao tác',
      edit: 'Sửa',
      toggleStatus: 'Đổi trạng thái',
      viewHistory: 'Xem lịch sử',
      toggleStatusTitle: 'Thay đổi trạng thái Asset',
      toggleStatusMessage: 'Bạn có chắc chắn muốn thay đổi trạng thái của asset này không?',
      toggleStatusCancel: 'Hủy',
      toggleStatusConfirm: 'Xác nhận',
      toggleStatusSuccess: 'Cập nhật trạng thái asset thành công',
      noResults: 'Không tìm thấy asset nào',
      showingResults: 'Hiển thị {count} assets',
      currentStatus: 'Trạng thái hiện tại',
      newStatus: 'Trạng thái mới'
    }
  }

  const t = translations[language]

  // Filtered and searched assets
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = 
        asset.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.wh_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location_name?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter
      const matchesWarehouse = warehouseFilter === 'all' || asset.wh_code === warehouseFilter
      const matchesModel = modelFilter === 'all' || asset.model_code === modelFilter

      return matchesSearch && matchesStatus && matchesWarehouse && matchesModel
    })
  }, [assets, searchTerm, statusFilter, warehouseFilter, modelFilter])

  const handleCreate = () => {
    setShowForm(true)
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setShowEditForm(true)
  }

  const handleToggleStatus = (asset: Asset) => {
    setAssetToToggle(asset)
    setStatusDialogOpen(true)
  }

  const handleViewHistory = (asset: Asset) => {
    setSelectedAssetForHistory(asset)
    setShowHistory(true)
  }

  const confirmToggleStatus = () => {
    if (assetToToggle) {
      // For demo purposes, we'll just toggle between InStock and Issued
      const newStatus = assetToToggle.status === 'InStock' ? 'Issued' : 'InStock'
      
      setAssets(prev => 
        prev.map(asset => 
          asset.id === assetToToggle.id 
            ? { ...asset, status: newStatus, updated_date: new Date().toISOString() }
            : asset
        )
      )
      toast.success(t.toggleStatusSuccess)
      setStatusDialogOpen(false)
      setAssetToToggle(undefined)
    }
  }

  const handleSubmit = (data: any) => {
    // Create new assets from serial numbers
    const serialNumbers = data.serial_numbers.split('\n').filter((sn: string) => sn.trim())
    const newAssets = serialNumbers.map((serialNumber: string, index: number) => {
      const warehouse = activeWarehouses.find(w => w.code === data.wh_code)
      const location = getLocationsByWarehouse(data.wh_code).find(l => l.loc_code === data.location_code)
      const modelAsset = serialModelAssets.find(m => m.model_code === data.model_code)
      
      return {
        id: (assets.length + index + 1).toString(),
        asset_id: `AST-2024-${(assets.length + index + 1).toString().padStart(6, '0')}`,
        model_code: data.model_code,
        model_name: modelAsset?.model_name,
        uom_code: modelAsset?.uom_code,
        uom_name: modelAsset?.uom_name,
        serial_number: serialNumber.trim(),
        wh_code: data.wh_code,
        wh_name: warehouse?.name,
        location_code: data.location_code,
        location_name: location?.loc_name,
        partner_code: data.partner_code || '',
        partner_name: data.partner_code ? activePartners.find(p => p.partner_code === data.partner_code)?.partner_name : '',
        status: data.status as Asset['status'],
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      }
    })

    setAssets(prev => [...prev, ...newAssets])
  }

  const handleUpdate = (data: AssetUpdateData) => {
    if (editingAsset) {
      const warehouse = activeWarehouses.find(w => w.code === data.wh_code)
      const location = getLocationsByWarehouse(data.wh_code).find(l => l.loc_code === data.location_code)
      const partner = data.partner_code ? activePartners.find(p => p.partner_code === data.partner_code) : undefined

      setAssets(prev =>
        prev.map(asset =>
          asset.id === editingAsset.id
            ? {
                ...asset,
                wh_code: data.wh_code,
                wh_name: warehouse?.name,
                location_code: data.location_code,
                location_name: location?.loc_name,
                partner_code: data.partner_code || '',
                partner_name: partner?.partner_name || '',
                status: data.status,
                updated_date: new Date().toISOString()
              }
            : asset
        )
      )
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'InStock': return t.inStock
      case 'Issued': return t.issued
      case 'Disposed': return t.disposed
      case 'Lost': return t.lost
      default: return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'InStock': return 'default'
      case 'Issued': return 'secondary'
      case 'Disposed': return 'destructive'
      case 'Lost': return 'destructive'
      default: return 'outline'
    }
  }

  // Get existing serial numbers for validation
  const existingSerialNumbers = assets.map(asset => asset.serial_number)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>{t.title}</h2>
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
                {t.showingResults.replace('{count}', filteredAssets.length.toString())}
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
                    <SelectItem value="all">{t.all}</SelectItem>
                    <SelectItem value="InStock">{t.inStock}</SelectItem>
                    <SelectItem value="Issued">{t.issued}</SelectItem>
                    <SelectItem value="Disposed">{t.disposed}</SelectItem>
                    <SelectItem value="Lost">{t.lost}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Warehouse Filter */}
              <div className="space-y-2">
                <Label>{t.warehouse}</Label>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.all}</SelectItem>
                    {activeWarehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.code}>
                        {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Filter */}
              <div className="space-y-2">
                <Label>{t.model}</Label>
                <Select value={modelFilter} onValueChange={setModelFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.all}</SelectItem>
                    {serialModelAssets.map((model) => (
                      <SelectItem key={model.id} value={model.model_code}>
                        {model.model_name}
                      </SelectItem>
                    ))}
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
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t.noResults}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.assetId}</TableHead>
                  <TableHead>{t.serialNumber}</TableHead>
                  <TableHead>{t.model}</TableHead>
                  <TableHead>{t.warehouse}</TableHead>
                  <TableHead>{t.location}</TableHead>
                  <TableHead>{t.partner}</TableHead>
                  <TableHead>{t.uom}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-mono">
                      {asset.asset_id}
                    </TableCell>
                    <TableCell className="font-mono">
                      {asset.serial_number}
                    </TableCell>
                    <TableCell>{asset.model_name}</TableCell>
                    <TableCell>{asset.wh_name}</TableCell>
                    <TableCell>{asset.location_name || '-'}</TableCell>
                    <TableCell>{asset.partner_name || '-'}</TableCell>
                    <TableCell>
                      {asset.uom_name && (
                        <Badge variant="outline">{asset.uom_name}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(asset.status) as any}>
                        {getStatusLabel(asset.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(asset)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(asset)}
                          className={asset.status === 'InStock' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                        >
                          {asset.status === 'InStock' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewHistory(asset)}
                        >
                          <History className="h-4 w-4" />
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

      {/* Create Form Dialog */}
      <AssetForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSubmit}
        existingSerialNumbers={existingSerialNumbers}
      />

      {/* Edit Form Dialog */}
      <AssetEditForm
        asset={editingAsset}
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSubmit={handleUpdate}
      />

      {/* Status Toggle Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.toggleStatusTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.toggleStatusMessage}
            </AlertDialogDescription>
            {assetToToggle && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <div className="text-sm font-medium">{assetToToggle.asset_id} - {assetToToggle.serial_number}</div>
                <div className="text-xs text-muted-foreground">
                  {t.currentStatus}: {getStatusLabel(assetToToggle.status)}
                  <br />
                  {t.newStatus}: {getStatusLabel(assetToToggle.status === 'InStock' ? 'Issued' : 'InStock')}
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

      {/* History Dialog */}
      <AssetHistoryDialog
        asset={selectedAssetForHistory}
        open={showHistory}
        onOpenChange={setShowHistory}
      />
    </div>
  )
}