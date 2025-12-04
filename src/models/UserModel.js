export class UserModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.role = data.role || 'employee';
    this.fullName = data.fullName || '';
    this.department = data.department || '';
    this.designation = data.designation || '';
    this.joinDate = data.joinDate || new Date().toISOString();
    this.bankAccount = data.bankAccount || '';
    this.phone = data.phone || '';
    this.address = data.address || '';
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  static getRoles() {
    return [
      { value: 'admin', label: 'Administrator' },
      { value: 'hr', label: 'HR Manager' },
      { value: 'employee', label: 'Employee' }
    ];
  }
  
  static getDepartments() {
    return [
      'IT',
      'Human Resources',
      'Sales',
      'Marketing',
      'Finance',
      'Operations',
      'Customer Support',
      'Research & Development'
    ];
  }
  
  static getDesignations() {
    return [
      'Software Engineer',
      'Senior Software Engineer',
      'Team Lead',
      'Project Manager',
      'HR Manager',
      'HR Executive',
      'Sales Manager',
      'Sales Executive',
      'Marketing Manager',
      'Finance Manager',
      'Accountant',
      'Operations Manager',
      'Customer Support Executive',
      'Research Analyst'
    ];
  }
  
  toFirebase() {
    const { id, ...data } = this;
    return {
      ...data,
      updatedAt: new Date().toISOString()
    };
  }
}