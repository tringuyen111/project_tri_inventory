import { useState } from 'react'
import { AlertTriangle, XCircle, RotateCcw, Save } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../contexts/LanguageContext'
import { GoodsReceipt } from '../../types/goodsReceipt'
import { toast } from 'sonner@2.0.3'

const translations = {
  en: {
    specialActions: 'Special Actions',
    cancel: 'Cancel Receipt',
    reverse: 'Reverse Receipt',
    partialWarning: 'Partial Receipt Warning',
    overWarning: 'Over Receipt Warning',
    cancelDialog: 'Cancel Receipt',
    reverseDialog: 'Reverse Receipt',
    cancelConfirm: 'Are you sure you want to cancel this receipt?',
    reverseConfirm: 'Are you sure you want to reverse this completed receipt?',
    cancelDescription: 'This will set the receipt status to Cancelled. This action cannot be undone.',
    reverseDescription: 'This will create a reverse goods issue to adjust inventory. The original receipt will remain as reference.',
    reason: 'Reason (Required)',
    reasonPlaceholder: 'Enter reason for cancellation/reversal...',
    cancelButton: 'Cancel Receipt',
    reverseButton: 'Create Reverse GI',
    close: 'Close',
    confirmAction: 'Confirm',
    cancelSuccess: 'Receipt cancelled successfully',
    reverseSuccess: 'Reverse goods issue created successfully',
    reasonRequired: 'Reason is required',
    // Status restrictions
    cannotCancel: 'Cannot cancel - receipt is already completed',
    cannotReverse: 'Cannot reverse - only completed receipts can be reversed',
    draftCancel: 'Draft receipts can be cancelled without creating adjustments',
    // Warnings
    partialReceiptWarning: 'This receipt has partial quantities (received less than planned)',
    overReceiptWarning: 'This receipt has over quantities (received more than planned)',
    splitLineWarning: 'This receipt contains split lines (multiple entries for same model)',
    
    // Messages for different scenarios
    partialReceiptInfo: 'Partial receipts are allowed and will only post actual received quantities to inventory.',
    overReceiptInfo: 'Over receipts are allowed but require verification of additional quantities.',
    splitLineInfo: 'Split lines allow receiving the same model in multiple lots, bins, or entries.'
  },
  vn: {
    specialActions: 'Hành Động Đặc Biệt',
    cancel: 'Hủy Phiếu',
    reverse: 'Đảo Ngược Phiếu',
    partialWarning: 'Cảnh Báo Nhận Thiếu',
    overWarning: 'Cảnh Báo Nhận Thừa',
    cancelDialog: 'Hủy Phiếu',
    reverseDialog: 'Đảo Ngược Phiếu',
    cancelConfirm: 'Bạn có chắc chắn muốn hủy phiếu này?',
    reverseConfirm: 'Bạn có chắc chắn muốn đảo ngược phiếu đã hoàn thành này?',
    cancelDescription: 'Điều này sẽ đặt trạng thái phiếu thành Đã Hủy. Hành động này không thể hoàn tác.',
    reverseDescription: 'Điều này sẽ tạo phiếu xuất đảo ngược để điều chỉnh tồn kho. Phiếu gốc sẽ được giữ làm tham chiếu.',
    reason: 'Lý Do (Bắt Buộc)',
    reasonPlaceholder: 'Nhập lý do hủy/đảo ngược...',
    cancelButton: 'Hủy Phiếu',
    reverseButton: 'Tạo Phiếu Xuất Đảo Ngược',
    close: 'Đóng',
    confirmAction: 'Xác Nhận',
    cancelSuccess: 'Hủy phiếu thành công',
    reverseSuccess: 'Tạo phiếu xuất đảo ngược thành công',
    reasonRequired: 'Lý do là bắt buộc',
    // Status restrictions
    cannotCancel: 'Không thể hủy - phiếu đã hoàn thành',
    cannotReverse: 'Không thể đảo ngược - chỉ phiếu đã hoàn thành mới có thể đảo ngược',
    draftCancel: 'Phiếu nháp có thể hủy mà không cần tạo điều chỉnh',
    // Warnings
    partialReceiptWarning: 'Phiếu này có số lượng thiếu (nhận ít hơn dự kiến)',
    overReceiptWarning: 'Phiếu này có số lượng thừa (nhận nhiều hơn dự kiến)',
    splitLineWarning: 'Phiếu này chứa dòng phân tách (nhiều bút toán cho cùng model)',
    
    // Messages for different scenarios
    partialReceiptInfo: 'Phiếu nhận thiếu được cho phép và chỉ ghi nhận số lượng thực tế vào tồn kho.',
    overReceiptInfo: 'Phiếu nhận thừa được cho phép nhưng cần xác minh số lượng bổ sung.',
    splitLineInfo: 'Dòng phân tách cho phép nhận cùng model trong nhiều lô, vị trí, hoặc bút toán khác nhau.'
  }
}

interface GoodsReceiptSpecialActionsProps {
  receipt: GoodsReceipt
  onReceiptUpdate: (updatedReceipt: GoodsReceipt) => void
}

export function GoodsReceiptSpecialActions({ receipt, onReceiptUpdate }: GoodsReceiptSpecialActionsProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showReverseDialog, setShowReverseDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [reverseReason, setReverseReason] = useState('')

  // Calculate receipt characteristics
  const totalPlanned = receipt.lines.reduce((sum, line) => sum + line.qty_planned, 0)
  const totalReceived = receipt.lines.reduce((sum, line) => sum + (line.qty_received || 0), 0)
  const isPartialReceipt = totalReceived < totalPlanned
  const isOverReceipt = totalReceived > totalPlanned
  
  // Check for split lines (same model appearing multiple times)
  const modelCounts = receipt.lines.reduce((acc, line) => {
    acc[line.model_id] = (acc[line.model_id] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const hasSplitLines = Object.values(modelCounts).some(count => count > 1)

  const canCancel = ['Draft', 'Receiving', 'Submitted'].includes(receipt.status)
  const canReverse = receipt.status === 'Completed'

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error(t.reasonRequired)
      return
    }

    const updatedReceipt = {
      ...receipt,
      status: 'Cancelled' as const,
      cancelled_at: new Date().toISOString(),
      cancelled_by: 'current_user',
      cancelled_reason: cancelReason
    }
    
    onReceiptUpdate(updatedReceipt)
    setShowCancelDialog(false)
    setCancelReason('')
    toast.success(t.cancelSuccess)
  }

  const handleReverse = () => {
    if (!reverseReason.trim()) {
      toast.error(t.reasonRequired)
      return
    }

    // In a real system, this would create a reverse goods issue document
    // For demonstration, we'll just show success
    setShowReverseDialog(false)
    setReverseReason('')
    toast.success(t.reverseSuccess)
  }

  return (
    <div className="space-y-4">
      {/* Warning badges for special cases */}
      <div className="flex flex-wrap gap-2">
        {isPartialReceipt && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {t.partialWarning}
          </Badge>
        )}
        {isOverReceipt && (
          <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {t.overWarning}
          </Badge>
        )}
        {hasSplitLines && (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
            Split Lines
          </Badge>
        )}
      </div>

      {/* Information alerts */}
      {isPartialReceipt && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {t.partialReceiptInfo}
          </AlertDescription>
        </Alert>
      )}

      {isOverReceipt && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {t.overReceiptInfo}
          </AlertDescription>
        </Alert>
      )}

      {hasSplitLines && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTriangle className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {t.splitLineInfo}
          </AlertDescription>
        </Alert>
      )}

      {/* Action buttons */}
      <div className="flex space-x-4">
        {/* Cancel Button */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              disabled={!canCancel}
              className={canCancel ? "border-red-200 text-red-600 hover:bg-red-50" : ""}
            >
              <XCircle className="w-4 h-4 mr-2" />
              {t.cancel}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.cancelDialog}</DialogTitle>
              <DialogDescription>
                {t.cancelConfirm}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  {receipt.status === 'Draft' ? t.draftCancel : t.cancelDescription}
                </AlertDescription>
              </Alert>
              <div>
                <Label htmlFor="cancelReason">{t.reason}</Label>
                <Textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder={t.reasonPlaceholder}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  {t.close}
                </Button>
                <Button variant="destructive" onClick={handleCancel}>
                  {t.cancelButton}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reverse Button */}
        <Dialog open={showReverseDialog} onOpenChange={setShowReverseDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              disabled={!canReverse}
              className={canReverse ? "border-orange-200 text-orange-600 hover:bg-orange-50" : ""}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.reverse}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.reverseDialog}</DialogTitle>
              <DialogDescription>
                {t.reverseConfirm}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  {t.reverseDescription}
                </AlertDescription>
              </Alert>
              <div>
                <Label htmlFor="reverseReason">{t.reason}</Label>
                <Textarea
                  id="reverseReason"
                  value={reverseReason}
                  onChange={(e) => setReverseReason(e.target.value)}
                  placeholder={t.reasonPlaceholder}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReverseDialog(false)}>
                  {t.close}
                </Button>
                <Button onClick={handleReverse} className="bg-orange-600 hover:bg-orange-700">
                  {t.reverseButton}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Restriction messages */}
      {!canCancel && receipt.status === 'Completed' && (
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            {t.cannotCancel}
          </AlertDescription>
        </Alert>
      )}

      {!canReverse && receipt.status !== 'Completed' && (
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            {t.cannotReverse}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}