import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Plus, Search, Edit, MapPin, Shield, ShieldOff, Power, PowerOff } from "lucide-react";
import { LocationForm } from "./LocationForm";
import { Location, CreateLocationData, UpdateLocationData } from "../../types/location";
import { getLocations, createLocation, updateLocation, getActiveAssetTypes, getWarehousesForLocation } from "../../data/mockLocationData";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "sonner@2.0.3";

export function LocationManagement() {
  const { language } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [assetTypes, setAssetTypes] = useState<any[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterLocations();
  }, [locations, searchTerm, statusFilter, warehouseFilter]);

  const loadData = () => {
    try {
      const locationsData = getLocations();
      const warehousesData = getWarehousesForLocation();
      const assetTypesData = getActiveAssetTypes();
      
      setLocations(locationsData);
      setWarehouses(warehousesData);
      setAssetTypes(assetTypesData);
    } catch (error) {
      toast.error(language === 'vi' ? 'Lỗi khi tải dữ liệu' : 'Error loading data');
    }
  };

  const filterLocations = () => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(
        location =>
          location.loc_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.loc_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.wh_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(location => location.status === statusFilter);
    }

    if (warehouseFilter !== "all") {
      filtered = filtered.filter(location => location.wh_code === warehouseFilter);
    }

    setFilteredLocations(filtered);
  };

  const handleCreate = async (data: CreateLocationData) => {
    try {
      const newLocation = createLocation(data);
      setLocations(prev => [...prev, newLocation]);
      setIsCreateDialogOpen(false);
      toast.success(language === 'vi' ? 'Tạo vị trí thành công' : 'Location created successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (language === 'vi' ? 'Lỗi khi tạo vị trí' : 'Error creating location'));
    }
  };

  const handleUpdate = async (locationCode: string, data: UpdateLocationData) => {
    try {
      const updatedLocation = updateLocation(locationCode, data);
      setLocations(prev => prev.map(location => 
        location.loc_code === locationCode ? updatedLocation : location
      ));
      setIsEditDialogOpen(false);
      setSelectedLocation(null);
      toast.success(language === 'vi' ? 'Cập nhật vị trí thành công' : 'Location updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (language === 'vi' ? 'Lỗi khi cập nhật vị trí' : 'Error updating location'));
    }
  };

  const handleToggleStatus = async (locationCode: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      const updatedLocation = updateLocation(locationCode, { status: newStatus });
      setLocations(prev => prev.map(location => 
        location.loc_code === locationCode ? updatedLocation : location
      ));
      toast.success(
        language === 'vi' 
          ? `${newStatus === "Active" ? 'Kích hoạt' : 'Vô hiệu hóa'} vị trí thành công`
          : `Location ${newStatus === "Active" ? 'activated' : 'deactivated'} successfully`
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : (language === 'vi' ? 'Lỗi khi thay đổi trạng thái' : 'Error changing status'));
    }
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsEditDialogOpen(true);
  };

  const getWarehouseName = (warehouseCode: string) => {
    const warehouse = warehouses.find(w => w.wh_code === warehouseCode);
    return warehouse ? warehouse.wh_name : warehouseCode;
  };

  const getAssetTypeName = (assetTypeCode: string) => {
    const assetType = assetTypes.find(at => at.code === assetTypeCode);
    return assetType ? assetType.name : assetTypeCode;
  };

  const renderAssetTypeBadges = (assetTypeCodes: string[], type: 'allow' | 'deny') => {
    if (assetTypeCodes.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1">
        {assetTypeCodes.map(code => (
          <Badge 
            key={code} 
            variant={type === 'allow' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {type === 'allow' ? <Shield className="w-3 h-3 mr-1" /> : <ShieldOff className="w-3 h-3 mr-1" />}
            {getAssetTypeName(code)}
          </Badge>
        ))}
      </div>
    );
  };

  const texts = {
    title: language === 'vi' ? 'Quản Lý Vị Trí' : 'Location Management',
    description: language === 'vi' ? 'Quản lý vị trí lưu trữ trong kho' : 'Manage storage locations in warehouses',
    createButton: language === 'vi' ? 'Tạo Vị Trí' : 'Create Location',
    search: language === 'vi' ? 'Tìm kiếm vị trí...' : 'Search locations...',
    allStatuses: language === 'vi' ? 'Tất cả trạng thái' : 'All statuses',
    allWarehouses: language === 'vi' ? 'Tất cả kho' : 'All warehouses',
    active: language === 'vi' ? 'Hoạt động' : 'Active',
    inactive: language === 'vi' ? 'Không hoạt động' : 'Inactive',
    locationCode: language === 'vi' ? 'Mã Vị Trí' : 'Location Code',
    locationName: language === 'vi' ? 'Tên Vị Trí' : 'Location Name',
    warehouse: language === 'vi' ? 'Kho' : 'Warehouse',
    allowAssetTypes: language === 'vi' ? 'Loại Tài Sản Cho Phép' : 'Allow Asset Types',
    denyAssetTypes: language === 'vi' ? 'Loại Tài Sản Không Cho Phép' : 'Deny Asset Types',
    status: language === 'vi' ? 'Trạng Thái' : 'Status',
    actions: language === 'vi' ? 'Thao Tác' : 'Actions',
    edit: language === 'vi' ? 'Sửa' : 'Edit',
    toggleStatus: language === 'vi' ? 'Thay đổi trạng thái' : 'Toggle Status',
    activate: language === 'vi' ? 'Kích hoạt' : 'Activate',
    deactivate: language === 'vi' ? 'Vô hiệu hóa' : 'Deactivate',
    noRestrictions: language === 'vi' ? 'Không hạn chế' : 'No restrictions',
    createTitle: language === 'vi' ? 'Tạo Vị Trí Mới' : 'Create New Location',
    editTitle: language === 'vi' ? 'Sửa Vị Trí' : 'Edit Location'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {texts.title}
              </CardTitle>
              <CardDescription>
                {texts.description}
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {texts.createButton}
                </Button>
              </DialogTrigger>
              <DialogContent className="min-w-[720px] w-[80vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{texts.createTitle}</DialogTitle>
                  <DialogDescription>
                    {language === 'vi' ? 'Tạo vị trí lưu trữ mới trong kho với các quy tắc tài sản' : 'Create a new storage location in warehouse with asset type rules'}
                  </DialogDescription>
                </DialogHeader>
                <LocationForm
                  onSubmit={handleCreate}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  warehouses={warehouses}
                  assetTypes={assetTypes}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={texts.search}
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
                <SelectItem value="all">{texts.allStatuses}</SelectItem>
                <SelectItem value="Active">{texts.active}</SelectItem>
                <SelectItem value="Inactive">{texts.inactive}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{texts.allWarehouses}</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.unique_key} value={warehouse.wh_code}>
                    {warehouse.wh_name} ({warehouse.organization_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{texts.locationCode}</TableHead>
                  <TableHead>{texts.locationName}</TableHead>
                  <TableHead>{texts.warehouse}</TableHead>
                  <TableHead>{texts.allowAssetTypes}</TableHead>
                  <TableHead>{texts.denyAssetTypes}</TableHead>
                  <TableHead>{texts.status}</TableHead>
                  <TableHead className="text-right">{texts.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location) => (
                  <TableRow key={location.loc_code}>
                    <TableCell>{location.loc_code}</TableCell>
                    <TableCell>{location.loc_name}</TableCell>
                    <TableCell>{getWarehouseName(location.wh_code)}</TableCell>
                    <TableCell>
                      {location.allow_asset_types.length > 0 
                        ? renderAssetTypeBadges(location.allow_asset_types, 'allow')
                        : location.deny_asset_types.length === 0 
                          ? <span className="text-muted-foreground text-sm">{texts.noRestrictions}</span>
                          : null
                      }
                    </TableCell>
                    <TableCell>
                      {renderAssetTypeBadges(location.deny_asset_types, 'deny')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={location.status === "Active" ? "default" : "secondary"}>
                        {location.status === "Active" ? texts.active : texts.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">{texts.edit}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(location.loc_code, location.status)}
                          className={location.status === "Active" ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                        >
                          {location.status === "Active" ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {location.status === "Active" ? texts.deactivate : texts.activate}
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="min-w-[720px] w-[80vw] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{texts.editTitle}</DialogTitle>
            <DialogDescription>
              {language === 'vi' ? 'Chỉnh sửa thông tin vị trí lưu trữ và quy tắc tài sản' : 'Edit storage location information and asset type rules'}
            </DialogDescription>
          </DialogHeader>
          {selectedLocation && (
            <LocationForm
              location={selectedLocation}
              onSubmit={(data) => handleUpdate(selectedLocation.loc_code, data)}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedLocation(null);
              }}
              warehouses={warehouses}
              assetTypes={assetTypes}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}