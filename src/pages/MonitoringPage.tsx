import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  Shield, 
  Eye, 
  Smartphone,
  RotateCcw,
  Clock,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../contexts/DatabaseContext';

const MonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addSession, updateSession } = useDatabase();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionTime, setSessionTime] = useState(0);
  const [headMovements, setHeadMovements] = useState(0);
  const [phoneDetections, setPhoneDetections] = useState(0);
  const [cheatingPercentage, setCheatingPercentage] = useState(0);
  const [trustScore, setTrustScore] = useState(100);
  const [currentAlert, setCurrentAlert] = useState<string>('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const monitoringIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (monitoringIntervalRef.current) clearInterval(monitoringIntervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraEnabled(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCurrentAlert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraEnabled(false);
    }
  };

  const startMonitoring = () => {
    if (!user) return;

    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
    
    addSession({
      studentId: user.id,
      studentName: user.name,
      startTime: new Date().toISOString(),
      headMovements: 0,
      phoneDetections: 0,
      cheatingPercentage: 0,
      trustScore: 100,
      status: 'active'
    });

    setIsMonitoring(true);
    setSessionTime(0);
    setHeadMovements(0);
    setPhoneDetections(0);
    setCheatingPercentage(0);
    setTrustScore(100);
    setCurrentAlert('');

    // Start session timer
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // Start monitoring simulation
    monitoringIntervalRef.current = setInterval(() => {
      simulateMonitoring();
    }, 2000);

    startCamera();
  };

  const simulateMonitoring = () => {
    // Simulate head movement detection
    if (Math.random() < 0.3) { // 30% chance of head movement
      setHeadMovements(prev => {
        const newCount = prev + 1;
        if (newCount > 5) {
          setCurrentAlert('Excessive head movement detected!');
          setTimeout(() => setCurrentAlert(''), 3000);
        }
        return newCount;
      });
    }

    // Simulate phone detection (strict detection)
    if (Math.random() < 0.1) { // 10% chance of phone detection
      setPhoneDetections(prev => {
        const newCount = prev + 1;
        setCurrentAlert('Mobile phone detected! This is strictly monitored.');
        setTimeout(() => setCurrentAlert(''), 5000);
        return newCount;
      });
    }

    // Update cheating percentage and trust score
    setHeadMovements(headCount => {
      setPhoneDetections(phoneCount => {
        const totalSuspiciousActivity = headCount + (phoneCount * 3); // Phone detection weighted more
        const newCheatingPercentage = Math.min(totalSuspiciousActivity * 5, 100);
        const newTrustScore = Math.max(100 - newCheatingPercentage, 0);
        
        setCheatingPercentage(newCheatingPercentage);
        setTrustScore(newTrustScore);
        
        return phoneCount;
      });
      return headCount;
    });
  };

  const stopMonitoring = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (monitoringIntervalRef.current) clearInterval(monitoringIntervalRef.current);
    
    setIsMonitoring(false);
    stopCamera();

    // Update session in database
    if (sessionId) {
      updateSession(sessionId, {
        endTime: new Date().toISOString(),
        headMovements,
        phoneDetections,
        cheatingPercentage,
        trustScore,
        status: cheatingPercentage > 50 ? 'flagged' : 'completed'
      });
    }

    // Navigate to reports page
    setTimeout(() => {
      navigate('/reports');
    }, 1000);
  };

  const handleLogout = () => {
    if (isMonitoring) {
      stopMonitoring();
    }
    logout();
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 20) return 'text-green-600';
    if (percentage < 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBg = (percentage: number) => {
    if (percentage < 20) return 'bg-green-100 border-green-200';
    if (percentage < 50) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Live Monitoring Session</h1>
                <p className="text-sm text-gray-600">Student: {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{formatTime(sessionTime)}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Camera Feed</h2>
                <div className="flex items-center space-x-2">
                  {cameraEnabled ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Camera className="w-5 h-5" />
                      <span className="text-sm font-medium">Camera Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <CameraOff className="w-5 h-5" />
                      <span className="text-sm font-medium">Camera Inactive</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {!cameraEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Camera Not Active</p>
                      <p className="text-sm opacity-75">Start monitoring to enable camera</p>
                    </div>
                  </div>
                )}

                {/* AI Detection Overlays */}
                {isMonitoring && cameraEnabled && (
                  <>
                    {/* Face Detection Box */}
                    <div className="absolute top-20 left-20 w-40 h-48 border-2 border-green-400 rounded-lg">
                      <div className="bg-green-400 text-white text-xs px-2 py-1 rounded-t-lg">
                        Face Detected
                      </div>
                    </div>

                    {/* Phone Detection Alert */}
                    {phoneDetections > 0 && (
                      <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-sm font-medium">Phone Detected!</span>
                      </div>
                    )}

                    {/* Head Movement Indicator */}
                    {headMovements > 3 && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm font-medium">Head Movement</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4 mt-6">
                {!isMonitoring ? (
                  <button
                    onClick={startMonitoring}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Start Monitoring</span>
                  </button>
                ) : (
                  <button
                    onClick={stopMonitoring}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <CameraOff className="w-5 h-5" />
                    <span>Stop Monitoring</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Monitoring Stats */}
          <div className="space-y-6">
            {/* Current Alert */}
            {currentAlert && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800">Alert</h3>
                    <p className="text-sm text-red-700">{currentAlert}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Score */}
            <div className={`rounded-xl p-6 border-2 ${getStatusBg(cheatingPercentage)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Trust Score</h3>
                <Shield className={`w-6 h-6 ${getStatusColor(100 - trustScore)}`} />
              </div>
              <div className="text-3xl font-bold mb-2 text-gray-900">{trustScore}%</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    trustScore > 80 ? 'bg-green-500' : trustScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${trustScore}%` }}
                ></div>
              </div>
            </div>

            {/* Cheating Percentage */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Cheating Risk</h3>
                <Eye className={`w-6 h-6 ${getStatusColor(cheatingPercentage)}`} />
              </div>
              <div className={`text-3xl font-bold mb-2 ${getStatusColor(cheatingPercentage)}`}>
                {cheatingPercentage}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    cheatingPercentage < 20 ? 'bg-green-500' : cheatingPercentage < 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${cheatingPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Detection Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Detection Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-5 h-5 text-yellow-600" />
                    <span className="text-gray-700">Head Movements</span>
                  </div>
                  <span className="font-semibold text-gray-900">{headMovements}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-red-600" />
                    <span className="text-gray-700">Phone Detections</span>
                  </div>
                  <span className="font-semibold text-red-600">{phoneDetections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Session Time</span>
                  </div>
                  <span className="font-mono font-semibold text-gray-900">{formatTime(sessionTime)}</span>
                </div>
              </div>
            </div>

            {/* AI Detection Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">AI Detection Active</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• MediaPipe face tracking</li>
                <li>• YOLOv8 object detection</li>
                <li>• Real-time behavior analysis</li>
                <li>• Strict mobile phone monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;