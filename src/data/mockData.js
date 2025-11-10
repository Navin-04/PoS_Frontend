// Mock Tax Slabs
export const mockTaxSlabs = [
  { id: 1, rate: 0.0, name: 'GST 0%' },
  { id: 2, rate: 5.0, name: 'GST 5%' },
  { id: 3, rate: 18.0, name: 'GST 18%' },
];

// Mock Categories
export const mockCategories = [
  { id: 1, name: 'Main Course', description: 'Main course dishes' },
  { id: 2, name: 'Beverages', description: 'Drinks and beverages' },
  { id: 3, name: 'Dessert', description: 'Desserts and sweets' },
  { id: 4, name: 'Appetizer', description: 'Starters and appetizers' },
];

// Mock Products (matching database schema)
export const mockProducts = [
  {
    id: 1,
    sku: 'P001',
    name: 'Paneer Butter Masala',
    category_id: 1,
    current_unit_price: 200.0,
    tax_slab_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:06:33',
    updated_at: '2025-11-10 16:06:33',
  },
  {
    id: 2,
    sku: 'P002',
    name: 'Dal Makhani',
    category_id: 1,
    current_unit_price: 250.0,
    tax_slab_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:06:33',
    updated_at: '2025-11-10 16:06:33',
  },
  {
    id: 3,
    sku: 'P003',
    name: 'Butter Chicken',
    category_id: 1,
    current_unit_price: 320.0,
    tax_slab_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:06:33',
    updated_at: '2025-11-10 16:06:33',
  },
  {
    id: 4,
    sku: 'P004',
    name: 'Biryani',
    category_id: 1,
    current_unit_price: 280.0,
    tax_slab_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:06:33',
    updated_at: '2025-11-10 16:06:33',
  },
  {
    id: 5,
    sku: 'P005',
    name: 'Coca Cola',
    category_id: 2,
    current_unit_price: 50.0,
    tax_slab_id: 3,
    is_active: 1,
    created_at: '2025-11-10 16:06:33',
    updated_at: '2025-11-10 16:06:33',
  },
  {
    id: 6,
    sku: 'P006',
    name: 'Mineral Water',
    category_id: 2,
    current_unit_price: 20.0,
    tax_slab_id: 3,
    is_active: 1,
    created_at: '2025-11-10 16:06:33',
    updated_at: '2025-11-10 16:06:33',
  },
  {
    id: 7,
    sku: 'P007',
    name: 'Gulab Jamun',
    category_id: 3,
    current_unit_price: 80.0,
    tax_slab_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:06:33',
    updated_at: '2025-11-10 16:06:33',
  },
  {
    id: 8,
    sku: 'P008',
    name: 'Ice Cream',
    category_id: 3,
    current_unit_price: 120.0,
    tax_slab_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:06:33',
    updated_at: '2025-11-10 16:06:33',
  },
];

// Mock Roles
export const mockRoles = [
  { id: 1, name: 'owner' },
  { id: 2, name: 'staff' },
  { id: 3, name: 'manager' },
];

// Mock User Accounts
export const mockUserAccounts = [
  {
    id: 1,
    email: 'owner@hotel.com',
    username: 'OWNER001',
    password_hash: 'owner123', // In real app, this would be hashed
    full_name: 'Rajesh Kumar',
    role_id: 1,
    is_active: 1,
    created_at: '2025-11-10 16:06:27',
    updated_at: '2025-11-10 16:06:27',
  },
  {
    id: 2,
    email: 'staff1@hotel.com',
    username: 'STAFF001',
    password_hash: 'staff123',
    full_name: 'Priya Sharma',
    role_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:06:27',
    updated_at: '2025-11-10 16:06:27',
  },
  {
    id: 3,
    email: 'staff2@hotel.com',
    username: 'STAFF002',
    password_hash: 'staff123',
    full_name: 'Amit Patel',
    role_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:06:27',
    updated_at: '2025-11-10 16:06:27',
  },
];

// Mock Employees
export const mockEmployees = [
  {
    id: 1,
    full_name: 'John Doe',
    phone: '9999999999',
    employee_code: 'W001',
    hire_date: '2025-11-10',
    designation: 'Waiter',
    user_account_id: null,
    is_active: 1,
    created_at: '2025-11-10 16:06:27',
    updated_at: '2025-11-10 16:06:27',
  },
  {
    id: 2,
    full_name: 'John Smith',
    phone: '9999999990',
    employee_code: 'M101',
    hire_date: '2024-11-10',
    designation: 'Manager',
    user_account_id: null,
    is_active: 1,
    created_at: '2025-11-10 16:17:11',
    updated_at: '2025-11-10 16:17:11',
  },
  {
    id: 3,
    full_name: 'Priya Sharma',
    phone: '8888888888',
    employee_code: 'W002',
    hire_date: '2025-11-10',
    designation: 'Waiter',
    user_account_id: 2,
    is_active: 1,
    created_at: '2025-11-10 16:22:54',
    updated_at: '2025-11-10 16:22:54',
  },
];

// Helper function to get product with category and tax slab
export const getProductWithDetails = (productId) => {
  const product = mockProducts.find((p) => p.id === productId);
  if (!product) return null;

  const category = mockCategories.find((c) => c.id === product.category_id);
  const taxSlab = mockTaxSlabs.find((t) => t.id === product.tax_slab_id);

  return {
    ...product,
    category: category ? category.name : 'Unknown',
    taxRate: taxSlab ? taxSlab.rate : 0,
    taxSlabName: taxSlab ? taxSlab.name : 'Unknown',
  };
};

// Mock Invoices (matching database schema)
export const mockInvoices = [
  {
    id: 5,
    invoice_number: 'TINV251110215253',
    created_by: null,
    created_at: '2025-11-10 16:22:54',
    status: 'finalized',
    total_amount: 315.0,
    notes: null,
    table_number: 'T1',
    order_type: 'dine-in',
    employee_id: 3,
  },
  {
    id: 15,
    invoice_number: 'TINV251110225113',
    created_by: null,
    created_at: '2025-11-10 17:21:13',
    status: 'paid',
    total_amount: 315.0,
    notes: null,
    table_number: 'T1',
    order_type: 'dine-in',
    employee_id: 3,
  },
  {
    id: 16,
    invoice_number: 'TINV251110225200',
    created_by: null,
    created_at: '2025-11-10 17:22:00',
    status: 'paid',
    total_amount: 315.0,
    notes: null,
    table_number: 'T1',
    order_type: 'dine-in',
    employee_id: 12,
  },
  {
    id: 17,
    invoice_number: 'TINV251110225300',
    created_by: null,
    created_at: '2025-11-10 17:23:00',
    status: 'paid',
    total_amount: 315.0,
    notes: null,
    table_number: 'T1',
    order_type: 'dine-in',
    employee_id: 13,
  },
  {
    id: 18,
    invoice_number: 'TINV251110225400',
    created_by: null,
    created_at: '2025-11-10 17:24:00',
    status: 'finalized',
    total_amount: 315.0,
    notes: null,
    table_number: 'T1',
    order_type: 'dine-in',
    employee_id: 14,
  },
];

// Mock Invoice Items
export const mockInvoiceItems = [
  {
    id: 2,
    invoice_id: 5,
    product_id: 2,
    description: 'Test Dish',
    quantity: 2.0,
    unit_price: 150.0,
    tax_rate: 5.0,
    discount_amount: 0.0,
    line_total_excl_tax: 300.0,
    line_tax_amount: 15.0,
    line_total_incl_tax: 315.0,
  },
  {
    id: 12,
    invoice_id: 15,
    product_id: 11,
    description: 'Test Dish',
    quantity: 2.0,
    unit_price: 150.0,
    tax_rate: 5.0,
    discount_amount: 0.0,
    line_total_excl_tax: 300.0,
    line_tax_amount: 15.0,
    line_total_incl_tax: 315.0,
  },
  {
    id: 13,
    invoice_id: 16,
    product_id: 12,
    description: 'Test Dish',
    quantity: 2.0,
    unit_price: 150.0,
    tax_rate: 5.0,
    discount_amount: 0.0,
    line_total_excl_tax: 300.0,
    line_tax_amount: 15.0,
    line_total_incl_tax: 315.0,
  },
];

// Mock Payments
export const mockPayments = [
  {
    id: 1,
    invoice_id: 19,
    paid_at: '2025-11-10 17:21:13',
    amount: 315.0,
    method: 'cash',
    reference: 'PAY-TINV251110225113',
  },
  {
    id: 2,
    invoice_id: 20,
    paid_at: '2025-11-10 17:22:00',
    amount: 315.0,
    method: 'cash',
    reference: 'PAY-TINV251110225200',
  },
  {
    id: 3,
    invoice_id: 21,
    paid_at: '2025-11-10 17:23:00',
    amount: 315.0,
    method: 'cash',
    reference: 'PAY-TINV251110225300',
  },
];

// Helper function to get invoice with items and employee
export const getInvoiceWithDetails = (invoiceId) => {
  const invoice = mockInvoices.find((inv) => inv.id === invoiceId);
  if (!invoice) return null;

  const items = mockInvoiceItems.filter((item) => item.invoice_id === invoiceId);
  const employee = mockEmployees.find((emp) => emp.id === invoice.employee_id);
  const payment = mockPayments.find((pay) => pay.invoice_id === invoiceId);

  return {
    ...invoice,
    items: items.map((item) => {
      const product = getProductWithDetails(item.product_id);
      return {
        ...item,
        product: product,
      };
    }),
    employee: employee ? employee.full_name : 'Unknown',
    payment: payment || null,
  };
};

// Mock Organization Info
export const mockOrganization = {
  name: 'Grand Hotel & Restaurant',
  gst: '29ABCDE1234F1Z5',
  address: '123 MG Road, Bangalore, Karnataka - 560001',
  phone: '+91-80-12345678',
  email: 'info@grandhotel.com',
};

// Mock Statistics
export const getMockStats = () => {
  const totalRevenue = mockInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
  const totalBills = mockInvoices.length;
  const totalProducts = mockProducts.filter((p) => p.is_active === 1).length;

  return {
    totalRevenue,
    totalBills,
    totalProducts,
  };
};
