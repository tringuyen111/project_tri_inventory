import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Switch } from '../ui/switch'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { X, ChevronDown, Check } from 'lucide-react'
import { cn } from '../ui/utils'
import type { Warehouse, WarehouseFormData } from '../../types/warehouse'
import { useLanguage } from '../../contexts/LanguageContext'

interface WarehouseOrganization {
  id: string
  code: string
  name: string
  nameVi: string
  isActive: boolean
}

interface WarehouseBranch {
  id: string
  code: string
  name: string
  nameVi: string
  organizationId: string
  isActive: boolean
}

interface WarehouseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse?: Warehouse
  onSave: (warehouse: WarehouseFormData) => void
  organizations: WarehouseOrganization[]
  branches: WarehouseBranch[]
}

export function WarehouseForm({ open, onOpenChange, warehouse, onSave, organizations, branches }: WarehouseFormProps) {
  const { t, currentLanguage } = useLanguage()
  
  const [formData, setFormData] = useState<WarehouseFormData>({
    code: '',
    name: '',
    organizationId: '',
    branchId: '',
    address: '',
    isActive: true
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orgPopoverOpen, setOrgPopoverOpen] = useState(false)
  const [branchPopoverOpen, setBranchPopoverOpen] = useState(false)

  // Filter branches based on selected organization
  const availableBranches = formData.organizationId
    ? branches.filter(branch => branch.organizationId === formData.organizationId && branch.isActive)
    : []

  // Reset branch when organization changes
  useEffect(() => {
    if (formData.organizationId && formData.branchId) {
      const selectedBranch = branches.find(b => b.id === formData.branchId)
      if (!selectedBranch || selectedBranch.organizationId !== formData.organizationId) {
        setFormData(prev => ({ ...prev, branchId: '' }))
      }
    }
  }, [formData.organizationId, formData.branchId, branches])

  // Initialize form data when warehouse changes
  useEffect(() => {
    if (warehouse) {
      setFormData({
        code: warehouse.code,
        name: warehouse.name,
        organizationId: warehouse.organizationId,
        branchId: warehouse.branchId,
        address: warehouse.address || '',
        isActive: warehouse.isActive
      })
    } else {
      setFormData({
        code: '',
        name: '',
        organizationId: '',
        branchId: '',
        address: '',
        isActive: true
      })
    }
    setErrors({})
  }, [warehouse, open])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Code validation
    if (!formData.code.trim()) {
      newErrors.code = t('validation.required.code')
    } else if (!/^WH_\d{3}$/.test(formData.code)) {
      newErrors.code = t('validation.pattern.whCode')
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required.name')
    }

    // Organization validation
    if (!formData.organizationId) {
      newErrors.organizationId = t('validation.required.organization')
    }

    // Branch validation
    if (!formData.branchId) {
      newErrors.branchId = t('validation.required.branch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    onSave(formData)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    setErrors({})
  }

  const handleOrganizationSelect = (orgId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      organizationId: orgId,
      branchId: '' // Reset branch when organization changes
    }))
    setOrgPopoverOpen(false)
    if (errors.organizationId) {
      setErrors(prev => ({ ...prev, organizationId: '' }))
    }
  }

  const handleBranchSelect = (branchId: string) => {
    setFormData(prev => ({ ...prev, branchId }))
    setBranchPopoverOpen(false)
    if (errors.branchId) {
      setErrors(prev => ({ ...prev, branchId: '' }))
    }
  }

  const selectedOrganization = organizations.find(org => org.id === formData.organizationId)
  const selectedBranch = availableBranches.find(branch => branch.id === formData.branchId)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {warehouse ? t('warehouse.edit') : t('warehouse.create')}
          </DialogTitle>
          <DialogDescription>
            {warehouse ? t('warehouse.editDescription') : t('warehouse.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warehouse Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              {t('common.code')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              placeholder="WH_001"
              value={formData.code}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, code: e.target.value }))
                if (errors.code) setErrors(prev => ({ ...prev, code: '' }))
              }}
              className={errors.code ? 'border-destructive' : ''}
              disabled={!!warehouse} // Disable editing code for existing warehouses
            />
            {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
            <p className="text-sm text-muted-foreground">
              {t('warehouse.codeHint')}
            </p>
          </div>

          {/* Warehouse Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t('common.name')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder={t('warehouse.namePlaceholder')}
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }))
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
              }}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <Label>
              {t('common.organization')} <span className="text-destructive">*</span>
            </Label>
            <Popover open={orgPopoverOpen} onOpenChange={setOrgPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={orgPopoverOpen}
                  className={cn(
                    "w-full justify-between",
                    errors.organizationId && "border-destructive"
                  )}
                >
                  {selectedOrganization
                    ? (currentLanguage === 'vi' ? selectedOrganization.nameVi : selectedOrganization.name)
                    : t('common.selectOrganization')
                  }
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder={t('common.searchOrganizations')} />
                  <CommandList>
                    <CommandEmpty>{t('common.noResults')}</CommandEmpty>
                    <CommandGroup>
                      {organizations.filter(org => org.isActive).map((org) => (
                        <CommandItem
                          key={org.id}
                          value={org.id}
                          onSelect={() => handleOrganizationSelect(org.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedOrganization?.id === org.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{currentLanguage === 'vi' ? org.nameVi : org.name}</span>
                            <span className="text-sm text-muted-foreground">{org.code}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.organizationId && (
              <p className="text-sm text-destructive">{errors.organizationId}</p>
            )}
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <Label>
              {t('common.branch')} <span className="text-destructive">*</span>
            </Label>
            <Popover open={branchPopoverOpen} onOpenChange={setBranchPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={branchPopoverOpen}
                  className={cn(
                    "w-full justify-between",
                    errors.branchId && "border-destructive"
                  )}
                  disabled={!formData.organizationId}
                >
                  {selectedBranch
                    ? (currentLanguage === 'vi' ? selectedBranch.nameVi : selectedBranch.name)
                    : formData.organizationId
                      ? t('common.selectBranch')
                      : t('common.selectOrganizationFirst')
                  }
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder={t('common.searchBranches')} />
                  <CommandList>
                    <CommandEmpty>{t('common.noResults')}</CommandEmpty>
                    <CommandGroup>
                      {availableBranches.map((branch) => (
                        <CommandItem
                          key={branch.id}
                          value={branch.id}
                          onSelect={() => handleBranchSelect(branch.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedBranch?.id === branch.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{currentLanguage === 'vi' ? branch.nameVi : branch.name}</span>
                            <span className="text-sm text-muted-foreground">{branch.code}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.branchId && <p className="text-sm text-destructive">{errors.branchId}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">{t('common.address')}</Label>
            <Textarea
              id="address"
              placeholder={t('warehouse.addressPlaceholder')}
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">{t('common.active')}</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>
            {warehouse ? t('common.update') : t('common.create')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}