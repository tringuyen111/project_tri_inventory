import { useState, useMemo } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockUoMs } from '../../data/mockUomData'

const translations = {
  en: {
    selectUoM: 'Select unit of measure',
    searchUoM: 'Search unit of measure...',
    noUoM: 'No unit of measure found.',
    unitsOfMeasure: 'Units of Measure'
  },
  vn: {
    selectUoM: 'Chọn đơn vị tính',
    searchUoM: 'Tìm kiếm đơn vị tính...',
    noUoM: 'Không tìm thấy đơn vị tính.',
    unitsOfMeasure: 'Đơn Vị Tính'
  }
}

interface UomSelectWithSearchProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function UomSelectWithSearch({ 
  value, 
  onValueChange, 
  placeholder, 
  disabled = false 
}: UomSelectWithSearchProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const uoms = useMemo(() => {
    return mockUoMs.filter(u => u.status === 'Active')
  }, [])

  const filteredUoms = useMemo(() => {
    if (!searchValue) return uoms
    
    return uoms.filter(uom =>
      uom.uom_code.toLowerCase().includes(searchValue.toLowerCase()) ||
      uom.uom_name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [uoms, searchValue])

  const selectedUom = uoms.find(u => u.id === value)

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
          {selectedUom ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                {selectedUom.uom_code}
              </Badge>
              <span className="truncate">{selectedUom.uom_name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {placeholder || t.selectUoM}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={t.searchUoM}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{t.noUoM}</CommandEmpty>
            <CommandGroup heading={t.unitsOfMeasure}>
              {filteredUoms.map((uom) => (
                <CommandItem
                  key={uom.id}
                  value={uom.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchValue('')
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === uom.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                      {uom.uom_code}
                    </Badge>
                    <span className="truncate">{uom.uom_name}</span>
                  </div>
                  {uom.measure_type && (
                    <span className="text-xs text-muted-foreground ml-auto">
                      {uom.measure_type}
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