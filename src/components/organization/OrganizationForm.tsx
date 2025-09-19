import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Organization, OrganizationFormData } from '../../types/organization'
import { useLanguage } from '../../contexts/LanguageContext'
import { Loader2 } from 'lucide-react'

interface OrganizationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organization?: Organization
  onSubmit: (data: OrganizationFormData) => Promise<void>
  mode: 'create' | 'edit'
}

const translations = {
  en: {
    createTitle: 'Create New Organization',
    editTitle: 'Edit Organization',
    createDescription: 'Add a new organization to the system.',
    editDescription: 'Update organization information.',
    organizationCode: 'Organization Code',
    organizationCodePlaceholder: 'e.g., HQ_001',
    organizationCodeHelper: 'Format: XX_999 (2 letters, underscore, 3 digits)',
    organizationName: 'Organization Name',
    organizationNamePlaceholder: 'Enter organization name',
    address: 'Address',
    addressPlaceholder: 'Enter organization address',
    contact: 'Contact',
    contactPlaceholder: 'Enter contact information',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    cancel: 'Cancel',
    create: 'Create Organization',
    update: 'Update Organization',
    creating: 'Creating...',
    updating: 'Updating...',
    required: 'This field is required',
    invalidCodeFormat: 'Code must follow format XX_999 (e.g., HQ_001)',
    duplicateCode: 'This organization code already exists'
  },
  vi: {
    createTitle: 'Tạo Tổ Chức Mới',
    editTitle: 'Chỉnh Sửa Tổ Chức',
    createDescription: 'Thêm tổ chức mới vào hệ thống.',
    editDescription: 'Cập nhật thông tin tổ chức.',
    organizationCode: 'Mã Tổ Chức',
    organizationCodePlaceholder: 'vd: HQ_001',
    organizationCodeHelper: 'Định dạng: XX_999 (2 chữ cái, gạch dưới, 3 chữ số)',
    organizationName: 'Tên Tổ Chức',
    organizationNamePlaceholder: 'Nhập tên tổ chức',
    address: 'Địa Chỉ',
    addressPlaceholder: 'Nhập địa chỉ tổ chức',
    contact: 'Liên Hệ',
    contactPlaceholder: 'Nhập thông tin liên hệ',
    status: 'Trạng Thái',
    active: 'Hoạt Động',
    inactive: 'Không Hoạt Động',
    cancel: 'Hủy',
    create: 'Tạo Tổ Chức',
    update: 'Cập Nhật Tổ Chức',
    creating: 'Đang tạo...',
    updating: 'Đang cập nhật...',
    required: 'Trường này là bắt buộc',
    invalidCodeFormat: 'Mã phải theo định dạng XX_999 (vd: HQ_001)',
    duplicateCode: 'Mã tổ chức này đã tồn tại'
  }
}

export function OrganizationForm({ open, onOpenChange, organization, onSubmit, mode }: OrganizationFormProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [formData, setFormData] = useState<OrganizationFormData>({
    organization_code: '',
    organization_name: '',
    address: '',
    contact: '',
    status: 'Active'
  })
  
  const [errors, setErrors] = useState<Partial<Record<keyof OrganizationFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (organization && mode === 'edit') {
      setFormData({
        organization_code: organization.organization_code,
        organization_name: organization.organization_name,
        address: organization.address || '',
        contact: organization.contact || '',
        status: organization.status
      })
    } else {
      setFormData({
        organization_code: '',
        organization_name: '',
        address: '',
        contact: '',
        status: 'Active'
      })
    }
    setErrors({})
  }, [organization, mode, open])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrganizationFormData, string>> = {}

    // Organization Code validation
    if (!formData.organization_code.trim()) {
      newErrors.organization_code = t.required
    } else {
      const codePattern = /^[A-Z]{2}_\d{3}$/
      if (!codePattern.test(formData.organization_code)) {
        newErrors.organization_code = t.invalidCodeFormat
      }
    }

    // Organization Name validation
    if (!formData.organization_name.trim()) {
      newErrors.organization_name = t.required
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
        setErrors({ organization_code: t.duplicateCode })
      } else {
        console.error('Form submission error:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof OrganizationFormData, value: string) => {
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
            <Label htmlFor="organization_code">{t.organizationCode} *</Label>
            <Input
              id="organization_code"
              placeholder={t.organizationCodePlaceholder}
              value={formData.organization_code}
              onChange={(e) => handleInputChange('organization_code', e.target.value.toUpperCase())}
              disabled={mode === 'edit' || isSubmitting}
              className={errors.organization_code ? 'border-destructive' : ''}
            />
            {mode === 'create' && (
              <p className="text-sm text-muted-foreground">{t.organizationCodeHelper}</p>
            )}
            {errors.organization_code && (
              <p className="text-sm text-destructive">{errors.organization_code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_name">{t.organizationName} *</Label>
            <Input
              id="organization_name"
              placeholder={t.organizationNamePlaceholder}
              value={formData.organization_name}
              onChange={(e) => handleInputChange('organization_name', e.target.value)}
              disabled={isSubmitting}
              className={errors.organization_name ? 'border-destructive' : ''}
            />
            {errors.organization_name && (
              <p className="text-sm text-destructive">{errors.organization_name}</p>
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