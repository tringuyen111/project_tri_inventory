import { Partner } from '../types/partner';

export const mockPartners: Partner[] = [
  {
    id: '1',
    partner_code: 'SUP001',
    partner_name: 'ABC Materials Supplier',
    partner_type: 'Supplier',
    tax_code: '0123456789',
    address: '123 Industrial Street, Ho Chi Minh City',
    contact: 'John Doe - +84 901 234 567',
    status: 'Active',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T08:00:00Z',
    has_open_documents: false
  },
  {
    id: '2',
    partner_code: 'SUP002',
    partner_name: 'XYZ Manufacturing Co.',
    partner_type: 'Supplier',
    tax_code: '0987654321',
    address: '456 Factory Road, Hanoi',
    contact: 'Jane Smith - +84 902 345 678',
    status: 'Active',
    created_at: '2024-01-20T09:30:00Z',
    updated_at: '2024-02-10T14:15:00Z',
    has_open_documents: true
  },
  {
    id: '3',
    partner_code: 'CUS001',
    partner_name: 'Retail Store Network',
    partner_type: 'Customer',
    tax_code: '1122334455',
    address: '789 Commercial Avenue, Da Nang',
    contact: 'Mike Johnson - +84 903 456 789',
    status: 'Active',
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-01-25T10:00:00Z',
    has_open_documents: false
  },
  {
    id: '4',
    partner_code: 'CUS002',
    partner_name: 'E-commerce Solutions',
    partner_type: 'Customer',
    tax_code: '5566778899',
    address: '321 Digital Street, Ho Chi Minh City',
    contact: 'Sarah Wilson - +84 904 567 890',
    status: 'Active',
    created_at: '2024-02-01T11:00:00Z',
    updated_at: '2024-02-15T16:30:00Z',
    has_open_documents: true
  },
  {
    id: '5',
    partner_code: 'SUP003',
    partner_name: 'Global Components Ltd',
    partner_type: 'Supplier',
    tax_code: '2233445566',
    address: '654 Export Zone, Hai Phong',
    contact: 'David Brown - +84 905 678 901',
    status: 'Inactive',
    created_at: '2024-01-10T07:45:00Z',
    updated_at: '2024-02-20T09:20:00Z',
    has_open_documents: false
  },
  {
    id: '6',
    partner_code: 'CUS003',
    partner_name: 'Local Distributors',
    partner_type: 'Customer',
    tax_code: '7788990011',
    address: '987 Distribution Center, Can Tho',
    contact: 'Lisa Chen - +84 906 789 012',
    status: 'Inactive',
    created_at: '2024-01-18T13:20:00Z',
    updated_at: '2024-02-25T10:45:00Z',
    has_open_documents: false
  },
  {
    id: '7',
    partner_code: 'SUP004',
    partner_name: 'Tech Hardware Supplies',
    partner_type: 'Supplier',
    tax_code: '3344556677',
    address: '147 Technology Park, Ho Chi Minh City',
    contact: 'Robert Lee - +84 907 890 123',
    status: 'Active',
    created_at: '2024-02-05T15:00:00Z',
    updated_at: '2024-02-05T15:00:00Z',
    has_open_documents: false
  },
  {
    id: '8',
    partner_code: 'CUS004',
    partner_name: 'Premium Retail Chain',
    partner_type: 'Customer',
    tax_code: '8899001122',
    address: '258 Shopping District, Hanoi',
    contact: 'Emma Davis - +84 908 901 234',
    status: 'Active',
    created_at: '2024-02-08T12:30:00Z',
    updated_at: '2024-02-22T08:15:00Z',
    has_open_documents: false
  }
];

// Simulate partners referenced in open documents
export const getPartnersWithOpenDocuments = (): string[] => {
  return mockPartners
    .filter(partner => partner.has_open_documents)
    .map(partner => partner.id);
};

// Get active partners for dropdowns
export const getActivePartners = (): Partner[] => {
  return mockPartners.filter(partner => partner.status === 'Active');
};