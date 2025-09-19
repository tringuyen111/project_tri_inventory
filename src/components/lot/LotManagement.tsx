import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
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
  DropdownMenuTrigger 
} from '../ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '../ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '../ui/pagination'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Package, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { format } from 'date-fns'
import { Lot } from '../../types/lot'
import { LotForm } from './LotForm'
import { mockLots, getLotsByFIFO } from '../../data/mockLotData'
import { mockModelAssets } from '../../data/mockModelAssetData'
import { mockWarehouses } from '../../data/mockWarehouseData'
import { mockLocations } from '../../data/mockLocationData'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'sonner'

export function LotManagement() {
  const { language } = useLanguage()
  const [lots, setLots] = useState<Lot[]>(mockLots)
  const [filteredLots, setFilteredLots] = useState<Lot[]>(mockLots)
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list')
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lotToDelete, setLotToDelete] = useState<Lot | null>(null)
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [modelFilter, setModelFilter] = useState<string>('__all__')
  const [warehouseFilter, setWarehouseFilter] = useState<string>('__all__')
  const [statusFilter, setStatusFilter] = useState<string>('__all__')
  const [sortBy, setSortBy] = useState<'received_date' | 'mfg_date' | 'exp_date' | 'lot_code'>('received_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50 // Limit to 50 items per page to prevent performance issues

  const translations = {
    en: {
      title: 'Lot/Batch Management',
      createNew: 'Create New Lot',
      search: 'Search by lot code...',
      filterByModel: 'Filter by Model',
      filterByWarehouse: 'Filter by Warehouse',
      filterByStatus: 'Filter by Status',
      sortBy: 'Sort by',
      allModels: 'All Models',
      allWarehouses: 'All Warehouses',
      allStatuses: 'All Statuses',
      lotCode: 'Lot Code',
      modelAsset: 'Model Asset',
      warehouse: 'Warehouse',
      location: 'Location',
      receivedDate: 'Received Date',
      qtyOnhand: 'Qty On Hand',
      uom: 'UoM',
      status: 'Status',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      active: 'Active',
      inactive: 'Inactive',
      noLots: 'No lots found',
      confirmDelete: 'Confirm Delete',
      deleteConfirmation: 'Are you sure you want to delete this lot? This action cannot be undone.',
      cancel: 'Cancel',
      lotCreated: 'Lot created successfully',
      lotUpdated: 'Lot updated successfully',
      lotDeleted: 'Lot deleted successfully',
      cannotDelete: 'Cannot delete lot with stock on hand',
      fifoSuggestion: 'FIFO Suggestion',
      suggestedLots: 'Suggested lots for shipment (FIFO order):',
      mfgDate: 'Mfg Date',
      expDate: 'Exp Date'
    },
    vi: {
      title: 'Quản lý Lot/Lô hàng',
      createNew: 'Tạo Lot mới',
      search: 'Tìm kiếm theo mã lot...',
      filterByModel: 'Lọc theo Model',
      filterByWarehouse: 'Lọc theo Kho',
      filterByStatus: 'Lọc theo Trạng thái',
      sortBy: 'Sắp xếp theo',
      allModels: 'Tất cả Model',
      allWarehouses: 'Tất cả Kho',
      allStatuses: 'Tất cả Trạng thái',
      lotCode: 'Mã Lot',
      modelAsset: 'Model Tài sản',
      warehouse: 'Kho',
      location: 'Vị trí',
      receivedDate: 'Ngày nhận',
      qtyOnhand: 'Tồn kho',
      uom: 'ĐVT',
      status: 'Trạng thái',
      actions: 'Thao tác',
      edit: 'Sửa',
      delete: 'Xóa',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      noLots: 'Không tìm thấy lot nào',
      confirmDelete: 'Xác nhận Xóa',
      deleteConfirmation: 'Bạn có chắc chắn muốn xóa lot này? Hành động này không thể hoàn tác.',
      cancel: 'Hủy',
      lotCreated: 'Lot đã được tạo thành công',
      lotUpdated: 'Lot đã được cập nhật thành công',
      lotDeleted: 'Lot đã được xóa thành công',
      cannotDelete: 'Không thể xóa lot có tồn kho',
      fifoSuggestion: 'Gợi ý FIFO',
      suggestedLots: 'Các lot được gợi ý để xuất kho (theo thứ tự FIFO):',
      mfgDate: 'Ngày SX',
      expDate: 'Ngày HH'
    }
  }

  const t = translations[language]

  // Calculate pagination
  const totalPages = Math.ceil(filteredLots.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLots = useMemo(() => 
    filteredLots.slice(startIndex, endIndex), 
    [filteredLots, startIndex, endIndex]
  )

  // Get available models with lot tracking
  const availableModels = useMemo(() => 
    mockModelAssets.filter(
      model => model.tracking_type === 'Lot' && model.status === 'Active'
    ), []
  )

  // Get available warehouses
  const availableWarehouses = useMemo(() => 
    mockWarehouses.filter(wh => wh.isActive === true), []
  )

  useEffect(() => {
    let filtered = lots

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lot =>
        lot.lot_code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply model filter
    if (modelFilter && modelFilter !== '__all__') {
      filtered = filtered.filter(lot => lot.model_code === modelFilter)
    }

    // Apply warehouse filter
    if (warehouseFilter && warehouseFilter !== '__all__') {
      filtered = filtered.filter(lot => lot.wh_code === warehouseFilter)
    }

    // Apply status filter
    if (statusFilter && statusFilter !== '__all__') {
      filtered = filtered.filter(lot => lot.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = ''
      let bValue = ''
      
      switch (sortBy) {
        case 'received_date':
          aValue = a.received_date || ''
          bValue = b.received_date || ''
          break
        case 'mfg_date':
          aValue = a.mfg_date || ''
          bValue = b.mfg_date || ''
          break
        case 'exp_date':
          aValue = a.exp_date || ''
          bValue = b.exp_date || ''
          break
        case 'lot_code':
          aValue = a.lot_code
          bValue = b.lot_code
          break
        default:
          aValue = a.received_date || ''
          bValue = b.received_date || ''
      }

      if (sortBy === 'lot_code') {
        // Sort lot code alphabetically
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      } else {
        // Sort dates
        const dateA = aValue ? new Date(aValue).getTime() : 0
        const dateB = bValue ? new Date(bValue).getTime() : 0
        
        if (sortOrder === 'asc') {
          return dateA - dateB
        } else {
          return dateB - dateA
        }
      }
    })

    setFilteredLots(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [lots, searchTerm, modelFilter, warehouseFilter, statusFilter, sortBy, sortOrder])

  const handleCreate = () => {
    setSelectedLot(null)
    setCurrentView('create')
  }

  const handleEdit = (lot: Lot) => {
    setSelectedLot(lot)
    setCurrentView('edit')
  }

  const handleSave = (formData: any) => {
    if (currentView === 'create') {
      const newLot: Lot = {
        ...formData,
        qty_onhand: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Add display names from related data
        model_name: availableModels.find(m => m.model_code === formData.model_code)?.model_name,
        wh_name: availableWarehouses.find(w => w.code === formData.wh_code)?.name,
        loc_name: mockLocations.find(l => l.loc_code === formData.loc_code)?.loc_name
      }
      setLots(prev => [...prev, newLot])
      toast.success(t.lotCreated)
    } else if (currentView === 'edit' && selectedLot) {
      setLots(prev => prev.map(lot => 
        lot.lot_code === selectedLot.lot_code && lot.model_code === selectedLot.model_code
          ? { 
              ...lot, 
              ...formData, 
              updated_at: new Date().toISOString(),
              // Update display names
              wh_name: availableWarehouses.find(w => w.code === formData.wh_code)?.name,
              loc_name: mockLocations.find(l => l.loc_code === formData.loc_code)?.loc_name
            }
          : lot
      ))
      toast.success(t.lotUpdated)
    }
    setCurrentView('list')
  }

  const handleDelete = (lot: Lot) => {
    if (lot.qty_onhand > 0) {
      toast.error(t.cannotDelete)
      return
    }
    setLotToDelete(lot)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (lotToDelete) {
      setLots(prev => prev.filter(lot => 
        !(lot.lot_code === lotToDelete.lot_code && lot.model_code === lotToDelete.model_code)
      ))
      toast.success(t.lotDeleted)
      setDeleteDialogOpen(false)
      setLotToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
        {status === 'Active' ? t.active : t.inactive}
      </Badge>
    )
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return format(new Date(dateStr), 'dd/MM/yyyy')
  }

  // Get FIFO suggestion for demo
  const getFifoSuggestionForModel = useMemo(() => {
    const fifoCache = new Map<string, typeof mockLots>()
    return (modelCode: string) => {
      if (fifoCache.has(modelCode)) {
        return fifoCache.get(modelCode)!
      }
      const result = getLotsByFIFO(modelCode).slice(0, 3) // Show top 3 for FIFO
      fifoCache.set(modelCode, result)
      return result
    }
  }, [])

  if (currentView === 'edit' && selectedLot) {
    return (
      <LotForm
        lot={selectedLot}
        isEdit={true}
        onSave={handleSave}
        onCancel={() => setCurrentView('list')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>{t.title}</h1>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          {t.createNew}
        </Button>
      </div>

      {/* FIFO Suggestion Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t.fifoSuggestion}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t.suggestedLots}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModels.slice(0, 3).map(model => {
              const fifoLots = getFifoSuggestionForModel(model.model_code)
              return (
                <div key={model.model_code} className="border rounded-lg p-3">
                  <h4 className="mb-2">{model.model_code} - {model.model_name}</h4>
                  {fifoLots.length > 0 ? (
                    <div className="space-y-1">
                      {fifoLots.map(lot => (
                        <div key={lot.lot_code} className="text-sm bg-muted/50 p-2 rounded">
                          <div className="flex justify-between">
                            <span>{lot.lot_code}</span>
                            <span>Qty: {lot.qty_onhand}</span>
                          </div>
                          <div className="text-muted-foreground">
                            {t.receivedDate}: {formatDate(lot.received_date)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm">No lots in stock</div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterByModel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t.allModels}</SelectItem>
                {availableModels.map((model) => (
                  <SelectItem key={model.model_code} value={model.model_code}>
                    {model.model_code} - {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterByWarehouse} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t.allWarehouses}</SelectItem>
                {availableWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.code} value={warehouse.code}>
                    {warehouse.code} - {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterByStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t.allStatuses}</SelectItem>
                <SelectItem value="Active">{t.active}</SelectItem>
                <SelectItem value="Inactive">{t.inactive}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received_date">{t.receivedDate}</SelectItem>
                  <SelectItem value="mfg_date">{t.mfgDate}</SelectItem>
                  <SelectItem value="exp_date">{t.expDate}</SelectItem>
                  <SelectItem value="lot_code">{t.lotCode}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="shrink-0"
              >
                {sortOrder === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lots Table */}
      <Card>
        <CardContent className="pt-6">
          {/* Results summary */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredLots.length)} of {filteredLots.length} lots
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => {
                  if (sortBy === 'lot_code') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('lot_code')
                    setSortOrder('asc')
                  }
                }}>
                  <div className="flex items-center gap-1">
                    {t.lotCode}
                    {sortBy === 'lot_code' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead>{t.modelAsset}</TableHead>
                <TableHead>{t.warehouse}</TableHead>
                <TableHead>{t.location}</TableHead>
                <TableHead className="cursor-pointer" onClick={() => {
                  if (sortBy === 'received_date') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('received_date')
                    setSortOrder('desc')
                  }
                }}>
                  <div className="flex items-center gap-1">
                    {t.receivedDate}
                    {sortBy === 'received_date' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => {
                  if (sortBy === 'mfg_date') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('mfg_date')
                    setSortOrder('desc')
                  }
                }}>
                  <div className="flex items-center gap-1">
                    {t.mfgDate}
                    {sortBy === 'mfg_date' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => {
                  if (sortBy === 'exp_date') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortBy('exp_date')
                    setSortOrder('desc')
                  }
                }}>
                  <div className="flex items-center gap-1">
                    {t.expDate}
                    {sortBy === 'exp_date' && (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    )}
                  </div>
                </TableHead>
                <TableHead>{t.qtyOnhand}</TableHead>
                <TableHead>{t.uom}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="w-[100px]">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    {t.noLots}
                  </TableCell>
                </TableRow>
              ) : (
                currentLots.map((lot) => (
                  <TableRow key={`${lot.lot_code}-${lot.model_code}`}>
                    <TableCell>{lot.lot_code}</TableCell>
                    <TableCell>
                      {lot.model_code}
                      {lot.model_name && (
                        <div className="text-sm text-muted-foreground">
                          {lot.model_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {lot.wh_code}
                      {lot.wh_name && (
                        <div className="text-sm text-muted-foreground">
                          {lot.wh_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {lot.loc_code}
                      {lot.loc_name && (
                        <div className="text-sm text-muted-foreground">
                          {lot.loc_name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(lot.received_date)}</TableCell>
                    <TableCell>{formatDate(lot.mfg_date)}</TableCell>
                    <TableCell>{formatDate(lot.exp_date)}</TableCell>
                    <TableCell>
                      <Badge variant={lot.qty_onhand > 0 ? 'default' : 'secondary'}>
                        {lot.qty_onhand}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lot.uom_name && (
                        <Badge variant="outline">{lot.uom_name}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(lot)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(lot)}
                            className="text-destructive"
                            disabled={lot.qty_onhand > 0}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={currentView === 'create'} onOpenChange={(open) => setCurrentView(open ? 'create' : 'list')}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.createNew}</DialogTitle>
            <DialogDescription>
              {language === 'vi' ? 'Tạo lot/lô hàng mới cho hệ thống quản lý tồn kho.' : 'Create a new lot/batch for inventory management system.'}
            </DialogDescription>
          </DialogHeader>
          <LotForm
            onSave={handleSave}
            onCancel={() => setCurrentView('list')}
            showCard={false}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteConfirmation}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}