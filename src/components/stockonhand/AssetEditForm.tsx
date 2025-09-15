import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { Asset, AssetUpdateData, ASSET_STATUSES } from '../../types/asset'
import { getActiveWarehouses } from '../../data/mockWarehouseData'
import { getLocationsByWarehouse } from '../../data/mockLocationData'
import { getActivePartners } from '../../data/mockPartnerData'
import { toast } from 'sonner'

interface AssetEditFormProps {
  asset?: Asset
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: AssetUpdateData) => void
}

export function AssetEditForm({ 
  asset, 
  open, 
  onOpenChange, 
  onSubmit
}: AssetEditFormProps) {
  const { language } = useLanguage()

  const [formData, setFormData] = useState<AssetUpdateData>({
    wh_code: '',
    location_code: '',
    partner_code: '',
    status: 'InStock'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get data for dropdowns
  const activeWarehouses = getActiveWarehouses()
  const activePartners = getActivePartners()
  const availableLocations = formData.wh_code ? getLocationsByWarehouse(formData.wh_code) : []

  const translations = {
    en: {
      title: 'Edit Asset',
      description: 'Update asset location, warehouse, partner and status',
      assetId: 'Asset ID',
      serialNumber: 'Serial Number',
      modelAsset: 'Model Asset',
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
      save: 'Update Asset',
      required: 'This field is required',
      success: 'Asset updated successfully',
      locationRequired: 'Location is required when status is In Stock',
      readOnly: 'This field cannot be modified'
    },
    vn: {
      title: 'Sửa Asset',
      description: 'Cập nhật vị trí, kho, đối tác và trạng thái asset',
      assetId: 'Mã Asset',
      serialNumber: 'Số Serial',
      modelAsset: 'Model Asset',
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
      save: 'Cập nhật Asset',
      required: 'Trường này là bắt buộc',
      success: 'Cập nhật asset thành công',
      locationRequired: 'Vị trí là bắt buộc khi trạng thái là Trong kho',
      readOnly: 'Trường này không thể sửa đổi'
    }
  }

  const t = translations[language]

  useEffect(() => {
    if (asset && open) {
      setFormData({
        wh_code: asset.wh_code,
        location_code: asset.location_code,
        partner_code: asset.partner_code || '',
        status: asset.status
      })
      setErrors({})
    }
  }, [asset, open])

  // Reset location when warehouse changes
  useEffect(() => {
    if (formData.wh_code && asset && formData.wh_code !== asset.wh_code) {
      setFormData(prev => ({ ...prev, location_code: '' }))
    }
  }, [formData.wh_code, asset])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.wh_code) {
      newErrors.wh_code = t.required
    }
    if (formData.status === 'InStock' && !formData.location_code) {
      newErrors.location_code = t.locationRequired
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

  const handleChange = (field: keyof AssetUpdateData, value: string) => {
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

  if (!asset) return null

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
          {/* Read-only fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.assetId}</Label>
              <Input
                value={asset.asset_id}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">{t.readOnly}</p>
            </div>

            <div className="space-y-2">
              <Label>{t.serialNumber}</Label>
              <Input
                value={asset.serial_number}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">{t.readOnly}</p>
            </div>

            <div className="space-y-2 col-span-2">
              <Label>{t.modelAsset}</Label>
              <Input
                value={`${asset.model_name} (${asset.model_code})`}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">{t.readOnly}</p>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-2 gap-4">
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