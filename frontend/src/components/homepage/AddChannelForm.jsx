import React, { useState } from 'react';
import { Hash, Volume2, X, Plus } from 'lucide-react';
import axios from 'axios'; 

const AddChannelForm = ({ serverId, userId, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return setError('Channel name is required');
    }
    if (!type) {
      return setError('Channel type is required');
    }
  
    try {
      setIsLoading(true);
  
      const payload = {
        name,
        type,
        createdBy: userId,
      };
  
      const token = localStorage.getItem('token'); // adjust based on your auth setup
  
      const res = await axios.post(
        `http://localhost:3000/api/v1/channels/create/${serverId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Optional, if auth is needed
          },
        }
      );
  
      if (onCreate) onCreate(res.data); // you can refetch channels too
      onClose();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700/50 transform transition-all duration-300 animate-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Create Channel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 group"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Channel Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wide">
              Channel Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter channel name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-600/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all duration-200 text-white placeholder-slate-400 backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-200"></div>
            </div>
          </div>

          {/* Channel Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wide">
              Channel Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Text Channel Option */}
              <button
                type="button"
                onClick={() => setType('text')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group ${
                  type === 'text'
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                    : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-3 rounded-lg transition-colors duration-200 ${
                  type === 'text'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300'
                }`}>
                  <Hash className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className={`font-semibold ${type === 'text' ? 'text-white' : 'text-slate-300'}`}>
                    Text
                  </p>
                  <p className="text-xs text-slate-400">Send messages, links, and files</p>
                </div>
              </button>

              {/* Voice Channel Option */}
              <button
                type="button"
                onClick={() => setType('voice')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 group ${
                  type === 'voice'
                    ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/25'
                    : 'border-slate-600/50 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                }`}
              >
                <div className={`p-3 rounded-lg transition-colors duration-200 ${
                  type === 'voice'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300'
                }`}>
                  <Volume2 className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className={`font-semibold ${type === 'voice' ? 'text-white' : 'text-slate-300'}`}>
                    Voice
                  </p>
                  <p className="text-xs text-slate-400">Talk with voice and video</p>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl font-semibold transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create Channel'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChannelForm;