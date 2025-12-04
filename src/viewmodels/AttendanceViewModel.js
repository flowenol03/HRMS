import { useState, useCallback, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../hooks/useAuth';
import { AttendanceModel } from '../models/AttendanceModel';
import { formatDate, getDateOnly } from '../utils/dateUtils';

export const useAttendanceViewModel = () => {
  const { data: attendance, loading, error, fetchData, create, update } = useFirebase('attendance');
  const { data: employees } = useFirebase('users');
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };
    loadData();
  }, [fetchData]);
  
  useEffect(() => {
    if (attendance.length > 0 && user) {
      const today = getDateOnly();
      const userAttendance = attendance.find(a => 
        a.employeeId === user.username && a.date === today
      );
      
      if (userAttendance) {
        setTodayAttendance(userAttendance);
        setCheckInTime(userAttendance.checkIn || '');
        setCheckOutTime(userAttendance.checkOut || '');
      }
    }
  }, [attendance, user]);
  
  const handleCheckIn = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const employee = employees?.find(e => e.username === user.username);
      
      const attendanceData = new AttendanceModel({
        employeeId: user.username,
        employeeName: employee?.fullName || user.username,
        date: getDateOnly(),
        checkIn: time,
        status: 'present'
      });
      
      await create(attendanceData.toFirebase());
      
      setCheckInTime(time);
      setTodayAttendance(attendanceData);
      
      addNotification({
        type: 'success',
        title: 'Checked In',
        message: `You have successfully checked in at ${time}`,
        module: 'ATTENDANCE'
      });
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Check-in Failed',
        message: error.message,
        module: 'ATTENDANCE'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, employees, create, addNotification]);
  
  const handleCheckOut = useCallback(async () => {
    if (!user || !todayAttendance) return;
    
    setIsLoading(true);
    try {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      await update(todayAttendance.id, {
        checkOut: time,
        status: this.calculateHours() >= 8 ? 'present' : 'half-day'
      });
      
      setCheckOutTime(time);
      
      addNotification({
        type: 'success',
        title: 'Checked Out',
        message: `You have successfully checked out at ${time}`,
        module: 'ATTENDANCE'
      });
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Check-out Failed',
        message: error.message,
        module: 'ATTENDANCE'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, todayAttendance, update, addNotification]);
  
  const getAttendanceSummary = useCallback((employeeId, month, year) => {
    const filtered = attendance.filter(a => {
      if (employeeId && a.employeeId !== employeeId) return false;
      
      const [attendanceYear, attendanceMonth] = a.date.split('-');
      if (month && parseInt(attendanceMonth) !== month) return false;
      if (year && parseInt(attendanceYear) !== year) return false;
      
      return true;
    });
    
    const summary = {
      present: filtered.filter(a => a.status === 'present').length,
      absent: filtered.filter(a => a.status === 'absent').length,
      late: filtered.filter(a => a.status === 'late').length,
      halfDay: filtered.filter(a => a.status === 'half-day').length,
      leave: filtered.filter(a => a.status === 'leave').length,
      total: filtered.length
    };
    
    return summary;
  }, [attendance]);
  
  const updateAttendanceStatus = useCallback(async (id, status, notes = '') => {
    try {
      await update(id, { status, notes });
      
      addNotification({
        type: 'success',
        title: 'Attendance Updated',
        message: `Attendance status updated to ${status}`,
        module: 'ATTENDANCE'
      });
      
      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.message,
        module: 'ATTENDANCE'
      });
      
      return { success: false, error: error.message };
    }
  }, [update, addNotification]);
  
  const getEmployeeAttendance = useCallback((employeeId) => {
    return attendance.filter(a => a.employeeId === employeeId);
  }, [attendance]);
  
  return {
    attendance,
    loading: loading || isLoading,
    error,
    todayAttendance,
    checkInTime,
    checkOutTime,
    handleCheckIn,
    handleCheckOut,
    getAttendanceSummary,
    updateAttendanceStatus,
    getEmployeeAttendance,
    refresh: fetchData
  };
};