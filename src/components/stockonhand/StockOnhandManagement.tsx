import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { useLanguage } from '../../contexts/LanguageContext'
import { AssetManagement } from './AssetManagement'
import { LotManagement } from '../lot/LotManagement'
import { AssetNoneManagement } from './AssetNoneManagement'
import { Package, Hash, List } from 'lucide-react'

export function StockOnhandManagement() {
  const { language } = useLanguage()

  const translations = {
    en: {
      title: 'Stock On-hand',
      description: 'Manage stock inventory by tracking method',
      serialTab: 'Asset (Serial)',
      lotTab: 'Lot/Batch',
      noneTab: 'None (Bulk)',
      serialDescription: 'Individual asset tracking with unique serial numbers',
      lotDescription: 'Batch/lot tracking for grouped items',
      noneDescription: 'Bulk quantity tracking without individual identification'
    },
    vi: {
      title: 'Tồn kho',
      description: 'Quản lý tồn kho theo phương thức theo dõi',
      serialTab: 'Asset (Serial)',
      lotTab: 'Lot/Batch',
      noneTab: 'Không (Bulk)',
      serialDescription: 'Theo dõi tài sản cá nhân với số serial duy nhất',
      lotDescription: 'Theo dõi theo lô/batch cho các sản phẩm nhóm',
      noneDescription: 'Theo dõi số lượng bulk không cần định danh cá nhân'
    }
  }

  const t = translations[language]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>{t.title}</h1>
        <p className="text-muted-foreground">
          {t.description}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="serial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="serial" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t.serialTab}
          </TabsTrigger>
          <TabsTrigger value="lot" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            {t.lotTab}
          </TabsTrigger>
          <TabsTrigger value="none" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {t.noneTab}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="serial">
          <AssetManagement />
        </TabsContent>

        <TabsContent value="lot">
          <LotManagement />
        </TabsContent>

        <TabsContent value="none">
          <AssetNoneManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}