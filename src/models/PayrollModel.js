import { calculateTax, calculateNetSalary } from '../utils/salaryUtils';

export class PayrollModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.basicSalary = data.basicSalary || 0;
    this.allowances = data.allowances || [
      { name: 'House Rent Allowance', amount: 0 },
      { name: 'Conveyance Allowance', amount: 0 },
      { name: 'Medical Allowance', amount: 0 }
    ];
    this.deductions = data.deductions || [
      { name: 'Provident Fund', amount: 0 },
      { name: 'Professional Tax', amount: 0 }
    ];
    this.tax = data.tax || 0;
    this.payPeriodStart = data.payPeriodStart || new Date().toISOString();
    this.payPeriodEnd = data.payPeriodEnd || new Date().toISOString();
    this.paymentDate = data.paymentDate || new Date().toISOString();
    this.paymentMethod = data.paymentMethod || 'bank';
    this.status = data.status || 'pending';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  calculateGrossSalary() {
    const totalAllowances = this.allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
    return this.basicSalary + totalAllowances;
  }
  
  calculateTotalDeductions() {
    const totalOtherDeductions = this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
    return this.tax + totalOtherDeductions;
  }
  
  calculateNetSalary() {
    const gross = this.calculateGrossSalary();
    return calculateNetSalary(gross, this.deductions);
  }
  
  recalculateTax() {
    const gross = this.calculateGrossSalary();
    this.tax = calculateTax(gross);
    return this.tax;
  }
  
  static getPaymentMethods() {
    return [
      { value: 'bank', label: 'Bank Transfer' },
      { value: 'cash', label: 'Cash' },
      { value: 'cheque', label: 'Cheque' }
    ];
  }
  
  static getStatuses() {
    return [
      { value: 'draft', label: 'Draft', color: 'gray' },
      { value: 'pending', label: 'Pending', color: 'yellow' },
      { value: 'processed', label: 'Processed', color: 'blue' },
      { value: 'paid', label: 'Paid', color: 'green' },
      { value: 'cancelled', label: 'Cancelled', color: 'red' }
    ];
  }
  
  toFirebase() {
    const { id, ...data } = this;
    const gross = this.calculateGrossSalary();
    const net = this.calculateNetSalary();
    
    return {
      ...data,
      grossSalary: gross,
      netSalary: net,
      updatedAt: new Date().toISOString()
    };
  }
}