import React, { useState } from 'react';
import { createInvoice } from '../api/finance';
import { useNavigate } from 'react-router-dom';

export default function AdminInvoiceCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    remarks: '',
    items: [{ description: '', quantity: 1, unitPrice: '' }]
  });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const updateItem = (index, key, value) => {
    setForm(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [key]: value };
      
      // Validate amounts
      if (key === 'unitPrice' || key === 'quantity') {
        const item = items[index];
        if (item.unitPrice && item.quantity) {
          const lineTotal = parseFloat(item.unitPrice) * parseInt(item.quantity);
          if (lineTotal > 999999.99) {
            alert('Line total cannot exceed 999,999.99 LKR');
            return prev;
          }
        }
      }
      
      return { ...prev, items };
    });
  };
  const addItem = () => setForm(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, unitPrice: '' }] }));
  const removeItem = (i) => setForm(prev => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const validItems = form.items
        .filter(it => it.description && it.quantity && it.unitPrice)
        .map(it => ({ description: it.description, quantity: Number(it.quantity), unitPrice: Number(it.unitPrice) }));
      
      // Check total amount
      const total = validItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      if (total > 1000000) {
        alert('Invoice total cannot exceed 1,000,000 LKR');
        setSubmitting(false);
        return;
      }
      
      const payload = {
        customerId: form.customerId ? Number(form.customerId) : null,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        remarks: form.remarks,
        items: validItems
      };
      const created = await createInvoice(payload);
      // Show success message and redirect to finance page
      alert('Invoice created successfully!');
      navigate('/admin/finance');
    } catch (err) {
      alert(err?.response?.data || err?.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Invoice</h1>
          <p className="page-description">Add reasons and fees as line items.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="grid">
          <div className="form-group">
            <label>Customer ID (optional)</label>
            <input value={form.customerId} onChange={e => updateField('customerId', e.target.value)} placeholder="e.g., 123" />
          </div>
          <div className="form-group">
            <label>Customer Name</label>
            <input required value={form.customerName} onChange={e => updateField('customerName', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Customer Email</label>
            <input type="email" required value={form.customerEmail} onChange={e => updateField('customerEmail', e.target.value)} />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Remarks (Optional)</label>
          <textarea 
            value={form.remarks} 
            onChange={e => updateField('remarks', e.target.value)}
            placeholder="Add any additional notes or remarks for the owner..."
            rows={3}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <h3>Line Items</h3>
          {form.items.map((it, idx) => (
            <div key={idx} className="grid" style={{ alignItems: 'end', marginBottom: 8 }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Description</label>
                <input value={it.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Qty</label>
                <input type="number" min="1" value={it.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Unit Price</label>
                <input type="number" step="0.01" min="0" value={it.unitPrice} onChange={e => updateItem(idx, 'unitPrice', e.target.value)} />
              </div>
              <button type="button" onClick={() => removeItem(idx)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addItem}>+ Add Item</button>
        </div>

        <div style={{ marginTop: 16 }}>
          <button type="submit" disabled={submitting}>Create Invoice</button>
        </div>
      </form>
    </div>
  );
}


