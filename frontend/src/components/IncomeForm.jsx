import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema for Income
const IncomeSchema = z.object({
  amount: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return typeof num === 'number' && !isNaN(num) ? num : undefined;
    },
    z.number().min(0.01, 'Amount must be greater than 0').max(999999.99, 'Amount cannot exceed 999,999.99')
  ),
  reason: z.string()
    .min(1, 'Reason is required')
    .max(255, 'Reason must be less than 255 characters'),
  incomeDate: z.string()
    .min(1, 'Income date is required')
    .refine((val) => {
      if (!val) return false;
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    }, 'Income date cannot be in the future'),
  remarks: z.string()
    .max(500, 'Remarks must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  category: z.string()
    .max(50, 'Category must be less than 50 characters')
    .optional()
    .or(z.literal('')),
});

export default function IncomeForm({ initialValues, onSubmit, submitLabel = 'Save', disabled = false }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(IncomeSchema),
    defaultValues: initialValues ?? {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card">
      <div className="form-grid">
        {/* Amount */}
        <div className="form-group">
          <label className="label">Amount *</label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0.01"
            max="999999.99"
            className={`input ${errors.amount ? 'input-error' : ''}`}
            placeholder="Enter amount"
          />
          {errors.amount && <div className="help-error">{errors.amount.message}</div>}
          <div className="help-text">Maximum: 999,999.99</div>
        </div>

        {/* Reason */}
        <div className="form-group">
          <label className="label">Reason *</label>
          <input
            {...register('reason')}
            className={`input ${errors.reason ? 'input-error' : ''}`}
            placeholder="Enter reason for income"
          />
          {errors.reason && <div className="help-error">{errors.reason.message}</div>}
        </div>

        {/* Income Date */}
        <div className="form-group">
          <label className="label">Income Date *</label>
          <input
            {...register('incomeDate')}
            type="date"
            className={`input ${errors.incomeDate ? 'input-error' : ''}`}
          />
          {errors.incomeDate && <div className="help-error">{errors.incomeDate.message}</div>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="label">Category</label>
          <select {...register('category')} className={`input ${errors.category ? 'input-error' : ''}`}>
            <option value="">Select category</option>
            <option value="ROOM_BOOKING">Room Booking</option>
            <option value="RESTAURANT">Restaurant</option>
            <option value="SERVICES">Services</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.category && <div className="help-error">{errors.category.message}</div>}
        </div>

        {/* Remarks */}
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="label">Remarks</label>
          <textarea
            {...register('remarks')}
            className={`input ${errors.remarks ? 'input-error' : ''}`}
            placeholder="Enter additional remarks"
            rows="3"
          />
          {errors.remarks && <div className="help-error">{errors.remarks.message}</div>}
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
