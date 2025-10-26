import React, { useEffect, useMemo, useState } from 'react'
import { getCategories, createCategory, deleteCategory, getItems, createItem, updateItem, deleteItem, adjustItemStock } from '../api/resources.js'
import { getNotifications, clearNotifications } from "../api/api.js";

export default function AddResources() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [alerts, setAlerts] = useState([])

  // Forms state
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [newItem, setNewItem] = useState({ name: '', description: '', categoryId: '', unit: '', quantityOnHand: 0 })
  const [stockAdjust, setStockAdjust] = useState({ id: '', type: 'IN', quantity: 0, reason: '' })

  const categoryOptions = useMemo(() => categories.map(c => ({ value: c.id, label: c.name })), [categories])

  async function loadAll() {
    setLoading(true)
    setError('')
    try {
      const [cats, its] = await Promise.all([getCategories(), getItems()])
      setCategories(cats)
      setItems(its)
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  async function handleAddCategory(e) {
    e.preventDefault()
    try {
      const created = await createCategory(newCategory)
      setCategories(prev => [...prev, created])
      setNewCategory({ name: '', description: '' })
    } catch (e) {
      setError(e.message || 'Failed to add category')
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(c => c.id !== id))
      // Also remove items that belong to this category
      setItems(prev => prev.filter(i => i.categoryId !== id))
    } catch (e) {
      setError(e.message || 'Failed to delete category')
    }
  }

  async function handleAddItem(e) {
    e.preventDefault()
    try {
      const payload = { ...newItem, categoryId: Number(newItem.categoryId) || null, quantityOnHand: Number(newItem.quantityOnHand) || 0 }
      const created = await createItem(payload)
      setItems(prev => [...prev, created])
      setNewItem({ name: '', description: '', categoryId: '', unit: '', quantityOnHand: 0 })
    } catch (e) {
      setError(e.message || 'Failed to add item')
    }
  }

  async function handleDeleteItem(id) {
    try {
      await deleteItem(id)
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (e) {
      setError(e.message || 'Failed to delete item')
    }
  }

  async function handleAdjustStock(e) {
    e.preventDefault()
    try {
      const updated = await adjustItemStock(Number(stockAdjust.id), { type: stockAdjust.type, quantity: Number(stockAdjust.quantity) || 0, reason: stockAdjust.reason })
      setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)))
      setStockAdjust({ id: '', type: 'IN', quantity: 0, reason: '' })
    } catch (e) {
      setError(e.message || 'Failed to adjust stock')
    }
  }

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await getNotifications();
        setAlerts(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    }

    loadAlerts();
    const interval = setInterval(loadAlerts, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);



  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEF9E7', fontFamily: 'system-ui, Arial' }}>
      {/* Header */}
         {/* Notification Popup */}
          {alerts.length > 0 && (
            <div
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                minWidth: '280px',
                backgroundColor: '#fff3cd',
                color: '#856404',
                border: '1px solid #ffeeba',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999,
                animation: 'fadeIn 0.3s ease-out',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong>⚠ Low Stock Alerts</strong>
                <button
                  onClick={async () => {
                    try {
                      await clearNotifications();
                      const freshAlerts = await getNotifications(); // reload from server
                      setAlerts(freshAlerts);
                    } catch (err) {
                      console.error('Failed to clear alerts', err);
                    }
                  }}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Clear
                </button>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {alerts.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          )}

  
      
      <header style={{ 
        backgroundColor: '#B8860B', 
        padding: '16px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#F4D03F', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#B8860B',
            fontWeight: 'bold'
          }}>📄</div>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Galle My Bungalow</span>
        </div>
        <a href="/" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', backgroundColor: '#9A7209', borderRadius: '4px' }}>
          ← Back to Dashboard
        </a>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            color: '#B8860B', 
            fontSize: '32px', 
            marginBottom: '8px',
            fontWeight: 'bold'
          }}>Add Resources</h1>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            marginBottom: '24px'
          }}>Manage your bungalow's inventory, categories, and stock levels.</p>
        </div>

        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#900', 
            padding: '12px 16px', 
            marginBottom: '24px',
            borderRadius: '4px',
            border: '1px solid #fcc'
          }}>{error}</div>
        )}

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#666'
          }}>Loading...</div>
        ) : (
          <>
            {/* Categories Section */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px', 
              marginBottom: '32px',
              border: '2px solid #B8860B',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ color: '#B8860B', marginBottom: '16px', fontSize: '20px' }}>Categories</h2>
              <form onSubmit={handleAddCategory} style={{ 
                display: 'grid', 
                gap: '12px', 
                gridTemplateColumns: '1fr 2fr auto',
                marginBottom: '20px'
              }}>
                <input 
                  required 
                  placeholder="Name" 
                  value={newCategory.name} 
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <input 
                  placeholder="Description" 
                  value={newCategory.description} 
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#B8860B',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >Add</button>
              </form>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map(c => (
                  <div key={c.id} style={{
                    backgroundColor: '#F4D03F',
                    color: '#B8860B',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{c.name} {c.description ? ` - ${c.description}` : ''}</span>
                    <button 
                      onClick={() => handleDeleteCategory(c.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete category"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Section */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px', 
              marginBottom: '32px',
              border: '2px solid #B8860B',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ color: '#B8860B', marginBottom: '16px', fontSize: '20px' }}>Items</h2>
              <form onSubmit={handleAddItem} style={{ 
                display: 'grid', 
                gap: '12px', 
                gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr auto',
                marginBottom: '20px'
              }}>
                <input 
                  required 
                  placeholder="Name" 
                  value={newItem.name} 
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <input 
                  placeholder="Description" 
                  value={newItem.description} 
                  onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <select 
                  required 
                  value={newItem.categoryId} 
                  onChange={e => setNewItem({ ...newItem, categoryId: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <input 
                  placeholder="Unit (e.g., pcs)" 
                  value={newItem.unit} 
                  onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <input 
                  type="number" 
                  min={0} 
                  placeholder="Qty On Hand" 
                  value={newItem.quantityOnHand} 
                  onChange={e => setNewItem({ ...newItem, quantityOnHand: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#B8860B',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >Add</button>
              </form>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  backgroundColor: 'white'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#FDF6E3' }}>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px',
                        color: '#B8860B',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #B8860B'
                      }}>Name</th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px',
                        color: '#B8860B',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #B8860B'
                      }}>Description</th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px',
                        color: '#B8860B',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #B8860B'
                      }}>Category</th>
                      <th style={{ 
                        textAlign: 'left', 
                        padding: '12px',
                        color: '#B8860B',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #B8860B'
                      }}>Unit</th>
                      <th style={{ 
                        textAlign: 'right', 
                        padding: '12px',
                        color: '#B8860B',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #B8860B'
                      }}>On Hand</th>
                      <th style={{ 
                        textAlign: 'center', 
                        padding: '12px',
                        color: '#B8860B',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #B8860B'
                      }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(i => (
                      <tr key={i.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{i.name}</td>
                        <td style={{ padding: '12px' }}>{i.description}</td>
                        <td style={{ padding: '12px' }}>{categories.find(c => c.id === i.categoryId)?.name || '-'}</td>
                        <td style={{ padding: '12px' }}>{i.unit}</td>
                        <td style={{ textAlign: 'right', padding: '12px' }}>{i.quantityOnHand ?? 0}</td>
                        <td style={{ textAlign: 'center', padding: '12px' }}>
                          <button 
                            onClick={() => handleDeleteItem(i.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stock Adjustment Section */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px',
              border: '2px solid #B8860B',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ color: '#B8860B', marginBottom: '16px', fontSize: '20px' }}>Adjust Stock</h2>
              <form onSubmit={handleAdjustStock} style={{ 
                display: 'grid', 
                gap: '12px', 
                gridTemplateColumns: '1fr 1fr 1fr 2fr auto'
              }}>
                <select 
                  required 
                  value={stockAdjust.id} 
                  onChange={e => setStockAdjust({ ...stockAdjust, id: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select Item</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
                <select 
                  required 
                  value={stockAdjust.type} 
                  onChange={e => setStockAdjust({ ...stockAdjust, type: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                </select>
                <input 
                  type="number" 
                  min={0} 
                  placeholder="Quantity" 
                  value={stockAdjust.quantity} 
                  onChange={e => setStockAdjust({ ...stockAdjust, quantity: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <input 
                  placeholder="Reason" 
                  value={stockAdjust.reason} 
                  onChange={e => setStockAdjust({ ...stockAdjust, reason: e.target.value })}
                  style={{
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#B8860B',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >Apply</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
