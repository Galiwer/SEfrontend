import React, { useEffect, useState } from 'react';
import { listInvoicesForCustomer, downloadInvoicePdf } from '../api/finance';
import { useAuth } from '../contexts/AuthContext';

export default function CustomerInvoices() {
  const { user, isCustomer } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const customerId = user?.id;

  useEffect(() => {
    (async () => {
      if (!isCustomer() || !customerId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await listInvoicesForCustomer(customerId);
        setInvoices(data || []);
      } catch (e) {
        // quiet fail into UI
      } finally {
        setLoading(false);
      }
    })();
  }, [customerId, isCustomer]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount || 0);

  const handleDownload = async (id) => {
    try {
      setDownloadingIds(prev => new Set(prev).add(id));
      console.log(`Attempting to download PDF for invoice ${id}`);
      const blob = await downloadInvoicePdf(id);
      
      if (!blob || blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      console.log(`PDF downloaded successfully, size: ${blob.size} bytes`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF download failed:', e);
      alert(`Download failed: ${e?.message ?? 'Unknown error'}`);
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (!isCustomer() || !customerId) {
    return (
      <div className="container">
        <div className="card">Please log in as a customer to view invoices.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">My Invoices</h1>
      </div>

      {invoices.length === 0 ? (
        <div className="card">No invoices yet.</div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Issued</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  <td>{new Date(inv.issuedAt).toLocaleString()}</td>
                  <td>{formatCurrency(inv.total)}</td>
                  <td>
                    <button 
                      onClick={() => handleDownload(inv.id)}
                      disabled={downloadingIds.has(inv.id)}
                      style={{ opacity: downloadingIds.has(inv.id) ? 0.6 : 1 }}
                    >
                      {downloadingIds.has(inv.id) ? 'Downloading...' : 'Download PDF'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


