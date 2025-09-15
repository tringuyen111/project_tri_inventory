import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MultiSelect } from "../ui/multi-select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlertCircle, Shield, ShieldOff, Info } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Location, CreateLocationData, UpdateLocationData, AssetType } from "../../types/location";
import { isLocationCodeUnique } from "../../data/mockLocationData";
import { useLanguage } from "../../contexts/LanguageContext";

interface LocationFormProps {
  location?: Location;
  onSubmit: (data: CreateLocationData | UpdateLocationData) => void;
  onCancel: () => void;
  warehouses: any[];
  assetTypes: AssetType[];
  isEdit?: boolean;
}

export function LocationForm({
  location,
  onSubmit,
  onCancel,
  warehouses,
  assetTypes,
  isEdit = false
}: LocationFormProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    loc_code: location?.loc_code || "",
    loc_name: location?.loc_name || "",
    wh_code: location?.wh_code || "",
    allow_asset_types: location?.allow_asset_types || [],
    deny_asset_types: location?.deny_asset_types || [],
    status: location?.status || "Active" as "Active" | "Inactive"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflictError, setConflictError] = useState<string>("");

  useEffect(() => {
    // Check for conflicts whenever asset type lists change
    checkAssetTypeConflicts();
  }, [formData.allow_asset_types, formData.deny_asset_types]);

  const checkAssetTypeConflicts = () => {
    const conflicts = formData.allow_asset_types.filter(code => 
      formData.deny_asset_types.includes(code)
    );
    
    if (conflicts.length > 0) {
      const conflictNames = conflicts.map(code => {
        const assetType = assetTypes.find(at => at.code === code);
        return assetType ? assetType.name : code;
      });
      setConflictError(
        language === 'vi' 
          ? `Loại tài sản "${conflictNames.join(', ')}" không thể xuất hiện trong cả hai danh sách Cho phép và Không cho phép`
          : `Asset type(s) "${conflictNames.join(', ')}" cannot appear in both Allow and Deny lists`
      );
    } else {
      setConflictError("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!formData.wh_code) {
      newErrors.wh_code = language === 'vi' ? 'Vui lòng chọn kho' : 'Please select a warehouse';
    }

    if (!formData.loc_code.trim()) {
      newErrors.loc_code = language === 'vi' ? 'Vui lòng nhập mã vị trí' : 'Please enter location code';
    } else {
      // Format validation
      if (!/^LO_\d{3}$/.test(formData.loc_code)) {
        newErrors.loc_code = language === 'vi' ? 'Mã vị trí phải theo định dạng LO_999' : 'Location code must follow format LO_999';
      } else if (!isEdit) {
        // Uniqueness validation (only for create)
        if (!isLocationCodeUnique(formData.loc_code, formData.wh_code)) {
          newErrors.loc_code = language === 'vi' ? 'Mã vị trí đã tồn tại trong kho này' : 'Location code already exists in this warehouse';
        }
      }
    }

    if (!formData.loc_name.trim()) {
      newErrors.loc_name = language === 'vi' ? 'Vui lòng nhập tên vị trí' : 'Please enter location name';
    }

    // Asset type conflict validation
    if (conflictError) {
      newErrors.asset_types = conflictError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isEdit) {
      const updateData: UpdateLocationData = {
        loc_name: formData.loc_name,
        allow_asset_types: formData.allow_asset_types,
        deny_asset_types: formData.deny_asset_types,
        status: formData.status
      };
      onSubmit(updateData);
    } else {
      const createData: CreateLocationData = {
        loc_code: formData.loc_code,
        loc_name: formData.loc_name,
        wh_code: formData.wh_code,
        allow_asset_types: formData.allow_asset_types,
        deny_asset_types: formData.deny_asset_types,
        status: formData.status
      };
      onSubmit(createData);
    }
  };

  const handleAllowAssetTypesChange = (values: string[]) => {
    setFormData(prev => ({
      ...prev,
      allow_asset_types: values,
      // Remove selected values from deny list to prevent conflicts
      deny_asset_types: prev.deny_asset_types.filter(code => !values.includes(code))
    }));
  };

  const handleDenyAssetTypesChange = (values: string[]) => {
    setFormData(prev => ({
      ...prev,
      deny_asset_types: values,
      // Remove selected values from allow list to prevent conflicts
      allow_asset_types: prev.allow_asset_types.filter(code => !values.includes(code))
    }));
  };

  const getAssetTypeName = (code: string) => {
    const assetType = assetTypes.find(at => at.code === code);
    return assetType ? assetType.name : code;
  };

  const texts = {
    warehouse: language === 'vi' ? 'Kho' : 'Warehouse',
    selectWarehouse: language === 'vi' ? 'Chọn kho' : 'Select warehouse',
    locationCode: language === 'vi' ? 'Mã Vị Trí' : 'Location Code',
    locationName: language === 'vi' ? 'Tên Vị Trí' : 'Location Name',
    enterLocationName: language === 'vi' ? 'Nhập tên vị trí' : 'Enter location name',
    allowAssetTypes: language === 'vi' ? 'Loại Tài Sản Cho Phép' : 'Allow Asset Types',
    denyAssetTypes: language === 'vi' ? 'Loại Tài Sản Không Cho Phép' : 'Deny Asset Types',
    status: language === 'vi' ? 'Trạng Thái' : 'Status',
    active: language === 'vi' ? 'Hoạt động' : 'Active',
    inactive: language === 'vi' ? 'Không hoạt động' : 'Inactive',
    create: language === 'vi' ? 'Tạo' : 'Create',
    update: language === 'vi' ? 'Cập nhật' : 'Update',
    cancel: language === 'vi' ? 'Hủy' : 'Cancel',
    assetTypeHelp: language === 'vi' 
      ? 'Chọn loại tài sản để thiết lập quy tắc cho vị trí này'
      : 'Select asset types to set up rules for this location',
    allowHelp: language === 'vi' 
      ? 'Chỉ cho phép các loại tài sản này'
      : 'Only allow these asset types',
    denyHelp: language === 'vi' 
      ? 'Không cho phép các loại tài sản này'
      : 'Do not allow these asset types',
    rulesExplanation: language === 'vi' 
      ? 'Quy tắc: Nếu cả hai danh sách đều trống - không hạn chế. Chỉ "Cho phép" có dữ liệu - chỉ chấp nhận loại trong danh sách. Chỉ "Không cho phép" có dữ liệu - chặn loại trong danh sách. Cả hai có dữ liệu - "Không cho phép" được ưu tiên.'
      : 'Rules: Both empty - no restrictions. Only "Allow" has data - only accept types in Allow. Only "Deny" has data - block types in Deny. Both have data - Deny takes precedence.',
    selectAllowTypes: language === 'vi' ? 'Chọn loại tài sản cho phép' : 'Select allowed asset types',
    selectDenyTypes: language === 'vi' ? 'Chọn loại tài sản không cho phép' : 'Select denied asset types'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-1">
      {/* Warehouse Selection */}
      <div className="space-y-3">
        <Label htmlFor="warehouse">{texts.warehouse} *</Label>
        <Select
          value={formData.wh_code}
          onValueChange={(value) => setFormData(prev => ({ ...prev, wh_code: value }))}
          disabled={isEdit}
        >
          <SelectTrigger>
            <SelectValue placeholder={texts.selectWarehouse} />
          </SelectTrigger>
          <SelectContent>
            {warehouses.map((warehouse) => (
              <SelectItem key={warehouse.unique_key} value={warehouse.wh_code}>
                {warehouse.wh_name} ({warehouse.wh_code}) - {warehouse.organization_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.wh_code && (
          <p className="text-sm text-destructive">{errors.wh_code}</p>
        )}
      </div>

      {/* Location Code */}
      <div className="space-y-3">
        <Label htmlFor="locationCode">{texts.locationCode} *</Label>
        <Input
          id="locationCode"
          value={formData.loc_code}
          onChange={(e) => setFormData(prev => ({ ...prev, loc_code: e.target.value }))}
          placeholder="LO_001"
          readOnly={isEdit}
          className={isEdit ? "bg-muted" : ""}
        />
        {errors.loc_code && (
          <p className="text-sm text-destructive">{errors.loc_code}</p>
        )}
      </div>

      {/* Location Name */}
      <div className="space-y-3">
        <Label htmlFor="locationName">{texts.locationName} *</Label>
        <Input
          id="locationName"
          value={formData.loc_name}
          onChange={(e) => setFormData(prev => ({ ...prev, loc_name: e.target.value }))}
          placeholder={texts.enterLocationName}
        />
        {errors.loc_name && (
          <p className="text-sm text-destructive">{errors.loc_name}</p>
        )}
      </div>

      {/* Asset Types Configuration */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h4 className="font-medium">{texts.assetTypeHelp}</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-sm p-3">
                  <p className="text-sm">{texts.rulesExplanation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {conflictError && (
          <Alert variant="destructive" className="border-l-4 border-l-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{conflictError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Allow Asset Types */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              {texts.allowAssetTypes}
            </Label>
            <p className="text-sm text-muted-foreground">{texts.allowHelp}</p>
            <MultiSelect
              options={assetTypes.map(assetType => ({
                label: `${assetType.name} (${assetType.code})`,
                value: assetType.code,
                icon: Shield
              }))}
              selected={formData.allow_asset_types}
              onChange={handleAllowAssetTypesChange}
              placeholder={texts.selectAllowTypes}
              maxCount={2}
              className="w-full"
            />
          </div>

          {/* Deny Asset Types */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <ShieldOff className="h-4 w-4 text-red-600" />
              {texts.denyAssetTypes}
            </Label>
            <p className="text-sm text-muted-foreground">{texts.denyHelp}</p>
            <MultiSelect
              options={assetTypes.map(assetType => ({
                label: `${assetType.name} (${assetType.code})`,
                value: assetType.code,
                icon: ShieldOff
              }))}
              selected={formData.deny_asset_types}
              onChange={handleDenyAssetTypesChange}
              placeholder={texts.selectDenyTypes}
              maxCount={2}
              className="w-full"
            />
          </div>
        </div>

        {errors.asset_types && (
          <p className="text-sm text-destructive">{errors.asset_types}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-3">
        <Label htmlFor="status">{texts.status}</Label>
        <Select
          value={formData.status}
          onValueChange={(value: "Active" | "Inactive") => setFormData(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">{texts.active}</SelectItem>
            <SelectItem value="Inactive">{texts.inactive}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {texts.cancel}
        </Button>
        <Button type="submit" disabled={!!conflictError}>
          {isEdit ? texts.update : texts.create}
        </Button>
      </div>
    </form>
  );
}