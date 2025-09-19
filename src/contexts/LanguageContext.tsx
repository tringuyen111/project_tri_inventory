import React, { createContext, useContext, useState } from 'react'

type Language = 'en' | 'vi'

interface LanguageContextType {
  language: Language
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string>) => string
}

const DEFAULT_LANGUAGE: Language = 'en'

const normalizeLanguage = (value: string | null): Language => {
  if (value === 'vi' || value === 'en') {
    return value
  }
  if (value === 'vn') {
    return 'vi'
  }
  return DEFAULT_LANGUAGE
}

const translations = {
  en: {
    // Navigation
    'nav.dashboards': 'Dashboards',
    'nav.warehouseOperations': 'Warehouse Operations',
    'nav.stockOnhand': 'Stock Onhand',
    'nav.lot': 'Lot/Batch',
    'nav.inventory': 'Inventory',
    'nav.goodsReceipt': 'Goods Receipt',
    'nav.goodsIssue': 'Goods Issue',
    'nav.goodsTransfer': 'Goods Transfer',
    'nav.putaway': 'Putaway',
    'nav.assetManagement': 'Asset Management',
    'nav.assetType': 'Asset Type',
    'nav.modelAsset': 'Model Asset (Serial/Lot/None)',
    'nav.assetList': 'Asset List (Serial instances / Lots)',
    'nav.masterData': 'Master Data (Catalog)',
    'nav.organization': 'Organization',
    'nav.branch': 'Branch',
    'nav.warehouse': 'Warehouse',
    'nav.location': 'Location (Area & Position/Bin/Slot)',
    'nav.uom': 'UoM - Unit of Measure',
    'nav.partner': 'Partner (Customer/Supplier)',
    'nav.reports': 'Reports',
    'nav.inventoryReport': 'Import/Export/Stock Report',
    'nav.stockByWarehouse': 'Stock by Warehouse/Branch Report',
    'nav.assetReport': 'Report by Asset Type / Model',
    'nav.admin': 'Admin',
    'nav.authentication': 'Authentication / Users & Roles',
    'nav.systemConfig': 'System Config',
    
    // Common
    'common.warehouseManagement': 'Warehouse Management System',
    'common.profile': 'Profile',
    'common.settings': 'Settings',
    'common.logout': 'Logout',
    'common.lightMode': 'Light Mode',
    'common.darkMode': 'Dark Mode',
    'common.language': 'Language',
    'common.english': 'English',
    'common.vietnamese': 'Vietnamese',
    'common.code': 'Code',
    'common.name': 'Name',
    'common.nameVi': 'Name (Vietnamese)',
    'common.organization': 'Organization',
    'common.branch': 'Branch',
    'common.address': 'Address',
    'common.addressVi': 'Address (Vietnamese)',
    'common.description': 'Description',
    'common.descriptionVi': 'Description (Vietnamese)',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.activate': 'Activate',
    'common.deactivate': 'Deactivate',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.search': 'Search',
    'common.noSearchResults': 'No results found',
    'common.basicInformation': 'Basic Information',
    'common.selectOrganization': 'Select Organization',
    'common.selectBranch': 'Select Branch',
    'common.selectOrganizationFirst': 'Select Organization First',
    'common.searchOrganization': 'Search Organization...',
    'common.searchBranch': 'Search Branch...',
    'common.noOrganizationFound': 'Không tìm thấy tổ chức',
    'common.noBranchFound': 'Không tìm thấy chi nhánh',
    'common.searchAndFilter': 'Tìm kiếm & Lọc',
    'common.clearFilters': 'Xóa bộ lọc',
    'common.allOrganizations': 'Tất cả tổ chức',
    'common.allBranches': 'Tất cả chi nhánh',
    'common.allStatuses': 'Tất cả trạng thái',
    'common.filteredResults': 'Đã lọc',

    // Warehouse
    'warehouse.create': 'Create Warehouse',
    'warehouse.edit': 'Edit Warehouse',
    'warehouse.createDescription': 'Create a new warehouse to manage inventory locations',
    'warehouse.editDescription': 'Edit warehouse information and settings',
    'warehouse.description': 'Manage warehouse locations and their configurations',
    'warehouse.list': 'Warehouse List',
    'warehouse.empty': 'No warehouses found',
    'warehouse.namePlaceholder': 'Enter warehouse name',
    'warehouse.addressPlaceholder': 'Enter warehouse address',
    'warehouse.searchPlaceholder': 'Search by code, name, organization, or branch...',
    'warehouse.activeCount': 'Active',
    'warehouse.totalCount': 'Total',
    'warehouse.createSuccess': 'Warehouse created successfully',
    'warehouse.updateSuccess': 'Warehouse updated successfully',
    'warehouse.deleteSuccess': 'Warehouse deleted successfully',
    'warehouse.activateSuccess': 'Warehouse activated successfully',
    'warehouse.deactivateSuccess': 'Warehouse deactivated successfully',
    'warehouse.cannotDeactivate.hasInventory': 'Cannot deactivate warehouse that has inventory or open documents',
    'warehouse.cannotDelete.isActive': 'Cannot delete active warehouse. Please deactivate it first.',
    'warehouse.deleteConfirm.title': 'Delete Warehouse',
    'warehouse.deleteConfirm.description': 'Are you sure you want to delete warehouse "{name}"? This action cannot be undone.',

    // Validation
    'validation.required.code': 'Code is required',
    'validation.required.name': 'Name is required',
    'validation.required.organization': 'Organization is required',
    'validation.required.branch': 'Branch is required',
    'validation.pattern.warehouse.code': 'Mã phải có định dạng WH_XXX (ví dụ: WH_001)',
    'validation.pattern.whCode': 'Mã phải có định dạng WH_XXX (ví dụ: WH_001)',
    'validation.unique.codeInBranch': 'Mã đã tồn tại trong chi nhánh này',
    
    // Additional warehouse translations
    'warehouse.codeHint': 'Code format: WH_XXX (e.g., WH_001)',

    // Common search/select
    'common.searchOrganizations': 'Search organizations...',
    'common.searchBranches': 'Search branches...',
    'common.noResults': 'No results found'
  },
  vi: {
    // Navigation
    'nav.dashboards': 'Bảng điều khiển',
    'nav.warehouseOperations': 'Vận hành kho',
    'nav.stockOnhand': 'Quản lý tồn kho',
    'nav.lot': 'Lot/Lô hàng',
    'nav.inventory': 'Kiểm kê',
    'nav.goodsReceipt': 'Nhập kho',
    'nav.goodsIssue': 'Xuất kho',
    'nav.goodsTransfer': 'Điều chuyển',
    'nav.putaway': 'Sắp xếp',
    'nav.assetManagement': 'Quản lý tài sản',
    'nav.assetType': 'Loại tài sản',
    'nav.modelAsset': 'Mô hình tài sản (Serial/Lot/None)',
    'nav.assetList': 'Danh sách tài sản (Serial instances / Lots)',
    'nav.masterData': 'Dữ liệu chính (Catalog)',
    'nav.organization': 'Tổ chức',
    'nav.branch': 'Chi nhánh',
    'nav.warehouse': 'Kho hàng',
    'nav.location': 'Khu vực & Vị trí/Bin/Slot',
    'nav.uom': 'Đơn vị tính',
    'nav.partner': 'Đối tác (Khách hàng/NCC)',
    'nav.reports': 'Báo cáo',
    'nav.inventoryReport': 'Báo cáo nhập xuất tồn',
    'nav.stockByWarehouse': 'Báo cáo tồn theo kho/chi nhánh',
    'nav.assetReport': 'Báo cáo theo Asset Type / Model',
    'nav.admin': 'Quản trị',
    'nav.authentication': 'Xác thực / Người dùng & Vai trò',
    'nav.systemConfig': 'Cấu hình hệ thống',
    
    // Common
    'common.warehouseManagement': 'Hệ thống quản lý kho',
    'common.profile': 'Hồ sơ',
    'common.settings': 'Cài đặt',
    'common.logout': 'Đăng xuất',
    'common.lightMode': 'Chế độ sáng',
    'common.darkMode': 'Chế độ tối',
    'common.language': 'Ngôn ngữ',
    'common.english': 'Tiếng Anh',
    'common.vietnamese': 'Tiếng Việt',
    'common.code': 'Mã',
    'common.name': 'Tên',
    'common.nameVi': 'Tên (Tiếng Việt)',
    'common.organization': 'Tổ chức',
    'common.branch': 'Chi nhánh',
    'common.address': 'Địa chỉ',
    'common.addressVi': 'Địa chỉ (Tiếng Việt)',
    'common.description': 'Mô tả',
    'common.descriptionVi': 'Mô tả (Tiếng Việt)',
    'common.status': 'Trạng thái',
    'common.active': 'Hoạt động',
    'common.inactive': 'Không hoạt động',
    'common.activate': 'Kích hoạt',
    'common.deactivate': 'Vô hiệu hóa',
    'common.edit': 'Sửa',
    'common.delete': 'Xóa',
    'common.create': 'Tạo',
    'common.update': 'Cập nhật',
    'common.cancel': 'Hủy',
    'common.save': 'Lưu',
    'common.search': 'Tìm kiếm',
    'common.noSearchResults': 'Không tìm thấy kết quả',
    'common.basicInformation': 'Thông tin cơ bản',
    'common.selectOrganization': 'Chọn tổ chức',
    'common.selectBranch': 'Chọn chi nhánh',
    'common.selectOrganizationFirst': 'Chọn tổ chức trước',
    'common.searchOrganization': 'Tìm kiếm tổ chức...',
    'common.searchBranch': 'Tìm kiếm chi nhánh...',
    'common.noOrganizationFound': 'Không tìm thấy tổ chức',
    'common.noBranchFound': 'Không tìm thấy chi nhánh',
    'common.searchAndFilter': 'Tìm kiếm & Lọc',
    'common.clearFilters': 'Xóa bộ lọc',
    'common.allOrganizations': 'Tất cả tổ chức',
    'common.allBranches': 'Tất cả chi nhánh',
    'common.allStatuses': 'Tất cả trạng thái',
    'common.filteredResults': 'Đã lọc',

    // Warehouse
    'warehouse.create': 'Tạo kho hàng',
    'warehouse.edit': 'Sửa kho hàng',
    'warehouse.createDescription': 'Tạo kho hàng mới để quản lý vị trí lưu trữ hàng hóa',
    'warehouse.editDescription': 'Chỉnh sửa thông tin và cài đặt kho hàng',
    'warehouse.description': 'Quản lý vị trí kho hàng và cấu hình của chúng',
    'warehouse.list': 'Danh sách kho hàng',
    'warehouse.empty': 'Không tìm thấy kho hàng',
    'warehouse.namePlaceholder': 'Nhập tên kho hàng',
    'warehouse.addressPlaceholder': 'Nhập địa chỉ kho hàng',
    'warehouse.searchPlaceholder': 'Tìm kiếm theo mã, tên, tổ chức, hoặc chi nhánh...',
    'warehouse.activeCount': 'Hoạt động',
    'warehouse.totalCount': 'Tổng cộng',
    'warehouse.createSuccess': 'Tạo kho hàng thành công',
    'warehouse.updateSuccess': 'Cập nhật kho hàng thành công',
    'warehouse.deleteSuccess': 'Xóa kho hàng thành công',
    'warehouse.activateSuccess': 'Kích hoạt kho hàng thành công',
    'warehouse.deactivateSuccess': 'Vô hiệu hóa kho hàng thành công',
    'warehouse.cannotDeactivate.hasInventory': 'Không thể vô hiệu hóa kho hàng có tồn kho hoặc chứng từ đang mở',
    'warehouse.cannotDelete.isActive': 'Không thể xóa kho hàng đang hoạt động. Vui lòng vô hiệu hóa trước.',
    'warehouse.deleteConfirm.title': 'Xóa kho hàng',
    'warehouse.deleteConfirm.description': 'Bạn có chắc chắn muốn xóa kho hàng "{name}"? Hành động này không thể hoàn tác.',

    // Validation
    'validation.required.code': 'Mã là bắt buộc',
    'validation.required.name': 'Tên là bắt buộc',
    'validation.required.organization': 'Tổ chức là bắt buộc',
    'validation.required.branch': 'Chi nhánh là bắt buộc',
    'validation.pattern.warehouse.code': 'Mã phải có định dạng WH_XXX (ví dụ: WH_001)',
    'validation.pattern.whCode': 'Mã phải có định dạng WH_XXX (ví dụ: WH_001)',
    'validation.unique.codeInBranch': 'Mã đã tồn tại trong chi nhánh này',
    
    // Additional warehouse translations
    'warehouse.codeHint': 'Định dạng: WH_XXX (ví dụ: WH_001)',

    // Common search/select
    'common.searchOrganizations': 'Tìm kiếm tổ chức...',
    'common.searchBranches': 'Tìm kiếm chi nhánh...',
    'common.noResults': 'Không tìm thấy kết quả'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get saved language from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language')
      return normalizeLanguage(saved)
    }
    return DEFAULT_LANGUAGE
  })

  const t = (key: string, params?: Record<string, string>): string => {
    const languageTranslations = translations[language] || translations.en
    let translation =
      languageTranslations[key as keyof typeof translations['en']] || key
    
    // Replace parameters in the translation string
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey])
      })
    }
    
    return translation
  }

  // Save language to localStorage when it changes
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, currentLanguage: language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}