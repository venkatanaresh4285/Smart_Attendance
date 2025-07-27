import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, MicOff, User, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDatabase } from '../contexts/DatabaseContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { getStudent } = useDatabase();
  const [name, setName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceAuthenticated, setVoiceAuthenticated] = useState(false);
  const [authenticationStatus, setAuthenticationStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [step, setStep] = useState(1);

  const voicePrompts = [
    "Authentication requires voice verification for security",
    "Please speak clearly for voice pattern matching",
    "Secure login using biometric voice recognition",
    "Voice authentication ensures account protection"
  ];

  const generateRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * voicePrompts.length);
    setCurrentPrompt(voicePrompts[randomIndex]);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = getStudent(name);
    if (student) {
      setStep(2);
      generateRandomPrompt();
    } else {
      setAuthenticationStatus('failed');
      setTimeout(() => setAuthenticationStatus('idle'), 3000);
    }
  };

  const startVoiceAuthentication = () => {
    setIsRecording(true);
    setAuthenticationStatus('processing');
    
    // Simulate voice authentication process
    setTimeout(() => {
      setIsRecording(false);
      
      // Simulate voice matching (90% success rate for demo)
      const isAuthenticated = Math.random() > 0.1;
      
      if (isAuthenticated) {
        setVoiceAuthenticated(true);
        setAuthenticationStatus('success');
        
        const student = getStudent(name);
        if (student) {
          login({
            id: student.id,
            name: student.name,
            email: student.email,
            role: 'student'
          });
          
          setTimeout(() => {
            navigate('/monitoring');
          }, 2000);
        }
      } else {
        setAuthenticationStatus('failed');
        setTimeout(() => setAuthenticationStatus('idle'), 3000);
      }
    }, 3000);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    setAuthenticationStatus('idle');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Voice Authentication</h2>
          <p className="mt-2 text-gray-600">Secure login using voice recognition</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-4 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 mt-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Enter Your Name</h3>
            
            {authenticationStatus === 'failed' && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-800 text-sm">Student not found. Please check your name or register first.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your registered name"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Voice Authentication
              </button>
            </form>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-blue-800 text-sm">
                <strong>Demo Users:</strong> Try "John Doe" or "Jane Smith" for testing
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Voice Authentication</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Please read the following sentence clearly for voice verification:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">{currentPrompt}</p>
              </div>
            </div>

            {authenticationStatus === 'failed' && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-red-800 text-sm">Voice authentication failed. Please try again.</p>
                </div>
              </div>
            )}

            {authenticationStatus === 'success' && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <p className="text-green-800 text-sm">Voice authenticated successfully! Starting monitoring session...</p>
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceAuthentication}
                disabled={authenticationStatus === 'processing' || authenticationStatus === 'success'}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  authenticationStatus === 'success'
                    ? 'bg-green-500'
                    : isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : authenticationStatus === 'processing'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-blue-500 hover:bg-blue-600'
                } disabled:cursor-not-allowed`}
              >
                {authenticationStatus === 'success' ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : isRecording ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
              <p className="mt-3 text-sm text-gray-600">
                {authenticationStatus === 'success' 
                  ? 'Authentication successful!' 
                  : authenticationStatus === 'processing'
                  ? 'Processing voice...'
                  : isRecording 
                  ? 'Recording... Click to stop' 
                  : 'Click to start voice authentication'
                }
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={authenticationStatus === 'processing' || authenticationStatus === 'success'}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => generateRandomPrompt()}
                disabled={authenticationStatus === 'processing' || authenticationStatus === 'success'}
                className="flex-1 py-3 px-4 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                New Prompt
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;