export class AttendanceModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.date = data.date || new Date().toISOString().split('T')[0];
    this.checkIn = data.checkIn || '';
    this.checkOut = data.checkOut || '';
    this.status = data.status || 'present';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
  
  static getStatuses() {
    return [
      { value: 'present', label: 'Present', color: 'green' },
      { value: 'absent', label: 'Absent', color: 'red' },
      { value: 'half-day', label: 'Half Day', color: 'yellow' },
      { value: 'late', label: 'Late', color: 'orange' },
      { value: 'leave', label: 'On Leave', color: 'blue' }
    ];
  }
  
  calculateHours() {
    if (!this.checkIn || !this.checkOut) return 0;
    
    const [inHour, inMin] = this.checkIn.split(':').map(Number);
    const [outHour, outMin] = this.checkOut.split(':').map(Number);
    
    let hours = outHour - inHour;
    let minutes = outMin - inMin;
    
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    
    return hours + (minutes / 60);
  }
  
  toFirebase() {
    const { id, ...data } = this;
    return data;
  }
}