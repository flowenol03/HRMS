export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateSalary = (salary) => {
  return !isNaN(salary) && salary >= 0;
};

export const validateDate = (date) => {
  return date && !isNaN(new Date(date).getTime());
};

export const validateEmployeeForm = (data) => {
  const errors = {};
  
  if (!validateRequired(data.fullName)) {
    errors.fullName = 'Full name is required';
  }
  
  if (!validateRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!validateRequired(data.department)) {
    errors.department = 'Department is required';
  }
  
  if (!validateRequired(data.designation)) {
    errors.designation = 'Designation is required';
  }
  
  if (!validateSalary(data.basicSalary)) {
    errors.basicSalary = 'Valid salary is required';
  }
  
  return errors;
};