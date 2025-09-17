import { useEffect, useMemo, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form@7.55.0'
import { ArrowLeft, Plus, Trash2, Upload, Download, Info, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import {
  enrichGoodsIssueLine,
  generateGoodsIssueNumber,
  logGoodsIssueAudit,
  saveGoodsIssueDraft
} from '../../data/mockGoodsIssueData'
import { mockPartners } from '../../data/mockPartnerData'
import { mockWarehouses } from '../../data/mockWarehouseData'
import { mockModelAssets } from '../../data/mockModelAssetData'
import { mockUoMs } from '../../data/mockUomData'
import { GoodsIssue, GoodsIssueFormData, GoodsIssueTrackingType } from '../../types/goodsIssue'
import { WarehouseSelectWithSearch } from '../goodsreceipt/WarehouseSelectWithSearch'
import { AssetModelSelectWithSearch } from '../goodsreceipt/AssetModelSelectWithSearch'
import { UomSelectWithSearch } from '../goodsreceipt/UomSelectWithSearch'
import { toast } from 'sonner'

const translations = {
  en: {
    backToList: 'Back to Goods Issue List',
    createIssue: 'Create Goods Issue',
    issueHeader: 'Issue Header',
    issueNo: 'Issue No',
    issueType: 'Issue Type',
    reference: 'Reference',
    partner: 'Partner',
    sourceWarehouse: 'Source Warehouse',
    destinationWarehouse: 'Destination Warehouse',
    plannedDate: 'Planned Date',
    remarks: 'Remarks',
    issueLines: 'Issue Lines',
    addLine: 'Add Line',
    importLines: 'Import Lines',
    exportLines: 'Export Lines',
    assetModel: 'Asset Model',
    unitOfMeasure: 'Unit of Measure',
    trackingType: 'Tracking Type',
    plannedQty: 'Planned Qty',
    lineNote: 'Line Note',
    details: 'Details',
    remove: 'Remove',
    noLines: 'No lines added yet. Use Add Line or import from template.',
    saveDraft: 'Save Draft',
    cancel: 'Cancel',
    draftStatus: 'Draft',
    detailTitle: 'Tracking Details',
    serialHelp: 'Enter one serial per line. Empty lines will be ignored.',
    lotHelp: 'Provide lot number and manufacturing / expiration dates when available.',
    partnerRequired: 'Partner is required for Sales Order and Return issues.',
    destinationRequired: 'Destination warehouse is required for Transfer issues.',
    sourceRequired: 'Source warehouse is required.',
    referenceRequired: 'Reference is required for Sales Order, Transfer and Return issues.',
    quantityRequired: 'Quantity must be greater than 0.',
    minimumOneLine: 'At least one line is required.',
    draftSaved: 'Goods issue saved as draft successfully.',
    SO: 'Sales Order',
    Transfer: 'Transfer',
    Return: 'Return',
    Consumption: 'Consumption'
  },
  vn: {
    backToList: 'Quay lại danh sách phiếu xuất',
    createIssue: 'Tạo phiếu xuất kho',
    issueHeader: 'Thông tin phiếu',
    issueNo: 'Số phiếu',
    issueType: 'Loại phiếu',
    reference: 'Tham chiếu',
    partner: 'Đối tác',
    sourceWarehouse: 'Kho xuất',
    destinationWarehouse: 'Kho nhận',
    plannedDate: 'Ngày dự kiến',
    remarks: 'Ghi chú',
    issueLines: 'Chi tiết phiếu',
    addLine: 'Thêm dòng',
    importLines: 'Nhập dòng',
    exportLines: 'Xuất dòng',
    assetModel: 'Mẫu tài sản',
    unitOfMeasure: 'Đơn vị tính',
    trackingType: 'Loại theo dõi',
    plannedQty: 'SL dự kiến',
    lineNote: 'Ghi chú dòng',
    details: 'Chi tiết',
    remove: 'Xóa',
    noLines: 'Chưa có dòng nào. Sử dụng Thêm dòng hoặc nhập từ file.',
    saveDraft: 'Lưu nháp',
    cancel: 'Hủy',
    draftStatus: 'Nháp',
    detailTitle: 'Thông tin theo dõi',
    serialHelp: 'Nhập mỗi serial trên một dòng. Bỏ qua dòng trống.',
    lotHelp: 'Cung cấp số lô và ngày sản xuất / hết hạn nếu có.',
    partnerRequired: 'Đối tác bắt buộc cho phiếu bán hàng và trả hàng.',
    destinationRequired: 'Kho nhận bắt buộc cho phiếu chuyển kho.',
    sourceRequired: 'Vui lòng chọn kho xuất.',
    referenceRequired: 'Tham chiếu bắt buộc cho phiếu bán hàng, chuyển kho và trả hàng.',
    quantityRequired: 'Số lượng phải lớn hơn 0.',
    minimumOneLine: 'Cần ít nhất một dòng.',
    draftSaved: 'Lưu phiếu nháp thành công.',
    SO: 'Đơn bán hàng',
    Transfer: 'Chuyển kho',
    Return: 'Trả hàng',
    Consumption: 'Tiêu dùng nội bộ'
  }
}

type DetailDialogState = {
  index: number
} | null

const issueTypes: GoodsIssue['issue_type'][] = ['SO', 'Transfer', 'Return', 'Consumption']

const requiresPartner = (issueType: GoodsIssue['issue_type']) =>
  issueType === 'SO' || issueType === 'Return'

const requiresDestinationWarehouse = (issueType: GoodsIssue['issue_type']) =>
  issueType === 'Transfer'

export function GoodsIssueFormWrapper() {
  const { language } = useLanguage()
  const t = translations[language]

  const [issueNo, setIssueNo] = useState('')
  const [detailDialog, setDetailDialog] = useState<DetailDialogState>(null)
  const [serialInput, setSerialInput] = useState('')
  const [lotInfo, setLotInfo] = useState({ lot_no: '', mfg_date: '', exp_date: '' })

  const form = useForm<GoodsIssueFormData>({
    defaultValues: {
      issue_type: 'SO',
      planned_date: new Date().toISOString().split('T')[0],
      lines: []
    }
  })

  const { control, handleSubmit, watch, setValue, getValues, resetField } = form
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'lines'
  })

  const issueType = watch('issue_type')
  const fromWarehouseId = watch('from_wh_id')

  useEffect(() => {
    if (!requiresPartner(issueType)) {
      resetField('partner_id', { keepDirty: false })
    }
    if (!requiresDestinationWarehouse(issueType)) {
      resetField('to_wh_id', { keepDirty: false })
    }
  }, [issueType, resetField])

  useEffect(() => {
    if (detailDialog !== null) {
      const currentLine = getValues(`lines.${detailDialog.index}`)
      setSerialInput((currentLine.serial_numbers || []).join('\n'))
      setLotInfo({
        lot_no: currentLine.lot_no || '',
        mfg_date: currentLine.mfg_date || '',
        exp_date: currentLine.exp_date || ''
      })
    }
  }, [detailDialog, getValues])

  const handleBack = () => {
    window.location.hash = '#warehouse/goods-issue'
  }

  const handleAddLine = () => {
    append({
      model_id: '',
      uom_id: '',
      tracking_type: 'None',
      qty_planned: 1,
      note: ''
    })
  }

  const handleModelChange = (index: number, modelId: string) => {
    const model = mockModelAssets.find(m => m.id === modelId)
    setValue(`lines.${index}.model_id`, modelId)
    const tracking = (model?.tracking_type || 'None') as GoodsIssueTrackingType
    setValue(`lines.${index}.tracking_type`, tracking)

    if (tracking === 'Serial') {
      setValue(`lines.${index}.serial_numbers`, [])
    } else {
      setValue(`lines.${index}.serial_numbers`, undefined)
    }

    if (tracking !== 'Lot') {
      setValue(`lines.${index}.lot_no`, undefined)
      setValue(`lines.${index}.mfg_date`, undefined)
      setValue(`lines.${index}.exp_date`, undefined)
    }

    const defaultUom = model ? mockUoMs.find(u => u.uom_code === model.uom_code) : undefined
    if (defaultUom) {
      setValue(`lines.${index}.uom_id`, defaultUom.id)
    }
  }

  const openDetailDialog = (index: number) => {
    setDetailDialog({ index })
  }

  const closeDetailDialog = () => {
    setDetailDialog(null)
  }

  const handleDetailSave = () => {
    if (detailDialog === null) return
    const currentLine = getValues(`lines.${detailDialog.index}`)
    const updatedLine = { ...currentLine }

    if (currentLine.tracking_type === 'Serial') {
      const serials = serialInput
        .split(/\r?\n/)
        .map(serial => serial.trim())
        .filter(Boolean)
      updatedLine.serial_numbers = serials
    }

    if (currentLine.tracking_type === 'Lot') {
      updatedLine.lot_no = lotInfo.lot_no || undefined
      updatedLine.mfg_date = lotInfo.mfg_date || undefined
      updatedLine.exp_date = lotInfo.exp_date || undefined
    }

    update(detailDialog.index, updatedLine)
    closeDetailDialog()
  }

  const handleExportLines = () => {
    const currentLines = getValues('lines')
    logGoodsIssueAudit('exported', issueNo || 'draft', 'Goods issue line export placeholder', {
      line_count: currentLines.length
    })
  }

  const handleImportLines = () => {
    logGoodsIssueAudit('imported', issueNo || 'draft', 'Goods issue line import placeholder')
  }

  const onSubmit = (data: GoodsIssueFormData) => {
    const errors: string[] = []

    if (!data.from_wh_id) {
      errors.push(t.sourceRequired)
    }

    if (requiresPartner(data.issue_type) && !data.partner_id) {
      errors.push(t.partnerRequired)
    }

    if (requiresDestinationWarehouse(data.issue_type) && !data.to_wh_id) {
      errors.push(t.destinationRequired)
    }

    if ((data.issue_type === 'SO' || data.issue_type === 'Transfer' || data.issue_type === 'Return') && !data.ref_no) {
      errors.push(t.referenceRequired)
    }

    if (!data.lines.length) {
      errors.push(t.minimumOneLine)
    }

    const invalidQty = data.lines.some(line => !line.qty_planned || line.qty_planned <= 0)
    if (invalidQty) {
      errors.push(t.quantityRequired)
    }

    if (errors.length) {
      alert(errors.join('\n'))
      return
    }

    const fromWarehouse = mockWarehouses.find(w => w.id === data.from_wh_id)
    const toWarehouse = data.to_wh_id ? mockWarehouses.find(w => w.id === data.to_wh_id) : undefined
    const partner = data.partner_id ? mockPartners.find(p => p.id === data.partner_id) : undefined

    let currentIssueNo = issueNo
    if (!currentIssueNo) {
      currentIssueNo = generateGoodsIssueNumber(fromWarehouse?.code || 'WH01')
      setIssueNo(currentIssueNo)
    }

    const now = new Date().toISOString()

    const newIssue: GoodsIssue = {
      id: `gi-${Date.now()}`,
      issue_no: currentIssueNo,
      issue_type: data.issue_type,
      ref_no: data.ref_no,
      partner_id: data.partner_id,
      partner_code: partner?.partner_code,
      partner_name: partner?.partner_name,
      from_wh_id: data.from_wh_id,
      from_wh_code: fromWarehouse?.code || '',
      from_wh_name: fromWarehouse?.name || '',
      to_wh_id: data.to_wh_id,
      to_wh_code: toWarehouse?.code,
      to_wh_name: toWarehouse?.name,
      planned_date: data.planned_date,
      remark: data.remark,
      status: 'Draft',
      lines: data.lines.map((line, index) => {
        const model = mockModelAssets.find(m => m.id === line.model_id)
        const uom = mockUoMs.find(u => u.id === line.uom_id)
        return enrichGoodsIssueLine({
          id: `gi-line-${Date.now()}-${index}`,
          model_id: line.model_id,
          model_code: model?.model_code || '',
          model_name: model?.model_name || '',
          uom_id: line.uom_id,
          uom_code: uom?.uom_code || '',
          uom_name: uom?.uom_name || '',
          tracking_type: line.tracking_type,
          qty_planned: line.qty_planned,
          note: line.note,
          serial_numbers: line.serial_numbers,
          lot_no: line.lot_no,
          mfg_date: line.mfg_date,
          exp_date: line.exp_date
        })
      }),
      created_at: now,
      created_by: 'current_user',
      updated_at: now,
      updated_by: 'current_user'
    }

    logGoodsIssueAudit('created', newIssue.id, 'Goods issue draft created', {
      issue_no: newIssue.issue_no,
      issue_type: newIssue.issue_type
    })
    saveGoodsIssueDraft(newIssue)
    toast.success(t.draftSaved)

    setTimeout(() => {
      window.location.hash = '#warehouse/goods-issue'
    }, 1200)
  }

  const selectedLines = useMemo(() => fields, [fields])

  const activeLine = detailDialog !== null ? getValues(`lines.${detailDialog.index}`) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToList}
        </Button>
        <div className="flex items-center gap-3">
          <div>
            <h1>{t.createIssue}</h1>
            {issueNo && (
              <p className="text-muted-foreground font-mono">{issueNo}</p>
            )}
          </div>
          <Badge variant="outline">{t.draftStatus}</Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.issueHeader}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.issueType}</Label>
                <Controller
                  control={control}
                  name="issue_type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.issueType} />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {t[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.reference}</Label>
                <Controller
                  control={control}
                  name="ref_no"
                  render={({ field }) => (
                    <Input {...field} placeholder={t.reference} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.partner}</Label>
                <Controller
                  control={control}
                  name="partner_id"
                  render={({ field }) => (
                    <Select
                      value={field.value || ''}
                      onValueChange={(value) => field.onChange(value || undefined)}
                      disabled={!requiresPartner(issueType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.partner} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">—</SelectItem>
                        {mockPartners.map(partner => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.partner_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.plannedDate}</Label>
                <Controller
                  control={control}
                  name="planned_date"
                  render={({ field }) => (
                    <Input type="date" {...field} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.sourceWarehouse}</Label>
                <Controller
                  control={control}
                  name="from_wh_id"
                  render={({ field }) => (
                    <WarehouseSelectWithSearch
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.destinationWarehouse}</Label>
                <Controller
                  control={control}
                  name="to_wh_id"
                  render={({ field }) => (
                    <WarehouseSelectWithSearch
                      value={field.value}
                      onValueChange={field.onChange}
                      excludeWarehouseId={fromWarehouseId}
                      disabled={!requiresDestinationWarehouse(issueType)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.remarks}</Label>
              <Controller
                control={control}
                name="remark"
                render={({ field }) => (
                  <Textarea {...field} rows={3} placeholder={t.remarks} />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>{t.issueLines}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleImportLines} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {t.importLines}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleExportLines} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {t.exportLines}
              </Button>
              <Button type="button" size="sm" onClick={handleAddLine} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t.addLine}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedLines.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.noLines}</p>
            ) : (
              selectedLines.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t.assetModel}</Label>
                      <Controller
                        control={control}
                        name={`lines.${index}.model_id`}
                        render={({ field }) => (
                          <AssetModelSelectWithSearch
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value)
                              handleModelChange(index, value)
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.unitOfMeasure}</Label>
                      <Controller
                        control={control}
                        name={`lines.${index}.uom_id`}
                        render={({ field }) => (
                          <UomSelectWithSearch
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[1fr,1fr,auto] md:items-end">
                    <div className="space-y-2">
                      <Label>{t.trackingType}</Label>
                      <Controller
                        control={control}
                        name={`lines.${index}.tracking_type`}
                        render={({ field }) => (
                          <Input value={field.value} readOnly className="bg-muted" />
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.plannedQty}</Label>
                      <Controller
                        control={control}
                        name={`lines.${index}.qty_planned`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            value={field.value ?? ''}
                            onChange={(event) => {
                              const value = event.target.value
                              field.onChange(value === '' ? undefined : Number(value))
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => openDetailDialog(index)} className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        {t.details}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => remove(index)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t.remove}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t.lineNote}</Label>
                    <Controller
                      control={control}
                      name={`lines.${index}.note`}
                      render={({ field }) => (
                        <Textarea {...field} rows={2} />
                      )}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleBack}>
            {t.cancel}
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {t.saveDraft}
          </Button>
        </div>
      </form>

      <Dialog open={detailDialog !== null} onOpenChange={(open) => !open && closeDetailDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.detailTitle}</DialogTitle>
            <DialogDescription>
              {activeLine?.tracking_type === 'Serial' ? t.serialHelp : activeLine?.tracking_type === 'Lot' ? t.lotHelp : ''}
            </DialogDescription>
          </DialogHeader>
          {activeLine && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>{t.trackingType}</Label>
                <Input value={activeLine.tracking_type} readOnly className="bg-muted" />
              </div>
              {activeLine.tracking_type === 'Serial' && (
                <div className="space-y-2">
                  <Label>Serials</Label>
                  <Textarea
                    rows={6}
                    value={serialInput}
                    onChange={(event) => setSerialInput(event.target.value)}
                  />
                </div>
              )}
              {activeLine.tracking_type === 'Lot' && (
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Lot No</Label>
                    <Input
                      value={lotInfo.lot_no}
                      onChange={(event) => setLotInfo(info => ({ ...info, lot_no: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>MFG Date</Label>
                    <Input
                      type="date"
                      value={lotInfo.mfg_date}
                      onChange={(event) => setLotInfo(info => ({ ...info, mfg_date: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>EXP Date</Label>
                    <Input
                      type="date"
                      value={lotInfo.exp_date}
                      onChange={(event) => setLotInfo(info => ({ ...info, exp_date: event.target.value }))}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={closeDetailDialog}>
              {t.cancel}
            </Button>
            <Button type="button" onClick={handleDetailSave}>
              {t.saveDraft}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
