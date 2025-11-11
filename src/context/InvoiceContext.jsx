import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockInvoices, mockInvoiceItems } from '../data/mockData';

const InvoiceContext = createContext(null);

export const InvoiceProvider = ({ children }) => {
  // Initialize with mock data, but allow updates
  const [invoices, setInvoices] = useState(mockInvoices);
  const [invoiceItems, setInvoiceItems] = useState(mockInvoiceItems);

  // Load from localStorage on mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    const savedInvoiceItems = localStorage.getItem('invoiceItems');
    
    if (savedInvoices) {
      try {
        setInvoices(JSON.parse(savedInvoices));
      } catch (e) {
        console.error('Error loading invoices from localStorage:', e);
      }
    }
    
    if (savedInvoiceItems) {
      try {
        setInvoiceItems(JSON.parse(savedInvoiceItems));
      } catch (e) {
        console.error('Error loading invoice items from localStorage:', e);
      }
    }
  }, []);

  // Save to localStorage whenever invoices or invoiceItems change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('invoiceItems', JSON.stringify(invoiceItems));
  }, [invoiceItems]);

  const addInvoice = (invoiceData) => {
    // Generate a new ID (simple increment from max ID)
    const maxId = invoices.length > 0 
      ? Math.max(...invoices.map(inv => inv.id || 0))
      : 0;
    const newInvoiceId = maxId + 1;

    // Create invoice object with proper structure
    const newInvoice = {
      id: newInvoiceId,
      invoice_number: invoiceData.invoice_number,
      created_by: invoiceData.created_by,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: invoiceData.status,
      total_amount: invoiceData.total_amount,
      notes: invoiceData.notes || null,
      table_number: invoiceData.table_number || null,
      order_type: invoiceData.order_type,
      employee_id: invoiceData.employee_id,
    };

    // Create invoice items
    const newInvoiceItems = invoiceData.items.map((item, index) => {
      const maxItemId = invoiceItems.length > 0
        ? Math.max(...invoiceItems.map(it => it.id || 0))
        : 0;
      
      return {
        id: maxItemId + index + 1,
        invoice_id: newInvoiceId,
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        discount_amount: item.discount_amount,
        line_total_excl_tax: item.line_total_excl_tax,
        line_tax_amount: item.line_tax_amount,
        line_total_incl_tax: item.line_total_incl_tax,
      };
    });

    // Update state
    setInvoices(prev => [newInvoice, ...prev]);
    setInvoiceItems(prev => [...newInvoiceItems, ...prev]);

    return newInvoice;
  };

  const updateInvoice = (invoiceId, updates) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === invoiceId ? { ...inv, ...updates } : inv))
    );
  };

  const updateInvoiceWithItems = (invoiceId, invoiceData) => {
    // Update invoice
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: invoiceData.status,
            total_amount: invoiceData.total_amount,
            notes: invoiceData.notes || null,
            table_number: invoiceData.table_number || null,
            order_type: invoiceData.order_type,
            employee_id: invoiceData.employee_id,
          };
        }
        return inv;
      })
    );

    // Remove old items and add new ones
    setInvoiceItems(prev => {
      const filtered = prev.filter(item => item.invoice_id !== invoiceId);
      const maxItemId = filtered.length > 0
        ? Math.max(...filtered.map(it => it.id || 0))
        : 0;
      
      const newItems = invoiceData.items.map((item, index) => ({
        id: maxItemId + index + 1,
        invoice_id: invoiceId,
        product_id: item.product_id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        discount_amount: item.discount_amount,
        line_total_excl_tax: item.line_total_excl_tax,
        line_tax_amount: item.line_tax_amount,
        line_total_incl_tax: item.line_total_incl_tax,
      }));

      return [...filtered, ...newItems];
    });
  };

  const deleteInvoice = (invoiceId) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId));
    setInvoiceItems(prev => prev.filter(item => item.invoice_id !== invoiceId));
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        invoiceItems,
        addInvoice,
        updateInvoice,
        updateInvoiceWithItems,
        deleteInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within InvoiceProvider');
  }
  return context;
};

