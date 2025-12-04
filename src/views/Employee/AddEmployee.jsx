import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeViewModel } from '../../viewmodels/EmployeeViewModel';
import EmployeeForm from './EmployeeForm';
import { ArrowLeft } from 'lucide-react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { handleCreate } = useEmployeeViewModel();

  const handleSubmit = async (employeeData) => {
    const result = await handleCreate(employeeData);
    if (result.success) {
      navigate('/employees');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/employees')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Employee
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Enter employee details to add them to the system
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <EmployeeForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/employees')}
        />
      </div>
    </div>
  );
};

export default AddEmployee;