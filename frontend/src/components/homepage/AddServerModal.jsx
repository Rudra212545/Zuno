import React, { useState, useRef } from 'react';
import { Upload, Image, X, Plus, Camera } from 'lucide-react';
import axios from 'axios';

// Load Google Fonts
const GoogleFonts = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <style>
      {`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .border-3 {
          border-width: 3px;
        }
      `}
    </style>
  </>
);

const AddServerModal = ({ isOpen, onClose, onCreate,token }) => {
  const [serverName, setServerName] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Trigger file input click when rectangle is clicked
  const handleRectangleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview(null);
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serverName) return;
  
    const formData = new FormData();
    formData.append('name', serverName);
    if (iconFile) {
      formData.append('icon', iconFile);
    }
    
    const token = localStorage.getItem('token');
  console.log('Using token:', token);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/server/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${token}`
        },
      });
  
      const createdServer = response.data;
      onCreate(createdServer); // pass newly created server to parent or update UI
      setServerName('');
      setIconFile(null);
      setIconPreview(null);
      onClose();
    }catch (error) {
      console.error('Create server error details:', error);
      alert(error.response?.data?.message || error.message || 'Failed to create server');
    }
  };
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <GoogleFonts />
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
        style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 border border-gray-600/50 rounded-3xl shadow-2xl w-full max-w-md p-8 text-white relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
          <div className="relative z-10">
            <div className="text-center mb-8">

              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2" style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
                Create Server
              </h2>
              <p className="text-gray-400 text-base font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}>Set up your new community space</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="block text-sm font-semibold text-gray-300 tracking-wide" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.025em' }}>SERVER NAME</div>
                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/70 text-white border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 font-medium"
                  placeholder="Enter your server name..."
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
                />
              </div>

              <div className="space-y-3">
                <div className="block text-sm font-semibold text-gray-300 tracking-wide" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.025em' }}>SERVER ICON</div>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                {/* Drag & Drop Area */}
                <div
                  onClick={handleRectangleClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative  cursor-pointer w-full h-60 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                    isDragging
                      ? 'border-indigo-400 bg-indigo-500/20 scale-105'
                      : iconPreview
                      ? 'border-indigo-500/50 bg-slate-700/50'
                      : 'border-indigo-500/70 bg-slate-700/50 hover:bg-indigo-900/30 hover:border-indigo-400'
                  } flex items-center justify-center group overflow-hidden`}
                >
                  {iconPreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={iconPreview}
                        alt="Server Icon Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRectangleClick();
                            }}
                            className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                          >
                            <Camera size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeIcon();
                            }}
                            className="p-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      {/* Circular Ring with Camera Icon */}
                      <div className="relative inline-flex items-center justify-center mb-4">
                        {/* Animated ring */}
                        <div className="w-20 h-20 rounded-full border-3 border-dashed border-indigo-500/60 animate-spin-slow group-hover:border-indigo-400 transition-colors"></div>
                        
                        {/* Inner circle with camera */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full flex items-center justify-center group-hover:from-indigo-600/40 group-hover:to-purple-600/40 transition-all duration-300 backdrop-blur-sm">
                            <Camera size={24} className="text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                          </div>
                        </div>
                        
                        {/* Outer glow ring */}
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                      </div>
                      
                      <div className="text-indigo-400 font-semibold mb-2 group-hover:text-indigo-300 transition-colors text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Upload Server Icon
                      </div>
                      <div className="text-sm text-gray-500 font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Drag & drop your image here
                      </div>
                      <div className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        or <span className="text-indigo-400 underline font-semibold cursor-pointer">click to browse</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-3 font-medium tracking-wide" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.025em' }}>
                        PNG, JPG, GIF up to 10MB
                      </div>
                    </div>
                  )}

                  {/* Drag overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full border-3 border-dashed border-white/80 flex items-center justify-center mb-3 animate-pulse">
                          <Upload size={28} className="text-white" />
                        </div>
                        <div className="text-white font-bold text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Release to upload</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-6 space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 text-gray-400 hover:text-white border border-gray-600/50 hover:border-gray-500 rounded-xl transition-all duration-200 font-semibold tracking-wide"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', letterSpacing: '0.025em' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!serverName}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none tracking-wide"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '14px', letterSpacing: '0.025em' }}
                >
                  Create Server
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddServerModal;