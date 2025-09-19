import { useState, useMemo } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '../ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockPartners } from '../../data/mockPartnerData'

const translations = {
  en: {
    selectPartner: 'Select partner',
    searchPartner: 'Search partner...',
    noPartner: 'No partner found.',
    partners: 'Partners'
  },
  vi: {
    selectPartner: 'Chọn đối tác',
    searchPartner: 'Tìm kiếm đối tác...',
    noPartner: 'Không tìm thấy đối tác.',
    partners: 'Đối Tác'
  }
}

interface PartnerSelectWithSearchProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function PartnerSelectWithSearch({ 
  value, 
  onValueChange, 
  placeholder, 
  disabled = false 
}: PartnerSelectWithSearchProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const partners = useMemo(() => {
    return mockPartners.filter(p => p.status === 'Active')
  }, [])

  const filteredPartners = useMemo(() => {
    if (!searchValue) return partners
    
    return partners.filter(partner =>
      partner.partner_code.toLowerCase().includes(searchValue.toLowerCase()) ||
      partner.partner_name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [partners, searchValue])

  const selectedPartner = partners.find(p => p.id === value)

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
          {selectedPartner ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                {selectedPartner.partner_code}
              </Badge>
              <span className="truncate">{selectedPartner.partner_name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {placeholder || t.selectPartner}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={t.searchPartner}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{t.noPartner}</CommandEmpty>
            <CommandGroup heading={t.partners}>
              {filteredPartners.map((partner) => (
                <CommandItem
                  key={partner.id}
                  value={partner.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchValue('')
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === partner.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                      {partner.partner_code}
                    </Badge>
                    <div className="flex flex-col">
                      <span className="truncate font-medium">{partner.partner_name}</span>
                      {partner.contact && (
                        <span className="text-xs text-muted-foreground">
                          {partner.contact}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="secondary"
                    className="ml-auto text-xs"
                  >
                    {partner.partner_type}
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