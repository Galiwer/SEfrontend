import React, { useEffect, useState } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import { getEmployeeByNic, updateEmployee, deleteEmployee } from '../api/employees';
import { useNavigate, useParams } from 'react-router-dom';

export default function EmployeeEditPage() {
  const params = useParams(); // now NIC instead of id
  const nic = params.nic;
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!nic) return;
    (async () => {
      try {
         const data = await getEmployeeByNic(nic.trim());
         const formatted = {
           ...data,
           joinDate: data.joinDate ?? '',
           dateOfBirth: data.dateOfBirth ?? '',
           salary: data.salary ?? 0,
         };
         setInitial(formatted);
      } catch (err) {
        if (err?.response?.status === 404) {
          alert(`No employee found for NIC: ${nic}`);
          return;
        }
        alert(err?.response?.data?.message ?? err?.message ?? 'Failed to load employee');
      }
    })();
  }, [nic]);

  const handleUpdate = async (values) => {
    if (!nic) {
      alert('NIC is required');
      return;
    }
    if (!initial?.id) {
      alert('Employee ID not found. Cannot update.');
      return;
    }
    try {
      await updateEmployee(Number(initial.id), values);
      alert('Successfully Updated Employee');
      navigate('/admin/employees');
    } catch (err) {
      console.error('Update error:', err);
      alert(err?.response?.data?.message ?? err?.message ?? 'Failed to update employee');
    }
  };

  const handleDelete = async () => {
    if (!initial?.id) {
      alert('Employee ID not found. Cannot delete.');
      return;
    }
    
    setIsDeleting(true);
    try {
      await deleteEmployee(Number(initial.id));
      alert('Employee deleted successfully');
      navigate('/admin/employees');
    } catch (err) {
      console.error('Delete error:', err);
      alert(err?.response?.data?.message ?? err?.message ?? 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!initial) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Employee</h1>
          <p className="page-description">
            Update the details for <strong>{initial.firstName} {initial.lastName}</strong>
          </p>
          <div className="text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            NIC: <code>{nic}</code>
          </div>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isDeleting ? 'Deleting...' : 'Delete Employee'}
          </button>
        </div>
      </div>

      <EmployeeForm
        initialValues={initial}
        onSubmit={handleUpdate}
        submitLabel="Update Employee"
        disabled={false}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{initial.firstName} {initial.lastName}</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
