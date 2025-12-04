export class AuditModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.userName = data.userName || '';
    this.action = data.action || '';
    this.module = data.module || '';
    this.details = data.details || '';
    this.ipAddress = data.ipAddress || '';
    this.userAgent = data.userAgent || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
  
  static getActions() {
    return [
      'LOGIN',
      'LOGOUT',
      'CREATE',
      'UPDATE',
      'DELETE',
      'APPROVE',
      'REJECT',
      'VIEW',
      'DOWNLOAD',
      'PRINT'
    ];
  }
  
  static getModules() {
    return [
      'AUTH',
      'EMPLOYEE',
      'ATTENDANCE',
      'LEAVE',
      'PAYROLL',
      'PERFORMANCE',
      'SETTINGS',
      'REPORTS'
    ];
  }
  
  toFirebase() {
    const { id, ...data } = this;
    return data;
  }
}