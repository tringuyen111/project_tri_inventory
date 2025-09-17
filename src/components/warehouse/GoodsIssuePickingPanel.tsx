import { useMemo, useState } from 'react'
import { CheckCircle, Minus, Plus, ScanBarcode, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../ui/drawer'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'

import { useGoodsIssues } from '../../contexts/GoodsIssueContext'
import { GoodsIssue } from '../../types/goodsIssue'
import { getLotsByFIFO } from '../../data/mockLotData'

interface GoodsIssuePickingPanelProps {
  issueNo?: string
  open: boolean
  onClose: () => void
}

const statusActions: Partial<Record<GoodsIssue['status'], { label: string; target: GoodsIssue['status']; note?: string }[]>> = {
  Draft: [
    { label: 'Start Picking', target: 'Picking' },
    { label: 'Cancel Issue', target: 'Cancelled' }
  ],
  Picking: [
    { label: 'Request Adjustment', target: 'AdjustmentRequested' },
    { label: 'Submit for Approval', target: 'Submitted' },
    { label: 'Cancel Issue', target: 'Cancelled' }
  ],
  AdjustmentRequested: [
    { label: 'Resume Picking', target: 'Picking' },
    { label: 'Cancel Issue', target: 'Cancelled' }
  ],
  Submitted: [
    { label: 'Approve Issue', target: 'Approved' },
    { label: 'Request Adjustment', target: 'AdjustmentRequested' },
    { label: 'Cancel Issue', target: 'Cancelled' }
  ],
  Approved: [
    { label: 'Complete Issue', target: 'Completed' },
    { label: 'Cancel Issue', target: 'Cancelled' }
  ]
}

export function GoodsIssuePickingPanel({ issueNo, open, onClose }: GoodsIssuePickingPanelProps) {
  const {
    issues,
    addSerial,
    removeSerial,
    upsertLotAllocation,
    removeLotAllocation,
    setLinePickedQuantity,
    transitionStatus
  } = useGoodsIssues()

  const issue = useMemo(() => issues.find(item => item.issue_no === issueNo), [issues, issueNo])

  const lots = useMemo(() => getLotsByFIFO(), [])

  const [serialInputs, setSerialInputs] = useState<Record<string, string>>({})
  const [lotSelections, setLotSelections] = useState<Record<string, { lotNumber: string; quantity: number }>>({})

  if (!issue) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Goods Issue</DrawerTitle>
            <DrawerDescription>No goods issue selected.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  const actions = statusActions[issue.status] ?? []
  const pickingEnabled = ['Picking', 'AdjustmentRequested'].includes(issue.status)

  const handleAddSerial = (lineId: string) => {
    const serial = serialInputs[lineId]
    const result = addSerial(issue.issue_no, lineId, serial)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success('Serial captured')
    setSerialInputs(prev => ({ ...prev, [lineId]: '' }))
  }

  const handleSetQuantity = (lineId: string, quantity: number) => {
    const result = setLinePickedQuantity(issue.issue_no, lineId, quantity)
    if (!result.success) {
      toast.error(result.error)
    }
  }

  const handleLotAssignment = (lineId: string) => {
    const selection = lotSelections[lineId]
    if (!selection) {
      toast.error('Choose a lot before assigning')
      return
    }

    const lot = lots.find(item => item.lot_code === selection.lotNumber)
    const result = upsertLotAllocation(issue.issue_no, lineId, {
      lotNumber: selection.lotNumber,
      quantity: selection.quantity,
      availableQty: lot?.qty_onhand
    })

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success('Lot allocation saved')
  }

  const performTransition = (target: GoodsIssue['status']) => {
    const result = transitionStatus(issue.issue_no, target)
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success(`Status updated to ${target}`)
  }

  const totalPlanned = issue.lines.reduce((sum, line) => sum + line.planned_qty, 0)
  const totalPicked = issue.lines.reduce((sum, line) => sum + line.picked_qty, 0)

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="w-full overflow-hidden md:w-[720px]">
        <DrawerHeader className="space-y-2 text-left">
          <DrawerTitle className="flex items-center justify-between">
            <span>{issue.issue_no}</span>
            <Badge variant="secondary">{issue.status}</Badge>
          </DrawerTitle>
          <DrawerDescription className="space-y-1 text-left text-sm text-muted-foreground">
            <p>
              {issue.issue_type} • Expected {new Date(issue.expected_date).toLocaleDateString()} • {issue.from_wh_name}
              {issue.to_wh_name ? ` → ${issue.to_wh_name}` : ''}
            </p>
            {issue.partner_name && <p>Partner: {issue.partner_name}</p>}
            <p>
              Planned: {totalPlanned.toLocaleString()} • Picked: {totalPicked.toLocaleString()} • Diff:{' '}
              {(totalPicked - totalPlanned).toLocaleString()}
            </p>
          </DrawerDescription>
        </DrawerHeader>
        <Separator />
        <div className="grid h-full gap-6 overflow-hidden p-4 md:grid-cols-[2fr_1fr]">
          <ScrollArea className="h-full rounded-md border p-3">
            <div className="space-y-4">
              {issue.lines.map(line => (
                <div key={line.line_id} className="space-y-3 rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{line.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {line.sku} • Planned {line.planned_qty} {line.uom} • Picked {line.picked_qty}{' '}
                        {line.uom}
                      </p>
                    </div>
                    <Badge variant="outline">{line.tracking_type}</Badge>
                  </div>
                  {line.tracking_type === 'SERIAL' && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Serial Capture</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Scan or enter serial"
                          value={serialInputs[line.line_id] || ''}
                          onChange={event =>
                            setSerialInputs(prev => ({ ...prev, [line.line_id]: event.target.value }))
                          }
                          disabled={!pickingEnabled}
                        />
                        <Button
                          onClick={() => handleAddSerial(line.line_id)}
                          disabled={!pickingEnabled || !serialInputs[line.line_id]}
                        >
                          <ScanBarcode className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      </div>
                      {line.serials.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {line.serials.map(serial => (
                            <Badge key={serial} variant="secondary" className="flex items-center gap-1">
                              {serial}
                              {pickingEnabled && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const result = removeSerial(issue.issue_no, line.line_id, serial)
                                    if (!result.success) {
                                      toast.error(result.error)
                                      return
                                    }
                                    toast.success('Serial removed')
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No serials captured yet.</p>
                      )}
                    </div>
                  )}
                  {line.tracking_type === 'LOT' && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Lot Selection</Label>
                      <div className="grid gap-2 md:grid-cols-[2fr_1fr_auto]">
                        <Select
                          value={lotSelections[line.line_id]?.lotNumber || ''}
                          onValueChange={value =>
                            setLotSelections(prev => ({
                              ...prev,
                              [line.line_id]: {
                                lotNumber: value,
                                quantity: prev[line.line_id]?.quantity ?? 0
                              }
                            }))
                          }
                          disabled={!pickingEnabled}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose lot" />
                          </SelectTrigger>
                          <SelectContent>
                            {lots.map(lot => (
                              <SelectItem key={lot.lot_code} value={lot.lot_code}>
                                {lot.lot_code} • {lot.qty_onhand} {lot.uom_name || lot.uom_code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={0}
                          value={lotSelections[line.line_id]?.quantity ?? 0}
                          onChange={event =>
                            setLotSelections(prev => ({
                              ...prev,
                              [line.line_id]: {
                                lotNumber: prev[line.line_id]?.lotNumber || '',
                                quantity: Number(event.target.value) || 0
                              }
                            }))
                          }
                          disabled={!pickingEnabled}
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleLotAssignment(line.line_id)}
                          disabled={!pickingEnabled}
                        >
                          Save
                        </Button>
                      </div>
                      {line.lot_allocations.length > 0 ? (
                        <div className="space-y-2">
                          {line.lot_allocations.map(allocation => (
                            <div key={allocation.lotNumber} className="flex items-center justify-between rounded-md bg-muted p-2">
                              <div>
                                <p className="text-sm font-medium">{allocation.lotNumber}</p>
                                <p className="text-xs text-muted-foreground">{allocation.quantity} {line.uom}</p>
                              </div>
                              {pickingEnabled && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const result = removeLotAllocation(issue.issue_no, line.line_id, allocation.lotNumber)
                                    if (!result.success) {
                                      toast.error(result.error)
                                      return
                                    }
                                    toast.success('Lot allocation removed')
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No lots assigned yet.</p>
                      )}
                    </div>
                  )}
                  {line.tracking_type === 'NONE' && (
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground">Picked Quantity</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleSetQuantity(line.line_id, Math.max(0, line.picked_qty - 1))}
                          disabled={!pickingEnabled}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          className="w-24 text-center"
                          type="number"
                          value={line.picked_qty}
                          onChange={event => handleSetQuantity(line.line_id, Number(event.target.value) || 0)}
                          disabled={!pickingEnabled}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleSetQuantity(line.line_id, Math.min(line.planned_qty, line.picked_qty + 1))}
                          disabled={!pickingEnabled}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex h-full flex-col gap-4">
            <div className="rounded-md border p-4">
              <h3 className="text-sm font-semibold">Workflow</h3>
              <div className="mt-3 space-y-2">
                {actions.length > 0 ? (
                  actions.map(action => (
                    <Button key={action.label} className="w-full" onClick={() => performTransition(action.target)}>
                      {action.label}
                    </Button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No actions available for this status.</p>
                )}
              </div>
            </div>
            <div className="flex-1 rounded-md border p-4">
              <h3 className="text-sm font-semibold">Status History</h3>
              <ScrollArea className="mt-3 h-full">
                <div className="space-y-3">
                  {issue.statusHistory.map(entry => (
                    <div key={`${entry.status}-${entry.changedAt}`} className="rounded-md bg-muted p-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{entry.status}</span>
                        <span>{new Date(entry.changedAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-1">{entry.changedBy}</p>
                      {entry.note && <p className="text-muted-foreground">{entry.note}</p>}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="rounded-md border p-4">
              <h3 className="text-sm font-semibold">Completion Check</h3>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <CheckCircle className={totalPicked >= totalPlanned ? 'h-4 w-4 text-green-500' : 'h-4 w-4 text-muted-foreground'} />
                <span>
                  {totalPicked >= totalPlanned
                    ? 'All quantities captured'
                    : `${totalPlanned - totalPicked} remaining`}
                </span>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex items-center justify-between">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
