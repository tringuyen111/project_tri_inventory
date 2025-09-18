import { useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

import type { GoodsIssue } from '../../types/goodsIssue'
import { useLanguage } from '../../contexts/LanguageContext'

type IssueType = GoodsIssue['issue_type']
type IssueStatus = GoodsIssue['status']

const issueTypes: IssueType[] = ['SO', 'Transfer', 'ReturnToSupplier', 'Adjustment', 'Manual']
const issueStatuses: IssueStatus[] = [
  'Draft',
  'Picking',
  'AdjustmentRequested',
  'Submitted',
  'Approved',
  'Completed',
  'Cancelled'
]

interface FormState {
  issueNo: string
  issueType: IssueType
  status: IssueStatus
  partnerName: string
  partnerAddress: string
  relatedEntry: string
  fromWarehouse: string
  toWarehouse: string
  expectedDate: string
  remarks: string
  createdBy: string
}

const initialFormState: FormState = {
  issueNo: '',
  issueType: 'SO',
  status: 'Draft',
  partnerName: '',
  partnerAddress: '',
  relatedEntry: '',
  fromWarehouse: '',
  toWarehouse: '',
  expectedDate: '',
  remarks: '',
  createdBy: ''
}

type FormErrors = Partial<Record<keyof FormState, string>>

const translations = {
  en: {
    title: 'Create Goods Issue',
    description:
      'This placeholder form dispatches a mock goods issue event so the management view can preview new records.',
    back: 'Back to goods issues',
    save: 'Save Goods Issue',
    cancel: 'Cancel',
    issueNo: 'Goods Issue Number',
    issueType: 'Issue Type',
    status: 'Status',
    partnerName: 'Partner / Destination',
    partnerAddress: 'Partner Address',
    relatedEntry: 'Related Entry',
    fromWarehouse: 'From Warehouse',
    toWarehouse: 'To Warehouse',
    expectedDate: 'Expected Date',
    remarks: 'Remarks / Notes',
    createdBy: 'Created By',
    optional: 'Optional',
    requiredError: 'This field is required',
    typeLabels: {
      SO: 'Sales Order',
      Transfer: 'Transfer',
      ReturnToSupplier: 'Return to Supplier',
      Adjustment: 'Adjustment',
      Manual: 'Manual'
    } as Record<IssueType, string>,
    statusLabels: {
      Draft: 'Draft',
      Picking: 'Picking',
      AdjustmentRequested: 'Adjustment Requested',
      Submitted: 'Submitted',
      Approved: 'Approved',
      Completed: 'Completed',
      Cancelled: 'Cancelled'
    } as Record<IssueStatus, string>
  },
  vn: {
    title: 'Tạo Phiếu Xuất Kho',
    description:
      'Biểu mẫu tạm thời này sẽ gửi sự kiện mô phỏng để màn hình quản lý hiển thị phiếu mới.',
    back: 'Quay lại danh sách phiếu',
    save: 'Lưu Phiếu Xuất Kho',
    cancel: 'Hủy',
    issueNo: 'Số Phiếu Xuất',
    issueType: 'Loại Phiếu',
    status: 'Trạng Thái',
    partnerName: 'Đối Tác / Nơi Nhận',
    partnerAddress: 'Địa Chỉ Đối Tác',
    relatedEntry: 'Chứng Từ Liên Quan',
    fromWarehouse: 'Xuất Từ Kho',
    toWarehouse: 'Nhập Về Kho',
    expectedDate: 'Ngày Dự Kiến',
    remarks: 'Ghi chú',
    createdBy: 'Người Tạo',
    optional: 'Không bắt buộc',
    requiredError: 'Vui lòng nhập thông tin này',
    typeLabels: {
      SO: 'Đơn Bán Hàng',
      Transfer: 'Điều Chuyển',
      ReturnToSupplier: 'Trả Nhà Cung Cấp',
      Adjustment: 'Điều Chỉnh',
      Manual: 'Thủ Công'
    } as Record<IssueType, string>,
    statusLabels: {
      Draft: 'Nháp',
      Picking: 'Đang Soạn',
      AdjustmentRequested: 'Yêu Cầu Điều Chỉnh',
      Submitted: 'Đã Gửi',
      Approved: 'Đã Duyệt',
      Completed: 'Hoàn Tất',
      Cancelled: 'Đã Hủy'
    } as Record<IssueStatus, string>
  }
}

export function GoodsIssueCreatePlaceholder() {
  const { language } = useLanguage()
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const selectedLanguage: keyof typeof translations = language in translations ? (language as keyof typeof translations) : 'en'
  const t = translations[selectedLanguage]

  const handleBack = () => {
    window.location.hash = '#warehouse/goods-issue'
  }

  const handleChange = <Field extends keyof FormState>(field: Field, value: FormState[Field]) => {
    setFormState(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _removed, ...rest } = prev
        return rest
      })
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formState.issueNo.trim()) {
      newErrors.issueNo = t.requiredError
    }
    if (!formState.fromWarehouse.trim()) {
      newErrors.fromWarehouse = t.requiredError
    }
    if (!formState.expectedDate) {
      newErrors.expectedDate = t.requiredError
    }
    if (!formState.createdBy.trim()) {
      newErrors.createdBy = t.requiredError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setSaving(true)

    try {
      const goodsIssue: GoodsIssue = {
        issue_no: formState.issueNo.trim(),
        issue_type: formState.issueType,
        status: formState.status,
        partner_name: formState.partnerName.trim() || undefined,
        related_entry: formState.relatedEntry.trim() || undefined,
        partner_address: formState.partnerAddress.trim() || undefined,
        remarks: formState.remarks.trim() || undefined,
        from_wh_name: formState.fromWarehouse.trim(),
        to_wh_name: formState.toWarehouse.trim() || undefined,
        expected_date: formState.expectedDate,
        created_at: new Date().toISOString(),
        created_by: formState.createdBy.trim(),
        lines: []
      }

      window.dispatchEvent(new CustomEvent<GoodsIssue>('goods-issue-created', { detail: goodsIssue }))
      setFormState(initialFormState)
      handleBack()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Button variant="ghost" className="w-fit" onClick={handleBack} type="button">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t.back}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="issueNo">
                  {t.issueNo} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="issueNo"
                  value={formState.issueNo}
                  onChange={event => handleChange('issueNo', event.target.value)}
                  placeholder="GI-2024-010"
                />
                {errors.issueNo && <p className="text-sm text-destructive">{errors.issueNo}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="issueType">
                  {t.issueType}
                </label>
                <Select value={formState.issueType} onValueChange={value => handleChange('issueType', value as IssueType)}>
                  <SelectTrigger id="issueType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {issueTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {t.typeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="status">
                  {t.status}
                </label>
                <Select value={formState.status} onValueChange={value => handleChange('status', value as IssueStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {issueStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {t.statusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="fromWarehouse">
                  {t.fromWarehouse} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="fromWarehouse"
                  value={formState.fromWarehouse}
                  onChange={event => handleChange('fromWarehouse', event.target.value)}
                  placeholder="Central Warehouse"
                />
                {errors.fromWarehouse && <p className="text-sm text-destructive">{errors.fromWarehouse}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="toWarehouse">
                  {t.toWarehouse} <span className="text-xs text-muted-foreground">({t.optional})</span>
                </label>
                <Input
                  id="toWarehouse"
                  value={formState.toWarehouse}
                  onChange={event => handleChange('toWarehouse', event.target.value)}
                  placeholder="Retail Store District 1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="expectedDate">
                  {t.expectedDate} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="expectedDate"
                  type="date"
                  value={formState.expectedDate}
                  onChange={event => handleChange('expectedDate', event.target.value)}
                />
                {errors.expectedDate && <p className="text-sm text-destructive">{errors.expectedDate}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="createdBy">
                  {t.createdBy} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="createdBy"
                  value={formState.createdBy}
                  onChange={event => handleChange('createdBy', event.target.value)}
                  placeholder="Nguyen Van A"
                />
                {errors.createdBy && <p className="text-sm text-destructive">{errors.createdBy}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="partnerName">
                  {t.partnerName} <span className="text-xs text-muted-foreground">({t.optional})</span>
                </label>
                <Input
                  id="partnerName"
                  value={formState.partnerName}
                  onChange={event => handleChange('partnerName', event.target.value)}
                  placeholder="Acme Retailers"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="partnerAddress">
                  {t.partnerAddress} <span className="text-xs text-muted-foreground">({t.optional})</span>
                </label>
                <Input
                  id="partnerAddress"
                  value={formState.partnerAddress}
                  onChange={event => handleChange('partnerAddress', event.target.value)}
                  placeholder="123 Nguyen Trai, District 1, HCMC"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="relatedEntry">
                  {t.relatedEntry} <span className="text-xs text-muted-foreground">({t.optional})</span>
                </label>
                <Input
                  id="relatedEntry"
                  value={formState.relatedEntry}
                  onChange={event => handleChange('relatedEntry', event.target.value)}
                  placeholder="SO-2024-1005"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium" htmlFor="remarks">
                  {t.remarks} <span className="text-xs text-muted-foreground">({t.optional})</span>
                </label>
                <Textarea
                  id="remarks"
                  value={formState.remarks}
                  onChange={event => handleChange('remarks', event.target.value)}
                  placeholder="Any special handling instructions"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button type="button" variant="outline" onClick={handleBack} disabled={saving}>
                {t.cancel}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

