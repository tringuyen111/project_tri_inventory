import { useState } from 'react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { UoM, UoMConversion, MeasureType } from "../../types/uom"
import { AlertCircle, Save, X, ArrowRight } from "lucide-react"

interface ConversionFormProps {
  uoms: UoM[]
  existingConversions: UoMConversion[]
  onSave: (conversion: Omit<UoMConversion, 'id' | 'created_at' | 'updated_at' | 'from_uom' | 'to_uom'>) => void
  onCancel: () => void
}

export function ConversionForm({ uoms, existingConversions, onSave, onCancel }: ConversionFormProps) {
  const [formData, setFormData] = useState({
    from_uom_id: '',
    to_uom_id: '',
    multiplier: '',
    note: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFromUoM, setSelectedFromUoM] = useState<UoM | null>(null)

  // Get available "to" UoMs based on selected "from" UoM
  const getAvailableToUoMs = () => {
    if (!selectedFromUoM) return []
    
    return uoms.filter(uom => 
      uom.measure_type === selectedFromUoM.measure_type && 
      uom.id !== selectedFromUoM.id &&
      uom.status === 'Active'
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.from_uom_id) {
      newErrors.from_uom_id = 'Parent Unit is required'
    }

    if (!formData.to_uom_id) {
      newErrors.to_uom_id = 'Small Unit is required'
    }

    if (!formData.multiplier) {
      newErrors.multiplier = 'Conversion Multiplier is required'
    } else {
      const multiplierNum = parseFloat(formData.multiplier)
      if (isNaN(multiplierNum) || multiplierNum <= 0) {
        newErrors.multiplier = 'Multiplier must be a positive number'
      }
    }

    // Check for duplicate conversion
    if (formData.from_uom_id && formData.to_uom_id) {
      const isDuplicate = existingConversions.some(conv => 
        conv.from_uom_id === formData.from_uom_id && conv.to_uom_id === formData.to_uom_id
      )
      if (isDuplicate) {
        newErrors.general = 'This conversion already exists'
      }
    }

    // Check if UoMs have same measure type
    if (formData.from_uom_id && formData.to_uom_id) {
      const fromUoM = uoms.find(u => u.id === formData.from_uom_id)
      const toUoM = uoms.find(u => u.id === formData.to_uom_id)
      
      if (fromUoM && toUoM && fromUoM.measure_type !== toUoM.measure_type) {
        newErrors.general = 'Conversions can only be created between UoMs of the same measurement type'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave({
        from_uom_id: formData.from_uom_id,
        to_uom_id: formData.to_uom_id,
        multiplier: parseFloat(formData.multiplier),
        note: formData.note.trim() || undefined
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Update selected from UoM when from_uom_id changes
    if (field === 'from_uom_id') {
      const fromUoM = uoms.find(u => u.id === value)
      setSelectedFromUoM(fromUoM || null)
      
      // Clear to_uom_id if measure type changed
      if (formData.to_uom_id) {
        const toUoM = uoms.find(u => u.id === formData.to_uom_id)
        if (toUoM && fromUoM && toUoM.measure_type !== fromUoM.measure_type) {
          setFormData(prev => ({ ...prev, to_uom_id: '' }))
        }
      }
    }
    
    // Clear error when user makes changes
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }))
    }
  }

  const activeUoMs = uoms.filter(uom => uom.status === 'Active')
  const availableToUoMs = getAvailableToUoMs()

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Conversion Rule</DialogTitle>
        <DialogDescription>
          Create a conversion relationship between two units of measure of the same type
        </DialogDescription>
      </DialogHeader>
      <Card className="w-full max-w-2xl border-0 shadow-none">
        <CardHeader className="px-0 pt-4">
          <CardTitle>Add Conversion Rule</CardTitle>
          <CardDescription>
            Create a conversion relationship between two units of measure of the same type
          </CardDescription>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* From UoM */}
          <div className="space-y-2">
            <Label htmlFor="from_uom_id">Parent Unit (From) *</Label>
            <Select 
              value={formData.from_uom_id} 
              onValueChange={(value) => handleInputChange('from_uom_id', value)}
            >
              <SelectTrigger className={errors.from_uom_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select parent unit" />
              </SelectTrigger>
              <SelectContent>
                {activeUoMs.map((uom) => (
                  <SelectItem key={uom.id} value={uom.id}>
                    {uom.uom_code} - {uom.uom_name} ({uom.measure_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.from_uom_id && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.from_uom_id}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Conversion Visual */}
          {selectedFromUoM && (
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{selectedFromUoM.uom_code}</span>
                <ArrowRight className="h-4 w-4" />
                <span>{formData.multiplier || 'X'}</span>
                <ArrowRight className="h-4 w-4" />
                <span>{availableToUoMs.find(u => u.id === formData.to_uom_id)?.uom_code || '?'}</span>
              </div>
            </div>
          )}

          {/* Multiplier */}
          <div className="space-y-2">
            <Label htmlFor="multiplier">Conversion Multiplier *</Label>
            <Input
              id="multiplier"
              type="number"
              step="any"
              value={formData.multiplier}
              onChange={(e) => handleInputChange('multiplier', e.target.value)}
              placeholder="e.g., 12 (1 parent unit = 12 small units)"
              className={errors.multiplier ? 'border-destructive' : ''}
            />
            {errors.multiplier && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.multiplier}</AlertDescription>
              </Alert>
            )}
            <p className="text-xs text-muted-foreground">
              Enter how many small units equal 1 parent unit
            </p>
          </div>

          {/* To UoM */}
          <div className="space-y-2">
            <Label htmlFor="to_uom_id">Small Unit (To) *</Label>
            <Select 
              value={formData.to_uom_id} 
              onValueChange={(value) => handleInputChange('to_uom_id', value)}
              disabled={!selectedFromUoM}
            >
              <SelectTrigger className={errors.to_uom_id ? 'border-destructive' : ''}>
                <SelectValue placeholder={
                  !selectedFromUoM 
                    ? "Select parent unit first" 
                    : availableToUoMs.length === 0 
                      ? "No compatible units available"
                      : "Select small unit"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableToUoMs.map((uom) => (
                  <SelectItem key={uom.id} value={uom.id}>
                    {uom.uom_code} - {uom.uom_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.to_uom_id && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.to_uom_id}</AlertDescription>
              </Alert>
            )}
            {selectedFromUoM && (
              <p className="text-xs text-muted-foreground">
                Only showing {selectedFromUoM.measure_type} units
              </p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              placeholder="Optional note about this conversion"
              rows={2}
              maxLength={500}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Add Conversion
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