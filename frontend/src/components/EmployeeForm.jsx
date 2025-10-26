import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema aligned with DB fields
const EmployeeSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),

  nic: z.string()
    .min(5, 'NIC must be at least 5 characters')
    .max(20, 'NIC must be less than 20 characters')
    .regex(/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/, 'Invalid NIC format. Use format: 123456789V or 123456789012'),
  
  address: z.string()
    .min(1, 'Address is required')
    .max(255, 'Address must be less than 255 characters'),

  phone: z.string()
    .max(50, 'Phone number must be less than 50 characters')
    .regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),

  department: z.string()
    .min(1, 'Department is required')
    .max(100, 'Department must be less than 100 characters'),

  position: z.string()
    .min(1, 'Position is required')
    .max(100, 'Position must be less than 100 characters'),

  hireDate: z.string()
    .min(1, 'Hire date is required')
    .refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    }, 'Hire date cannot be in the future'),
  
  role: z.string()
     .max(50, 'Role must be less than 50 characters')
     .optional()
     .or(z.literal('')),
   
  status: z.string()
     .max(20, 'Status must be less than 20 characters')
     .optional()
     .or(z.literal('')),
  
  joinDate: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    }, 'Join date cannot be in the future'),
  
  dateOfBirth: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      const birthDate = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred this year
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
        ? age - 1 
        : age;
      
      return actualAge >= 16 && actualAge <= 100;
    }, 'Date of birth must be valid and age must be between 16 and 100 years'),

  salary: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return typeof num === 'number' && !isNaN(num) ? num : undefined;
    },
    z.union([
      z.number().min(0, 'Salary cannot be negative').max(999999.99, 'Salary cannot exceed 999,999.99'),
      z.undefined()
    ])
  ),
});

export default function EmployeeForm({ initialValues, onSubmit, submitLabel = 'Save', disabled = false }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: initialValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card">
      <div className="form-grid">
        {/* First name */}
        <div className="form-group">
          <label className="label">First name *</label>
          <input {...register('firstName')} className={`input ${errors.firstName ? 'input-error' : ''}`} placeholder="Enter first name" />
          {errors.firstName && <div className="help-error">{errors.firstName.message}</div>}
        </div>

        {/* Last name */}
        <div className="form-group">
          <label className="label">Last name *</label>
          <input {...register('lastName')} className={`input ${errors.lastName ? 'input-error' : ''}`} placeholder="Enter last name" />
          {errors.lastName && <div className="help-error">{errors.lastName.message}</div>}
        </div>

        {/* NIC */}
        <div className="form-group">
          <label className="label">NIC *</label>
          <input {...register('nic')} className={`input ${errors.nic ? 'input-error' : ''}`} placeholder="Enter NIC number (e.g., 123456789V)" />
          {errors.nic && <div className="help-error">{errors.nic.message}</div>}
          <div className="help-text">Format: 123456789V or 123456789012</div>
        </div>

        {/* Address */}
        <div className="form-group">
          <label className="label">Address *</label>
          <textarea {...register('address')} className={`input ${errors.address ? 'input-error' : ''}`} placeholder="Enter full address" rows="3" />
          {errors.address && <div className="help-error">{errors.address.message}</div>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="label">Phone</label>
          <input {...register('phone')} className={`input ${errors.phone ? 'input-error' : ''}`} placeholder="Enter phone number (e.g., +94 77 123 4567)" />
          {errors.phone && <div className="help-error">{errors.phone.message}</div>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label className="label">Department *</label>
          <input {...register('department')} className={`input ${errors.department ? 'input-error' : ''}`} placeholder="Enter department (e.g., IT, HR, Finance)" />
          {errors.department && <div className="help-error">{errors.department.message}</div>}
        </div>

        {/* Position */}
        <div className="form-group">
          <label className="label">Position *</label>
          <input {...register('position')} className={`input ${errors.position ? 'input-error' : ''}`} placeholder="Enter job position (e.g., Software Developer, Manager)" />
          {errors.position && <div className="help-error">{errors.position.message}</div>}
        </div>

        {/* Hire Date */}
        <div className="form-group">
          <label className="label">Hire Date *</label>
          <input {...register('hireDate')} type="date" className={`input ${errors.hireDate ? 'input-error' : ''}`} />
          {errors.hireDate && <div className="help-error">{errors.hireDate.message}</div>}
        </div>

         {/* Role */}
         <div className="form-group">
           <label className="label">Role</label>
           <input {...register('role')} className={`input ${errors.role ? 'input-error' : ''}`} placeholder="Enter job role" />
           {errors.role && <div className="help-error">{errors.role.message}</div>}
         </div>

         {/* Status */}
         <div className="form-group">
           <label className="label">Status</label>
           <select {...register('status')} className={`input ${errors.status ? 'input-error' : ''}`}>
             <option value="">Select status</option>
             <option value="ACTIVE">Active</option>
             <option value="INACTIVE">Inactive</option>
           </select>
           {errors.status && <div className="help-error">{errors.status.message}</div>}
         </div>

        {/* Join Date */}
        <div className="form-group">
          <label className="label">Join date</label>
          <input {...register('joinDate')} type="date" className={`input ${errors.joinDate ? 'input-error' : ''}`} />
          {errors.joinDate && <div className="help-error">{errors.joinDate.message}</div>}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label className="label">Date of Birth</label>
          <input {...register('dateOfBirth')} type="date" className={`input ${errors.dateOfBirth ? 'input-error' : ''}`} />
          {errors.dateOfBirth && <div className="help-error">{errors.dateOfBirth.message}</div>}
          <div className="help-text">Age must be between 16 and 100 years</div>
        </div>

        {/* Salary */}
        <div className="form-group">
          <label className="label">Salary</label>
          <input
            {...register('salary', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            max="999999.99"
            className={`input ${errors.salary ? 'input-error' : ''}`}
            placeholder="Enter salary amount"
          />
          {errors.salary && <div className="help-error">{errors.salary.message}</div>}
          <div className="help-text">Maximum: 999,999.99</div>
        </div>

      </div>
      
      {/* Submit button */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={isSubmitting || disabled}
          className="btn btn-primary"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
