import React, { useEffect, useState } from 'react'
import { getAttendance, markAttendance, updateAttendance, getEmployees, getAttendanceByEmployee, getAttendanceSummary } from '../api/employees.js'

export default function Attendance() {
  const [rows, setRows] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [employeeAttendance, setEmployeeAttendance] = useState([])
  const [attendanceSummary, setAttendanceSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ employeeId: '', workDate: '', status: 'PRESENT' })

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [attendanceData, employeesData] = await Promise.all([
        getAttendance(),
        getEmployees()
      ])
      setRows(attendanceData)
      setEmployees(employeesData)
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function loadEmployeeAttendance(employeeId) {
    if (!employeeId) return
    
    try {
      setError('')
      const [attendanceData, summaryData] = await Promise.all([
        getAttendanceByEmployee(employeeId),
        getAttendanceSummary(employeeId)
      ])
      setEmployeeAttendance(attendanceData)
      setAttendanceSummary(summaryData)
      
      // Find and set the selected employee
      const employee = employees.find(emp => emp.id === employeeId)
      setSelectedEmployee(employee)
    } catch (e) {
      setError(e.message || 'Failed to load employee attendance')
    }
  }

  useEffect(() => { load() }, [])

  async function handleMark(e) {
    e.preventDefault()
    try {
      const payload = {
        employeeId: Number(form.employeeId),
        workDate: form.workDate,
        status: form.status
      }
      const created = await markAttendance(payload)
      setRows(prev => [...prev, created])
      
      // If we're viewing a specific employee, refresh their attendance
      if (selectedEmployee && selectedEmployee.id === Number(form.employeeId)) {
        loadEmployeeAttendance(selectedEmployee.id)
      }
      
      setForm({ employeeId: '', workDate: '', status: 'PRESENT' })
    } catch (e) {
      setError(e.message || 'Failed to mark attendance')
    }
  }

  async function handleUpdate(r) {
    try {
      const next = r.status === 'PRESENT' ? 'ABSENT' : r.status === 'ABSENT' ? 'LEAVE' : 'PRESENT'
      const updated = await updateAttendance(r.employeeId, r.workDate, next)
      setRows(prev => prev.map(x => (x.id === updated.id ? updated : x)))
      
      // If we're viewing a specific employee, refresh their attendance
      if (selectedEmployee && selectedEmployee.id === r.employeeId) {
        loadEmployeeAttendance(selectedEmployee.id)
      }
    } catch (e) {
      setError(e.message || 'Failed to update attendance')
    }
  }

  function handleEmployeeSelect(employeeId) {
    if (employeeId) {
      loadEmployeeAttendance(Number(employeeId))
    } else {
      setSelectedEmployee(null)
      setEmployeeAttendance([])
      setAttendanceSummary(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEF9E7', fontFamily: 'system-ui, Arial' }}>
      <header style={{ backgroundColor: '#B8860B', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Galle My Bungalow</span>
        <a href="/" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', backgroundColor: '#9A7209', borderRadius: '4px' }}>
          ← Back to Dashboard
        </a>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ color: '#B8860B', fontSize: '28px', marginBottom: '16px', fontWeight: 'bold' }}>Attendance Management</h1>

        {error && (
          <div style={{ background: '#fee', color: '#900', padding: '12px 16px', marginBottom: '16px', border: '1px solid #fcc', borderRadius: 4 }}>{error}</div>
        )}

        {/* Employee Selection */}
        <div style={{ background: 'white', border: '2px solid #B8860B', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <h2 style={{ color: '#B8860B', marginBottom: 12, fontSize: 18 }}>Select Employee to View Records</h2>
          <select 
            value={selectedEmployee?.id || ''} 
            onChange={e => handleEmployeeSelect(e.target.value)}
            style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4, width: '100%', maxWidth: 400 }}
          >
            <option value="">-- Select an Employee --</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} - {emp.department} ({emp.position})
              </option>
            ))}
          </select>
        </div>

        {/* Employee Attendance Summary */}
        {selectedEmployee && attendanceSummary && (
          <div style={{ background: 'white', border: '2px solid #B8860B', borderRadius: 8, padding: 24, marginBottom: 24 }}>
            <h2 style={{ color: '#B8860B', marginBottom: 16, fontSize: 18 }}>
              Attendance Summary - {selectedEmployee.firstName} {selectedEmployee.lastName}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#F4D03F', borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#B8860B' }}>{attendanceSummary.totalDays}</div>
                <div style={{ color: '#666' }}>Total Days</div>
              </div>
              <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#90EE90', borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#006400' }}>{attendanceSummary.presentDays}</div>
                <div style={{ color: '#666' }}>Present</div>
              </div>
              <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#FFB6C1', borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#DC143C' }}>{attendanceSummary.absentDays}</div>
                <div style={{ color: '#666' }}>Absent</div>
              </div>
              <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#87CEEB', borderRadius: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#4682B4' }}>{attendanceSummary.leaveDays}</div>
                <div style={{ color: '#666' }}>Leave</div>
              </div>
            </div>
          </div>
        )}

        {/* Mark Attendance Form */}
        <div style={{ background: 'white', border: '2px solid #B8860B', borderRadius: 8, padding: 24, marginBottom: 24 }}>
          <h2 style={{ color: '#B8860B', marginBottom: 12, fontSize: 18 }}>Mark Attendance</h2>
          <form onSubmit={handleMark} style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr auto' }}>
            <select required value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
            <input required type="date" value={form.workDate} onChange={e => setForm({ ...form, workDate: e.target.value })} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4 }} />
            <select required value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
              <option value="PRESENT">PRESENT</option>
              <option value="ABSENT">ABSENT</option>
              <option value="LEAVE">LEAVE</option>
            </select>
            <button type="submit" style={{ backgroundColor: '#B8860B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 4, fontWeight: 'bold' }}>Save</button>
          </form>
        </div>

        <div style={{ background: 'white', border: '2px solid #B8860B', borderRadius: 8, padding: 24 }}>
          <h2 style={{ color: '#B8860B', marginBottom: 12, fontSize: 18 }}>
            {selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} - Attendance Records` : 'All Attendance Records'}
          </h2>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>Loading...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FDF6E3' }}>
                    <th style={{ textAlign: 'left', padding: 12, color: '#B8860B', borderBottom: '2px solid #B8860B' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: 12, color: '#B8860B', borderBottom: '2px solid #B8860B' }}>Employee</th>
                    <th style={{ textAlign: 'left', padding: 12, color: '#B8860B', borderBottom: '2px solid #B8860B' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: 12, color: '#B8860B', borderBottom: '2px solid #B8860B' }}>Status</th>
                    <th style={{ textAlign: 'center', padding: 12, color: '#B8860B', borderBottom: '2px solid #B8860B' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedEmployee ? employeeAttendance : rows).map(r => {
                    const employee = employees.find(emp => emp.id === r.employeeId)
                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: 12 }}>{r.id}</td>
                        <td style={{ padding: 12 }}>
                          {employee ? `${employee.firstName} ${employee.lastName}` : `Employee ${r.employeeId}`}
                        </td>
                        <td style={{ padding: 12 }}>{r.workDate}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: r.status === 'PRESENT' ? '#90EE90' : 
                                           r.status === 'ABSENT' ? '#FFB6C1' : '#87CEEB',
                            color: r.status === 'PRESENT' ? '#006400' : 
                                   r.status === 'ABSENT' ? '#DC143C' : '#4682B4'
                          }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding: 12, textAlign: 'center' }}>
                          <button 
                            onClick={() => handleUpdate(r)} 
                            style={{ 
                              background: '#9A7209', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: 4,
                              cursor: 'pointer'
                            }}
                          >
                            Cycle Status
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {selectedEmployee && employeeAttendance.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                  No attendance records found for {selectedEmployee.firstName} {selectedEmployee.lastName}
                </div>
              )}
              {!selectedEmployee && rows.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                  No attendance records found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


