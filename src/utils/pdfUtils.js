import jsPDF from 'jspdf';
import { numberToWords, calculateNetSalary } from './salaryUtils';
import { formatDate } from './dateUtils';

export const generatePayslip = (employee, payroll, company) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Company Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(company.address, pageWidth / 2, 30, { align: 'center' });
  doc.text(`Phone: ${company.phone} | Email: ${company.email}`, pageWidth / 2, 36, { align: 'center' });
  
  // Payslip Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP', pageWidth / 2, 50, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${formatDate(payroll.payPeriodStart)} to ${formatDate(payroll.payPeriodEnd)}`, pageWidth / 2, 58, { align: 'center' });
  
  // Employee Details
  let yPos = 70;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Employee Details:', 20, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${employee.fullName}`, 20, yPos);
  doc.text(`Employee ID: ${employee.employeeId || employee.id}`, 120, yPos);
  
  yPos += 6;
  doc.text(`Department: ${employee.department}`, 20, yPos);
  doc.text(`Designation: ${employee.designation}`, 120, yPos);
  
  yPos += 6;
  doc.text(`Payment Date: ${formatDate(payroll.paymentDate)}`, 20, yPos);
  doc.text(`Bank Account: ${employee.bankAccount || 'N/A'}`, 120, yPos);
  
  // Earnings
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Earnings', 20, yPos);
  doc.text('Amount (₹)', 180, yPos, { align: 'right' });
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text(`Basic Salary`, 30, yPos);
  doc.text(payroll.basicSalary.toLocaleString('en-IN'), 180, yPos, { align: 'right' });
  
  payroll.allowances?.forEach(allowance => {
    yPos += 6;
    doc.text(allowance.name, 30, yPos);
    doc.text(allowance.amount.toLocaleString('en-IN'), 180, yPos, { align: 'right' });
  });
  
  // Total Earnings
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Earnings', 30, yPos);
  const grossSalary = payroll.basicSalary + (payroll.allowances?.reduce((sum, a) => sum + a.amount, 0) || 0);
  doc.text(grossSalary.toLocaleString('en-IN'), 180, yPos, { align: 'right' });
  
  // Deductions
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Deductions', 20, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Tax', 30, yPos);
  doc.text(payroll.tax.toLocaleString('en-IN'), 180, yPos, { align: 'right' });
  
  payroll.deductions?.forEach(deduction => {
    yPos += 6;
    doc.text(deduction.name, 30, yPos);
    doc.text(deduction.amount.toLocaleString('en-IN'), 180, yPos, { align: 'right' });
  });
  
  // Total Deductions
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Deductions', 30, yPos);
  const totalDeductions = payroll.tax + (payroll.deductions?.reduce((sum, d) => sum + d.amount, 0) || 0);
  doc.text(totalDeductions.toLocaleString('en-IN'), 180, yPos, { align: 'right' });
  
  // Net Salary
  yPos += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('NET SALARY', 20, yPos);
  const netSalary = calculateNetSalary(grossSalary, payroll.deductions || []);
  doc.text(`₹ ${netSalary.toLocaleString('en-IN')}`, 180, yPos, { align: 'right' });
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  const words = numberToWords(netSalary);
  doc.text(`In Words: ${words}`, 20, yPos, { maxWidth: 170 });
  
  // Footer
  yPos += 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Authorized Signature', 140, yPos);
  doc.line(140, yPos + 2, 180, yPos + 2);
  
  doc.text('Employee Signature', 20, yPos);
  doc.line(20, yPos + 2, 80, yPos + 2);
  
  // Footer note
  yPos += 15;
  doc.setFontSize(8);
  doc.text('This is a computer generated payslip, no signature required.', pageWidth / 2, yPos, { align: 'center' });
  
  return doc;
};