import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useLanguage } from '../../contexts/LanguageContext'
import { AssetNoneFormData, ASSET_NONE_STATUSES } from '../../types/assetNone'
import { mockModelAssets } from '../../data/mockModelAssetData'
import { mockWarehouses } from '../../data/mockWarehouseData'
import { mockLocations } from '../../data/mockLocationData'

interface AssetNoneFormProps {
  onSubmit: (data: AssetNoneFormData) => void
  onCancel: () => void
  initialData?: Partial<AssetNoneFormData>
  isSubmitting?: boolean
  showCard?: boolean
}

export function AssetNoneForm({ onSubmit, onCancel, initialData, isSubmitting = false, showCard = true }: AssetNoneFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState<AssetNoneFormData>({
    model_code: initialData?.model_code || '',
    wh_code: initialData?.wh_code || '',
    location_code: initialData?.location_code || '',
    status: initialData?.status || 'Active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [filteredLocations, setFilteredLocations] = useState(mockLocations.filter(loc => loc.status === 'Active'))

  const translations = {
    en: {
      title: 'Asset (None) Form',
      description: 'Create asset inventory record without tracking',
      modelCode: 'Asset Model',
      modelCodePlaceholder: 'Select asset model',
      warehouse: 'Warehouse',
      warehousePlaceholder: 'Select warehouse',
      location: 'Location',
      locationPlaceholder: 'Select location',
      status: 'Status',
      statusPlaceholder: 'Select status',
      submit: 'Create Record',
      cancel: 'Cancel',
      submitting: 'Creating...',
      validation: {
        modelCodeRequired: 'Asset model is required',
        warehouseRequired: 'Warehouse is required',
        locationRequired: 'Location is required',
        statusRequired: 'Status is required'
      },
      note: 'Note: Quantity will be initialized to 0 and managed through inventory movements'
    },
    vi: {
      title: 'Form Asset (None)',
      description: 'Tạo bản ghi tồn kho asset không theo dõi',
      modelCode: 'Model Asset',
      modelCodePlaceholder: 'Chọn model asset',
      warehouse: 'Kho',
      warehousePlaceholder: 'Chọn kho',
      location: 'Vị trí',
      locationPlaceholder: 'Chọn vị trí',
      status: 'Trạng thái',
      statusPlaceholder: 'Chọn trạng thái',
      submit: 'Tạo bản ghi',
      cancel: 'Hủy',
      submitting: 'Đang tạo...',
      validation: {
        modelCodeRequired: 'Model asset là bắt buộc',
        warehouseRequired: 'Kho là bắt buộc',
        locationRequired: 'Vị trí là bắt buộc',
        statusRequired: 'Trạng thái là bắt buộc'
      },
      note: 'Lưu ý: Số lượng sẽ được khởi tạo = 0 và quản lý qua các phiếu xuất nhập kho'
    }
  }

  const t = translations[language]

  // Get active model assets with tracking = 'None'
  const noneModelAssets = mockModelAssets.filter(model => 
    model.status === 'Active' && model.tracking_type === 'None'
  )

  // Get active warehouses
  const activeWarehouses = mockWarehouses.filter(wh => wh.isActive === true)

  // Filter locations based on selected warehouse
  useEffect(() => {
    if (formData.wh_code) {
      const filtered = mockLocations.filter(loc => 
        loc.wh_code === formData.wh_code && loc.status === 'Active'
      )
      setFilteredLocations(filtered)
      
      // Reset location if it's not valid for the selected warehouse
      if (formData.location_code && !filtered.some(loc => loc.loc_code === formData.location_code)) {
        setFormData(prev => ({ ...prev, location_code: '' }))
      }
    } else {
      setFilteredLocations([])
      setFormData(prev => ({ ...prev, location_code: '' }))
    }
  }, [formData.wh_code])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.model_code) {
      newErrors.model_code = t.validation.modelCodeRequired
    }
    if (!formData.wh_code) {
      newErrors.wh_code = t.validation.warehouseRequired
    }
    if (!formData.location_code) {
      newErrors.location_code = t.validation.locationRequired
    }
    if (!formData.status) {
      newErrors.status = t.validation.statusRequired
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof AssetNoneFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Model */}
          <div className="space-y-2">
            <Label htmlFor="model_code">{t.modelCode} *</Label>
            <Select
              value={formData.model_code}
              onValueChange={(value) => handleInputChange('model_code', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.modelCodePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {noneModelAssets.map((model) => (
                  <SelectItem key={`asset-none-model-${model.id}`} value={model.model_code}>
                    {model.model_code} - {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.model_code && (
              <p className="text-sm text-destructive">{errors.model_code}</p>
            )}
          </div>

          {/* Warehouse */}
          <div className="space-y-2">
            <Label htmlFor="wh_code">{t.warehouse} *</Label>
            <Select
              value={formData.wh_code}
              onValueChange={(value) => handleInputChange('wh_code', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.warehousePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {activeWarehouses.map((warehouse) => (
                  <SelectItem key={`asset-none-warehouse-${warehouse.id}`} value={warehouse.code}>
                    {warehouse.code} - {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.wh_code && (
              <p className="text-sm text-destructive">{errors.wh_code}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location_code">{t.location} *</Label>
            <Select
              value={formData.location_code}
              onValueChange={(value) => handleInputChange('location_code', value)}
              disabled={!formData.wh_code}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.locationPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {filteredLocations.map((location) => (
                  <SelectItem key={`asset-none-location-${location.loc_code}`} value={location.loc_code}>
                    {location.loc_code} - {location.loc_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location_code && (
              <p className="text-sm text-destructive">{errors.location_code}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">{t.status} *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value as 'Active' | 'Inactive')}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.statusPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {ASSET_NONE_STATUSES.map((status) => (
                  <SelectItem key={`asset-none-status-${status}`} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status}</p>
            )}
          </div>

          {/* Note */}
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">{t.note}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </div>
        </form>
  )

  if (!showCard) {
    return formContent
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  )
}