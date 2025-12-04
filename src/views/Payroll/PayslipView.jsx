import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generatePayslip } from '../../utils/pdfUtils';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail,
  Share2,
  Copy,
  Check
} from 'lucide-react';

const PayslipView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Get data from navigation state or use default
  const { formData = {}, selectedEmployee = {} } = location.state || {};

  const company = {
    name: 'HRMS Corporation',
    address: '123 Business Street, Corporate City, CC 12345',
    phone: '+1 (555) 123-4567',
    email: 'hr@hrmscorp.com'
  };

  // Calculate totals
  const calculateTotals = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    
    const totalAllowances = (formData.allowances || []).reduce((sum, allowance) => {
      return sum + (parseFloat(allowance.amount) || 0);
    }, 0);
    
    const totalDeductions = (formData.deductions || []).reduce((sum, deduction) => {
      return sum + (parseFloat(deduction.amount) || 0);
    }, 0);
    
    const gross = basic + totalAllowances;
    const net = gross - totalDeductions;
    
    return { basic, totalAllowances, totalDeductions, gross, net };
  };

  const totals = calculateTotals();

  const handleDownload = () => {
    const payrollData = {
      ...formData,
      employeeName: selectedEmployee?.fullName || 'Employee',
      tax: 0, // Would be calculated
      netSalary: totals.net
    };

    const pdfDoc = generatePayslip(selectedEmployee, payrollData, company);
    pdfDoc.save(`payslip-${selectedEmployee?.fullName || 'employee'}-${formData.payPeriodStart}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    // In a real app, this would open email composer
    alert('Email feature would open email composer with payslip attached');
  };

  const handleShare = () => {
    // In a real app, this would use Web Share API
    if (navigator.share) {
      navigator.share({
        title: `Payslip - ${selectedEmployee?.fullName}`,
        text: `Payslip for ${selectedEmployee?.fullName}`,
        url: window.location.href
      });
    } else {
      alert('Share functionality not available in this browser');
    }
  };

  useEffect(() => {
    // Add print styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #payslip-content, #payslip-content * {
          visibility: visible;
        }
        #payslip-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payslip Preview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and download employee payslip
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          
          <button
            onClick={handleEmail}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Mail size={16} />
            <span>Email</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Payslip Content */}
      <div id="payslip-content" className="bg-white p-8 rounded-lg shadow-lg">
        {/* Company Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
          <p className="text-gray-600 mt-2">{company.address}</p>
          <p className="text-gray-600">Phone: {company.phone} | Email: {company.email}</p>
        </div>

        {/* Payslip Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">PAYSLIP</h2>
          <p className="text-gray-600 mt-2">
            Period: {formData.payPeriodStart} to {formData.payPeriodEnd}
          </p>
        </div>

        {/* Employee Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="font-medium">{selectedEmployee?.fullName || 'Employee Name'}</p>
            </div>
            <div>
              <p className="text-gray-600">Employee ID:</p>
              <p className="font-medium">{selectedEmployee?.username || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Department:</p>
              <p className="font-medium">{selectedEmployee?.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Designation:</p>
              <p className="font-medium">{selectedEmployee?.designation || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Earnings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Basic Salary</td>
                  <td className="py-2 text-right">₹{totals.basic.toLocaleString('en-IN')}</td>
                </tr>
                {(formData.allowances || []).map((allowance, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{allowance.name}</td>
                    <td className="py-2 text-right">₹{(parseFloat(allowance.amount) || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                <tr className="border-t font-bold">
                  <td className="py-2">Total Earnings</td>
                  <td className="py-2 text-right">₹{totals.gross.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deductions</h3>
            <table className="w-full">
              <tbody>
                {(formData.deductions || []).map((deduction, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{deduction.name}</td>
                    <td className="py-2 text-right">₹{(parseFloat(deduction.amount) || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                <tr className="border-t font-bold">
                  <td className="py-2">Total Deductions</td>
                  <td className="py-2 text-right">₹{totals.totalDeductions.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Salary */}
        <div className="text-center p-6 bg-gray-50 rounded-lg mb-8">
          <p className="text-gray-600 mb-2">NET SALARY</p>
          <p className="text-3xl font-bold text-primary-600">₹{totals.net.toLocaleString('en-IN')}</p>
          <p className="text-gray-600 mt-2 italic">
            {totals.net.toLocaleString('en-IN', { 
              style: 'currency', 
              currency: 'INR',
              minimumFractionDigits: 0 
            })} only
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12">
          <div className="text-center">
            <div className="border-t border-gray-400 pt-2 mb-8"></div>
            <p className="font-medium">Authorized Signature</p>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 pt-2 mb-8"></div>
            <p className="font-medium">Employee Signature</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500">
            This is a computer generated payslip, no signature required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayslipView;