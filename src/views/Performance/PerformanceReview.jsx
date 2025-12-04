import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePerformanceViewModel } from '../../viewmodels/PerformanceViewModel';
import { useEmployeeViewModel } from '../../viewmodels/EmployeeViewModel';
import { useAuth } from '../../hooks/useAuth';
import { 
  ArrowLeft, 
  Save, 
  Star,
  TrendingUp,
  MessageSquare,
  Target,
  Calendar,
  User
} from 'lucide-react';
import SelectInput from '../../components/inputs/SelectInput';
import DateInput from '../../components/inputs/DateInput';
import TextInput from '../../components/inputs/TextInput';

const PerformanceReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employees } = useEmployeeViewModel();
  const { performances, handleCreatePerformance, handleUpdatePerformance, loading } = usePerformanceViewModel();
  
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewPeriod: '',
    reviewDate: new Date().toISOString().split('T')[0],
    ratings: {
      qualityOfWork: 0,
      productivity: 0,
      communication: 0,
      teamwork: 0,
      punctuality: 0,
      problemSolving: 0
    },
    feedback: '',
    goals: [''],
    status: 'draft'
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const review = performances.find(p => p.id === id);
      if (review) {
        setFormData(review);
        setIsEditing(true);
        const emp = employees.find(e => e.username === review.employeeId);
        setSelectedEmployee(emp);
      }
    }
  }, [id, performances, employees]);

  useEffect(() => {
    if (formData.employeeId) {
      const emp = employees.find(e => e.username === formData.employeeId);
      setSelectedEmployee(emp);
    }
  }, [formData.employeeId, employees]);

  const ratingCriteria = [
    { key: 'qualityOfWork', label: 'Quality of Work', description: 'Accuracy, thoroughness, and effectiveness' },
    { key: 'productivity', label: 'Productivity', description: 'Output and efficiency in completing tasks' },
    { key: 'communication', label: 'Communication', description: 'Clarity and effectiveness in communication' },
    { key: 'teamwork', label: 'Teamwork', description: 'Collaboration and support to team members' },
    { key: 'punctuality', label: 'Punctuality', description: 'Timeliness and meeting deadlines' },
    { key: 'problemSolving', label: 'Problem Solving', description: 'Ability to analyze and solve problems' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [key]: parseInt(value)
      }
    }));
  };

  const handleGoalChange = (index, value) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData(prev => ({ ...prev, goals: newGoals }));
  };

  const addGoal = () => {
    setFormData(prev => ({ ...prev, goals: [...prev.goals, ''] }));
  };

  const removeGoal = (index) => {
    const newGoals = formData.goals.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, goals: newGoals }));
  };

  const calculateOverallScore = () => {
    const ratings = Object.values(formData.ratings);
    if (ratings.length === 0 || ratings.some(r => r === 0)) return 0;
    
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = 'Please select an employee';
    }
    
    if (!formData.reviewPeriod) {
      newErrors.reviewPeriod = 'Review period is required';
    }
    
    if (!formData.reviewDate) {
      newErrors.reviewDate = 'Review date is required';
    }
    
    // Check if all ratings are provided
    const hasZeroRating = Object.values(formData.ratings).some(r => r === 0);
    if (hasZeroRating) {
      newErrors.ratings = 'Please provide all ratings';
    }
    
    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const overallScore = calculateOverallScore();
    const reviewData = {
      ...formData,
      overallScore,
      reviewerId: user?.username,
      reviewerName: user?.username,
      status: 'in-review'
    };
    
    if (isEditing) {
      await handleUpdatePerformance(id, reviewData);
    } else {
      await handleCreatePerformance(reviewData);
    }
    
    navigate('/performance');
  };

  const overallScore = calculateOverallScore();
  const performanceLevel = overallScore >= 4.5 ? 'Excellent' :
                         overallScore >= 4 ? 'Very Good' :
                         overallScore >= 3 ? 'Good' :
                         overallScore >= 2 ? 'Needs Improvement' : 'Poor';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/performance')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Performance Review' : 'Create Performance Review'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Evaluate employee performance and set goals
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h3>
              
              <SelectInput
                label="Select Employee"
                value={formData.employeeId}
                onChange={handleChange}
                options={employees
                  .filter(e => e.role === 'employee')
                  .map(e => ({ value: e.username, label: `${e.fullName} - ${e.department}` }))
                }
                placeholder="Choose an employee"
                name="employeeId"
                error={errors.employeeId}
                required
                disabled={isEditing}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="Review Period"
                  value={formData.reviewPeriod}
                  onChange={handleChange}
                  placeholder="e.g., Q1 2024"
                  name="reviewPeriod"
                  error={errors.reviewPeriod}
                  required
                />
                
                <DateInput
                  label="Review Date"
                  value={formData.reviewDate}
                  onChange={handleChange}
                  name="reviewDate"
                  error={errors.reviewDate}
                  required
                />
              </div>
            </div>

            {/* Ratings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Performance Ratings
              </h3>
              
              {errors.ratings && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.ratings}</p>
                </div>
              )}
              
              <div className="space-y-6">
                {ratingCriteria.map((criterion) => (
                  <div key={criterion.key} className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {criterion.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {criterion.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(criterion.key, star)}
                            className="p-1"
                          >
                            <Star
                              size={20}
                              className={`
                                ${star <= formData.ratings[criterion.key]
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300 dark:text-gray-600'
                                }
                              `}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                          {formData.ratings[criterion.key] || 0}/5
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Feedback & Comments
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Overall Feedback *
                  </label>
                  <textarea
                    value={formData.feedback}
                    onChange={handleChange}
                    rows={6}
                    name="feedback"
                    className={`
                      w-full px-3 py-2 border rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                      dark:focus:ring-primary-400
                      ${errors.feedback 
                        ? 'border-red-500 focus:ring-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                      }
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-white
                    `}
                    placeholder="Provide detailed feedback on employee performance..."
                  />
                  {errors.feedback && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.feedback}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Goals & Development Areas
                </h3>
                <button
                  type="button"
                  onClick={addGoal}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  + Add Goal
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.goals.map((goal, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Target className="text-gray-400 mt-1" size={16} />
                    <div className="flex-1">
                      <TextInput
                        value={goal}
                        onChange={(e) => handleGoalChange(index, e.target.value)}
                        placeholder={`Goal ${index + 1} (e.g., Improve communication skills)`}
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeGoal(index)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/performance')}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-2"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  isEditing ? 'Update Review' : 'Submit Review'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Overall Score Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Overall Score
            </h3>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white mb-4">
                <span className="text-3xl font-bold">{overallScore.toFixed(1)}</span>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {performanceLevel}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Out of 5.0
              </p>
            </div>
          </div>

          {/* Employee Info */}
          {selectedEmployee && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Employee Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="text-gray-400" size={18} />
                  <div>
                    <p className="font-medium">{selectedEmployee.fullName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedEmployee.designation}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviewer Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reviewer Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={18} />
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reviewer</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Review Date</p>
                  <p className="font-medium">
                    {new Date(formData.reviewDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Rating Summary
            </h3>
            
            <div className="space-y-3">
              {ratingCriteria.map((criterion) => (
                <div key={criterion.key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {criterion.label}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={`
                          ${star <= formData.ratings[criterion.key]
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReview;