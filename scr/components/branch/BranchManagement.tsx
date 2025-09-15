import { useState, useEffect, useMemo } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Branch, BranchFormData } from '../../types/branch'
import { Organization } from '../../types/organization'
import { BranchForm } from './BranchForm'
import { useLanguage } from '../../contexts/LanguageContext'
import { getBranches, createBranch, updateBranch, deleteBranch, getActiveOrganizations } from '../../data/mockBranchData'
import { toast } from 'sonner@2.0.3'
import { Plus, Search, MoreHorizontal, Edit, Trash2, GitBranch, Building2, CheckCircle, XCircle } from 'lucide-react'

const translations = {
  en: {
    title: 'Branch Management',
    description: 'Manage branches under organizations for location-based operations',
    createNew: 'Create New Branch',
    search: 'Search branches...',
    allStatuses: 'All Statuses',
    allOrganizations: 'All Organizations',
    active: 'Active',
    inactive: 'Inactive',
    branchCode: 'Code',
    branchName: 'Name',
    organization: 'Organization',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    deleteTitle: 'Delete Branch',
    deleteDescription: 'Are you sure you want to delete this branch? This action cannot be undone.',
    cancel: 'Cancel',
    deleteConfirm: 'Delete',
    totalBranches: 'Total Branches',
    activeBranches: 'Active Branches',
    noResults: 'No branches found.',
    noResultsDescription: 'Try adjusting your search or filter criteria.',
    createSuccess: 'Branch created successfully',
    updateSuccess: 'Branch updated successfully',
    deleteSuccess: 'Branch deleted successfully',
    createError: 'Failed to create branch',
    updateError: 'Failed to update branch',
    deleteError: 'Failed to delete branch',
    loading: 'Loading...'
  },
  vn: {
    title: 'Quản Lý Chi Nhánh',
    description: 'Quản lý chi nhánh thuộc các tổ chức cho hoạt động theo địa điểm',
    createNew: 'Tạo Chi Nhánh Mới',
    search: 'Tìm kiếm chi nhánh...',
    allStatuses: 'Tất Cả Trạng Thái',
    allOrganizations: 'Tất Cả Tổ Chức',
    active: 'Hoạt Động',
    inactive: 'Không Hoạt Động',
    branchCode: 'Mã',
    branchName: 'Tên',
    organization: 'Tổ Chức',
    status: 'Trạng Thái',
    actions: 'Thao Tác',
    edit: 'Chỉnh Sửa',
    delete: 'Xóa',
    deleteTitle: 'Xóa Chi Nhánh',
    deleteDescription: 'Bạn có chắc chắn muốn xóa chi nhánh này? Hành động này không thể hoàn tác.',
    cancel: 'Hủy',
    deleteConfirm: 'Xóa',
    totalBranches: 'Tổng Số Chi Nhánh',
    activeBranches: 'Chi Nhánh Hoạt Động',
    noResults: 'Không tìm thấy chi nhánh.',
    noResultsDescription: 'Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc.',
    createSuccess: 'Tạo chi nhánh thành công',
    updateSuccess: 'Cập nhật chi nhánh thành công',
    deleteSuccess: 'Xóa chi nhánh thành công',
    createError: 'Không thể tạo chi nhánh',
    updateError: 'Không thể cập nhật chi nhánh',
    deleteError: 'Không thể xóa chi nhánh',
    loading: 'Đang tải...'
  }
}

export function BranchManagement() {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [branches, setBranches] = useState<Branch[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [organizationFilter, setOrganizationFilter] = useState<string>('all')
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [branchData, orgData] = await Promise.all([
        getBranches(),
        Promise.resolve(getActiveOrganizations())
      ])
      setBranches(branchData)
      setOrganizations(orgData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error(t.loading)
    } finally {
      setLoading(false)
    }
  }

  const filteredBranches = useMemo(() => {
    return branches.filter(branch => {
      const matchesSearch = branch.branch_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           branch.branch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (branch.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                           (branch.address?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
                           (branch.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      
      const matchesStatus = statusFilter === 'all' || branch.status === statusFilter
      const matchesOrganization = organizationFilter === 'all' || branch.organization_id === organizationFilter
      
      return matchesSearch && matchesStatus && matchesOrganization
    })
  }, [branches, searchTerm, statusFilter, organizationFilter])

  const statistics = useMemo(() => {
    const total = branches.length
    const active = branches.filter(branch => branch.status === 'Active').length
    return { total, active }
  }, [branches])

  const handleCreateNew = () => {
    setSelectedBranch(undefined)
    setFormMode('create')
    setFormOpen(true)
  }

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch)
    setFormMode('edit')
    setFormOpen(true)
  }

  const handleDelete = (branch: Branch) => {
    setBranchToDelete(branch)
    setDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: BranchFormData) => {
    try {
      if (formMode === 'create') {
        await createBranch(data)
        toast.success(t.createSuccess)
      } else if (selectedBranch) {
        const { branch_code, organization_id, ...updateData } = data
        await updateBranch(selectedBranch.id, updateData)
        toast.success(t.updateSuccess)
      }
      
      setFormOpen(false)
      await loadData()
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
    if (!branchToDelete) return

    try {
      await deleteBranch(branchToDelete.id)
      toast.success(t.deleteSuccess)
      setDeleteDialogOpen(false)
      setBranchToDelete(null)
      await loadData()
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
            <CardTitle className="text-sm font-medium">{t.totalBranches}</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.activeBranches}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
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
            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allOrganizations}</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.organization_code} - {org.organization_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <TableHead>{t.branchCode}</TableHead>
                <TableHead>{t.branchName}</TableHead>
                <TableHead>{t.organization}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBranches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <GitBranch className="mx-auto h-8 w-8 mb-2" />
                      <p>{t.noResults}</p>
                      <p className="text-sm">{t.noResultsDescription}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-mono">{branch.branch_code}</TableCell>
                    <TableCell>
                      <div>
                        <div>{branch.branch_name}</div>
                        {branch.address && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {branch.address}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-mono">{organizations.find(org => org.id === branch.organization_id)?.organization_code}</div>
                        <div className="text-muted-foreground">{branch.organization_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={branch.status === 'Active' ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        {branch.status === 'Active' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {branch.status === 'Active' ? t.active : t.inactive}
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
                          <DropdownMenuItem onClick={() => handleEdit(branch)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(branch)}
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
      <BranchForm
        open={formOpen}
        onOpenChange={setFormOpen}
        branch={selectedBranch}
        organizations={organizations}
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