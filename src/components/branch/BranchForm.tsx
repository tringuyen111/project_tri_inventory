import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Branch, BranchFormData } from '../../types/branch'
import { Organization } from '../../types/organization'
import { useLanguage } from '../../contexts/LanguageContext'
import { Loader2 } from 'lucide-react'

interface BranchFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch?: Branch
  organizations: Organization[]
  onSubmit: (data: BranchFormData) => Promise<void>
  mode: 'create' | 'edit'
}

const translations = {
  en: {
    createTitle: 'Create New Branch',
    editTitle: 'Edit Branch',
    createDescription: 'Add a new branch to the selected organization.',
    editDescription: 'Update branch information.',
    branchCode: 'Branch Code',
    branchCodePlaceholder: 'e.g., BR_001',
    branchCodeHelper: 'Format: BR_999 (BR, underscore, 3 digits)',
    branchName: 'Branch Name',
    branchNamePlaceholder: 'Enter branch name',
    organization: 'Organization',
    organizationPlaceholder: 'Select organization',
    address: 'Address',
    addressPlaceholder: 'Enter branch address',
    contact: 'Contact',
    contactPlaceholder: 'Enter contact information',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    cancel: 'Cancel',
    create: 'Create Branch',
    update: 'Update Branch',
    creating: 'Creating...',
    updating: 'Updating...',
    required: 'This field is required',
    invalidCodeFormat: 'Code must follow format BR_999 (e.g., BR_001)',
    duplicateCode: 'This branch code already exists in the selected organization',
    noOrganizations: 'No active organizations available'
  },
  vi: {
    createTitle: 'Tạo Chi Nhánh Mới',
    editTitle: 'Chỉnh Sửa Chi Nhánh',
    createDescription: 'Thêm chi nhánh mới vào tổ chức đã chọn.',
    editDescription: 'Cập nhật thông tin chi nhánh.',
    branchCode: 'Mã Chi Nhánh',
    branchCodePlaceholder: 'vd: BR_001',
    branchCodeHelper: 'Định dạng: BR_999 (BR, gạch dưới, 3 chữ số)',
    branchName: 'Tên Chi Nhánh',
    branchNamePlaceholder: 'Nhập tên chi nhánh',
    organization: 'Tổ Chức',
    organizationPlaceholder: 'Chọn tổ chức',
    address: 'Địa Chỉ',
    addressPlaceholder: 'Nhập địa chỉ chi nhánh',
    contact: 'Liên Hệ',
    contactPlaceholder: 'Nhập thông tin liên hệ',
    status: 'Trạng Thái',
    active: 'Hoạt Động',
    inactive: 'Không Hoạt Động',
    cancel: 'Hủy',
    create: 'Tạo Chi Nhánh',
    update: 'Cập Nhật Chi Nhánh',
    creating: 'Đang tạo...',
    updating: 'Đang cập nhật...',
    required: 'Trường này là bắt buộc',
    invalidCodeFormat: 'Mã phải theo định dạng BR_999 (vd: BR_001)',
    duplicateCode: 'Mã chi nhánh này đã tồn tại trong tổ chức đã chọn',
    noOrganizations: 'Không có tổ chức hoạt động nào'
  }
}

export function BranchForm({ open, onOpenChange, branch, organizations, onSubmit, mode }: BranchFormProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [formData, setFormData] = useState<BranchFormData>({
    branch_code: '',
    branch_name: '',
    organization_id: '',
    address: '',
    contact: '',
    status: 'Active'
  })
  
  const [errors, setErrors] = useState<Partial<Record<keyof BranchFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (branch && mode === 'edit') {
      setFormData({
        branch_code: branch.branch_code,
        branch_name: branch.branch_name,
        organization_id: branch.organization_id,
        address: branch.address || '',
        contact: branch.contact || '',
        status: branch.status
      })
    } else {
      setFormData({
        branch_code: '',
        branch_name: '',
        organization_id: '',
        address: '',
        contact: '',
        status: 'Active'
      })
    }
    setErrors({})
  }, [branch, mode, open])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BranchFormData, string>> = {}

    // Branch Code validation
    if (!formData.branch_code.trim()) {
      newErrors.branch_code = t.required
    } else {
      const codePattern = /^BR_\d{3}$/
      if (!codePattern.test(formData.branch_code)) {
        newErrors.branch_code = t.invalidCodeFormat
      }
    }

    // Branch Name validation
    if (!formData.branch_name.trim()) {
      newErrors.branch_name = t.required
    }

    // Organization validation
    if (!formData.organization_id) {
      newErrors.organization_id = t.required
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        setErrors({ branch_code: t.duplicateCode })
      } else {
        console.error('Form submission error:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BranchFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t.createTitle : t.editTitle}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? t.createDescription : t.editDescription}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization_id">{t.organization} *</Label>
            <Select
              value={formData.organization_id}
              onValueChange={(value) => handleInputChange('organization_id', value)}
              disabled={mode === 'edit' || isSubmitting}
            >
              <SelectTrigger className={errors.organization_id ? 'border-destructive' : ''}>
                <SelectValue placeholder={t.organizationPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {organizations.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    {t.noOrganizations}
                  </div>
                ) : (
                  organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.organization_code} - {org.organization_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.organization_id && (
              <p className="text-sm text-destructive">{errors.organization_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch_code">{t.branchCode} *</Label>
            <Input
              id="branch_code"
              placeholder={t.branchCodePlaceholder}
              value={formData.branch_code}
              onChange={(e) => handleInputChange('branch_code', e.target.value.toUpperCase())}
              disabled={mode === 'edit' || isSubmitting}
              className={errors.branch_code ? 'border-destructive' : ''}
            />
            {mode === 'create' && (
              <p className="text-sm text-muted-foreground">{t.branchCodeHelper}</p>
            )}
            {errors.branch_code && (
              <p className="text-sm text-destructive">{errors.branch_code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch_name">{t.branchName} *</Label>
            <Input
              id="branch_name"
              placeholder={t.branchNamePlaceholder}
              value={formData.branch_name}
              onChange={(e) => handleInputChange('branch_name', e.target.value)}
              disabled={isSubmitting}
              className={errors.branch_name ? 'border-destructive' : ''}
            />
            {errors.branch_name && (
              <p className="text-sm text-destructive">{errors.branch_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t.address}</Label>
            <Textarea
              id="address"
              placeholder={t.addressPlaceholder}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">{t.contact}</Label>
            <Input
              id="contact"
              placeholder={t.contactPlaceholder}
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.status}</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Active' | 'Inactive') => handleInputChange('status', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">{t.active}</SelectItem>
                <SelectItem value="Inactive">{t.inactive}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? t.creating : t.updating}
                </>
              ) : (
                mode === 'create' ? t.create : t.update
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}