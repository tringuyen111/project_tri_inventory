import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

import {
  GoodsIssue,
  GoodsIssueDraftPayload,
  GoodsIssueLotAssignment,
  GoodsIssueStatus,
  GoodsIssueTransitionOptions
} from '../types/goodsIssue'
import { mockGoodsIssues } from '../data/mockGoodsIssueData'

interface GoodsIssueResult<T = GoodsIssue | void> {
  success: boolean
  error?: string
  data?: T
}

interface GoodsIssueContextValue {
  issues: GoodsIssue[]
  getIssue: (issueNo: string) => GoodsIssue | undefined
  createDraft: (payload: GoodsIssueDraftPayload, options?: GoodsIssueTransitionOptions) => GoodsIssueResult<GoodsIssue>
  updateDraft: (issueNo: string, payload: GoodsIssueDraftPayload) => GoodsIssueResult<GoodsIssue>
  transitionStatus: (issueNo: string, status: GoodsIssueStatus, options?: GoodsIssueTransitionOptions) => GoodsIssueResult
  addSerial: (issueNo: string, lineId: string, serial: string) => GoodsIssueResult
  removeSerial: (issueNo: string, lineId: string, serial: string) => GoodsIssueResult
  upsertLotAllocation: (issueNo: string, lineId: string, assignment: GoodsIssueLotAssignment) => GoodsIssueResult
  removeLotAllocation: (issueNo: string, lineId: string, lotNumber: string) => GoodsIssueResult
  setLinePickedQuantity: (issueNo: string, lineId: string, quantity: number) => GoodsIssueResult
}

const GoodsIssueContext = createContext<GoodsIssueContextValue | undefined>(undefined)

const ALLOWED_TRANSITIONS: Record<GoodsIssueStatus, GoodsIssueStatus[]> = {
  Draft: ['Picking', 'Cancelled'],
  Picking: ['AdjustmentRequested', 'Submitted', 'Cancelled'],
  AdjustmentRequested: ['Picking', 'Cancelled'],
  Submitted: ['Approved', 'AdjustmentRequested', 'Cancelled'],
  Approved: ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: []
}

const generateId = () => {
  const globalCrypto = globalThis.crypto as Crypto | undefined
  if (globalCrypto?.randomUUID) {
    return globalCrypto.randomUUID()
  }
  return `gi_${Math.random().toString(36).slice(2, 10)}`
}

const cloneIssue = (issue: GoodsIssue): GoodsIssue => structuredClone(issue)

interface GoodsIssueProviderProps {
  children: ReactNode
}

export function GoodsIssueProvider({ children }: GoodsIssueProviderProps) {
  const [issues, setIssues] = useState<GoodsIssue[]>(() => mockGoodsIssues.map(issue => cloneIssue(issue)))

  const sortIssues = (items: GoodsIssue[]) =>
    [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const getIssue = (issueNo: string) => issues.find(issue => issue.issue_no === issueNo)

  const appendHistory = (issue: GoodsIssue, status: GoodsIssueStatus, options?: GoodsIssueTransitionOptions) => {
    const changedBy = options?.changedBy || 'System User'
    const note = options?.note
    issue.statusHistory = [
      ...issue.statusHistory,
      { status, changedAt: new Date().toISOString(), changedBy, note }
    ]
  }

  const createDraft = (
    payload: GoodsIssueDraftPayload,
    options?: GoodsIssueTransitionOptions
  ): GoodsIssueResult<GoodsIssue> => {
    if (!payload.issue_type || !payload.from_wh_name || !payload.expected_date) {
      return { success: false, error: 'Missing required header fields' }
    }

    if (!payload.lines.length) {
      return { success: false, error: 'At least one line is required' }
    }

    for (const line of payload.lines) {
      if (!line.sku || !line.product_name || !line.uom || line.planned_qty <= 0) {
        return { success: false, error: 'Each line must include SKU, product, UoM and planned quantity' }
      }
    }

    const highestSequence = issues.reduce((max, issue) => {
      const match = issue.issue_no.match(/(\d+)$/)
      if (!match) return max
      return Math.max(max, parseInt(match[1] ?? '0', 10))
    }, 0)

    const nextSequence = highestSequence + 1
    const newIssueNo = `GI-${new Date().getFullYear()}-${nextSequence.toString().padStart(3, '0')}`

    const newIssue: GoodsIssue = {
      issue_no: newIssueNo,
      issue_type: payload.issue_type,
      status: 'Draft',
      partner_name: payload.partner_name,
      from_wh_name: payload.from_wh_name,
      to_wh_name: payload.to_wh_name,
      expected_date: payload.expected_date,
      created_at: new Date().toISOString(),
      created_by: options?.changedBy || 'System User',
      statusHistory: [
        {
          status: 'Draft',
          changedAt: new Date().toISOString(),
          changedBy: options?.changedBy || 'System User'
        }
      ],
      lines: payload.lines.map(line => ({
        line_id: line.line_id || generateId(),
        sku: line.sku,
        product_name: line.product_name,
        planned_qty: line.planned_qty,
        picked_qty: 0,
        uom: line.uom,
        tracking_type: line.tracking_type,
        serials: [],
        lot_allocations: []
      }))
    }

    setIssues(prev => sortIssues([...prev, newIssue]))

    return { success: true, data: newIssue }
  }

  const updateDraft = (issueNo: string, payload: GoodsIssueDraftPayload): GoodsIssueResult<GoodsIssue> => {
    const existing = getIssue(issueNo)
    if (!existing) {
      return { success: false, error: 'Goods issue not found' }
    }

    if (existing.status !== 'Draft') {
      return { success: false, error: 'Only draft goods issues can be edited' }
    }

    if (!payload.lines.length) {
      return { success: false, error: 'At least one line is required' }
    }

    for (const line of payload.lines) {
      if (!line.sku || !line.product_name || !line.uom || line.planned_qty <= 0) {
        return { success: false, error: 'Each line must include SKU, product, UoM and planned quantity' }
      }
    }

    const updatedIssue: GoodsIssue = {
      ...existing,
      issue_type: payload.issue_type,
      partner_name: payload.partner_name,
      from_wh_name: payload.from_wh_name,
      to_wh_name: payload.to_wh_name,
      expected_date: payload.expected_date,
      lines: payload.lines.map(line => ({
        line_id: line.line_id || generateId(),
        sku: line.sku,
        product_name: line.product_name,
        planned_qty: line.planned_qty,
        picked_qty: 0,
        uom: line.uom,
        tracking_type: line.tracking_type,
        serials: [],
        lot_allocations: []
      }))
    }

    setIssues(prev => sortIssues(prev.map(issue => (issue.issue_no === issueNo ? updatedIssue : issue))))

    return { success: true, data: updatedIssue }
  }

  const transitionStatus = (
    issueNo: string,
    status: GoodsIssueStatus,
    options?: GoodsIssueTransitionOptions
  ): GoodsIssueResult => {
    const existing = getIssue(issueNo)
    if (!existing) {
      return { success: false, error: 'Goods issue not found' }
    }

    if (existing.status === status) {
      return { success: true }
    }

    const allowed = ALLOWED_TRANSITIONS[existing.status]
    if (!allowed.includes(status)) {
      return { success: false, error: `Cannot transition from ${existing.status} to ${status}` }
    }

    const updated = cloneIssue(existing)
    updated.status = status
    appendHistory(updated, status, options)

    setIssues(prev => sortIssues(prev.map(issue => (issue.issue_no === issueNo ? updated : issue))))

    return { success: true }
  }

  const addSerial = (issueNo: string, lineId: string, serial: string): GoodsIssueResult => {
    const existing = getIssue(issueNo)
    if (!existing) return { success: false, error: 'Goods issue not found' }

    if (!['Picking', 'AdjustmentRequested'].includes(existing.status)) {
      return { success: false, error: 'Serials can only be captured during picking' }
    }

    const trimmed = serial.trim()
    if (!trimmed) {
      return { success: false, error: 'Serial cannot be empty' }
    }

    const updated = cloneIssue(existing)
    const line = updated.lines.find(item => item.line_id === lineId)
    if (!line) return { success: false, error: 'Line not found' }

    if (line.tracking_type !== 'SERIAL') {
      return { success: false, error: 'Line is not serial-tracked' }
    }

    if (line.serials.includes(trimmed)) {
      return { success: false, error: 'Serial already captured' }
    }

    if (line.serials.length + 1 > line.planned_qty) {
      return { success: false, error: 'Serial quantity exceeds planned quantity' }
    }

    line.serials = [...line.serials, trimmed]
    line.picked_qty = line.serials.length

    setIssues(prev => sortIssues(prev.map(issue => (issue.issue_no === issueNo ? updated : issue))))

    return { success: true }
  }

  const removeSerial = (issueNo: string, lineId: string, serial: string): GoodsIssueResult => {
    const existing = getIssue(issueNo)
    if (!existing) return { success: false, error: 'Goods issue not found' }

    const updated = cloneIssue(existing)
    const line = updated.lines.find(item => item.line_id === lineId)
    if (!line) return { success: false, error: 'Line not found' }

    if (line.tracking_type !== 'SERIAL') {
      return { success: false, error: 'Line is not serial-tracked' }
    }

    line.serials = line.serials.filter(item => item !== serial)
    line.picked_qty = line.serials.length

    setIssues(prev => sortIssues(prev.map(issue => (issue.issue_no === issueNo ? updated : issue))))

    return { success: true }
  }

  const upsertLotAllocation = (
    issueNo: string,
    lineId: string,
    assignment: GoodsIssueLotAssignment
  ): GoodsIssueResult => {
    const existing = getIssue(issueNo)
    if (!existing) return { success: false, error: 'Goods issue not found' }

    if (!['Picking', 'AdjustmentRequested'].includes(existing.status)) {
      return { success: false, error: 'Lots can only be allocated during picking' }
    }

    if (!assignment.lotNumber || assignment.quantity <= 0) {
      return { success: false, error: 'Lot and quantity are required' }
    }

    const updated = cloneIssue(existing)
    const line = updated.lines.find(item => item.line_id === lineId)
    if (!line) return { success: false, error: 'Line not found' }

    if (line.tracking_type !== 'LOT') {
      return { success: false, error: 'Line is not lot-tracked' }
    }

    const otherQuantity = line.lot_allocations
      .filter(allocation => allocation.lotNumber !== assignment.lotNumber)
      .reduce((sum, allocation) => sum + allocation.quantity, 0)

    if (otherQuantity + assignment.quantity > line.planned_qty) {
      return { success: false, error: 'Assigned quantity exceeds planned quantity' }
    }

    if (assignment.availableQty !== undefined && assignment.quantity > assignment.availableQty) {
      return { success: false, error: 'Assigned quantity exceeds available stock in lot' }
    }

    const existingAllocation = line.lot_allocations.find(allocation => allocation.lotNumber === assignment.lotNumber)
    if (existingAllocation) {
      existingAllocation.quantity = assignment.quantity
    } else {
      line.lot_allocations = [...line.lot_allocations, { lotNumber: assignment.lotNumber, quantity: assignment.quantity }]
    }

    line.picked_qty = line.lot_allocations.reduce((sum, allocation) => sum + allocation.quantity, 0)

    setIssues(prev => sortIssues(prev.map(issue => (issue.issue_no === issueNo ? updated : issue))))

    return { success: true }
  }

  const removeLotAllocation = (issueNo: string, lineId: string, lotNumber: string): GoodsIssueResult => {
    const existing = getIssue(issueNo)
    if (!existing) return { success: false, error: 'Goods issue not found' }

    const updated = cloneIssue(existing)
    const line = updated.lines.find(item => item.line_id === lineId)
    if (!line) return { success: false, error: 'Line not found' }

    if (line.tracking_type !== 'LOT') {
      return { success: false, error: 'Line is not lot-tracked' }
    }

    line.lot_allocations = line.lot_allocations.filter(allocation => allocation.lotNumber !== lotNumber)
    line.picked_qty = line.lot_allocations.reduce((sum, allocation) => sum + allocation.quantity, 0)

    setIssues(prev => sortIssues(prev.map(issue => (issue.issue_no === issueNo ? updated : issue))))

    return { success: true }
  }

  const setLinePickedQuantity = (issueNo: string, lineId: string, quantity: number): GoodsIssueResult => {
    const existing = getIssue(issueNo)
    if (!existing) return { success: false, error: 'Goods issue not found' }

    if (!['Picking', 'AdjustmentRequested'].includes(existing.status)) {
      return { success: false, error: 'Picked quantities can only be updated during picking' }
    }

    if (quantity < 0) {
      return { success: false, error: 'Quantity cannot be negative' }
    }

    const updated = cloneIssue(existing)
    const line = updated.lines.find(item => item.line_id === lineId)
    if (!line) return { success: false, error: 'Line not found' }

    if (line.tracking_type !== 'NONE') {
      return { success: false, error: 'Line is not quantity-tracked' }
    }

    if (quantity > line.planned_qty) {
      return { success: false, error: 'Quantity exceeds planned amount' }
    }

    line.picked_qty = quantity

    setIssues(prev => sortIssues(prev.map(issue => (issue.issue_no === issueNo ? updated : issue))))

    return { success: true }
  }

  const value = useMemo<GoodsIssueContextValue>(
    () => ({
      issues,
      getIssue,
      createDraft,
      updateDraft,
      transitionStatus,
      addSerial,
      removeSerial,
      upsertLotAllocation,
      removeLotAllocation,
      setLinePickedQuantity
    }),
    [issues]
  )

  return <GoodsIssueContext.Provider value={value}>{children}</GoodsIssueContext.Provider>
}

export const useGoodsIssues = () => {
  const context = useContext(GoodsIssueContext)
  if (!context) {
    throw new Error('useGoodsIssues must be used within a GoodsIssueProvider')
  }
  return context
}
