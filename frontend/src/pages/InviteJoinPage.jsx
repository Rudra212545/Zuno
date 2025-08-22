import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InviteJoinPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [inviteInfo, setInviteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (code) {
      fetchInviteInfo();
    }
  }, [code]);

  const fetchInviteInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/invites/${code}/info`);
      setInviteInfo(response.data);
    } catch (error) {
      console.error('Error fetching invite info:', error);
      if (error.response?.status === 404) {
        setError('This invite link is invalid or has expired.');
      } else if (error.response?.status === 410) {
        setError('This invite link has expired or reached its usage limit.');
      } else {
        setError('Unable to load invite information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const joinServer = async () => {
    if (!inviteInfo) return;
    
    setJoining(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to join a server.');
        return;
      }

      await axios.post(`http://localhost:3000/api/v1/invites/${code}/use`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Navigate to the server
      navigate(`/servers/${inviteInfo.server.id}`);
    } catch (error) {
      console.error('Error joining server:', error);
      setError(error.response?.data?.message || 'Failed to join server. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading invite...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Invite Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Success state - ✅ Only render when inviteInfo exists
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-700/50">
        {/* Server Info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-4">You're invited to join</h1>
          
          {/* Server Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-indigo-500/30">
            <img 
              src={inviteInfo?.server?.iconUrl || '/default-server-icon.png'} 
              alt={inviteInfo?.server?.name || 'Server'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=Server&background=6366F1&color=fff&bold=true';
              }}
            />
          </div>
          
          {/* Server Name */}
          <h2 className="text-xl font-bold text-white mb-2">
            {inviteInfo?.server?.name || 'Unknown Server'}
          </h2>
          
          {/* Invite Info */}
          <div className="text-gray-400 text-sm">
            <p>Invited by {inviteInfo?.createdBy || 'Unknown User'}</p>
            {inviteInfo?.uses !== undefined && (
              <p>{inviteInfo.uses} members have joined with this link</p>
            )}
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={joinServer}
          disabled={joining}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {joining ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Joining...
            </div>
          ) : (
            'Join Server'
          )}
        </button>

        {/* Alternative Actions */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            No thanks, take me home
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteJoinPage;
