export const calculateGrossSalary = (basic, allowances = []) => {
  const totalAllowances = allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
  return basic + totalAllowances;
};

export const calculateDeductions = (gross, deductions = []) => {
  const totalDeductions = deductions.reduce((sum, deduction) => {
    if (deduction.type === 'percentage') {
      return sum + (gross * deduction.amount / 100);
    }
    return sum + deduction.amount;
  }, 0);
  return totalDeductions;
};

export const calculateTax = (grossSalary) => {
  let tax = 0;
  
  if (grossSalary <= 300000) {
    tax = 0;
  } else if (grossSalary <= 600000) {
    tax = (grossSalary - 300000) * 0.05;
  } else if (grossSalary <= 900000) {
    tax = 15000 + (grossSalary - 600000) * 0.10;
  } else if (grossSalary <= 1200000) {
    tax = 45000 + (grossSalary - 900000) * 0.15;
  } else if (grossSalary <= 1500000) {
    tax = 90000 + (grossSalary - 1200000) * 0.20;
  } else {
    tax = 150000 + (grossSalary - 1500000) * 0.30;
  }
  
  return Math.round(tax);
};

export const calculateNetSalary = (grossSalary, deductions = []) => {
  const tax = calculateTax(grossSalary);
  const otherDeductions = calculateDeductions(grossSalary, deductions.filter(d => d.name !== 'Tax'));
  return grossSalary - tax - otherDeductions;
};

export const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const convert = (n) => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    
    const thousands = ['', 'Thousand', 'Lakh', 'Crore'];
    const groups = [];
    
    // Indian numbering system
    let i = 0;
    while (n > 0) {
      if (i === 0) {
        groups.push(n % 1000);
        n = Math.floor(n / 1000);
        i++;
      } else {
        groups.push(n % 100);
        n = Math.floor(n / 100);
      }
    }
    
    return groups
      .map((g, idx) => g ? convert(g) + ' ' + thousands[idx] : '')
      .reverse()
      .join(' ')
      .trim();
  };
  
  return convert(Math.round(num)) + ' Rupees Only';
};