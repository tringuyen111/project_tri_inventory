import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form@7.55.0'
import { ArrowLeft, Plus, Trash2, Upload, Download, Save, Send, FileText, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription } from '../ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { useLanguage } from '../../contexts/LanguageContext'
import { GoodsReceipt, GoodsReceiptFormData } from '../../types/goodsReceipt'
import { mockPartners } from '../../data/mockPartnerData'
import { mockWarehouses } from '../../data/mockWarehouseData'
import { mockModelAssets } from '../../data/mockModelAssetData'
import { mockUoMs } from '../../data/mockUomData'
import { generateReceiptNumber, mockGoodsReceipts } from '../../data/mockGoodsReceiptData'
import { WarehouseSelectWithSearch } from './WarehouseSelectWithSearch'
import { PartnerSelectWithSearch } from './PartnerSelectWithSearch'
import { toast } from 'sonner'

const translations = {
  en: {
    // Navigation
    backToList: 'Back to Goods Receipt List',
    createReceipt: 'Create Goods Receipt',
    editReceipt: 'Edit Goods Receipt',
    
    // Header section
    receiptHeader: 'Receipt Header',
    receiptNo: 'Receipt No',
    receiptType: 'Receipt Type',
    reference: 'Reference',
    partner: 'Partner',
    sourceWarehouse: 'Source Warehouse',
    destinationWarehouse: 'Destination Warehouse',
    expectedDate: 'Expected Date',
    remarks: 'Remarks',
    
    // Lines section
    receiptLines: 'Receipt Lines',
    addLine: 'Add Line',
    importLines: 'Import Lines',
    exportLines: 'Export Lines',
    assetModel: 'Asset Model',
    unitOfMeasure: 'Unit of Measure',
    trackingType: 'Tracking Type',
    plannedQty: 'Planned Qty',
    lineNote: 'Line Note',
    actions: 'Actions',
    
    // Actions
    saveDraft: 'Save Draft',
    create: 'Create',
    cancel: 'Cancel',
    
    // Types
    PO: 'Purchase Order',
    Transfer: 'Transfer',
    Return: 'Return',
    Manual: 'Manual Entry',
    
    // Tracking types
    None: 'None',
    Lot: 'Lot/Batch',
    Serial: 'Serial Number',
    
    // Status
    Draft: 'Draft',
    Receiving: 'Receiving',
    
    // Validation messages
    required: 'This field is required',
    invalidQty: 'Quantity must be greater than 0',
    partnerRequired: 'Partner is required for PO and Return types',
    sourceWarehouseRequired: 'Source warehouse is required for Transfer type',
    referenceRequired: 'Reference is required for PO, Transfer, and Return types',
    minimumOneLine: 'At least one line is required',
    
    // Import/Export
    importTemplate: 'Download Template',
    importFile: 'Import File',
    exportData: 'Export Current Lines',
    importSuccess: 'Lines imported successfully',
    importError: 'Import failed. Please check the file format.',
    
    // Tooltips
    receiptNoTooltip: 'Auto-generated when saving draft first time. Format: GR-[WHCODE]-[YYYYMM]-[seq]',
    trackingTooltip: 'Tracking type is automatically set from Asset Model and cannot be changed',
    importTooltip: 'Import lines from CSV/XLSX. Required columns: model_code, uom_code, tracking_type, qty_planned',
    
    // Placeholders
    selectReceiptType: 'Select receipt type',
    selectPartner: 'Select partner',
    selectWarehouse: 'Select warehouse',
    searchWarehouse: 'Search warehouse...',
    selectAssetModel: 'Select asset model',
    selectUoM: 'Select unit of measure',
    enterReference: 'Enter reference number',
    enterQuantity: 'Enter quantity',
    enterRemarks: 'Enter remarks...',
    enterLineNote: 'Enter line note...',
    
    // Messages
    noLines: 'No lines added yet. Add lines or import from template.',
    receiptSaved: 'Receipt saved as draft successfully',
    receiptCreated: 'Receipt created successfully',
    validationErrors: 'Please fix the following errors:',
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
  },
  vi: {
    // Navigation
    backToList: 'Quay Lại Danh Sách Phiếu Nhập',
    createReceipt: 'Tạo Phiếu Nhập Kho',
    editReceipt: 'Sửa Phiếu Nhập Kho',
    
    // Header section
    receiptHeader: 'Thông Tin Phiếu',
    receiptNo: 'Số Phiếu',
    receiptType: 'Loại Phiếu',
    reference: 'Tham Chiếu',
    partner: 'Đối Tác',
    sourceWarehouse: 'Kho Nguồn',
    destinationWarehouse: 'Kho Đích',
    expectedDate: 'Ngày Dự Kiến',
    remarks: 'Ghi Chú',
    
    // Lines section
    receiptLines: 'Chi Tiết Phiếu',
    addLine: 'Thêm Dòng',
    importLines: 'Nhập Dòng',
    exportLines: 'Xuất Dòng',
    assetModel: 'Mẫu Tài Sản',
    unitOfMeasure: 'Đơn Vị Tính',
    trackingType: 'Loại Theo Dõi',
    plannedQty: 'SL Dự Kiến',
    lineNote: 'Ghi Chú Dòng',
    actions: 'Thao Tác',
    
    // Actions
    saveDraft: 'Lưu Nháp',
    create: 'Tạo Phiếu',
    cancel: 'Hủy',
    
    // Types
    PO: 'Đơn Mua Hàng',
    Transfer: 'Chuyển Kho',
    Return: 'Trả Hàng',
    Manual: 'Nhập Thủ Công',
    
    // Tracking types
    None: 'Không',
    Lot: 'Lô/Batch',
    Serial: 'Số Serial',
    
    // Status
    Draft: 'Nháp',
    Receiving: 'Đang Nhận',
    
    // Validation messages
    required: 'Trường này là bắt buộc',
    invalidQty: 'Số lượng phải lớn hơn 0',
    partnerRequired: 'Đối tác là bắt buộc cho loại Đơn mua hàng và Trả hàng',
    sourceWarehouseRequired: 'Kho nguồn là bắt buộc cho loại Chuyển kho',
    referenceRequired: 'Tham chiếu là bắt buộc cho loại Đơn mua hàng, Chuyển kho và Trả hàng',
    minimumOneLine: 'Cần có ít nhất một dòng',
    
    // Import/Export
    importTemplate: 'Tải Mẫu',
    importFile: 'Nhập File',
    exportData: 'Xuất Dòng Hiện Tại',
    importSuccess: 'Nhập dòng thành công',
    importError: 'Nhập thất bại. Vui lòng kiểm tra định dạng file.',
    
    // Tooltips
    receiptNoTooltip: 'Tự động tạo khi lưu nháp lần đầu. Định dạng: GR-[WHCODE]-[YYYYMM]-[seq]',
    trackingTooltip: 'Loại theo dõi được tự động thiết lập từ Mẫu Tài Sản và không thể thay đổi',
    importTooltip: 'Nhập dòng từ CSV/XLSX. Cột bắt buộc: model_code, uom_code, tracking_type, qty_planned',
    
    // Placeholders
    selectReceiptType: 'Chọn loại phiếu',
    selectPartner: 'Chọn đối tác',
    selectWarehouse: 'Chọn kho',
    searchWarehouse: 'Tìm kiếm kho...',
    selectAssetModel: 'Chọn mẫu tài sản',
    selectUoM: 'Chọn đơn vị tính',
    enterReference: 'Nhập số tham chiếu',
    enterQuantity: 'Nhập số lượng',
    enterRemarks: 'Nhập ghi chú...',
    enterLineNote: 'Nhập ghi chú dòng...',
    
    // Messages
    noLines: 'Chưa có dòng nào. Thêm dòng hoặc nhập từ mẫu.',
    receiptSaved: 'Lưu phiếu nháp thành công',
    receiptCreated: 'Tạo phiếu thành công',
    validationErrors: 'Vui lòng sửa các lỗi sau:',
    unsavedChanges: 'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi?'
  }
}

interface GoodsReceiptFormPageProps {
  mode: 'create' | 'edit'
  receiptId?: string
}

export function GoodsReceiptFormPage({ mode, receiptId }: GoodsReceiptFormPageProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  // Get receipt data for edit mode
  const [receipt, setReceipt] = useState<GoodsReceipt | null>(() => {
    if (mode === 'edit') {
      const id = receiptId || localStorage.getItem('editingReceiptId')
      return id ? mockGoodsReceipts.find(r => r.id === id) || null : null
    }
    return null
  })
  
  const [currentStatus, setCurrentStatus] = useState<'Draft' | 'Receiving'>(receipt?.status as 'Draft' | 'Receiving' || 'Draft')
  const [receiptNo, setReceiptNo] = useState(receipt?.receipt_no || '')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors, isDirty } } = useForm<GoodsReceiptFormData>({
    defaultValues: {
      receipt_type: receipt?.receipt_type || 'PO',
      ref_no: receipt?.ref_no || '',
      partner_id: receipt?.partner_id || '',
      from_wh_id: receipt?.from_wh_id || '',
      to_wh_id: receipt?.to_wh_id || '',
      expected_date: receipt?.expected_date || new Date().toISOString().split('T')[0],
      remark: receipt?.remark || '',
      lines: receipt?.lines?.map(line => ({
        model_id: line.model_id,
        uom_id: line.uom_id,
        tracking_type: line.tracking_type,
        qty_planned: line.qty_planned,
        note: line.note || ''
      })) || [],
      attachments: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines'
  })

  const watchedReceiptType = watch('receipt_type')
  const watchedToWarehouse = watch('to_wh_id')

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty)
  }, [isDirty])

  // Handle browser back/close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = t.unsavedChanges
        return t.unsavedChanges
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, t.unsavedChanges])

  useEffect(() => {
    // Clear dependent fields when receipt type changes
    if (watchedReceiptType === 'Manual') {
      setValue('ref_no', '')
      setValue('partner_id', '')
      setValue('from_wh_id', '')
    } else if (watchedReceiptType === 'Transfer') {
      setValue('partner_id', '')
    } else if (watchedReceiptType === 'PO' || watchedReceiptType === 'Return') {
      setValue('from_wh_id', '')
    }
  }, [watchedReceiptType, setValue])

  const addLine = () => {
    append({
      model_id: '',
      uom_id: '',
      tracking_type: 'None',
      qty_planned: 1,
      note: ''
    })
  }

  const handleModelChange = (lineIndex: number, modelId: string) => {
    const selectedModel = mockModelAssets.find(m => m.id === modelId)
    if (selectedModel) {
      setValue(`lines.${lineIndex}.model_id`, modelId)
      setValue(`lines.${lineIndex}.tracking_type`, selectedModel.tracking_type)
      // Clear UoM when model changes
      setValue(`lines.${lineIndex}.uom_id`, '')
    }
  }

  const downloadTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      'model_code,uom_code,tracking_type,qty_planned,note,serial_list,lot_no,mfg_date,exp_date\n' +
      'LAP001,PCS,Serial,5,High priority items,,,\n' +
      'MSE001,PCS,Lot,20,,,,"LOT2024001",,\n' +
      'CBL001,PCS,None,50,,,,,\n'
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'goods_receipt_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportCurrentLines = () => {
    const currentLines = watch('lines')
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [
        'model_code,uom_code,tracking_type,qty_planned,note',
        ...currentLines.map(line => {
          const model = mockModelAssets.find(m => m.id === line.model_id)
          const uom = mockUoMs.find(u => u.id === line.uom_id)
          return [
            model?.code || '',
            uom?.code || '',
            line.tracking_type,
            line.qty_planned,
            line.note || ''
          ].join(',')
        })
      ].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `receipt_lines_${receiptNo || 'new'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        
        const importedLines = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim())
            const lineData: any = {}
            headers.forEach((header, index) => {
              lineData[header] = values[index] || ''
            })
            return lineData
          })
          .filter(lineData => lineData.model_code && lineData.uom_code)

        // Convert imported data to form format
        const formLines = importedLines.map((lineData: any) => {
          const model = mockModelAssets.find(m => m.code === lineData.model_code)
          const uom = mockUoMs.find(u => u.code === lineData.uom_code)
          
          return {
            model_id: model?.id || '',
            uom_id: uom?.id || '',
            tracking_type: lineData.tracking_type || 'None',
            qty_planned: parseFloat(lineData.qty_planned) || 1,
            note: lineData.note || ''
          }
        }).filter(line => line.model_id && line.uom_id)

        // Replace current lines with imported ones
        setValue('lines', formLines)
        toast.success(t.importSuccess)
        
      } catch (error) {
        console.error('Import error:', error)
        toast.error(t.importError)
      }
    }
    reader.readAsText(file)
  }

  const onSubmit = (data: GoodsReceiptFormData, isDraft: boolean = true) => {
    // Validation
    const errors: string[] = []
    
    if (!data.lines.length) {
      errors.push(t.minimumOneLine)
    }
    
    if ((data.receipt_type === 'PO' || data.receipt_type === 'Return') && !data.partner_id) {
      errors.push(t.partnerRequired)
    }
    
    if (data.receipt_type === 'Transfer' && !data.from_wh_id) {
      errors.push(t.sourceWarehouseRequired)
    }
    
    if ((data.receipt_type === 'PO' || data.receipt_type === 'Transfer' || data.receipt_type === 'Return') && !data.ref_no) {
      errors.push(t.referenceRequired)
    }

    if (errors.length > 0) {
      toast.error(t.validationErrors + '\n' + errors.join('\n'))
      return
    }

    // Generate receipt number if new and saving draft
    let newReceiptNo = receiptNo
    if (!receiptNo && isDraft) {
      const warehouse = mockWarehouses.find(w => w.id === data.to_wh_id)
      newReceiptNo = generateReceiptNumber(warehouse?.code || 'WH01')
      setReceiptNo(newReceiptNo)
    }

    // Build receipt object
    const newReceipt: GoodsReceipt = {
      id: receipt?.id || Date.now().toString(),
      receipt_no: newReceiptNo,
      receipt_type: data.receipt_type,
      ref_no: data.ref_no,
      partner_id: data.partner_id,
      partner_code: data.partner_id ? mockPartners.find(p => p.id === data.partner_id)?.code : undefined,
      partner_name: data.partner_id ? mockPartners.find(p => p.id === data.partner_id)?.name : undefined,
      from_wh_id: data.from_wh_id,
      from_wh_code: data.from_wh_id ? mockWarehouses.find(w => w.id === data.from_wh_id)?.code : undefined,
      from_wh_name: data.from_wh_id ? mockWarehouses.find(w => w.id === data.from_wh_id)?.name : undefined,
      to_wh_id: data.to_wh_id,
      to_wh_code: mockWarehouses.find(w => w.id === data.to_wh_id)?.code || '',
      to_wh_name: mockWarehouses.find(w => w.id === data.to_wh_id)?.name || '',
      expected_date: data.expected_date,
      remark: data.remark,
      status: isDraft ? 'Draft' : 'Receiving',
      lines: data.lines.map((line, index) => {
        const model = mockModelAssets.find(m => m.id === line.model_id)
        const uom = mockUoMs.find(u => u.id === line.uom_id)
        return {
          id: receipt?.lines[index]?.id || (Date.now() + index).toString(),
          model_id: line.model_id,
          model_code: model?.code || '',
          model_name: model?.name || '',
          uom_id: line.uom_id,
          uom_code: uom?.code || '',
          uom_name: uom?.name || '',
          tracking_type: line.tracking_type,
          qty_planned: line.qty_planned,
          note: line.note
        }
      }),
      attachments: [],
      created_at: receipt?.created_at || new Date().toISOString(),
      created_by: receipt?.created_by || 'current_user',
      updated_at: new Date().toISOString(),
      updated_by: 'current_user'
    }

    setCurrentStatus(newReceipt.status as 'Draft' | 'Receiving')
    
    // Show success message
    toast.success(isDraft ? t.receiptSaved : t.receiptCreated)
    
    // Reset unsaved changes flag
    setHasUnsavedChanges(false)
    
    // Clean up localStorage and navigate back to list after a brief delay
    setTimeout(() => {
      localStorage.removeItem('editingReceiptId')
      window.location.hash = '#warehouse/goods-receipt'
    }, 1500)
  }

  const handleBackToList = () => {
    if (hasUnsavedChanges && !confirm(t.unsavedChanges)) {
      return
    }
    // Clean up localStorage
    localStorage.removeItem('editingReceiptId')
    window.location.hash = '#warehouse/goods-receipt'
  }

  const getPartnerOptions = () => {
    return mockPartners.filter(p => p.status === 'Active')
  }

  const getModelOptions = () => {
    return mockModelAssets.filter(m => m.status === 'Active')
  }

  const getUomOptions = () => {
    return mockUoMs.filter(u => u.status === 'Active')
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToList}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToList}
        </Button>
        <div>
          <h1>{mode === 'create' ? t.createReceipt : t.editReceipt}</h1>
          {receiptNo && (
            <p className="text-muted-foreground font-mono">{receiptNo}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
        {/* Header Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>{t.receiptHeader}</CardTitle>
              {receiptNo && (
                <Badge variant="outline" className="font-mono">
                  {receiptNo}
                </Badge>
              )}
              <Badge variant={currentStatus === 'Draft' ? 'secondary' : 'default'}>
                {t[currentStatus]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="receipt_no">{t.receiptNo}</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t.receiptNoTooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="receipt_no"
                  value={receiptNo || 'Auto-generated'}
                  disabled
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt_type">{t.receiptType} *</Label>
                <Select 
                  value={watch('receipt_type')} 
                  onValueChange={(value) => setValue('receipt_type', value as any)}
                  disabled={!!receipt}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.selectReceiptType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PO">{t.PO}</SelectItem>
                    <SelectItem value="Transfer">{t.Transfer}</SelectItem>
                    <SelectItem value="Return">{t.Return}</SelectItem>
                    <SelectItem value="Manual">{t.Manual}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.receipt_type && (
                  <p className="text-sm text-red-500">{t.required}</p>
                )}
              </div>

              {(watchedReceiptType === 'PO' || watchedReceiptType === 'Transfer' || watchedReceiptType === 'Return') && (
                <div className="space-y-2">
                  <Label htmlFor="ref_no">{t.reference} *</Label>
                  <Input
                    id="ref_no"
                    {...register('ref_no', { required: true })}
                    placeholder={t.enterReference}
                  />
                  {errors.ref_no && (
                    <p className="text-sm text-red-500">{t.required}</p>
                  )}
                </div>
              )}

              {(watchedReceiptType === 'PO' || watchedReceiptType === 'Return') && (
                <div className="space-y-2">
                  <Label htmlFor="partner_id">{t.partner} *</Label>
                  <Select 
                    value={watch('partner_id')} 
                    onValueChange={(value) => setValue('partner_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectPartner} />
                    </SelectTrigger>
                    <SelectContent>
                      {getPartnerOptions().map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.code} - {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.partner_id && (
                    <p className="text-sm text-red-500">{t.required}</p>
                  )}
                </div>
              )}

              {watchedReceiptType === 'Transfer' && (
                <div className="space-y-2">
                  <Label htmlFor="from_wh_id">{t.sourceWarehouse} *</Label>
                  <WarehouseSelectWithSearch
                    value={watch('from_wh_id')}
                    onValueChange={(value) => setValue('from_wh_id', value)}
                    placeholder={t.selectWarehouse}
                    excludeWarehouseId={watchedToWarehouse}
                  />
                  {errors.from_wh_id && (
                    <p className="text-sm text-red-500">{t.required}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="to_wh_id">{t.destinationWarehouse} *</Label>
                <WarehouseSelectWithSearch
                  value={watch('to_wh_id')}
                  onValueChange={(value) => setValue('to_wh_id', value)}
                  placeholder={t.selectWarehouse}
                />
                {errors.to_wh_id && (
                  <p className="text-sm text-red-500">{t.required}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_date">{t.expectedDate} *</Label>
                <Input
                  id="expected_date"
                  type="date"
                  {...register('expected_date', { required: true })}
                />
                {errors.expected_date && (
                  <p className="text-sm text-red-500">{t.required}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remark">{t.remarks}</Label>
              <Textarea
                id="remark"
                {...register('remark')}
                placeholder={t.enterRemarks}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lines Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{t.receiptLines}</CardTitle>
                <Badge variant="secondary">{fields.length} lines</Badge>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={downloadTemplate} variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        {t.importTemplate}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{t.importTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <input
                  id="file-import"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('file-import')?.click()}
                  variant="outline"
                  size="sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t.importFile}
                </Button>

                {fields.length > 0 && (
                  <Button onClick={exportCurrentLines} variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    {t.exportData}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">{t.noLines}</p>
                <Button type="button" onClick={addLine}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.addLine}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Add Line Button - Now inside Lines section */}
                <div className="flex justify-end">
                  <Button type="button" onClick={addLine} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addLine}
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.assetModel}</TableHead>
                        <TableHead>{t.unitOfMeasure}</TableHead>
                        <TableHead>{t.trackingType}</TableHead>
                        <TableHead className="text-right">{t.plannedQty}</TableHead>
                        <TableHead>{t.lineNote}</TableHead>
                        <TableHead className="w-[100px]">{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <Select
                              value={watch(`lines.${index}.model_id`)}
                              onValueChange={(value) => handleModelChange(index, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t.selectAssetModel} />
                              </SelectTrigger>
                              <SelectContent>
                                {getModelOptions().map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    <div className="flex flex-col">
                                      <span className="font-mono text-sm">{model.code}</span>
                                      <span className="text-xs text-muted-foreground">{model.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={watch(`lines.${index}.uom_id`)}
                              onValueChange={(value) => setValue(`lines.${index}.uom_id`, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t.selectUoM} />
                              </SelectTrigger>
                              <SelectContent>
                                {getUomOptions().map((uom) => (
                                  <SelectItem key={uom.id} value={uom.id}>
                                    {uom.code} - {uom.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {t[watch(`lines.${index}.tracking_type`) as keyof typeof t]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              {...register(`lines.${index}.qty_planned`, { 
                                required: true, 
                                min: 1 
                              })}
                              placeholder={t.enterQuantity}
                              className="text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              {...register(`lines.${index}.note`)}
                              placeholder={t.enterLineNote}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6">
          <Button type="button" variant="outline" onClick={handleBackToList}>
            {t.cancel}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button type="submit" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              {t.saveDraft}
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit((data) => onSubmit(data, false))}
            >
              <Send className="w-4 h-4 mr-2" />
              {t.create}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}