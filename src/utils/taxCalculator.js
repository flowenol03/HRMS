export const calculateIncomeTax = (annualIncome, year = 2024) => {
  // Indian income tax slabs for FY 2024-25
  let tax = 0;
  
  if (annualIncome <= 300000) {
    // No tax for income up to ₹3,00,000
    tax = 0;
  } else if (annualIncome <= 600000) {
    // 5% for income between ₹3,00,001 to ₹6,00,000
    tax = (annualIncome - 300000) * 0.05;
  } else if (annualIncome <= 900000) {
    // ₹15,000 + 10% for income between ₹6,00,001 to ₹9,00,000
    tax = 15000 + (annualIncome - 600000) * 0.10;
  } else if (annualIncome <= 1200000) {
    // ₹45,000 + 15% for income between ₹9,00,001 to ₹12,00,000
    tax = 45000 + (annualIncome - 900000) * 0.15;
  } else if (annualIncome <= 1500000) {
    // ₹90,000 + 20% for income between ₹12,00,001 to ₹15,00,000
    tax = 90000 + (annualIncome - 1200000) * 0.20;
  } else {
    // ₹1,50,000 + 30% for income above ₹15,00,000
    tax = 150000 + (annualIncome - 1500000) * 0.30;
  }
  
  // Add health and education cess (4%)
  tax = tax + (tax * 0.04);
  
  return Math.round(tax);
};

export const calculateProvidentFund = (basicSalary, employeeContribution = 12, employerContribution = 12) => {
  // PF is calculated on basic salary
  const employeePF = (basicSalary * employeeContribution) / 100;
  const employerPF = (basicSalary * employerContribution) / 100;
  const totalPF = employeePF + employerPF;
  
  return {
    employee: Math.round(employeePF),
    employer: Math.round(employerPF),
    total: Math.round(totalPF)
  };
};

export const calculateProfessionalTax = (annualIncome, state = 'default') => {
  // Professional tax varies by state, here's a simplified version
  const monthlySalary = annualIncome / 12;
  
  if (monthlySalary <= 15000) {
    return 0;
  } else if (monthlySalary <= 20000) {
    return 150;
  } else if (monthlySalary <= 25000) {
    return 200;
  } else if (monthlySalary <= 30000) {
    return 250;
  } else {
    return 300;
  }
};

export const calculateESI = (grossSalary, employeeRate = 0.75, employerRate = 3.25) => {
  // ESI is applicable when gross salary is <= ₹21,000 per month
  if (grossSalary > 21000) {
    return {
      employee: 0,
      employer: 0,
      total: 0
    };
  }
  
  const employeeESI = (grossSalary * employeeRate) / 100;
  const employerESI = (grossSalary * employerRate) / 100;
  const totalESI = employeeESI + employerESI;
  
  return {
    employee: Math.round(employeeESI),
    employer: Math.round(employerESI),
    total: Math.round(totalESI)
  };
};

export const calculateTDS = (annualIncome, deductions = 0) => {
  // Calculate taxable income after deductions
  const taxableIncome = Math.max(0, annualIncome - deductions);
  
  // Calculate tax on taxable income
  const tax = calculateIncomeTax(taxableIncome);
  
  // TDS is tax divided by 12 (monthly deduction)
  const monthlyTDS = tax / 12;
  
  return {
    annualTax: Math.round(tax),
    monthlyTDS: Math.round(monthlyTDS)
  };
};

export const getTaxSlabs = (year = 2024) => {
  return [
    { from: 0, to: 300000, rate: 0, description: 'No tax' },
    { from: 300001, to: 600000, rate: 5, description: '5% of income exceeding ₹3,00,000' },
    { from: 600001, to: 900000, rate: 10, description: '₹15,000 + 10% of income exceeding ₹6,00,000' },
    { from: 900001, to: 1200000, rate: 15, description: '₹45,000 + 15% of income exceeding ₹9,00,000' },
    { from: 1200001, to: 1500000, rate: 20, description: '₹90,000 + 20% of income exceeding ₹12,00,000' },
    { from: 1500001, to: Infinity, rate: 30, description: '₹1,50,000 + 30% of income exceeding ₹15,00,000' }
  ];
};