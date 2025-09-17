import { useState } from 'react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { UoM, UoMConversion, UoMFilter, MeasureType } from "../../types/uom"
import { mockUoMs, mockConversions, measureTypes } from "../../data/mockUomData"
import { UoMForm } from "./UoMForm"
import { ConversionForm } from "./ConversionForm"
import { 
  Plus, 
  Edit2, 
  Search, 
  Filter,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

export function UoMManagement() {
  const [uoms, setUoMs] = useState<UoM[]>(mockUoMs)
  const [conversions, setConversions] = useState<UoMConversion[]>(mockConversions)
  const [filter, setFilter] = useState<UoMFilter>({})
  const [showUoMForm, setShowUoMForm] = useState(false)
  const [showConversionForm, setShowConversionForm] = useState(false)
  const [editingUoM, setEditingUoM] = useState<UoM | undefined>()

  // Filter UoMs
  const filteredUoMs = uoms.filter(uom => {
    if (filter.measure_type && uom.measure_type !== filter.measure_type) return false
    if (filter.status && uom.status !== filter.status) return false
    if (filter.search) {
      const search = filter.search.toLowerCase()
      return uom.uom_code.toLowerCase().includes(search) || 
             uom.uom_name.toLowerCase().includes(search)
    }
    return true
  })

  // Get conversions with UoM details
  const conversionsWithDetails = conversions.map(conv => ({
    ...conv,
    from_uom: uoms.find(u => u.id === conv.from_uom_id)!,
    to_uom: uoms.find(u => u.id === conv.to_uom_id)!
  }))

  const handleSaveUoM = (uomData: Omit<UoM, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingUoM) {
      // Update existing UoM
      setUoMs(prev => prev.map(uom => 
        uom.id === editingUoM.id 
          ? { ...uom, ...uomData, updated_at: new Date().toISOString() }
          : uom
      ))
      toast.success(`UoM ${uomData.uom_code} updated successfully`)
    } else {
      // Create new UoM
      const newUoM: UoM = {
        id: Date.now().toString(),
        ...uomData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setUoMs(prev => [...prev, newUoM])
      toast.success(`UoM ${uomData.uom_code} created successfully`)
    }
    
    setShowUoMForm(false)
    setEditingUoM(undefined)
  }

  const handleSaveConversion = (conversionData: Omit<UoMConversion, 'id' | 'created_at' | 'updated_at' | 'from_uom' | 'to_uom'>) => {
    const now = new Date().toISOString()
    const newId = Date.now().toString()
    
    // Create main conversion
    const newConversion: UoMConversion = {
      id: newId,
      ...conversionData,
      from_uom: uoms.find(u => u.id === conversionData.from_uom_id)!,
      to_uom: uoms.find(u => u.id === conversionData.to_uom_id)!,
      created_at: now,
      updated_at: now
    }
    
    // Create inverse conversion automatically
    const inverseConversion: UoMConversion = {
      id: (Date.now() + 1).toString(),
      from_uom_id: conversionData.to_uom_id,
      to_uom_id: conversionData.from_uom_id,
      from_uom: uoms.find(u => u.id === conversionData.to_uom_id)!,
      to_uom: uoms.find(u => u.id === conversionData.from_uom_id)!,
      multiplier: 1 / conversionData.multiplier,
      note: 'Auto-generated inverse',
      is_system_generated: true,
      created_at: now,
      updated_at: now
    }
    
    setConversions(prev => [...prev, newConversion, inverseConversion])
    toast.success('Conversion rule added successfully (with automatic inverse)')
    setShowConversionForm(false)
  }

  const handleDeleteConversion = (conversionId: string) => {
    const conversion = conversions.find(c => c.id === conversionId)
    if (!conversion) return

    // Find and remove both the conversion and its inverse
    setConversions(prev => prev.filter(c => 
      !(
        (c.from_uom_id === conversion.from_uom_id && c.to_uom_id === conversion.to_uom_id) ||
        (c.from_uom_id === conversion.to_uom_id && c.to_uom_id === conversion.from_uom_id)
      )
    ))
    
    toast.success('Conversion rule deleted (including inverse)')
  }

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary'
  }

  const getMeasureTypeColor = (measureType: MeasureType) => {
    const colors = {
      'Piece': 'bg-blue-100 text-blue-800',
      'Weight': 'bg-green-100 text-green-800', 
      'Volume': 'bg-purple-100 text-purple-800',
      'Length': 'bg-yellow-100 text-yellow-800',
      'Area': 'bg-pink-100 text-pink-800',
      'Time': 'bg-indigo-100 text-indigo-800',
      'Temperature': 'bg-red-100 text-red-800'
    }
    return colors[measureType] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Unit of Measure (UoM) Management</h1>
        <p className="text-muted-foreground">
          Manage units of measure and their conversion relationships
        </p>
      </div>

      <Tabs defaultValue="uoms" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="uoms">Units of Measure</TabsTrigger>
          <TabsTrigger value="conversions">Conversion Rules</TabsTrigger>
        </TabsList>

        {/* UoM List Tab */}
        <TabsContent value="uoms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Units of Measure</CardTitle>
                  <CardDescription>
                    Manage individual units of measure
                  </CardDescription>
                </div>
                <Dialog open={showUoMForm} onOpenChange={setShowUoMForm}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add UoM
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <UoMForm
                      uom={editingUoM}
                      onSave={handleSaveUoM}
                      onCancel={() => {
                        setShowUoMForm(false)
                        setEditingUoM(undefined)
                      }}
                      existingCodes={uoms.filter(u => u.id !== editingUoM?.id).map(u => u.uom_code)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by code or name..."
                      value={filter.search || ''}
                      onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select 
                  value={filter.measure_type || 'all'} 
                  onValueChange={(value) => setFilter(prev => ({ 
                    ...prev, 
                    measure_type: value === 'all' ? undefined : value as MeasureType 
                  }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {measureTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={filter.status || 'all'} 
                  onValueChange={(value) => setFilter(prev => ({ 
                    ...prev, 
                    status: value === 'all' ? undefined : value as 'Active' | 'Inactive'
                  }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* UoM Table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UoM Code</TableHead>
                      <TableHead>UoM Name</TableHead>
                      <TableHead>Measurement Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Base Unit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUoMs.map((uom) => (
                      <TableRow key={uom.id}>
                        <TableCell>
                          <span className="font-mono">{uom.uom_code}</span>
                        </TableCell>
                        <TableCell>{uom.uom_name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getMeasureTypeColor(uom.measure_type)}`}>
                            {uom.measure_type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(uom.status)}>
                            {uom.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {uom.is_base_unit && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingUoM(uom)
                              setShowUoMForm(true)
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUoMs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No units of measure found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversions Tab */}
        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Conversion Rules</CardTitle>
                  <CardDescription>
                    Manage conversion relationships between units
                  </CardDescription>
                </div>
                <Dialog open={showConversionForm} onOpenChange={setShowConversionForm}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Conversion
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <ConversionForm
                      uoms={uoms}
                      existingConversions={conversions}
                      onSave={handleSaveConversion}
                      onCancel={() => setShowConversionForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Info Alert */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  When you create a conversion rule, the system automatically creates the inverse relationship. 
                  Chain conversions are also automatically calculated (e.g., Pallet → Case → Box → Pieces).
                </AlertDescription>
              </Alert>

              {/* Conversions Table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From Unit</TableHead>
                      <TableHead>Multiplier</TableHead>
                      <TableHead>To Unit</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversionsWithDetails.map((conversion) => (
                      <TableRow key={conversion.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{conversion.from_uom.uom_code}</span>
                            <span className="text-sm text-muted-foreground">
                              {conversion.from_uom.uom_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{conversion.multiplier}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{conversion.to_uom.uom_code}</span>
                            <span className="text-sm text-muted-foreground">
                              {conversion.to_uom.uom_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={conversion.is_system_generated ? 'secondary' : 'default'}>
                            {conversion.is_system_generated ? 'Auto' : 'Manual'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-48 truncate">
                          {conversion.note}
                        </TableCell>
                        <TableCell className="text-right">
                          {!conversion.is_system_generated && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConversion(conversion.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {conversionsWithDetails.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No conversion rules found. Add your first conversion to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}