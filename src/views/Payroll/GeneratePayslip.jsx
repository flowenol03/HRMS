import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayrollViewModel } from '../../viewmodels/PayrollViewModel';
import { useEmployeeViewModel } from '../../viewmodels/EmployeeViewModel';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Eye,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import SelectInput from '../../components/inputs/SelectInput';
import DateInput from '../../components/inputs/DateInput';
import TextInput from '../../components/inputs/TextInput';

const GeneratePayslip = () => {
  const navigate = useNavigate();
  const { employees } = useEmployeeViewModel();
  const { handleGeneratePayslip, generatingPdf } = usePayrollViewModel();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    payPeriodStart: new Date().toISOString().split('T')[0].substring(0, 8) + '01', // First day of current month
    payPeriodEnd: new Date().toISOString().split('T')[0], // Today
    basicSalary: '',
    allowances: [
      { name: 'House Rent Allowance', amount: '' },
      { name: 'Conveyance Allowance', amount: '' },
      { name: 'Medical Allowance', amount: '' }
    ],
    deductions: [
      { name: 'Provident Fund', amount: '' },
      { name: 'Professional Tax', amount: '' }
    ]
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (formData.employeeId) {
      const emp = employees.find(e => e.username === formData.employeeId);
      setSelectedEmployee(emp);
      if (emp && !formData.basicSalary) {
        setFormData(prev => ({ ...prev, basicSalary: emp.basicSalary || '' }));
      }
    }
  }, [formData.employeeId, employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAllowanceChange = (index, field, value) => {
    const newAllowances = [...formData.allowances];
    newAllowances[index] = { ...newAllowances[index], [field]: value };
    setFormData(prev => ({ ...prev, allowances: newAllowances }));
  };

  const handleDeductionChange = (index, field, value) => {
    const newDeductions = [...formData.deductions];
    newDeductions[index] = { ...newDeductions[index], [field]: value };
    setFormData(prev => ({ ...prev, deductions: newDeductions }));
  };

  const addAllowance = () => {
    setFormData(prev => ({
      ...prev,
      allowances: [...prev.allowances, { name: '', amount: '' }]
    }));
  };

  const addDeduction = () => {
    setFormData(prev => ({
      ...prev,
      deductions: [...prev.deductions, { name: '', amount: '' }]
    }));
  };

  const removeAllowance = (index) => {
    const newAllowances = formData.allowances.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, allowances: newAllowances }));
  };

  const removeDeduction = (index) => {
    const newDeductions = formData.deductions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, deductions: newDeductions }));
  };

  const calculateTotals = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    
    const totalAllowances = formData.allowances.reduce((sum, allowance) => {
      return sum + (parseFloat(allowance.amount) || 0);
    }, 0);
    
    const totalDeductions = formData.deductions.reduce((sum, deduction) => {
      return sum + (parseFloat(deduction.amount) || 0);
    }, 0);
    
    const gross = basic + totalAllowances;
    const net = gross - totalDeductions;
    
    return { basic, totalAllowances, totalDeductions, gross, net };
  };

  const handleGenerate = async () => {
    if (!formData.employeeId) {
      alert('Please select an employee');
      return;
    }

    if (!formData.basicSalary) {
      alert('Please enter basic salary');
      return;
    }

    const payrollData = {
      ...formData,
      employeeName: selectedEmployee?.fullName || '',
      allowances: formData.allowances.map(a => ({
        name: a.name,
        amount: parseFloat(a.amount) || 0
      })),
      deductions: formData.deductions.map(d => ({
        name: d.name,
        amount: parseFloat(d.amount) || 0
      })),
      tax: 0, // Would be calculated by the system
      status: 'draft'
    };

    // In a real app, you would save to database first
    // For now, simulate payslip generation
    const result = await handleGeneratePayslip({
      ...payrollData,
      id: Date.now().toString()
    });
    
    if (result.success) {
      alert('Payslip generated successfully!');
    }
  };

  const handlePreview = () => {
    // Navigate to preview page with form data
    navigate('/payroll/preview', { state: { formData, selectedEmployee } });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/payroll')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Generate Payslip
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and generate employee payslips
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-6">
            {/* Employee Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Employee Details
              </h3>
              <SelectInput
                label="Select Employee"
                value={formData.employeeId}
                onChange={handleChange}
                options={employees
                  .filter(e => e.role === 'employee')
                  .map(e => ({ value: e.username, label: `${e.fullName} - ${e.department}` }))
                }
                placeholder="Choose an employee"
                name="employeeId"
                required
              />
            </div>

            {/* Pay Period */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pay Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInput
                  label="Start Date"
                  value={formData.payPeriodStart}
                  onChange={handleChange}
                  name="payPeriodStart"
                  required
                />
                <DateInput
                  label="End Date"
                  value={formData.payPeriodEnd}
                  onChange={handleChange}
                  name="payPeriodEnd"
                  required
                />
              </div>
            </div>

            {/* Basic Salary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Salary Details
              </h3>
              <TextInput
                label="Basic Salary (₹)"
                type="number"
                value={formData.basicSalary}
                onChange={handleChange}
                placeholder="Enter basic salary"
                name="basicSalary"
                required
              />
            </div>

            {/* Allowances */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Allowances
                </h3>
                <button
                  type="button"
                  onClick={addAllowance}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  + Add Allowance
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.allowances.map((allowance, index) => (
                  <div key={index} className="flex items-end space-x-4">
                    <TextInput
                      label={`Allowance ${index + 1} Name`}
                      value={allowance.name}
                      onChange={(e) => handleAllowanceChange(index, 'name', e.target.value)}
                      placeholder="Allowance name"
                      className="flex-1"
                    />
                    <TextInput
                      label="Amount (₹)"
                      type="number"
                      value={allowance.amount}
                      onChange={(e) => handleAllowanceChange(index, 'amount', e.target.value)}
                      placeholder="0"
                      className="w-32"
                    />
                    {index >= 3 && (
                      <button
                        type="button"
                        onClick={() => removeAllowance(index)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Deductions
                </h3>
                <button
                  type="button"
                  onClick={addDeduction}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  + Add Deduction
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.deductions.map((deduction, index) => (
                  <div key={index} className="flex items-end space-x-4">
                    <TextInput
                      label={`Deduction ${index + 1} Name`}
                      value={deduction.name}
                      onChange={(e) => handleDeductionChange(index, 'name', e.target.value)}
                      placeholder="Deduction name"
                      className="flex-1"
                    />
                    <TextInput
                      label="Amount (₹)"
                      type="number"
                      value={deduction.amount}
                      onChange={(e) => handleDeductionChange(index, 'amount', e.target.value)}
                      placeholder="0"
                      className="w-32"
                    />
                    {index >= 2 && (
                      <button
                        type="button"
                        onClick={() => removeDeduction(index)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Salary Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Basic Salary</span>
                <span className="font-medium">₹{totals.basic.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Allowances</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  +₹{totals.totalAllowances.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Deductions</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -₹{totals.totalDeductions.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Gross Salary</span>
                  <span className="font-bold">₹{totals.gross.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Net Salary</span>
                  <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
                    ₹{totals.net.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actions
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={handlePreview}
                disabled={!formData.employeeId || generatingPdf}
                className="w-full flex items-center justify-center space-x-2 btn-secondary py-3"
              >
                <Eye size={18} />
                <span>Preview Payslip</span>
              </button>
              
              <button
                onClick={handleGenerate}
                disabled={!formData.employeeId || generatingPdf}
                className="w-full flex items-center justify-center space-x-2 btn-primary py-3"
              >
                {generatingPdf ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Download Payslip</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleGenerate}
                disabled={!formData.employeeId || generatingPdf}
                className="w-full flex items-center justify-center space-x-2 btn-secondary py-3"
              >
                <Printer size={18} />
                <span>Print Payslip</span>
              </button>
            </div>
          </div>

          {/* Employee Info Card */}
          {selectedEmployee && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Employee Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="text-gray-400" size={18} />
                  <div>
                    <p className="font-medium">{selectedEmployee.fullName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedEmployee.designation}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <DollarSign className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Basic</p>
                    <p className="font-medium">₹{selectedEmployee.basicSalary?.toLocaleString('en-IN') || '0'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePayslip;