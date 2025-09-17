import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { ModelAsset, ModelAssetFormData, TRACKING_TYPES } from '../../types/modelAsset'
import { getActiveAssetTypes } from '../../data/mockAssetTypeData'
import { getActiveUoMs } from '../../data/mockUomData'
import { toast } from 'sonner'

interface ModelAssetFormProps {
  modelAsset?: ModelAsset
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ModelAssetFormData) => void
  existingCodes?: string[]
}

export function ModelAssetForm({ 
  modelAsset, 
  open, 
  onOpenChange, 
  onSubmit,
  existingCodes = []
}: ModelAssetFormProps) {
  const { language } = useLanguage()
  const isEditing = !!modelAsset

  const [formData, setFormData] = useState<ModelAssetFormData>({
    model_code: '',
    model_name: '',
    asset_type_code: '',
    tracking_type: 'None',
    uom_code: '',
    description: '',
    status: 'Active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get active asset types and UoMs for dropdowns
  const activeAssetTypes = getActiveAssetTypes()
  const activeUoMs = getActiveUoMs()

  const translations = {
    en: {
      title: isEditing ? 'Edit Model Asset' : 'Create Model Asset',
      modelCode: 'Model Code',
      modelCodePlaceholder: 'Enter model code (e.g., MD_001)',
      modelName: 'Model Name',
      modelNamePlaceholder: 'Enter model name',
      assetType: 'Asset Type',
      assetTypePlaceholder: 'Select asset type',
      trackingType: 'Tracking Type',
      trackingTypePlaceholder: 'Select tracking type',
      unitOfMeasure: 'Unit of Measure',
      unitOfMeasurePlaceholder: 'Select unit of measure',
      description: 'Description',
      descriptionPlaceholder: 'Enter description (optional)',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      serial: 'Serial',
      lot: 'Lot',
      none: 'None',
      cancel: 'Cancel',
      save: 'Save',
      required: 'This field is required',
      duplicateCode: 'Model code already exists',
      success: isEditing ? 'Model asset updated successfully' : 'Model asset created successfully'
    },
    vn: {
      title: isEditing ? 'Sửa Model Asset' : 'Tạo Model Asset',
      modelCode: 'Mã Model Asset',
      modelCodePlaceholder: 'Nhập mã model asset (ví dụ: MD_001)',
      modelName: 'Tên Model Asset',
      modelNamePlaceholder: 'Nhập tên model asset',
      assetType: 'Loại Asset',
      assetTypePlaceholder: 'Chọn loại asset',
      trackingType: 'Phương thức quản lý',
      trackingTypePlaceholder: 'Chọn phương thức quản lý',
      unitOfMeasure: 'Đơn vị tính',
      unitOfMeasurePlaceholder: 'Chọn đơn vị tính',
      description: 'Mô tả',
      descriptionPlaceholder: 'Nhập mô tả (tùy chọn)',
      status: 'Trạng thái',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      serial: 'Serial',
      lot: 'Lot',
      none: 'Không',
      cancel: 'Hủy',
      save: 'Lưu',
      required: 'Trường này là bắt buộc',
      duplicateCode: 'Mã model asset đã tồn tại',
      success: isEditing ? 'Cập nhật model asset thành công' : 'Tạo model asset thành công'
    }
  }

  const t = translations[language]

  useEffect(() => {
    if (modelAsset) {
      setFormData({
        model_code: modelAsset.model_code,
        model_name: modelAsset.model_name,
        asset_type_code: modelAsset.asset_type_code,
        tracking_type: modelAsset.tracking_type,
        uom_code: modelAsset.uom_code,
        description: modelAsset.description || '',
        status: modelAsset.status
      })
    } else {
      setFormData({
        model_code: '',
        model_name: '',
        asset_type_code: '',
        tracking_type: 'None',
        uom_code: '',
        description: '',
        status: 'Active'
      })
    }
    setErrors({})
  }, [modelAsset, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.model_code.trim()) {
      newErrors.model_code = t.required
    }
    if (!formData.model_name.trim()) {
      newErrors.model_name = t.required
    }
    if (!formData.asset_type_code) {
      newErrors.asset_type_code = t.required
    }
    if (!formData.tracking_type) {
      newErrors.tracking_type = t.required
    }
    if (!formData.uom_code) {
      newErrors.uom_code = t.required
    }

    // Unique validations
    if (!isEditing && existingCodes.includes(formData.model_code.trim())) {
      newErrors.model_code = t.duplicateCode
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit(formData)
    toast.success(t.success)
    onOpenChange(false)
  }

  const handleChange = (field: keyof ModelAssetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? language === 'vi' ? 'Cập nhật thông tin model asset.' : 'Update model asset information.'
              : language === 'vi' ? 'Tạo model asset mới cho hệ thống.' : 'Create a new model asset for the system.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model_code">{t.modelCode} *</Label>
              <Input
                id="model_code"
                value={formData.model_code}
                onChange={(e) => handleChange('model_code', e.target.value)}
                placeholder={t.modelCodePlaceholder}
                readOnly={isEditing}
                className={isEditing ? 'bg-muted' : ''}
              />
              {errors.model_code && (
                <p className="text-sm text-destructive">{errors.model_code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model_name">{t.modelName} *</Label>
              <Input
                id="model_name"
                value={formData.model_name}
                onChange={(e) => handleChange('model_name', e.target.value)}
                placeholder={t.modelNamePlaceholder}
              />
              {errors.model_name && (
                <p className="text-sm text-destructive">{errors.model_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.assetType} *</Label>
              <Select
                value={formData.asset_type_code}
                onValueChange={(value) => handleChange('asset_type_code', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.assetTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {activeAssetTypes.map((assetType) => (
                    <SelectItem key={`form-assettype-${assetType.asset_type_code}`} value={assetType.asset_type_code}>
                      {assetType.asset_type_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.asset_type_code && (
                <p className="text-sm text-destructive">{errors.asset_type_code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t.trackingType} *</Label>
              <Select
                value={formData.tracking_type}
                onValueChange={(value) => handleChange('tracking_type', value as any)}
                disabled={isEditing}
              >
                <SelectTrigger className={isEditing ? 'bg-muted' : ''}>
                  <SelectValue placeholder={t.trackingTypePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {TRACKING_TYPES.map((type) => (
                    <SelectItem key={`form-tracking-${type}`} value={type}>
                      {type === 'Serial' ? t.serial : 
                       type === 'Lot' ? t.lot : t.none}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tracking_type && (
                <p className="text-sm text-destructive">{errors.tracking_type}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.unitOfMeasure} *</Label>
            <Select
              value={formData.uom_code}
              onValueChange={(value) => handleChange('uom_code', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.unitOfMeasurePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {activeUoMs.map((uom) => (
                  <SelectItem key={`form-uom-${uom.uom_code}`} value={uom.uom_code}>
                    {uom.uom_name} ({uom.uom_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.uom_code && (
              <p className="text-sm text-destructive">{errors.uom_code}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.status}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value as 'Active' | 'Inactive')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="form-status-active" value="Active">{t.active}</SelectItem>
                <SelectItem key="form-status-inactive" value="Inactive">{t.inactive}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              {t.cancel}
            </Button>
            <Button type="submit">
              {t.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}