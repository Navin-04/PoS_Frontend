# PoS_Frontend

# Hotel Management Billing System

A modern, frontend-only React application for managing hotel billing operations with role-based access control.

## Features

- **Role-Based Access Control**: Separate access for Owners and Staff
- **Dashboard**: View statistics and quick actions (Owner only)
- **Menu Management**: Add, edit, and delete products (Owner) or view only (Staff)
- **Billing**: Create bills with automatic tax calculations
- **Bill History**: View and filter previous bills
- **Profile Management**: View/edit organization information
- **Modern UI**: Clean, business-style interface with CSS modules

## Tech Stack

- React 18
- React Router 6
- Vite (Build tool)
- CSS Modules (No external CSS frameworks)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Demo Credentials

### Owner Account
- **User ID**: `OWNER001`
- **Password**: `owner123`
- **Access**: Full access to all features

### Staff Account
- **User ID**: `STAFF001`
- **Password**: `staff123`
- **Access**: Limited access (view-only on some pages)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ProtectedRoute.jsx
│   ├── Sidebar.jsx
│   └── TopBar.jsx
├── context/            # React Context for state management
│   └── AuthContext.jsx
├── data/               # Mock data
│   └── mockData.js
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── MenuManagement.jsx
│   ├── Billing.jsx
│   ├── BillHistory.jsx
│   ├── Profile.jsx
│   └── Unauthorized.jsx
├── App.jsx             # Main app component with routing
├── App.css             # Global styles
└── index.jsx           # Entry point
```

## Features Details

### Login Page
- Mock authentication using User ID and Password
- Automatic redirect based on user role
- Owner → Dashboard
- Staff → Billing

### Dashboard (Owner Only)
- Display statistics: Total Revenue, Total Bills, Total Products
- Quick action buttons for common tasks

### Menu Management
- View all products with details (name, category, price, unit, tax rate)
- Owner can add, edit, and delete products
- Staff can only view the menu

### Billing Page
- Create bills by selecting products
- Automatic calculation of:
  - Item totals
  - Subtotal
  - Tax
  - Grand total
- Indian Rupee formatting with paise
- Save and Print functionality (mock actions)

### Bill History
- View all previous bills
- Filter by date, employee, and amount range
- Owner can view, edit, and delete bills
- Staff can only view bills

### Profile Page
- Display organization information
- Owner can edit organization details
- Staff can only view

## Role-Based Access

- **Owner**: Full access to all features
- **Staff**: Limited access (view-only on Menu Management, Bill History, and Profile)

## Currency Formatting

All monetary values are formatted using Indian Rupee (INR) format with paise:
```javascript
new Intl.NumberFormat("en-IN", { 
  style: "currency", 
  currency: "INR" 
}).format(value)
```

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Future Enhancements

This is a frontend-only application with mock data. To make it production-ready, you'll need to:

1. Connect to a backend API
2. Implement real authentication
3. Add database integration
4. Implement actual CRUD operations
5. Add form validation
6. Add error handling
7. Add loading states
8. Implement real-time updates

## License

This project is open source and available for use.

