import { useState, useMemo } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockWarehouses } from '../../data/mockWarehouseData'

const translations = {
  en: {
    selectWarehouse: 'Select warehouse',
    searchWarehouse: 'Search warehouse...',
    noWarehouse: 'No warehouse found.',
    warehouses: 'Warehouses'
  },
  vi: {
    selectWarehouse: 'Chọn kho',
    searchWarehouse: 'Tìm kiếm kho...',
    noWarehouse: 'Không tìm thấy kho.',
    warehouses: 'Kho'
  }
}

interface WarehouseSelectWithSearchProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  excludeWarehouseId?: string
}

export function WarehouseSelectWithSearch({ 
  value, 
  onValueChange, 
  placeholder, 
  disabled = false,
  excludeWarehouseId 
}: WarehouseSelectWithSearchProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const warehouses = useMemo(() => {
    return mockWarehouses
      .filter(w => w.isActive === true)
      .filter(w => excludeWarehouseId ? w.id !== excludeWarehouseId : true)
  }, [excludeWarehouseId])

  const filteredWarehouses = useMemo(() => {
    if (!searchValue) return warehouses
    
    return warehouses.filter(warehouse =>
      warehouse.code.toLowerCase().includes(searchValue.toLowerCase()) ||
      warehouse.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [warehouses, searchValue])

  const selectedWarehouse = warehouses.find(w => w.id === value)

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
          {selectedWarehouse ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                {selectedWarehouse.code}
              </Badge>
              <span className="truncate">{selectedWarehouse.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {placeholder || t.selectWarehouse}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={t.searchWarehouse}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{t.noWarehouse}</CommandEmpty>
            <CommandGroup heading={t.warehouses}>
              {filteredWarehouses.map((warehouse) => (
                <CommandItem
                  key={warehouse.id}
                  value={warehouse.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchValue('')
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === warehouse.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                      {warehouse.code}
                    </Badge>
                    <span className="truncate">{warehouse.name}</span>
                  </div>
                  {warehouse.branchName && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {warehouse.branchName}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}