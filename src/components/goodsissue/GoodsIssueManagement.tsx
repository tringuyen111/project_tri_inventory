import { useMemo, useRef, useState } from 'react'
import { Plus, Upload, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../contexts/LanguageContext'
import { logGoodsIssueAudit, mockGoodsIssues, resolveIssueHeaderData } from '../../data/mockGoodsIssueData'
import { GoodsIssue } from '../../types/goodsIssue'

const translations = {
  en: {
    title: 'Goods Issue Management',
    description: 'Review and control outbound inventory flows',
    create: 'Create Issue',
    import: 'Import',
    export: 'Export',
    issueNo: 'Issue No',
    type: 'Type',
    partner: 'Partner / Destination',
    source: 'Source Warehouse',
    plannedDate: 'Planned Date',
    status: 'Status',
    remark: 'Remark',
    noIssues: 'No goods issues found',
    SO: 'Sales Order',
    Transfer: 'Transfer',
    Return: 'Return',
    Consumption: 'Consumption',
    Draft: 'Draft',
    Picking: 'Picking',
    Submitted: 'Submitted',
    Completed: 'Completed',
    Cancelled: 'Cancelled'
  },
  vn: {
    title: 'Quản Lý Phiếu Xuất Kho',
    description: 'Theo dõi và kiểm soát hàng xuất kho',
    create: 'Tạo Phiếu Xuất',
    import: 'Nhập File',
    export: 'Xuất File',
    issueNo: 'Số Phiếu',
    type: 'Loại',
    partner: 'Đối Tác / Nơi Nhận',
    source: 'Kho Xuất',
    plannedDate: 'Ngày Dự Kiến',
    status: 'Trạng Thái',
    remark: 'Ghi Chú',
    noIssues: 'Không có phiếu xuất kho',
    SO: 'Đơn Bán Hàng',
    Transfer: 'Chuyển Kho',
    Return: 'Trả Hàng',
    Consumption: 'Tiêu Dùng Nội Bộ',
    Draft: 'Nháp',
    Picking: 'Đang Lấy Hàng',
    Submitted: 'Đã Gửi',
    Completed: 'Hoàn Thành',
    Cancelled: 'Đã Hủy'
  }
}

const statusColors: Record<GoodsIssue['status'], string> = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Picking: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export function GoodsIssueManagement() {
  const { language } = useLanguage()
  const t = translations[language]
  const [issues] = useState<GoodsIssue[]>(() =>
    mockGoodsIssues.map(resolveIssueHeaderData)
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formattedIssues = useMemo(() => issues, [issues])

  const handleCreate = () => {
    window.location.hash = '#warehouse/goods-issue/create'
  }

  const handleExport = () => {
    logGoodsIssueAudit('exported', 'bulk', 'Goods issue export initiated', {
      total_records: formattedIssues.length
    })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    logGoodsIssueAudit('imported', 'bulk', 'Goods issue import placeholder triggered', {
      file_name: file.name,
      file_size: file.size
    })

    event.target.value = ''
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>{t.title}</CardTitle>
            <p className="text-muted-foreground text-sm">{t.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleImport}
            />
            <Button variant="outline" onClick={handleImportClick} className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              {t.import}
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t.export}
            </Button>
            <Button onClick={handleCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t.create}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.issueNo}</TableHead>
                <TableHead>{t.type}</TableHead>
                <TableHead>{t.partner}</TableHead>
                <TableHead>{t.source}</TableHead>
                <TableHead>{t.plannedDate}</TableHead>
                <TableHead>{t.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedIssues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    {t.noIssues}
                  </TableCell>
                </TableRow>
              ) : (
                formattedIssues.map(issue => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.issue_no}</TableCell>
                    <TableCell>{t[issue.issue_type]}</TableCell>
                    <TableCell>
                      {issue.partner_name || issue.to_wh_name || '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{issue.from_wh_name}</span>
                        <span className="text-xs text-muted-foreground">{issue.from_wh_code}</span>
                      </div>
                    </TableCell>
                    <TableCell>{issue.planned_date}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[issue.status]}>{t[issue.status]}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
