import { useState, useEffect, useMemo } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Organization, OrganizationFormData } from '../../types/organization'
import { OrganizationForm } from './OrganizationForm'
import { useLanguage } from '../../contexts/LanguageContext'
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../../data/mockOrganizationData'
import { toast } from 'sonner@2.0.3'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Building2, Users, CheckCircle, XCircle } from 'lucide-react'

const translations = {
  en: {
    title: 'Organization Management',
    description: 'Manage organizations, their basic information and status',
    createNew: 'Create New Organization',
    search: 'Search organizations...',
    allStatuses: 'All Statuses',
    active: 'Active',
    inactive: 'Inactive',
    organizationCode: 'Code',
    organizationName: 'Name',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    deleteTitle: 'Delete Organization',
    deleteDescription: 'Are you sure you want to delete this organization? This action cannot be undone.',
    cancel: 'Cancel',
    deleteConfirm: 'Delete',
    totalOrganizations: 'Total Organizations',
    activeOrganizations: 'Active Organizations',
    noResults: 'No organizations found.',
    noResultsDescription: 'Try adjusting your search or filter criteria.',
    createSuccess: 'Organization created successfully',
    updateSuccess: 'Organization updated successfully',
    deleteSuccess: 'Organization deleted successfully',
    createError: 'Failed to create organization',
    updateError: 'Failed to update organization',
    deleteError: 'Failed to delete organization',
    loading: 'Loading...'
  },
  vn: {
    title: 'Quản Lý Tổ Chức',
    description: 'Quản lý tổ chức, thông tin cơ bản và trạng thái',
    createNew: 'Tạo Tổ Chức Mới',
    search: 'Tìm kiếm tổ chức...',
    allStatuses: 'Tất Cả Trạng Thái',
    active: 'Hoạt Động',
    inactive: 'Không Hoạt Động',
    organizationCode: 'Mã',
    organizationName: 'Tên',
    status: 'Trạng Thái',
    actions: 'Thao Tác',
    edit: 'Chỉnh Sửa',
    delete: 'Xóa',
    deleteTitle: 'Xóa Tổ Chức',
    deleteDescription: 'Bạn có chắc chắn muốn xóa tổ chức này? Hành động này không thể hoàn tác.',
    cancel: 'Hủy',
    deleteConfirm: 'Xóa',
    totalOrganizations: 'Tổng Số Tổ Chức',
    activeOrganizations: 'Tổ Chức Hoạt Động',
    noResults: 'Không tìm thấy tổ chức.',
    noResultsDescription: 'Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc.',
    createSuccess: 'Tạo tổ chức thành công',
    updateSuccess: 'Cập nhật tổ chức thành công',
    deleteSuccess: 'Xóa tổ chức thành công',
    createError: 'Không thể tạo tổ chức',
    updateError: 'Không thể cập nhật tổ chức',
    deleteError: 'Không thể xóa tổ chức',
    loading: 'Đang tải...'
  }
}

export function OrganizationManagement() {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null)

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      const data = await getOrganizations()
      setOrganizations(data)
    } catch (error) {
      console.error('Failed to load organizations:', error)
      toast.error(t.loading)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = org.organization_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (org.address?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                           (org.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      
      const matchesStatus = statusFilter === 'all' || org.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [organizations, searchTerm, statusFilter])

  const statistics = useMemo(() => {
    const total = organizations.length
    const active = organizations.filter(org => org.status === 'Active').length
    return { total, active }
  }, [organizations])

  const handleCreateNew = () => {
    setSelectedOrganization(undefined)
    setFormMode('create')
    setFormOpen(true)
  }

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization)
    setFormMode('edit')
    setFormOpen(true)
  }

  const handleDelete = (organization: Organization) => {
    setOrganizationToDelete(organization)
    setDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: OrganizationFormData) => {
    try {
      if (formMode === 'create') {
        await createOrganization(data)
        toast.success(t.createSuccess)
      } else if (selectedOrganization) {
        const { organization_code, ...updateData } = data
        await updateOrganization(selectedOrganization.id, updateData)
        toast.success(t.updateSuccess)
      }
      
      setFormOpen(false)
      await loadOrganizations()
    } catch (error) {
      console.error('Form submission error:', error)
      const errorMessage = formMode === 'create' ? t.createError : t.updateError
      
      if (error instanceof Error) {
        toast.error(`${errorMessage}: ${error.message}`)
      } else {
        toast.error(errorMessage)
      }
      throw error
    }
  }

  const confirmDelete = async () => {
    if (!organizationToDelete) return

    try {
      await deleteOrganization(organizationToDelete.id)
      toast.success(t.deleteSuccess)
      setDeleteDialogOpen(false)
      setOrganizationToDelete(null)
      await loadOrganizations()
    } catch (error) {
      console.error('Delete error:', error)
      if (error instanceof Error) {
        toast.error(`${t.deleteError}: ${error.message}`)
      } else {
        toast.error(t.deleteError)
      }
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">{t.loading}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t.createNew}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalOrganizations}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeOrganizations}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatuses}</SelectItem>
                <SelectItem value="Active">{t.active}</SelectItem>
                <SelectItem value="Inactive">{t.inactive}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.organizationCode}</TableHead>
                <TableHead>{t.organizationName}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Building2 className="mx-auto h-8 w-8 mb-2" />
                      <p>{t.noResults}</p>
                      <p className="text-sm">{t.noResultsDescription}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrganizations.map((organization) => (
                  <TableRow key={organization.id}>
                    <TableCell className="font-mono">{organization.organization_code}</TableCell>
                    <TableCell>
                      <div>
                        <div>{organization.organization_name}</div>
                        {organization.address && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {organization.address}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={organization.status === 'Active' ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        {organization.status === 'Active' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {organization.status === 'Active' ? t.active : t.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(organization)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(organization)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <OrganizationForm
        open={formOpen}
        onOpenChange={setFormOpen}
        organization={selectedOrganization}
        onSubmit={handleFormSubmit}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t.deleteConfirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}