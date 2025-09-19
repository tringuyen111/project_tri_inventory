import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../contexts/LanguageContext'
import { GoodsReceiptForm } from './GoodsReceiptFormFixed'
import { mockGoodsReceipts } from '../../data/mockGoodsReceiptData'
import { GoodsReceipt } from '../../types/goodsReceipt'
import { toast } from 'sonner'

const translations = {
  en: {
    backToList: 'Back to Goods Receipt List',
    createReceipt: 'Create Goods Receipt',
    editReceipt: 'Edit Goods Receipt',
    viewReceipt: 'View Goods Receipt',
    receiptSaved: 'Receipt saved as draft successfully',
    receiptCreated: 'Receipt created successfully',
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
  },
  vi: {
    backToList: 'Quay Lại Danh Sách Phiếu Nhập',
    createReceipt: 'Tạo Phiếu Nhập Kho',
    editReceipt: 'Sửa Phiếu Nhập Kho',
    viewReceipt: 'Xem Phiếu Nhập Kho',
    receiptSaved: 'Lưu phiếu nháp thành công',
    receiptCreated: 'Tạo phiếu thành công',
    unsavedChanges: 'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi?'
  }
}

interface GoodsReceiptFormWrapperProps {
  mode: 'create' | 'edit' | 'view'
  receiptId?: string
}

export function GoodsReceiptFormWrapper({ mode, receiptId }: GoodsReceiptFormWrapperProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  // Get receipt data for edit/view mode
  const [receipt, setReceipt] = useState<GoodsReceipt | null>(() => {
    if (mode === 'edit') {
      const id = receiptId || localStorage.getItem('editingReceiptId')
      return id ? mockGoodsReceipts.find(r => r.id === id) || null : null
    } else if (mode === 'view') {
      const id = receiptId || localStorage.getItem('viewingReceiptId')
      return id ? mockGoodsReceipts.find(r => r.id === id) || null : null
    }
    return null
  })

  const handleSuccess = (newReceipt: GoodsReceipt) => {
    // Show success message
    const isDraft = newReceipt.status === 'Draft'
    toast.success(isDraft ? t.receiptSaved : t.receiptCreated)
    
    // Clean up localStorage and navigate back to list after a brief delay
    setTimeout(() => {
      localStorage.removeItem('editingReceiptId')
      window.location.hash = '#warehouse/goods-receipt'
    }, 1500)
  }

  const handleCancel = () => {
    // In a real implementation, you might want to check for unsaved changes
    // For now, just navigate back
    if (mode === 'edit') {
      localStorage.removeItem('editingReceiptId')
    } else if (mode === 'view') {
      localStorage.removeItem('viewingReceiptId')
    }
    window.location.hash = '#warehouse/goods-receipt'
  }

  const handleBackToList = () => {
    // In a real implementation, you might want to check for unsaved changes
    if (mode === 'edit') {
      localStorage.removeItem('editingReceiptId')
    } else if (mode === 'view') {
      localStorage.removeItem('viewingReceiptId')
    }
    window.location.hash = '#warehouse/goods-receipt'
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToList}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToList}
        </Button>
        <div>
          <h1>
            {mode === 'create' ? t.createReceipt : 
             mode === 'edit' ? t.editReceipt : 
             t.viewReceipt}
          </h1>
          {receipt?.receipt_no && (
            <p className="text-muted-foreground font-mono">{receipt.receipt_no}</p>
          )}
        </div>
      </div>

      <GoodsReceiptForm
        receipt={receipt}
        viewMode={mode === 'view'}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}