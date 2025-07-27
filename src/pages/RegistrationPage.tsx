import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic, MicOff, User, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addStudent } = useDatabase();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [step, setStep] = useState(1);

  const voicePrompts = [
    "The quick brown fox jumps over the lazy dog",
    "Machine learning is transforming education technology",
    "Voice recognition provides secure authentication methods",
    "Artificial intelligence enhances online learning experiences"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * voicePrompts.length);
    setCurrentPrompt(voicePrompts[randomIndex]);
  };

  const startVoiceRecording = () => {
    if (!currentPrompt) {
      generateRandomPrompt();
    }
    setIsRecording(true);
    
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      setVoiceRecorded(true);
    }, 3000);
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    setVoiceRecorded(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && voiceRecorded) {
      addStudent({
        name: formData.name,
        email: formData.email,
        voiceProfile: `voice_${Date.now()}`
      });
      setStep(3);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.name && formData.email) {
      setStep(2);
      generateRandomPrompt();
    }
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
          <h2 className="text-3xl font-bold text-gray-900">Student Registration</h2>
          <p className="mt-2 text-gray-600">Create your account with voice authentication</p>
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
          <div className={`w-16 h-1 mt-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            ✓
          </div>
        </div>

        {step === 1 && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
            <form className="space-y-6">
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
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.name || !formData.email}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Continue to Voice Setup
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Voice Authentication Setup</h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Please read the following sentence clearly to create your voice profile:
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-blue-800 font-medium">{currentPrompt}</p>
              </div>
            </div>

            <div className="text-center mb-6">
              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : voiceRecorded 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {voiceRecorded ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : isRecording ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
              <p className="mt-3 text-sm text-gray-600">
                {isRecording 
                  ? 'Recording... Click to stop' 
                  : voiceRecorded 
                  ? 'Voice recorded successfully!' 
                  : 'Click to start recording'
                }
              </p>
            </div>

            {!voiceRecorded && (
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> This random sentence prevents voice playback attacks and ensures authentic voice registration.
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!voiceRecorded}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Complete Registration
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your account has been created with voice authentication enabled.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;