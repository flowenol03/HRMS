export class PerformanceModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.reviewPeriod = data.reviewPeriod || '';
    this.reviewDate = data.reviewDate || new Date().toISOString();
    this.reviewerId = data.reviewerId || '';
    this.reviewerName = data.reviewerName || '';
    this.ratings = data.ratings || {
      qualityOfWork: 0,
      productivity: 0,
      communication: 0,
      teamwork: 0,
      punctuality: 0,
      problemSolving: 0
    };
    this.feedback = data.feedback || '';
    this.goals = data.goals || [];
    this.overallScore = data.overallScore || 0;
    this.status = data.status || 'draft';
    this.comments = data.comments || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
  
  calculateOverallScore() {
    const ratings = Object.values(this.ratings);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((total, rating) => total + rating, 0);
    return Math.round(sum / ratings.length);
  }
  
  getPerformanceLevel() {
    const score = this.overallScore;
    if (score >= 4.5) return { level: 'Excellent', color: 'green' };
    if (score >= 4) return { level: 'Very Good', color: 'blue' };
    if (score >= 3) return { level: 'Good', color: 'yellow' };
    if (score >= 2) return { level: 'Needs Improvement', color: 'orange' };
    return { level: 'Poor', color: 'red' };
  }
  
  static getRatingCriteria() {
    return [
      { key: 'qualityOfWork', label: 'Quality of Work', description: 'Accuracy, thoroughness, and effectiveness' },
      { key: 'productivity', label: 'Productivity', description: 'Output and efficiency in completing tasks' },
      { key: 'communication', label: 'Communication', description: 'Clarity and effectiveness in communication' },
      { key: 'teamwork', label: 'Teamwork', description: 'Collaboration and support to team members' },
      { key: 'punctuality', label: 'Punctuality', description: 'Timeliness and meeting deadlines' },
      { key: 'problemSolving', label: 'Problem Solving', description: 'Ability to analyze and solve problems' }
    ];
  }
  
  static getStatuses() {
    return [
      { value: 'draft', label: 'Draft', color: 'gray' },
      { value: 'in-review', label: 'In Review', color: 'blue' },
      { value: 'completed', label: 'Completed', color: 'green' },
      { value: 'acknowledged', label: 'Acknowledged', color: 'purple' }
    ];
  }
  
  toFirebase() {
    const { id, ...data } = this;
    this.overallScore = this.calculateOverallScore();
    
    return {
      ...data,
      updatedAt: new Date().toISOString()
    };
  }
}