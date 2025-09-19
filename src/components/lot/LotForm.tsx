import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '../ui/utils'
import { Lot, LotFormData } from '../../types/lot'
import { mockModelAssets } from '../../data/mockModelAssetData'
import { mockWarehouses } from '../../data/mockWarehouseData'
import { mockLocations } from '../../data/mockLocationData'
import { mockLots } from '../../data/mockLotData'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'sonner'

interface LotFormProps {
  lot?: Lot
  isEdit?: boolean
  onSave: (lot: LotFormData) => void
  onCancel: () => void
  showCard?: boolean
}

export function LotForm({ lot, isEdit = false, onSave, onCancel, showCard = true }: LotFormProps) {
  const { language } = useLanguage()
  const [formData, setFormData] = useState<LotFormData>({
    lot_code: '',
    model_code: '',
    wh_code: '',
    loc_code: '',
    received_date: '',
    mfg_date: '',
    exp_date: '',
    status: 'Active'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [filteredLocations, setFilteredLocations] = useState(mockLocations)

  const translations = {
    en: {
      title: isEdit ? 'Edit Lot/Batch' : 'Create New Lot/Batch',
      lotCode: 'Lot Code',
      modelAsset: 'Model Asset',
      warehouse: 'Warehouse',
      location: 'Location',
      receivedDate: 'Received Date',
      manufacturingDate: 'Manufacturing Date (NSX)',
      expirationDate: 'Expiration Date (ED)',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      save: 'Save',
      cancel: 'Cancel',
      selectModel: 'Select Model Asset',
      selectWarehouse: 'Select Warehouse',
      selectLocation: 'Select Location',
      selectDate: 'Select date',
      required: 'This field is required',
      lotCodeExists: 'Lot code already exists for this model asset',
      cannotDeactivate: 'Cannot deactivate lot with stock on hand',
      lotCodeReadonly: 'Lot code cannot be modified',
      modelAssetReadonly: 'Model asset cannot be modified',
      receivedDateReadonly: 'Received date cannot be modified'
    },
    vi: {
      title: isEdit ? 'Sửa Lot/Lô hàng' : 'Tạo Lot/Lô hàng mới',
      lotCode: 'Mã Lot',
      modelAsset: 'Model Tài sản',
      warehouse: 'Kho',
      location: 'Vị trí',
      receivedDate: 'Ngày nhận',
      manufacturingDate: 'Ngày sản xuất (NSX)',
      expirationDate: 'Ngày hết hạn (ED)',
      status: 'Trạng thái',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      save: 'Lưu',
      cancel: 'Hủy',
      selectModel: 'Chọn Model Tài sản',
      selectWarehouse: 'Chọn Kho',
      selectLocation: 'Chọn Vị trí',
      selectDate: 'Chọn ngày',
      required: 'Trường này là bắt buộc',
      lotCodeExists: 'Mã lot đã tồn tại cho model tài sản này',
      cannotDeactivate: 'Không thể vô hiệu hóa lot có tồn kho',
      lotCodeReadonly: 'Mã lot không thể sửa đổi',
      modelAssetReadonly: 'Model tài sản không thể sửa đổi',
      receivedDateReadonly: 'Ngày nhận không thể sửa đổi'
    }
  }

  const t = translations[language]

  // Only show model assets with tracking_type = "Lot" and Active status
  const availableModelAssets = mockModelAssets.filter(
    model => model.tracking_type === 'Lot' && model.status === 'Active'
  )

  // Only show active warehouses
  const availableWarehouses = mockWarehouses.filter(wh => wh.isActive === true)

  useEffect(() => {
    if (lot) {
      setFormData({
        lot_code: lot.lot_code,
        model_code: lot.model_code,
        wh_code: lot.wh_code,
        loc_code: lot.loc_code,
        received_date: lot.received_date,
        mfg_date: lot.mfg_date || '',
        exp_date: lot.exp_date || '',
        status: lot.status
      })
    }
  }, [lot])

  useEffect(() => {
    // Filter locations by selected warehouse
    if (formData.wh_code) {
      const filtered = mockLocations.filter(loc => 
        loc.wh_code === formData.wh_code && loc.status === 'Active'
      )
      setFilteredLocations(filtered)
      
      // Reset location if it's not in the filtered list
      if (formData.loc_code && !filtered.some(loc => loc.loc_code === formData.loc_code)) {
        setFormData(prev => ({ ...prev, loc_code: '' }))
      }
    } else {
      setFilteredLocations([])
      setFormData(prev => ({ ...prev, loc_code: '' }))
    }
  }, [formData.wh_code])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.lot_code.trim()) {
      newErrors.lot_code = t.required
    } else if (!isEdit) {
      // Check if lot code already exists for this model asset
      const existingLot = mockLots.find(
        l => l.lot_code === formData.lot_code.trim() && 
             l.model_code === formData.model_code &&
             l.lot_code !== lot?.lot_code
      )
      if (existingLot) {
        newErrors.lot_code = t.lotCodeExists
      }
    }

    if (!formData.model_code) {
      newErrors.model_code = t.required
    }

    if (!formData.wh_code) {
      newErrors.wh_code = t.required
    }

    if (!formData.loc_code) {
      newErrors.loc_code = t.required
    }

    if (!formData.received_date) {
      newErrors.received_date = t.required
    }

    // Check if trying to deactivate lot with stock on hand
    if (isEdit && lot && formData.status === 'Inactive' && lot.qty_onhand > 0) {
      newErrors.status = t.cannotDeactivate
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: keyof LotFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toISOString().split('T')[0]
  }

  const parseDate = (dateStr: string) => {
    if (!dateStr) return undefined
    return new Date(dateStr)
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lot Code */}
              <div className="space-y-2">
                <Label htmlFor="lot_code">{t.lotCode} *</Label>
                <Input
                  id="lot_code"
                  value={formData.lot_code}
                  onChange={(e) => handleInputChange('lot_code', e.target.value)}
                  className={errors.lot_code ? 'border-destructive' : ''}
                  readOnly={isEdit}
                  placeholder={isEdit ? t.lotCodeReadonly : ''}
                />
                {errors.lot_code && (
                  <p className="text-destructive">{errors.lot_code}</p>
                )}
              </div>

              {/* Model Asset */}
              <div className="space-y-2">
                <Label htmlFor="model_code">{t.modelAsset} *</Label>
                <Select 
                  value={formData.model_code} 
                  onValueChange={(value) => handleInputChange('model_code', value)}
                  disabled={isEdit}
                >
                  <SelectTrigger className={errors.model_code ? 'border-destructive' : ''}>
                    <SelectValue placeholder={isEdit ? t.modelAssetReadonly : t.selectModel} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModelAssets.map((model) => (
                      <SelectItem key={`lot-form-model-${model.id}`} value={model.model_code}>
                        {model.model_code} - {model.model_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.model_code && (
                  <p className="text-destructive">{errors.model_code}</p>
                )}
              </div>

              {/* Warehouse */}
              <div className="space-y-2">
                <Label htmlFor="wh_code">{t.warehouse} *</Label>
                <Select 
                  value={formData.wh_code} 
                  onValueChange={(value) => handleInputChange('wh_code', value)}
                >
                  <SelectTrigger className={errors.wh_code ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t.selectWarehouse} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWarehouses.map((warehouse) => (
                      <SelectItem key={`lot-form-warehouse-${warehouse.id}`} value={warehouse.code}>
                        {warehouse.code} - {warehouse.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.wh_code && (
                  <p className="text-destructive">{errors.wh_code}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="loc_code">{t.location} *</Label>
                <Select 
                  value={formData.loc_code} 
                  onValueChange={(value) => handleInputChange('loc_code', value)}
                  disabled={!formData.wh_code}
                >
                  <SelectTrigger className={errors.loc_code ? 'border-destructive' : ''}>
                    <SelectValue placeholder={t.selectLocation} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLocations.map((location) => (
                      <SelectItem key={`lot-form-location-${location.loc_code}`} value={location.loc_code}>
                        {location.loc_code} - {location.loc_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.loc_code && (
                  <p className="text-destructive">{errors.loc_code}</p>
                )}
              </div>

              {/* Received Date */}
              <div className="space-y-2">
                <Label>{t.receivedDate} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !formData.received_date && "text-muted-foreground",
                        errors.received_date && "border-destructive"
                      )}
                      disabled={isEdit}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.received_date ? (
                        format(new Date(formData.received_date), "PPP")
                      ) : (
                        <span>{isEdit ? t.receivedDateReadonly : t.selectDate}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.received_date)}
                      onSelect={(date) => {
                        if (date) {
                          handleInputChange('received_date', format(date, 'yyyy-MM-dd'))
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.received_date && (
                  <p className="text-destructive">{errors.received_date}</p>
                )}
              </div>

              {/* Manufacturing Date */}
              <div className="space-y-2">
                <Label>{t.manufacturingDate}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !formData.mfg_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.mfg_date ? (
                        format(new Date(formData.mfg_date), "PPP")
                      ) : (
                        <span>{t.selectDate}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.mfg_date)}
                      onSelect={(date) => {
                        if (date) {
                          handleInputChange('mfg_date', format(date, 'yyyy-MM-dd'))
                        } else {
                          handleInputChange('mfg_date', '')
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Expiration Date */}
              <div className="space-y-2">
                <Label>{t.expirationDate}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !formData.exp_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.exp_date ? (
                        format(new Date(formData.exp_date), "PPP")
                      ) : (
                        <span>{t.selectDate}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.exp_date)}
                      onSelect={(date) => {
                        if (date) {
                          handleInputChange('exp_date', format(date, 'yyyy-MM-dd'))
                        } else {
                          handleInputChange('exp_date', '')
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">{t.status} *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'Active' | 'Inactive') => handleInputChange('status', value)}
                >
                  <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="lot-form-status-active" value="Active">{t.active}</SelectItem>
                    <SelectItem key="lot-form-status-inactive" value="Inactive">{t.inactive}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-destructive">{errors.status}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit">{t.save}</Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                {t.cancel}
              </Button>
            </div>
          </form>
  )

  if (!showCard) {
    return formContent
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1>{t.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {formContent}
        </CardContent>
      </Card>
    </div>
  )
}