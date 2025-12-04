import { useState, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../utils/dateUtils';

export const useDashboardViewModel = () => {
  const { data: employees, fetchData: fetchEmployees } = useFirebase('users');
  const { data: attendance, fetchData: fetchAttendance } = useFirebase('attendance');
  const { data: leaves, fetchData: fetchLeaves } = useFirebase('leaves');
  const { data: payroll, fetchData: fetchPayroll } = useFirebase('payroll');
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    totalPayroll: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchEmployees(),
        fetchAttendance(),
        fetchLeaves(),
        fetchPayroll()
      ]);
    };
    
    loadData();
  }, [fetchEmployees, fetchAttendance, fetchLeaves, fetchPayroll]);
  
  useEffect(() => {
    if (employees.length > 0 && attendance.length > 0 && leaves.length > 0 && payroll.length > 0) {
      const today = formatDate(new Date(), 'yyyy-MM-dd');
      
      const totalEmployees = employees.filter(e => e.role === 'employee').length;
      const presentToday = attendance.filter(a => 
        a.date === today && a.status === 'present'
      ).length;
      const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
      const totalPayroll = payroll
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + (p.netSalary || 0), 0);
      
      setStats({
        totalEmployees,
        presentToday,
        pendingLeaves,
        totalPayroll
      });
      
      // Generate recent activities
      const activities = [
        ...attendance.slice(-5).map(a => ({
          type: 'attendance',
          title: `${a.employeeName} checked ${a.checkIn ? 'in' : 'out'}`,
          time: formatDate(a.createdAt, 'HH:mm'),
          date: a.date
        })),
        ...leaves.slice(-5).map(l => ({
          type: 'leave',
          title: `${l.employeeName} applied for ${l.leaveType} leave`,
          time: formatDate(l.createdAt, 'HH:mm'),
          date: l.startDate
        })),
        ...payroll.slice(-5).map(p => ({
          type: 'payroll',
          title: `Payroll processed for ${p.employeeName}`,
          time: formatDate(p.updatedAt, 'HH:mm'),
          date: p.paymentDate
        }))
      ].sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
       .slice(0, 10);
      
      setRecentActivities(activities);
    }
  }, [employees, attendance, leaves, payroll]);
  
  const getRoleBasedData = () => {
    if (user?.role === 'employee') {
      const employeeData = employees.find(e => e.username === user.username);
      const todayAttendance = attendance.find(a => 
        a.employeeId === user.username && a.date === formatDate(new Date(), 'yyyy-MM-dd')
      );
      const employeeLeaves = leaves.filter(l => l.employeeId === user.username);
      const employeePayroll = payroll.filter(p => p.employeeId === user.username);
      
      return {
        employee: employeeData,
        todayAttendance,
        leaveBalance: {
          casual: 12,
          sick: 10,
          annual: 15
        },
        recentPayroll: employeePayroll.slice(-3)
      };
    }
    
    return {};
  };
  
  return {
    stats,
    recentActivities,
    getRoleBasedData,
    user
  };
};