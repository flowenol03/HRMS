import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const ProfileCard = ({ employee }) => {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            {employee?.fullName?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        
        {/* Details */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {employee?.fullName || 'Unknown'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {employee?.designation || 'No designation'}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                employee?.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {employee?.status?.charAt(0).toUpperCase() + employee?.status?.slice(1) || 'Unknown'}
              </span>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{employee?.email || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-900 dark:text-white">{employee?.phone || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <p className="text-gray-900 dark:text-white">{employee?.department || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Join Date</p>
                <p className="text-gray-900 dark:text-white">
                  {formatDate(employee?.joinDate) || 'N/A'}
                </p>
              </div>
            </div>
            
            {employee?.address && (
              <div className="md:col-span-2 flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-gray-900 dark:text-white">{employee.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;