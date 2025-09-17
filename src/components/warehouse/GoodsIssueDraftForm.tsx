import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ScrollArea } from '../ui/scroll-area'

import { GoodsIssue, GoodsIssueDraftLineInput, GoodsIssueDraftPayload, GoodsIssueTrackingType } from '../../types/goodsIssue'
import { useGoodsIssues } from '../../contexts/GoodsIssueContext'
import { useLanguage } from '../../contexts/LanguageContext'

interface GoodsIssueDraftFormProps {
  open: boolean
  onClose: () => void
  issue?: GoodsIssue
}

interface DraftFormState {
  issue_type: GoodsIssue['issue_type']
  partner_name?: string
  from_wh_name: string
  to_wh_name?: string
  expected_date: string
  lines: GoodsIssueDraftLineInput[]
}

const trackingTypeOptions: { value: GoodsIssueTrackingType; label: string }[] = [
  { value: 'NONE', label: 'Not Tracked' },
  { value: 'LOT', label: 'Lot Controlled' },
  { value: 'SERIAL', label: 'Serial Controlled' }
]

const defaultLine = (): GoodsIssueDraftLineInput => ({
  sku: '',
  product_name: '',
  planned_qty: 1,
  uom: '',
  tracking_type: 'NONE'
})

export function GoodsIssueDraftForm({ open, onClose, issue }: GoodsIssueDraftFormProps) {
  const { createDraft, updateDraft } = useGoodsIssues()
  const { language } = useLanguage()

  const t = useMemo(() => {
    const translations = {
      en: {
        createTitle: 'Create Goods Issue Draft',
        editTitle: 'Edit Goods Issue Draft',
        issueType: 'Issue Type',
        partner: 'Partner / Destination',
        fromWarehouse: 'From Warehouse',
        toWarehouse: 'To Warehouse',
        expectedDate: 'Expected Date',
        addLine: 'Add Line',
        sku: 'SKU',
        product: 'Product Name',
        plannedQty: 'Planned Qty',
        uom: 'UoM',
        trackingType: 'Tracking Type',
        cancel: 'Cancel',
        save: issue ? 'Save Changes' : 'Create Draft',
        mandatoryHint: 'All fields are required.',
        noLinesError: 'Please add at least one line before saving.',
        issueTypePlaceholder: 'Select issue type'
      },
      vn: {
        createTitle: 'Tạo Phiếu Xuất Nháp',
        editTitle: 'Chỉnh Sửa Phiếu Xuất Nháp',
        issueType: 'Loại Phiếu',
        partner: 'Đối tác / Nơi nhận',
        fromWarehouse: 'Kho xuất',
        toWarehouse: 'Kho nhận',
        expectedDate: 'Ngày dự kiến',
        addLine: 'Thêm dòng',
        sku: 'Mã hàng',
        product: 'Tên hàng hóa',
        plannedQty: 'SL kế hoạch',
        uom: 'Đơn vị tính',
        trackingType: 'Kiểu kiểm soát',
        cancel: 'Hủy',
        save: issue ? 'Lưu thay đổi' : 'Tạo nháp',
        mandatoryHint: 'Vui lòng nhập đầy đủ các trường bắt buộc.',
        noLinesError: 'Cần ít nhất một dòng hàng trước khi lưu.',
        issueTypePlaceholder: 'Chọn loại phiếu'
      }
    } as const

    return translations[language as keyof typeof translations] || translations.en
  }, [language, issue])

  const [formState, setFormState] = useState<DraftFormState>(() =>
    issue
      ? {
          issue_type: issue.issue_type,
          partner_name: issue.partner_name,
          from_wh_name: issue.from_wh_name,
          to_wh_name: issue.to_wh_name,
          expected_date: issue.expected_date,
          lines: issue.lines.map(line => ({
            line_id: line.line_id,
            sku: line.sku,
            product_name: line.product_name,
            planned_qty: line.planned_qty,
            uom: line.uom,
            tracking_type: line.tracking_type
          }))
        }
      : {
          issue_type: 'Sales Order',
          partner_name: '',
          from_wh_name: '',
          to_wh_name: '',
          expected_date: new Date().toISOString().slice(0, 10),
          lines: [defaultLine()]
        }
  )

  useEffect(() => {
    if (!open) return
    if (issue) {
      setFormState({
        issue_type: issue.issue_type,
        partner_name: issue.partner_name,
        from_wh_name: issue.from_wh_name,
        to_wh_name: issue.to_wh_name,
        expected_date: issue.expected_date,
        lines: issue.lines.map(line => ({
          line_id: line.line_id,
          sku: line.sku,
          product_name: line.product_name,
          planned_qty: line.planned_qty,
          uom: line.uom,
          tracking_type: line.tracking_type
        }))
      })
    } else {
      setFormState({
        issue_type: 'Sales Order',
        partner_name: '',
        from_wh_name: '',
        to_wh_name: '',
        expected_date: new Date().toISOString().slice(0, 10),
        lines: [defaultLine()]
      })
    }
  }, [issue, open])

  const updateLine = (index: number, updates: Partial<GoodsIssueDraftLineInput>) => {
    setFormState(prev => ({
      ...prev,
      lines: prev.lines.map((line, idx) => (idx === index ? { ...line, ...updates } : line))
    }))
  }

  const removeLine = (index: number) => {
    setFormState(prev => ({
      ...prev,
      lines: prev.lines.filter((_, idx) => idx !== index)
    }))
  }

  const addLine = () => {
    setFormState(prev => ({
      ...prev,
      lines: [...prev.lines, defaultLine()]
    }))
  }

  const handleSubmit = () => {
    const payload: GoodsIssueDraftPayload = {
      issue_type: formState.issue_type,
      partner_name: formState.partner_name,
      from_wh_name: formState.from_wh_name.trim(),
      to_wh_name: formState.to_wh_name?.trim(),
      expected_date: formState.expected_date,
      lines: formState.lines.map(line => ({
        line_id: line.line_id,
        sku: line.sku.trim(),
        product_name: line.product_name.trim(),
        planned_qty: Number(line.planned_qty),
        uom: line.uom.trim(),
        tracking_type: line.tracking_type
      }))
    }

    if (!payload.from_wh_name || !payload.expected_date) {
      toast.error(t.mandatoryHint)
      return
    }

    if (!payload.lines.length) {
      toast.error(t.noLinesError)
      return
    }

    if (payload.lines.some(line => !line.sku || !line.product_name || !line.uom || line.planned_qty <= 0)) {
      toast.error(t.mandatoryHint)
      return
    }

    if (issue) {
      const result = updateDraft(issue.issue_no, payload)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Draft updated successfully')
    } else {
      const result = createDraft(payload)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Draft created successfully')
    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{issue ? t.editTitle : t.createTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t.issueType}</Label>
              <Select
                value={formState.issue_type}
                onValueChange={value =>
                  setFormState(prev => ({
                    ...prev,
                    issue_type: value as GoodsIssue['issue_type']
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.issueTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales Order">Sales Order</SelectItem>
                  <SelectItem value="Transfer">Transfer</SelectItem>
                  <SelectItem value="Return">Return</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.partner}</Label>
              <Input
                value={formState.partner_name || ''}
                onChange={event =>
                  setFormState(prev => ({
                    ...prev,
                    partner_name: event.target.value
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>
                {t.fromWarehouse} <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formState.from_wh_name}
                onChange={event =>
                  setFormState(prev => ({
                    ...prev,
                    from_wh_name: event.target.value
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>{t.toWarehouse}</Label>
              <Input
                value={formState.to_wh_name || ''}
                onChange={event =>
                  setFormState(prev => ({
                    ...prev,
                    to_wh_name: event.target.value
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>
                {t.expectedDate} <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={formState.expected_date}
                onChange={event =>
                  setFormState(prev => ({
                    ...prev,
                    expected_date: event.target.value
                  }))
                }
              />
            </div>
          </div>
          <div className="rounded-md border">
            <div className="flex items-center justify-between border-b p-3">
              <p className="text-sm text-muted-foreground">{t.mandatoryHint}</p>
              <Button variant="outline" size="sm" onClick={addLine}>
                <Plus className="mr-2 h-4 w-4" />
                {t.addLine}
              </Button>
            </div>
            <ScrollArea className="max-h-[45vh]">
              <div className="space-y-4 p-4">
                {formState.lines.map((line, index) => (
                  <div key={index} className="grid gap-3 rounded-md border p-3 md:grid-cols-6">
                    <div className="md:col-span-1">
                      <Label className="text-xs uppercase text-muted-foreground">{t.sku}</Label>
                      <Input
                        value={line.sku}
                        onChange={event => updateLine(index, { sku: event.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs uppercase text-muted-foreground">{t.product}</Label>
                      <Input
                        value={line.product_name}
                        onChange={event =>
                          updateLine(index, { product_name: event.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-muted-foreground">{t.plannedQty}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={line.planned_qty}
                        onChange={event =>
                          updateLine(index, { planned_qty: Number(event.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-muted-foreground">{t.uom}</Label>
                      <Input value={line.uom} onChange={event => updateLine(index, { uom: event.target.value })} />
                    </div>
                    <div>
                      <Label className="text-xs uppercase text-muted-foreground">{t.trackingType}</Label>
                      <Select
                        value={line.tracking_type}
                        onValueChange={value =>
                          updateLine(index, { tracking_type: value as GoodsIssueTrackingType })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {trackingTypeOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLine(index)}
                        disabled={formState.lines.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit}>{t.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
