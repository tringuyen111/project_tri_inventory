import { useState } from 'react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { UoM, MeasureType, UoMStatus } from "../../types/uom"
import { measureTypes } from "../../data/mockUomData"
import { AlertCircle, Save, X } from "lucide-react"

interface UoMFormProps {
  uom?: UoM
  onSave: (uom: Omit<UoM, 'id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
  existingCodes: string[]
}

export function UoMForm({ uom, onSave, onCancel, existingCodes }: UoMFormProps) {
  const [formData, setFormData] = useState({
    uom_code: uom?.uom_code || '',
    uom_name: uom?.uom_name || '',
    measure_type: uom?.measure_type || 'Piece' as MeasureType,
    status: uom?.status || 'Active' as UoMStatus
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.uom_code.trim()) {
      newErrors.uom_code = 'UoM Code is required'
    } else if (formData.uom_code.trim().length < 1) {
      newErrors.uom_code = 'UoM Code must be at least 1 character'
    } else if (existingCodes.includes(formData.uom_code.trim()) && formData.uom_code !== uom?.uom_code) {
      newErrors.uom_code = 'UoM Code must be unique'
    }

    if (!formData.uom_name.trim()) {
      newErrors.uom_name = 'UoM Name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave({
        uom_code: formData.uom_code.trim().toUpperCase(),
        uom_name: formData.uom_name.trim(),
        measure_type: formData.measure_type,
        status: formData.status,
        is_base_unit: false
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {uom ? 'Edit Unit of Measure' : 'Create New Unit of Measure'}
        </DialogTitle>
        <DialogDescription>
          {uom ? 'Update the unit of measure details' : 'Add a new unit of measure to the system'}
        </DialogDescription>
      </DialogHeader>
      <Card className="w-full max-w-2xl border-0 shadow-none">
        <CardHeader className="px-0 pt-4">
          <CardTitle className="flex items-center gap-2">
            {uom ? 'Edit Unit of Measure' : 'Create New Unit of Measure'}
          </CardTitle>
          <CardDescription>
            {uom ? 'Update the unit of measure details' : 'Add a new unit of measure to the system'}
          </CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* UoM Code */}
          <div className="space-y-2">
            <Label htmlFor="uom_code">UoM Code *</Label>
            <Input
              id="uom_code"
              value={formData.uom_code}
              onChange={(e) => handleInputChange('uom_code', e.target.value)}
              placeholder="e.g., PCS, KG, L"
              className={errors.uom_code ? 'border-destructive' : ''}
              maxLength={20}
            />
            {errors.uom_code && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.uom_code}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* UoM Name */}
          <div className="space-y-2">
            <Label htmlFor="uom_name">UoM Name *</Label>
            <Input
              id="uom_name"
              value={formData.uom_name}
              onChange={(e) => handleInputChange('uom_name', e.target.value)}
              placeholder="e.g., Pieces, Kilogram, Liter"
              className={errors.uom_name ? 'border-destructive' : ''}
              maxLength={100}
            />
            {errors.uom_name && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.uom_name}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Measurement Group */}
          <div className="space-y-2">
            <Label htmlFor="measure_type">Measurement Group *</Label>
            <Select 
              value={formData.measure_type} 
              onValueChange={(value: MeasureType) => handleInputChange('measure_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select measurement type" />
              </SelectTrigger>
              <SelectContent>
                {measureTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: UoMStatus) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {uom ? 'Update' : 'Create'} UoM
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </>
  )
}