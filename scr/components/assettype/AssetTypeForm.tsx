import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useLanguage } from "../../contexts/LanguageContext";
import { AssetType, AssetTypeFormData } from "../../types/assetType";
import { isAssetTypeCodeUnique } from "../../data/mockAssetTypeData";

interface AssetTypeFormProps {
  assetType?: AssetType;
  onSubmit: (data: AssetTypeFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AssetTypeForm({ assetType, onSubmit, onCancel, isLoading = false }: AssetTypeFormProps) {
  const { language } = useLanguage();
  const isEditing = !!assetType;

  const [formData, setFormData] = useState<AssetTypeFormData>({
    asset_type_code: assetType?.asset_type_code || '',
    asset_type_name: assetType?.asset_type_name || '',
    description: assetType?.description || '',
    status: assetType?.status || 'Active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const texts = {
    title: isEditing 
      ? (language === 'vi' ? 'Sửa Loại Tài Sản' : 'Edit Asset Type')
      : (language === 'vi' ? 'Tạo Loại Tài Sản Mới' : 'Create New Asset Type'),
    subtitle: isEditing
      ? (language === 'vi' ? 'Cập nhật thông tin loại tài sản' : 'Update asset type information')
      : (language === 'vi' ? 'Nhập thông tin loại tài sản mới' : 'Enter new asset type information'),
    assetTypeCode: language === 'vi' ? 'Mã Loại Tài Sản' : 'Asset Type Code',
    assetTypeName: language === 'vi' ? 'Tên Loại Tài Sản' : 'Asset Type Name',
    description: language === 'vi' ? 'Mô tả' : 'Description',
    status: language === 'vi' ? 'Trạng thái' : 'Status',
    active: language === 'vi' ? 'Hoạt động' : 'Active',
    inactive: language === 'vi' ? 'Không hoạt động' : 'Inactive',
    save: language === 'vi' ? 'Lưu' : 'Save',
    cancel: language === 'vi' ? 'Hủy' : 'Cancel',
    required: language === 'vi' ? 'Trường này là bắt buộc' : 'This field is required',
    codeExists: language === 'vi' ? 'Mã loại tài sản đã tồn tại' : 'Asset type code already exists',
    codeReadOnly: language === 'vi' ? 'Mã không thể thay đổi khi sửa' : 'Code cannot be changed when editing',
    descriptionPlaceholder: language === 'vi' ? 'Nhập mô tả cho loại tài sản...' : 'Enter description for asset type...',
    codeFormat: language === 'vi' ? 'Nhập mã định danh cho loại tài sản' : 'Enter identifier code for asset type'
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.asset_type_code.trim()) {
      newErrors.asset_type_code = texts.required;
    } else if (!isEditing && !isAssetTypeCodeUnique(formData.asset_type_code)) {
      newErrors.asset_type_code = texts.codeExists;
    }

    if (!formData.asset_type_name.trim()) {
      newErrors.asset_type_name = texts.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      asset_type_code: true,
      asset_type_name: true,
      description: true,
      status: true
    });

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleFieldChange = (field: keyof AssetTypeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFieldBlur = (field: keyof AssetTypeFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{texts.title}</CardTitle>
        <CardDescription>{texts.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Type Code */}
          <div className="space-y-2">
            <Label htmlFor="asset_type_code">
              {texts.assetTypeCode} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="asset_type_code"
              type="text"
              value={formData.asset_type_code}
              onChange={(e) => handleFieldChange('asset_type_code', e.target.value.toUpperCase())}
              onBlur={() => handleFieldBlur('asset_type_code')}
              placeholder={texts.codeFormat}
              disabled={isEditing || isLoading}
              className={errors.asset_type_code && touched.asset_type_code ? 'border-destructive' : ''}
            />
            {isEditing && (
              <p className="text-sm text-muted-foreground">{texts.codeReadOnly}</p>
            )}
            {errors.asset_type_code && touched.asset_type_code && (
              <p className="text-sm text-destructive">{errors.asset_type_code}</p>
            )}
          </div>

          {/* Asset Type Name */}
          <div className="space-y-2">
            <Label htmlFor="asset_type_name">
              {texts.assetTypeName} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="asset_type_name"
              type="text"
              value={formData.asset_type_name}
              onChange={(e) => handleFieldChange('asset_type_name', e.target.value)}
              onBlur={() => handleFieldBlur('asset_type_name')}
              disabled={isLoading}
              className={errors.asset_type_name && touched.asset_type_name ? 'border-destructive' : ''}
            />
            {errors.asset_type_name && touched.asset_type_name && (
              <p className="text-sm text-destructive">{errors.asset_type_name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{texts.description}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={() => handleFieldBlur('description')}
              placeholder={texts.descriptionPlaceholder}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">{texts.status}</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'Active' | 'Inactive') => handleFieldChange('status', value)}
              disabled={isLoading}
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {texts.save}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
              {texts.cancel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}