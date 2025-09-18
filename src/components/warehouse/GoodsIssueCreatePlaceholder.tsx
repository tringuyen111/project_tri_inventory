import { ArrowLeft, ClipboardList } from 'lucide-react'

import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useLanguage } from '../../contexts/LanguageContext'

const translations = {
  en: {
    title: 'Create Goods Issue',
    description: 'Define fulfillment details, assign source warehouses, and capture picking quantities.',
    back: 'Back to Goods Issues',
    placeholderTitle: 'Goods issue creation is coming soon',
    placeholderDescription:
      'The creation workflow is being prepared. In the meantime, you can review and manage existing goods issues from the list view.'
  },
  vn: {
    title: 'Tạo Phiếu Xuất Kho',
    description: 'Thiết lập thông tin xuất kho, chọn kho nguồn và ghi nhận số lượng soạn hàng.',
    back: 'Quay lại danh sách phiếu xuất',
    placeholderTitle: 'Chức năng tạo phiếu đang được hoàn thiện',
    placeholderDescription:
      'Chúng tôi đang hoàn thiện quy trình tạo phiếu. Hiện tại bạn có thể xem và quản lý các phiếu xuất kho ở màn hình danh sách.'
  }
}

type SupportedLanguage = keyof typeof translations

export function GoodsIssueCreatePlaceholder() {
  const { language } = useLanguage()
  const selectedLanguage: SupportedLanguage = language in translations ? language as SupportedLanguage : 'en'
  const t = translations[selectedLanguage]

  const handleBack = () => {
    window.location.hash = '#warehouse/goods-issue'
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack} className="inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </Button>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle>{t.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-4 rounded-lg border border-dashed border-muted-foreground/50 p-6">
            <ClipboardList className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">{t.placeholderTitle}</p>
              <p className="text-sm text-muted-foreground">{t.placeholderDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
