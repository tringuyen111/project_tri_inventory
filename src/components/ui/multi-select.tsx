import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "./utils"
import { Button } from "./button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Badge } from "./badge"

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxCount?: number
  modalPopover?: boolean
  asChild?: boolean
  maxHeight?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items",
  className,
  disabled = false,
  maxCount = 3,
  modalPopover = false,
  asChild = false,
  maxHeight = "300px",
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback((value: string) => {
    onChange(selected.filter((s) => s !== value))
  }, [onChange, selected])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement
    if (input.value === "") {
      if (e.key === "Backspace") {
        const newSelected = [...selected]
        newSelected.pop()
        onChange(newSelected)
      }
    }
    if (e.key === "Escape") {
      input.blur()
    }
  }, [onChange, selected])

  const selectables = options.filter((option) => !selected.includes(option.value))

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modalPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal min-h-[42px] px-3 py-2",
            selected.length > 0 && "h-auto",
            className
          )}
          onClick={() => setOpen(!open)}
          disabled={disabled}
        >
          <div className="flex gap-2 flex-wrap items-center min-h-[32px]">
            {selected.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
            {selected.length > 0 && selected.length <= maxCount && (
              <>
                {selected.map((value) => {
                  const option = options.find((option) => option.value === value)
                  const IconComponent = option?.icon
                  return (
                    <Badge
                      variant="outline"
                      key={value}
                      className="bg-accent/50 hover:bg-accent/70 border-border/50 transition-colors px-2.5 py-1 gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleUnselect(value)
                      }}
                    >
                      {IconComponent && (
                        <IconComponent className="h-3 w-3" />
                      )}
                      <span className="text-xs">{option?.label}</span>
                      <X className="h-3 w-3 hover:text-destructive" />
                    </Badge>
                  )
                })}
              </>
            )}
            {selected.length > maxCount && (
              <Badge
                variant="outline"
                className="bg-accent/50 border-border/50 px-2.5 py-1"
              >
                {selected.length} selected
              </Badge>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandList style={{ maxHeight }}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {selectables.map((option) => {
                const IconComponent = option.icon
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange([...selected, option.value])
                      setInputValue("")
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {IconComponent && (
                      <IconComponent className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}