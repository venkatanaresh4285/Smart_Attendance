import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  Calendar,
  Filter,
  ArrowLeft,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  RotateCcw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';

const ReportsPage: React.FC = () => {
  const { students, sessions } = useDatabase();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedStudent, setSelectedStudent] = useState('all');

  const filteredSessions = sessions.filter(session => {
    if (selectedStudent === 'all') return true;
    return session.studentId === selectedStudent;
  });

  // Calculate statistics
  const totalSessions = filteredSessions.length;
  const completedSessions = filteredSessions.filter(s => s.status === 'completed').length;
  const flaggedSessions = filteredSessions.filter(s => s.status === 'flagged').length;
  const averageTrustScore = filteredSessions.length > 0 
    ? Math.round(filteredSessions.reduce((sum, s) => sum + s.trustScore, 0) / filteredSessions.length)
    : 0;
  const totalHeadMovements = filteredSessions.reduce((sum, s) => sum + s.headMovements, 0);
  const totalPhoneDetections = filteredSessions.reduce((sum, s) => sum + s.phoneDetections, 0);

  // Trust score distribution
  const trustScoreRanges = {
    excellent: filteredSessions.filter(s => s.trustScore >= 90).length,
    good: filteredSessions.filter(s => s.trustScore >= 70 && s.trustScore < 90).length,
    fair: filteredSessions.filter(s => s.trustScore >= 50 && s.trustScore < 70).length,
    poor: filteredSessions.filter(s => s.trustScore < 50).length
  };

  const generatePDFReport = () => {
    // Simulate PDF generation
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      student: selectedStudent === 'all' ? 'All Students' : students.find(s => s.id === selectedStudent)?.name,
      statistics: {
        totalSessions,
        completedSessions,
        flaggedSessions,
        averageTrustScore,
        totalHeadMovements,
        totalPhoneDetections
      },
      sessions: filteredSessions
    };

    console.log('Generating PDF report:', reportData);
    alert('PDF report generated successfully! (This is a demo - in production, this would download a PDF file)');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600">Comprehensive analysis of student behavior and attendance</p>
              </div>
            </div>
            <button
              onClick={generatePDFReport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Generate PDF Report</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Filters</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="day">Last 24 Hours</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Students</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <select className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="comprehensive">Comprehensive Report</option>
                  <option value="attendance">Attendance Only</option>
                  <option value="behavior">Behavior Analysis</option>
                  <option value="summary">Executive Summary</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% from last period</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Trust Score</p>
                <p className={`text-3xl font-bold ${getTrustScoreColor(averageTrustScore)}`}>
                  {averageTrustScore}%
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+5% improvement</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged Sessions</p>
                <p className="text-3xl font-bold text-red-600">{flaggedSessions}</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-8% from last period</span>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Phone Detections</p>
                <p className="text-3xl font-bold text-orange-600">{totalPhoneDetections}</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">-15% reduction</span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trust Score Distribution */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Trust Score Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-700">Excellent (90-100%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(trustScoreRanges.excellent / totalSessions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{trustScoreRanges.excellent}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-700">Good (70-89%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(trustScoreRanges.good / totalSessions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{trustScoreRanges.good}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-700">Fair (50-69%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(trustScoreRanges.fair / totalSessions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{trustScoreRanges.fair}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-700">Poor (0-49%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(trustScoreRanges.poor / totalSessions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{trustScoreRanges.poor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Session Details</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trust Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Violations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSessions.slice(0, 10).map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {session.studentName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(session.startTime)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${getTrustScoreColor(session.trustScore)}`}>
                            {session.trustScore}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3 text-sm">
                            <div className="flex items-center space-x-1 text-yellow-600">
                              <RotateCcw className="w-3 h-3" />
                              <span>{session.headMovements}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-red-600">
                              <Smartphone className="w-3 h-3" />
                              <span>{session.phoneDetections}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(session.status)}
                            <span className="text-sm text-gray-900 capitalize">{session.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-6">
            {/* Detection Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Head Movements</span>
                  </div>
                  <span className="font-semibold text-gray-900">{totalHeadMovements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700">Phone Detections</span>
                  </div>
                  <span className="font-semibold text-red-600">{totalPhoneDetections}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Total Violations</span>
                  </div>
                  <span className="font-semibold text-orange-600">{totalHeadMovements + totalPhoneDetections}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Recommendations</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Implement stricter phone policies for high-risk students</li>
                <li>• Consider additional monitoring for flagged sessions</li>
                <li>• Review seating arrangements to minimize distractions</li>
                <li>• Provide feedback to students with low trust scores</li>
              </ul>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>PDF Report</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Excel Spreadsheet</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;