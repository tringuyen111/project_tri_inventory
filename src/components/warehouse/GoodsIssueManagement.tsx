import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'

import { mockGoodsIssues } from '../../data/mockGoodsIssueData'
import { GoodsIssue } from '../../types/goodsIssue'
import { GOODS_ISSUE_STORAGE_KEY, loadStoredGoodsIssues } from '../../utils/goodsIssueStorage'
import { useLanguage } from '../../contexts/LanguageContext'

const statusColors: Record<GoodsIssue['status'], string> = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Picking: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  AdjustmentRequested:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Approved:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const translations = {
  en: {
    title: 'Goods Issue Management',
    description: 'Review and manage goods issues, monitor picking progress, and track fulfillment accuracy.',
    create: 'Create Goods Issue',
    searchPlaceholder: 'Search GI number, partner or warehouse...',
    statusFilter: 'Status',
    typeFilter: 'Type',
    expectedDateFilter: 'Expected Date',
    startDate: 'Start Date',
    endDate: 'End Date',
    clearFilters: 'Clear Filters',
    issueNo: 'GI Number',
    issueType: 'Type',
    partner: 'Partner / Destination',
    fromWarehouse: 'From Warehouse',
    toWarehouse: 'To Warehouse',
    expectedDate: 'Expected Date',
    status: 'Status',
    totalPlanned: 'Total Planned',
    totalPicked: 'Total Picked',
    totalDiff: 'Difference',
    createdAt: 'Created At',
    createdBy: 'Created By',
    summaryTotals: (planned: number, picked: number, diff: number) =>
      `Planned: ${planned.toLocaleString()} • Picked: ${picked.toLocaleString()} • Diff: ${diff.toLocaleString()}`,
    noResults: 'No goods issues found'
  },
  vn: {
    title: 'Quản Lý Phiếu Xuất Kho',
    description: 'Theo dõi phiếu xuất kho, tình trạng soạn hàng và độ chính xác thực hiện.',
    create: 'Tạo Phiếu Xuất Kho',
    searchPlaceholder: 'Tìm số phiếu, đối tác hoặc kho...',
    statusFilter: 'Trạng thái',
    typeFilter: 'Loại',
    expectedDateFilter: 'Ngày dự kiến',
    startDate: 'Từ ngày',
    endDate: 'Đến ngày',
    clearFilters: 'Xóa lọc',
    issueNo: 'Số phiếu',
    issueType: 'Loại',
    partner: 'Đối tác / Điểm đến',
    fromWarehouse: 'Kho xuất',
    toWarehouse: 'Kho nhận',
    expectedDate: 'Ngày dự kiến',
    status: 'Trạng thái',
    totalPlanned: 'Tổng kế hoạch',
    totalPicked: 'Tổng đã soạn',
    totalDiff: 'Chênh lệch',
    createdAt: 'Ngày tạo',
    createdBy: 'Người tạo',
    summaryTotals: (planned: number, picked: number, diff: number) =>
      `Kế hoạch: ${planned.toLocaleString()} • Đã soạn: ${picked.toLocaleString()} • Chênh: ${diff.toLocaleString()}`,
    noResults: 'Không có phiếu xuất kho'
  }
}

const formatDate = (dateString: string, withTime = false) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return withTime
    ? date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })
}

const calculateTotals = (issue: GoodsIssue) => {
  return issue.lines.reduce(
    (acc, line) => {
      acc.planned += line.planned_qty
      acc.picked += line.picked_qty
      return acc
    },
    { planned: 0, picked: 0 }
  )
}

const mergeGoodsIssues = (...lists: GoodsIssue[][]) => {
  const seen = new Set<string>()
  const merged: GoodsIssue[] = []

  lists.forEach(list => {
    list.forEach(issue => {
      if (!seen.has(issue.issue_no)) {
        merged.push(issue)
        seen.add(issue.issue_no)
      }
    })
  })

  return merged
}

export function GoodsIssueManagement() {
  const { language } = useLanguage()
  const [issues, setIssues] = useState<GoodsIssue[]>(() =>
    mergeGoodsIssues(loadStoredGoodsIssues(), mockGoodsIssues)
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent<GoodsIssue>
      const detail = customEvent.detail
      if (!detail) {
        return
      }

      setIssues(prev => mergeGoodsIssues([detail], prev))
    }

    window.addEventListener('goods-issue-created', listener)
    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== GOODS_ISSUE_STORAGE_KEY) {
        return
      }

      setIssues(mergeGoodsIssues(loadStoredGoodsIssues(), mockGoodsIssues))
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('goods-issue-created', listener)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])


  const selectedLanguage: keyof typeof translations = language in translations ? language : 'en'
  const t = translations[selectedLanguage]

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(issues.map(issue => issue.status))),
    [issues]
  )
  const uniqueTypes = useMemo(
    () => Array.from(new Set(issues.map(issue => issue.issue_type))),
    [issues]
  )

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const search = searchTerm.trim().toLowerCase()

      const matchesSearch =
        !search ||
        issue.issue_no.toLowerCase().includes(search) ||
        issue.partner_name?.toLowerCase().includes(search) ||
        issue.from_wh_name.toLowerCase().includes(search) ||
        issue.to_wh_name?.toLowerCase().includes(search) ||
        issue.created_by.toLowerCase().includes(search)

      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
      const matchesType = typeFilter === 'all' || issue.issue_type === typeFilter

      let matchesDate = true
      if (startDate && endDate) {
        const issueDate = new Date(issue.expected_date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        matchesDate = issueDate >= start && issueDate <= end
      } else if (startDate) {
        const issueDate = new Date(issue.expected_date)
        const start = new Date(startDate)
        matchesDate = issueDate >= start
      } else if (endDate) {
        const issueDate = new Date(issue.expected_date)
        const end = new Date(endDate)
        matchesDate = issueDate <= end
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate
    })
  }, [issues, searchTerm, statusFilter, typeFilter, startDate, endDate])

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setTypeFilter('all')
    setStartDate('')
    setEndDate('')
  }

  const handleCreateGoodsIssue = () => {
    window.location.hash = '#warehouse/goods-issue/create'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">{t.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{t.description}</p>
            </div>
            <Button onClick={handleCreateGoodsIssue}>
              <Plus className="mr-2 h-4 w-4" />
              {t.create}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-center gap-2 lg:w-72">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder={t.searchPlaceholder}
              />
            </div>
            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
              <div className="flex items-center gap-2">
                <Filter className="hidden h-4 w-4 text-muted-foreground lg:block" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={t.statusFilter}>
                      {statusFilter === 'all' ? t.statusFilter : statusFilter}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.statusFilter}</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder={t.typeFilter}>
                    {typeFilter === 'all' ? t.typeFilter : typeFilter}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.typeFilter}</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{t.startDate}</span>
                  <Input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground">{t.endDate}</span>
                  <Input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} />
                </div>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                {t.clearFilters}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">{t.issueNo}</TableHead>
                  <TableHead>{t.issueType}</TableHead>
                  <TableHead className="min-w-[180px]">{t.partner}</TableHead>
                  <TableHead className="min-w-[160px]">{t.fromWarehouse}</TableHead>
                  <TableHead className="min-w-[160px]">{t.toWarehouse}</TableHead>
                  <TableHead>{t.expectedDate}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="text-right">{t.totalPlanned}</TableHead>
                  <TableHead className="text-right">{t.totalPicked}</TableHead>
                  <TableHead className="text-right">{t.totalDiff}</TableHead>
                  <TableHead>{t.createdAt}</TableHead>
                  <TableHead>{t.createdBy}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="py-8 text-center text-muted-foreground">
                      {t.noResults}
                    </TableCell>
                  </TableRow>
                )}

                {filteredIssues.map(issue => {
                  const totals = calculateTotals(issue)
                  const difference = totals.picked - totals.planned

                  return (
                    <TableRow key={issue.issue_no}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{issue.issue_no}</span>
                          <span className="text-xs text-muted-foreground">
                            {t.summaryTotals(totals.planned, totals.picked, difference)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{issue.issue_type}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{issue.partner_name || '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{issue.from_wh_name}</TableCell>
                      <TableCell>{issue.to_wh_name || '—'}</TableCell>
                      <TableCell>{formatDate(issue.expected_date)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[issue.status]}>{issue.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{totals.planned.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{totals.picked.toLocaleString()}</TableCell>
                      <TableCell className={`text-right ${difference !== 0 ? 'text-red-500 dark:text-red-400' : ''}`}>
                        {difference.toLocaleString()}
                      </TableCell>
                      <TableCell>{formatDate(issue.created_at, true)}</TableCell>
                      <TableCell>{issue.created_by}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
