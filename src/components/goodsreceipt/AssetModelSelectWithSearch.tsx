import { useState, useMemo } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockModelAssets } from '../../data/mockModelAssetData'

const translations = {
  en: {
    selectAssetModel: 'Select asset model',
    searchAssetModel: 'Search asset model...',
    noAssetModel: 'No asset model found.',
    assetModels: 'Asset Models'
  },
  vi: {
    selectAssetModel: 'Chọn mẫu tài sản',
    searchAssetModel: 'Tìm kiếm mẫu tài sản...',
    noAssetModel: 'Không tìm thấy mẫu tài sản.',
    assetModels: 'Mẫu Tài Sản'
  }
}

interface AssetModelSelectWithSearchProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function AssetModelSelectWithSearch({ 
  value, 
  onValueChange, 
  placeholder, 
  disabled = false 
}: AssetModelSelectWithSearchProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const assetModels = useMemo(() => {
    return mockModelAssets.filter(m => m.status === 'Active')
  }, [])

  const filteredAssetModels = useMemo(() => {
    if (!searchValue) return assetModels
    
    return assetModels.filter(model =>
      model.model_code.toLowerCase().includes(searchValue.toLowerCase()) ||
      model.model_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      model.asset_type_name?.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [assetModels, searchValue])

  const selectedModel = assetModels.find(m => m.id === value)

  const getTrackingTypeBadgeVariant = (trackingType: string) => {
    switch (trackingType) {
      case 'Serial':
        return 'default'
      case 'Lot':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedModel ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                {selectedModel.model_code}
              </Badge>
              <span className="truncate">{selectedModel.model_name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {placeholder || t.selectAssetModel}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={t.searchAssetModel}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{t.noAssetModel}</CommandEmpty>
            <CommandGroup heading={t.assetModels}>
              {filteredAssetModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchValue('')
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === model.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                      {model.model_code}
                    </Badge>
                    <div className="flex flex-col">
                      <span className="truncate font-medium">{model.model_name}</span>
                      {model.asset_type_name && (
                        <span className="text-xs text-muted-foreground">
                          {model.asset_type_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={getTrackingTypeBadgeVariant(model.tracking_type) as "default" | "secondary" | "outline" | "destructive"}
                    className="ml-auto text-xs"
                  >
                    {model.tracking_type}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}