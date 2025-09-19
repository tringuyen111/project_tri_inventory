import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { AssetFormData, ASSET_STATUSES } from '../../types/asset'
import { getActiveWarehouses } from '../../data/mockWarehouseData'
import { getLocationsByWarehouse } from '../../data/mockLocationData'
import { getActivePartners } from '../../data/mockPartnerData'
import { getActiveModelAssetsByTracking } from '../../data/mockModelAssetData'
import { toast } from 'sonner'

interface AssetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AssetFormData) => void
  existingSerialNumbers?: string[]
}

export function AssetForm({ 
  open, 
  onOpenChange, 
  onSubmit,
  existingSerialNumbers = []
}: AssetFormProps) {
  const { language } = useLanguage()

  const [formData, setFormData] = useState<AssetFormData>({
    model_code: '',
    serial_numbers: '',
    wh_code: '',
    location_code: '',
    partner_code: '',
    status: 'InStock'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get data for dropdowns
  const activeWarehouses = getActiveWarehouses()
  const activePartners = getActivePartners()
  const serialModelAssets = getActiveModelAssetsByTracking('Serial')
  const availableLocations = formData.wh_code ? getLocationsByWarehouse(formData.wh_code) : []

  const translations = {
    en: {
      title: 'Create Asset',
      description: 'Create new assets with unique serial numbers',
      modelAsset: 'Model Asset',
      modelAssetPlaceholder: 'Select model asset',
      serialNumbers: 'Serial Numbers',
      serialNumbersPlaceholder: 'Enter serial numbers (one per line)',
      serialNumbersHelp: 'Enter each serial number on a new line for batch creation',
      warehouse: 'Warehouse',
      warehousePlaceholder: 'Select warehouse',
      location: 'Location',
      locationPlaceholder: 'Select location',
      partner: 'Partner',
      partnerPlaceholder: 'Select partner (optional)',
      status: 'Status',
      inStock: 'In Stock',
      issued: 'Issued',
      disposed: 'Disposed',
      lost: 'Lost',
      cancel: 'Cancel',
      save: 'Create Assets',
      required: 'This field is required',
      duplicateSerial: 'Serial number already exists: {serial}',
      invalidSerial: 'Invalid serial number: {serial}',
      success: 'Assets created successfully',
      locationRequired: 'Location is required when status is In Stock'
    },
    vi: {
      title: 'Tạo Asset',
      description: 'Tạo assets mới với số serial duy nhất',
      modelAsset: 'Model Asset',
      modelAssetPlaceholder: 'Chọn model asset',
      serialNumbers: 'Số Serial',
      serialNumbersPlaceholder: 'Nhập số serial (mỗi dòng một số)',
      serialNumbersHelp: 'Nhập mỗi số serial trên một dòng mới để tạo hàng loạt',
      warehouse: 'Kho',
      warehousePlaceholder: 'Chọn kho',
      location: 'Vị trí',
      locationPlaceholder: 'Chọn vị trí',
      partner: 'Đối tác',
      partnerPlaceholder: 'Chọn đối tác (tùy chọn)',
      status: 'Trạng thái',
      inStock: 'Trong kho',
      issued: 'Đã xuất',
      disposed: 'Đã thanh lý',
      lost: 'Đã mất',
      cancel: 'Hủy',
      save: 'Tạo Assets',
      required: 'Trường này là bắt buộc',
      duplicateSerial: 'Số serial đã tồn tại: {serial}',
      invalidSerial: 'Số serial không hợp lệ: {serial}',
      success: 'Tạo assets thành công',
      locationRequired: 'Vị trí là bắt buộc khi trạng thái là Trong kho'
    }
  }

  const t = translations[language]

  useEffect(() => {
    if (!open) {
      setFormData({
        model_code: '',
        serial_numbers: '',
        wh_code: '',
        location_code: '',
        partner_code: '',
        status: 'InStock'
      })
      setErrors({})
    }
  }, [open])

  // Reset location when warehouse changes
  useEffect(() => {
    if (formData.wh_code) {
      setFormData(prev => ({ ...prev, location_code: '' }))
    }
  }, [formData.wh_code])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.model_code.trim()) {
      newErrors.model_code = t.required
    }
    if (!formData.serial_numbers.trim()) {
      newErrors.serial_numbers = t.required
    }
    if (!formData.wh_code) {
      newErrors.wh_code = t.required
    }
    if (formData.status === 'InStock' && !formData.location_code) {
      newErrors.location_code = t.locationRequired
    }

    // Validate serial numbers
    if (formData.serial_numbers.trim()) {
      const serialNumbers = formData.serial_numbers.split('\n').filter(sn => sn.trim())
      
      for (const serial of serialNumbers) {
        const trimmedSerial = serial.trim()
        
        // Check if empty
        if (!trimmedSerial) {
          newErrors.serial_numbers = t.invalidSerial.replace('{serial}', serial)
          break
        }
        
        // Check if duplicate
        if (existingSerialNumbers.includes(trimmedSerial)) {
          newErrors.serial_numbers = t.duplicateSerial.replace('{serial}', trimmedSerial)
          break
        }
      }
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

  const handleChange = (field: keyof AssetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="model_code">{t.modelAsset} *</Label>
              <Select
                value={formData.model_code}
                onValueChange={(value) => handleChange('model_code', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.modelAssetPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {serialModelAssets.map((model) => (
                    <SelectItem key={model.id} value={model.model_code}>
                      {model.model_name} ({model.model_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.model_code && (
                <p className="text-sm text-destructive">{errors.model_code}</p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="serial_numbers">{t.serialNumbers} *</Label>
              <Textarea
                id="serial_numbers"
                value={formData.serial_numbers}
                onChange={(e) => handleChange('serial_numbers', e.target.value)}
                placeholder={t.serialNumbersPlaceholder}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">{t.serialNumbersHelp}</p>
              {errors.serial_numbers && (
                <p className="text-sm text-destructive">{errors.serial_numbers}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t.warehouse} *</Label>
              <Select
                value={formData.wh_code}
                onValueChange={(value) => handleChange('wh_code', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.warehousePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {activeWarehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.code}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.wh_code && (
                <p className="text-sm text-destructive">{errors.wh_code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t.location} {formData.status === 'InStock' ? '*' : ''}</Label>
              <Select
                value={formData.location_code}
                onValueChange={(value) => handleChange('location_code', value)}
                disabled={!formData.wh_code}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.locationPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {availableLocations.map((location) => (
                    <SelectItem key={location.loc_code} value={location.loc_code}>
                      {location.loc_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location_code && (
                <p className="text-sm text-destructive">{errors.location_code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t.partner}</Label>
              <Select
                value={formData.partner_code || '__none__'}
                onValueChange={(value) => handleChange('partner_code', value === '__none__' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.partnerPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="__none__" value="__none__">{language === 'vi' ? 'Không chọn' : 'None'}</SelectItem>
                  {activePartners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.partner_code}>
                      {partner.partner_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.status}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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