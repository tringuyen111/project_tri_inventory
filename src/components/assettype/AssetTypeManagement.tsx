import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner@2.0.3";
import { useLanguage } from "../../contexts/LanguageContext";
import { AssetType, AssetTypeFilters, AssetTypeFormData } from "../../types/assetType";
import { getAssetTypes, createAssetType, updateAssetType } from "../../data/mockAssetTypeData";
import { AssetTypeForm } from "./AssetTypeForm";
import { Plus, Search, Edit, Package, Filter } from "lucide-react";

export function AssetTypeManagement() {
  const { language } = useLanguage();
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [filters, setFilters] = useState<AssetTypeFilters>({
    status: 'all',
    search: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState<AssetType | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const texts = {
    title: language === 'vi' ? 'Quản Lý Loại Tài Sản' : 'Asset Type Management',
    description: language === 'vi' ? 'Quản lý các loại tài sản để phân loại nhóm tài sản/hàng hóa' : 'Manage asset types to classify groups of assets/goods',
    create: language === 'vi' ? 'Tạo Loại Tài Sản' : 'Create Asset Type',
    search: language === 'vi' ? 'Tìm kiếm theo mã hoặc tên...' : 'Search by code or name...',
    filter: language === 'vi' ? 'Lọc' : 'Filter',
    allStatuses: language === 'vi' ? 'Tất cả trạng thái' : 'All statuses',
    active: language === 'vi' ? 'Hoạt động' : 'Active',
    inactive: language === 'vi' ? 'Không hoạt động' : 'Inactive',
    code: language === 'vi' ? 'Mã' : 'Code',
    name: language === 'vi' ? 'Tên' : 'Name',
    descriptionColumn: language === 'vi' ? 'Mô tả' : 'Description',
    status: language === 'vi' ? 'Trạng thái' : 'Status',
    actions: language === 'vi' ? 'Thao tác' : 'Actions',
    edit: language === 'vi' ? 'Sửa' : 'Edit',
    noData: language === 'vi' ? 'Không có dữ liệu' : 'No data available',
    noDescription: language === 'vi' ? 'Không có mô tả' : 'No description',
    createSuccess: language === 'vi' ? 'Tạo loại tài sản thành công' : 'Asset type created successfully',
    updateSuccess: language === 'vi' ? 'Cập nhật loại tài sản thành công' : 'Asset type updated successfully',
    createError: language === 'vi' ? 'Lỗi khi tạo loại tài sản' : 'Error creating asset type',
    updateError: language === 'vi' ? 'Lỗi khi cập nhật loại tài sản' : 'Error updating asset type',
    totalRecords: language === 'vi' ? 'Tổng số bản ghi' : 'Total records',
    createDialogDescription: language === 'vi' ? 'Tạo loại tài sản mới để phân loại nhóm tài sản/hàng hóa' : 'Create a new asset type to classify groups of assets/goods',
    editDialogDescription: language === 'vi' ? 'Cập nhật thông tin loại tài sản đã chọn' : 'Update the selected asset type information'
  };

  useEffect(() => {
    loadAssetTypes();
  }, []);

  const loadAssetTypes = () => {
    try {
      const data = getAssetTypes();
      setAssetTypes(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error loading asset types');
    }
  };

  const handleCreate = () => {
    setEditingAssetType(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (assetType: AssetType) => {
    setEditingAssetType(assetType);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: AssetTypeFormData) => {
    setIsLoading(true);
    try {
      if (editingAssetType) {
        // Update existing asset type
        const updatedAssetType = updateAssetType(editingAssetType.asset_type_code, data);
        setAssetTypes(prev => prev.map(at => 
          at.asset_type_code === editingAssetType.asset_type_code ? updatedAssetType : at
        ));
        toast.success(texts.updateSuccess);
      } else {
        // Create new asset type
        const newAssetType = createAssetType(data);
        setAssetTypes(prev => [...prev, newAssetType]);
        toast.success(texts.createSuccess);
      }
      setIsFormOpen(false);
      setEditingAssetType(undefined);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (editingAssetType ? texts.updateError : texts.createError));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingAssetType(undefined);
  };

  const filteredAssetTypes = useMemo(() => {
    return assetTypes.filter(assetType => {
      const matchesStatus = filters.status === 'all' || assetType.status === filters.status;
      const matchesSearch = filters.search === '' || 
        assetType.asset_type_code.toLowerCase().includes(filters.search.toLowerCase()) ||
        assetType.asset_type_name.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [assetTypes, filters]);

  const handleFilterChange = (key: keyof AssetTypeFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            {texts.title}
          </h1>
          <p className="text-muted-foreground">{texts.description}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          {texts.create}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {texts.filter}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={texts.search}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-48">
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{texts.allStatuses}</SelectItem>
                  <SelectItem value="Active">{texts.active}</SelectItem>
                  <SelectItem value="Inactive">{texts.inactive}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Types Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{texts.title}</CardTitle>
            <Badge variant="secondary">
              {texts.totalRecords}: {filteredAssetTypes.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{texts.code}</TableHead>
                  <TableHead>{texts.name}</TableHead>
                  <TableHead>{texts.descriptionColumn}</TableHead>
                  <TableHead className="w-24">{texts.status}</TableHead>
                  <TableHead className="w-20 text-right">{texts.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssetTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {texts.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssetTypes.map((assetType) => (
                    <TableRow key={assetType.asset_type_code}>
                      <TableCell className="font-mono">{assetType.asset_type_code}</TableCell>
                      <TableCell>{assetType.asset_type_name}</TableCell>
                      <TableCell className="max-w-80 truncate">
                        {assetType.description || (
                          <span className="text-muted-foreground italic">{texts.noDescription}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={assetType.status === 'Active' ? 'default' : 'secondary'}>
                          {assetType.status === 'Active' ? texts.active : texts.inactive}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(assetType)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{texts.edit}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAssetType ? texts.edit : texts.create}
            </DialogTitle>
            <DialogDescription>
              {editingAssetType ? texts.editDialogDescription : texts.createDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <AssetTypeForm
            assetType={editingAssetType}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}