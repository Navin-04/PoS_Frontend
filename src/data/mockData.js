// Mock Products
export const mockProducts = [
  {
    id: 1,
    name: 'Dal Makhani',
    category: 'Main Course',
    price: 250,
    unit: 'pcs',
    taxRate: 5,
  },
  {
    id: 2,
    name: 'Butter Chicken',
    category: 'Main Course',
    price: 320,
    unit: 'pcs',
    taxRate: 5,
  },
  {
    id: 3,
    name: 'Biryani',
    category: 'Main Course',
    price: 280,
    unit: 'pcs',
    taxRate: 5,
  },
  {
    id: 4,
    name: 'Coca Cola',
    category: 'Beverages',
    price: 50,
    unit: 'pcs',
    taxRate: 12,
  },
  {
    id: 5,
    name: 'Mineral Water',
    category: 'Beverages',
    price: 20,
    unit: 'pcs',
    taxRate: 12,
  },
  {
    id: 6,
    name: 'Gulab Jamun',
    category: 'Dessert',
    price: 80,
    unit: 'pcs',
    taxRate: 5,
  },
  {
    id: 7,
    name: 'Ice Cream',
    category: 'Dessert',
    price: 120,
    unit: 'pcs',
    taxRate: 5,
  },
  {
    id: 8,
    name: 'Rice',
    category: 'Main Course',
    price: 100,
    unit: 'pcs',
    taxRate: 5,
  },
];

// Mock Bills
export const mockBills = [
  {
    id: 1,
    invoiceNo: 'INV-2024-001',
    date: '2024-01-15',
    employee: 'Priya Sharma',
    employeeId: 'STAFF001',
    items: [
      { productId: 1, name: 'Dal Makhani', quantity: 2, unit: 'pcs', price: 250, taxRate: 5 },
      { productId: 4, name: 'Coca Cola', quantity: 3, unit: 'pcs', price: 50, taxRate: 12 },
    ],
    subtotal: 650,
    tax: 68.5,
    total: 718.5,
    status: 'Paid',
  },
  {
    id: 2,
    invoiceNo: 'INV-2024-002',
    date: '2024-01-16',
    employee: 'Amit Patel',
    employeeId: 'STAFF002',
    items: [
      { productId: 2, name: 'Butter Chicken', quantity: 1, unit: 'pcs', price: 320, taxRate: 5 },
      { productId: 6, name: 'Gulab Jamun', quantity: 2, unit: 'pcs', price: 80, taxRate: 5 },
    ],
    subtotal: 480,
    tax: 24,
    total: 504,
    status: 'Paid',
  },
  {
    id: 3,
    invoiceNo: 'INV-2024-003',
    date: '2024-01-17',
    employee: 'Priya Sharma',
    employeeId: 'STAFF001',
    items: [
      { productId: 3, name: 'Biryani', quantity: 2, unit: 'pcs', price: 280, taxRate: 5 },
      { productId: 5, name: 'Mineral Water', quantity: 4, unit: 'pcs', price: 20, taxRate: 12 },
    ],
    subtotal: 640,
    tax: 41.6,
    total: 681.6,
    status: 'Pending',
  },
];

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
  const totalRevenue = mockBills.reduce((sum, bill) => sum + bill.total, 0);
  const totalBills = mockBills.length;
  const totalProducts = mockProducts.length;

  return {
    totalRevenue,
    totalBills,
    totalProducts,
  };
};

