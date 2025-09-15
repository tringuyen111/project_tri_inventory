export interface Partner {
  id: string;
  partner_code: string;
  partner_name: string;
  partner_type: 'Supplier' | 'Customer';
  tax_code?: string;
  address?: string;
  contact?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
  // Reference tracking for status validation
  has_open_documents?: boolean;
}

export interface CreatePartnerData {
  partner_code: string;
  partner_name: string;
  partner_type: 'Supplier' | 'Customer';
  tax_code?: string;
  address?: string;
  contact?: string;
  status: 'Active' | 'Inactive';
}

export interface UpdatePartnerData {
  partner_name: string;
  tax_code?: string;
  address?: string;
  contact?: string;
  status: 'Active' | 'Inactive';
}

export interface PartnerFilters {
  partner_type?: 'Supplier' | 'Customer';
  status?: 'Active' | 'Inactive';
  search?: string;
}