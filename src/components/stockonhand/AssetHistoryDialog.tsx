import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useLanguage } from '../../contexts/LanguageContext'
import { Asset } from '../../types/asset'
import { getAssetHistory } from '../../data/mockAssetData'
import { Calendar, Clock, User } from 'lucide-react'

interface AssetHistoryDialogProps {
  asset?: Asset
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssetHistoryDialog({ 
  asset, 
  open, 
  onOpenChange
}: AssetHistoryDialogProps) {
  const { language } = useLanguage()

  const translations = {
    en: {
      title: 'Asset History',
      description: 'View the complete history of changes for this asset',
      action: 'Action',
      oldValue: 'Old Value',
      newValue: 'New Value',
      timestamp: 'Date & Time',
      user: 'User',
      noHistory: 'No history records found',
      created: 'Created',
      statusChanged: 'Status Changed',
      locationChanged: 'Location Changed',
      warehouseChanged: 'Warehouse Changed',
      partnerAssigned: 'Partner Assigned',
      system: 'System'
    },
    vn: {
      title: 'Lịch sử Asset',
      description: 'Xem lịch sử thay đổi đầy đủ của asset này',
      action: 'Hành động',
      oldValue: 'Giá trị cũ',
      newValue: 'Giá trị mới',
      timestamp: 'Ngày giờ',
      user: 'Người dùng',
      noHistory: 'Không tìm thấy lịch sử',
      created: 'Đã tạo',
      statusChanged: 'Thay đổi trạng thái',
      locationChanged: 'Thay đổi vị trí',
      warehouseChanged: 'Thay đổi kho',
      partnerAssigned: 'Gán đối tác',
      system: 'Hệ thống'
    }
  }

  const t = translations[language]

  const getActionLabel = (action: string) => {
    switch(action) {
      case 'Created': return t.created
      case 'StatusChanged': return t.statusChanged
      case 'LocationChanged': return t.locationChanged
      case 'WarehouseChanged': return t.warehouseChanged
      case 'PartnerAssigned': return t.partnerAssigned
      default: return action
    }
  }

  const getActionVariant = (action: string) => {
    switch(action) {
      case 'Created': return 'default'
      case 'StatusChanged': return 'secondary'
      case 'LocationChanged': return 'outline'
      case 'WarehouseChanged': return 'outline'
      case 'PartnerAssigned': return 'outline'
      default: return 'outline'
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  if (!asset) return null

  const history = getAssetHistory(asset.asset_id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t.title}
          </DialogTitle>
          <DialogDescription>
            {t.description}
            <div className="mt-2 p-2 bg-muted rounded-md">
              <div className="text-sm font-medium">{asset.asset_id} - {asset.serial_number}</div>
              <div className="text-xs text-muted-foreground">{asset.model_name}</div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[400px] overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {t.noHistory}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.action}</TableHead>
                  <TableHead>{t.oldValue}</TableHead>
                  <TableHead>{t.newValue}</TableHead>
                  <TableHead>{t.timestamp}</TableHead>
                  <TableHead>{t.user}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Badge variant={getActionVariant(record.action) as any}>
                        {getActionLabel(record.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.old_value ? (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {record.old_value}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.new_value ? (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {record.new_value}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(record.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        {record.user_id || t.system}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}