import { calculateLeaveDays } from '../utils/dateUtils';

export class LeaveModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.leaveType = data.leaveType || 'casual';
    this.startDate = data.startDate || new Date().toISOString();
    this.endDate = data.endDate || new Date().toISOString();
    this.reason = data.reason || '';
    this.status = data.status || 'pending';
    this.approvedBy = data.approvedBy || '';
    this.comments = data.comments || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  static getLeaveTypes() {
    return [
      { value: 'casual', label: 'Casual Leave' },
      { value: 'sick', label: 'Sick Leave' },
      { value: 'annual', label: 'Annual Leave' },
      { value: 'maternity', label: 'Maternity Leave' },
      { value: 'paternity', label: 'Paternity Leave' },
      { value: 'unpaid', label: 'Unpaid Leave' }
    ];
  }
  
  static getStatuses() {
    return [
      { value: 'pending', label: 'Pending', color: 'yellow' },
      { value: 'approved', label: 'Approved', color: 'green' },
      { value: 'rejected', label: 'Rejected', color: 'red' },
      { value: 'cancelled', label: 'Cancelled', color: 'gray' }
    ];
  }
  
  getTotalDays() {
    return calculateLeaveDays(this.startDate, this.endDate);
  }
  
  toFirebase() {
    const { id, ...data } = this;
    return {
      ...data,
      totalDays: this.getTotalDays(),
      updatedAt: new Date().toISOString()
    };
  }
}