import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { PartnerForm } from './PartnerForm';
import { Partner, PartnerFilters } from '../../types/partner';
import { mockPartners } from '../../data/mockPartnerData';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Search, Edit, Building2, Users } from 'lucide-react';

export function PartnerManagement() {
  const { language } = useLanguage();
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | undefined>();
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  const [filters, setFilters] = useState<PartnerFilters>({
    partner_type: undefined,
    status: undefined,
    search: ''
  });

  const texts = {
    en: {
      title: 'Partner Management',
      description: 'Manage suppliers and customers for your warehouse operations',
      addPartner: 'Add Partner',
      searchPlaceholder: 'Search by code or name...',
      allTypes: 'All Types',
      allStatuses: 'All Statuses',
      supplier: 'Supplier',
      customer: 'Customer',
      active: 'Active',
      inactive: 'Inactive',
      partnerCode: 'Partner Code',
      partnerName: 'Partner Name',
      partnerType: 'Type',
      status: 'Status',
      actions: 'Actions',
      edit: 'Edit',
      noPartnersFound: 'No partners found',
      noPartnersDesc: 'No partners match your current filters.',
      totalPartners: 'Total Partners',
      activeSuppliers: 'Active Suppliers',
      activeCustomers: 'Active Customers'
    },
    vn: {
      title: 'Quản Lý Đối Tác',
      description: 'Quản lý nhà cung cấp và khách hàng cho hoạt động kho của bạn',
      addPartner: 'Thêm Đối Tác',
      searchPlaceholder: 'Tìm kiếm theo mã hoặc tên...',
      allTypes: 'Tất Cả Loại',
      allStatuses: 'Tất Cả Trạng Thái',
      supplier: 'Nhà Cung Cấp',
      customer: 'Khách Hàng',
      active: 'Hoạt Động',
      inactive: 'Ngưng Hoạt Động',
      partnerCode: 'Mã Đối Tác',
      partnerName: 'Tên Đối Tác',
      partnerType: 'Loại',
      status: 'Trạng Thái',
      actions: 'Thao Tác',
      edit: 'Sửa',
      noPartnersFound: 'Không tìm thấy đối tác',
      noPartnersDesc: 'Không có đối tác nào phù hợp với bộ lọc hiện tại.',
      totalPartners: 'Tổng Đối Tác',
      activeSuppliers: 'NCC Hoạt Động',
      activeCustomers: 'KH Hoạt Động'
    }
  };

  const t = texts[language] || texts.en;

  // Filter partners based on current filters
  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const matchesType = !filters.partner_type || partner.partner_type === filters.partner_type;
      const matchesStatus = !filters.status || partner.status === filters.status;
      const matchesSearch = !filters.search || 
        partner.partner_code.toLowerCase().includes(filters.search.toLowerCase()) ||
        partner.partner_name.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [partners, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = partners.length;
    const activeSuppliers = partners.filter(p => p.partner_type === 'Supplier' && p.status === 'Active').length;
    const activeCustomers = partners.filter(p => p.partner_type === 'Customer' && p.status === 'Active').length;
    
    return { total, activeSuppliers, activeCustomers };
  }, [partners]);

  const handleCreatePartner = () => {
    setEditingPartner(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleSavePartner = (partnerData: Partner) => {
    if (formMode === 'create') {
      setPartners(prev => [partnerData, ...prev]);
    } else {
      setPartners(prev => prev.map(p => p.id === partnerData.id ? partnerData : p));
    }
  };

  const handleFilterChange = (key: keyof PartnerFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const getStatusBadge = (status: Partner['status']) => {
    return (
      <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
        {status === 'Active' ? t.active : t.inactive}
      </Badge>
    );
  };

  const getTypeBadge = (type: Partner['partner_type']) => {
    return (
      <Badge variant={type === 'Supplier' ? 'outline' : 'secondary'}>
        {type === 'Supplier' ? t.supplier : t.customer}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>{t.title}</h1>
        <p className="text-muted-foreground mt-1">{t.description}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t.totalPartners}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t.activeSuppliers}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeSuppliers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">{t.activeCustomers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeCustomers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t.searchPlaceholder}
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={filters.partner_type || 'all'}
            onValueChange={(value) => handleFilterChange('partner_type', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTypes}</SelectItem>
              <SelectItem value="Supplier">{t.supplier}</SelectItem>
              <SelectItem value="Customer">{t.customer}</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              <SelectItem value="Active">{t.active}</SelectItem>
              <SelectItem value="Inactive">{t.inactive}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleCreatePartner}>
          <Plus className="h-4 w-4 mr-2" />
          {t.addPartner}
        </Button>
      </div>

      {/* Partners Table */}
      <Card>
        <CardContent className="p-0">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3>{t.noPartnersFound}</h3>
              <p className="text-muted-foreground">{t.noPartnersDesc}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.partnerCode}</TableHead>
                    <TableHead>{t.partnerName}</TableHead>
                    <TableHead>{t.partnerType}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>{partner.partner_code}</TableCell>
                      <TableCell>
                        <div>
                          <div>{partner.partner_name}</div>
                          {partner.contact && (
                            <div className="text-sm text-muted-foreground">
                              {partner.contact}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(partner.partner_type)}</TableCell>
                      <TableCell>{getStatusBadge(partner.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPartner(partner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Partner Form Dialog */}
      <PartnerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePartner}
        partner={editingPartner}
        mode={formMode}
      />
    </div>
  );
}