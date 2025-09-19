import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Partner, CreatePartnerData, UpdatePartnerData } from '../../types/partner';
import { mockPartners, getPartnersWithOpenDocuments } from '../../data/mockPartnerData';
import { toast } from 'sonner';
import { useLanguage } from '../../contexts/LanguageContext';

interface PartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partner: Partner) => void;
  partner?: Partner;
  mode: 'create' | 'edit';
}

export function PartnerForm({ isOpen, onClose, onSave, partner, mode }: PartnerFormProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<CreatePartnerData | UpdatePartnerData>(() => {
    if (mode === 'edit' && partner) {
      return {
        partner_name: partner.partner_name,
        tax_code: partner.tax_code || '',
        address: partner.address || '',
        contact: partner.contact || '',
        status: partner.status
      };
    }
    return {
      partner_code: '',
      partner_name: '',
      partner_type: 'Supplier' as const,
      tax_code: '',
      address: '',
      contact: '',
      status: 'Active' as const
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const texts = {
    en: {
      createTitle: 'Create New Partner',
      editTitle: 'Edit Partner',
      partnerCode: 'Partner Code',
      partnerName: 'Partner Name',
      partnerType: 'Partner Type',
      supplier: 'Supplier',
      customer: 'Customer',
      taxCode: 'Tax Code',
      address: 'Address',
      contact: 'Contact',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      cancel: 'Cancel',
      save: 'Save',
      create: 'Create',
      required: 'This field is required',
      codeExists: 'Partner code already exists',
      cannotDeactivate: 'Cannot set to Inactive: Partner is referenced in open documents',
      createSuccess: 'Partner created successfully',
      updateSuccess: 'Partner updated successfully'
    },
    vi: {
      createTitle: 'Tạo Đối Tác Mới',
      editTitle: 'Chỉnh Sửa Đối Tác',
      partnerCode: 'Mã Đối Tác',
      partnerName: 'Tên Đối Tác',
      partnerType: 'Loại Đối Tác',
      supplier: 'Nhà Cung Cấp',
      customer: 'Khách Hàng',
      taxCode: 'Mã Số Thuế',
      address: 'Địa Chỉ',
      contact: 'Liên Hệ',
      status: 'Trạng Thái',
      active: 'Hoạt Động',
      inactive: 'Ngưng Hoạt Động',
      cancel: 'Hủy',
      save: 'Lưu',
      create: 'Tạo',
      required: 'Trường này là bắt buộc',
      codeExists: 'Mã đối tác đã tồn tại',
      cannotDeactivate: 'Không thể đặt thành Ngưng Hoạt Động: Đối tác đang được tham chiếu trong các chứng từ chưa hoàn thành',
      createSuccess: 'Tạo đối tác thành công',
      updateSuccess: 'Cập nhật đối tác thành công'
    }
  };

  const t = texts[language] || texts.en;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'create') {
      const createData = formData as CreatePartnerData;
      if (!createData.partner_code.trim()) {
        newErrors.partner_code = t.required;
      } else if (mockPartners.some(p => p.partner_code === createData.partner_code)) {
        newErrors.partner_code = t.codeExists;
      }
      if (!createData.partner_name.trim()) {
        newErrors.partner_name = t.required;
      }
    } else {
      const updateData = formData as UpdatePartnerData;
      if (!updateData.partner_name.trim()) {
        newErrors.partner_name = t.required;
      }
      
      // Check if trying to deactivate a partner with open documents
      if (partner && updateData.status === 'Inactive' && partner.status === 'Active') {
        const partnersWithOpenDocs = getPartnersWithOpenDocuments();
        if (partnersWithOpenDocs.includes(partner.id)) {
          newErrors.status = t.cannotDeactivate;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const now = new Date().toISOString();

    if (mode === 'create') {
      const createData = formData as CreatePartnerData;
      const newPartner: Partner = {
        id: Date.now().toString(),
        partner_code: createData.partner_code,
        partner_name: createData.partner_name,
        partner_type: createData.partner_type,
        tax_code: createData.tax_code || undefined,
        address: createData.address || undefined,
        contact: createData.contact || undefined,
        status: createData.status,
        created_at: now,
        updated_at: now,
        has_open_documents: false
      };
      onSave(newPartner);
      toast.success(t.createSuccess);
    } else if (partner) {
      const updateData = formData as UpdatePartnerData;
      const updatedPartner: Partner = {
        ...partner,
        partner_name: updateData.partner_name,
        tax_code: updateData.tax_code || undefined,
        address: updateData.address || undefined,
        contact: updateData.contact || undefined,
        status: updateData.status,
        updated_at: now
      };
      onSave(updatedPartner);
      toast.success(t.updateSuccess);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t.createTitle : t.editTitle}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a new partner (supplier or customer) for your warehouse operations'
              : 'Edit partner information and status'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Partner Code */}
            {mode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="partner_code">{t.partnerCode} *</Label>
                <Input
                  id="partner_code"
                  value={(formData as CreatePartnerData).partner_code || ''}
                  onChange={(e) => handleInputChange('partner_code', e.target.value)}
                  placeholder="SUP001, CUS001..."
                  className={errors.partner_code ? 'border-destructive' : ''}
                />
                {errors.partner_code && (
                  <p className="text-sm text-destructive">{errors.partner_code}</p>
                )}
              </div>
            )}

            {/* Partner Type */}
            {mode === 'create' && (
              <div className="space-y-2">
                <Label htmlFor="partner_type">{t.partnerType} *</Label>
                <Select
                  value={(formData as CreatePartnerData).partner_type}
                  onValueChange={(value: 'Supplier' | 'Customer') => 
                    handleInputChange('partner_type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Supplier">{t.supplier}</SelectItem>
                    <SelectItem value="Customer">{t.customer}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Partner Name */}
          <div className="space-y-2">
            <Label htmlFor="partner_name">{t.partnerName} *</Label>
            <Input
              id="partner_name"
              value={formData.partner_name}
              onChange={(e) => handleInputChange('partner_name', e.target.value)}
              className={errors.partner_name ? 'border-destructive' : ''}
            />
            {errors.partner_name && (
              <p className="text-sm text-destructive">{errors.partner_name}</p>
            )}
          </div>

          {/* Tax Code */}
          <div className="space-y-2">
            <Label htmlFor="tax_code">{t.taxCode}</Label>
            <Input
              id="tax_code"
              value={formData.tax_code || ''}
              onChange={(e) => handleInputChange('tax_code', e.target.value)}
              placeholder="0123456789"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">{t.address}</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={2}
            />
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <Label htmlFor="contact">{t.contact}</Label>
            <Input
              id="contact"
              value={formData.contact || ''}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              placeholder="John Doe - +84 901 234 567"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">{t.status}</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Active' | 'Inactive') => 
                handleInputChange('status', value)
              }
            >
              <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">{t.active}</SelectItem>
                <SelectItem value="Inactive">{t.inactive}</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit">
              {mode === 'create' ? t.create : t.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}