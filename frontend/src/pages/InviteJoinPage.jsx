  import React, { useState, useEffect, } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { useDispatch } from 'react-redux';
  import { setServers } from '../store/slices/serverSlice';

  const InviteJoinPage = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        console.log('🔍 Fetching invite info for code:', code);
        
        // ✅ Use the correct API endpoint from your backend
        const response = await axios.get(`http://localhost:3000/api/v1/invite/${code}`);
        
        console.log('✅ Invite info response:', response.data);
        
        // Extract invite data based on your backend response structure
        const inviteData = response.data.data?.invite || response.data.invite || response.data;
        setInviteInfo(inviteData);
        
      } catch (error) {
        console.error('❌ Error fetching invite info:', error);
        
        if (error.response?.status === 404) {
          setError('This invite link is invalid or has expired.');
        } else if (error.response?.status === 400) {
          setError('This invite link has expired or reached its usage limit.');
        } else {
          setError(error.response?.data?.message || 'Unable to load invite information. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

// InviteJoinPage.jsx - Replace your joinServer function
const joinServer = async () => {
  if (!inviteInfo) return;
  
  setJoining(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to join a server.');
      navigate('/login');
      return;
    }

    console.log('🔄 Joining server with invite code:', code);

    // Step 1: Join the server
    const response = await axios.post(`http://localhost:3000/api/v1/invite/join/${code}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Join server response:', response.data);

    // Step 2: Force refresh servers - Multiple attempts to ensure it works
    let serversData = [];
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}: Refreshing servers list...`);
        
        // Wait a bit for backend to update
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
        
        const serversResponse = await axios.get("http://localhost:3000/api/v1/server/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`📋 Attempt ${attempt} response:`, serversResponse.data);

        // Extract servers from response
        if (Array.isArray(serversResponse.data)) {
          serversData = serversResponse.data;
        } else if (serversResponse.data.data) {
          serversData = serversResponse.data.data;
        } else if (serversResponse.data.servers) {
          serversData = serversResponse.data.servers;
        }

        console.log(`📋 Attempt ${attempt} - Found ${serversData.length} servers`);
        
        // Check if the joined server is in the list
        const joinedServerExists = serversData.some(server => 
          server._id === (response.data.data?.server?._id || response.data.server?._id) ||
          server.name === inviteInfo.server.name
        );

        if (joinedServerExists) {
          console.log(`✅ Attempt ${attempt}: Joined server found in list!`);
          break;
        } else {
          console.log(`⚠️ Attempt ${attempt}: Joined server not found, retrying...`);
        }
        
      } catch (serversFetchError) {
        console.error(`❌ Attempt ${attempt} failed:`, serversFetchError);
      }
    }

    // Update Redux state
    dispatch(setServers(serversData));
    console.log('✅ Redux state updated with', serversData.length, 'servers');

    // Step 3: Navigate with forced refresh flag
    const serverData = response.data.data?.server || response.data.server;
    
    navigate('/home', {
      state: { 
        justJoined: true,
        newServerId: serverData?._id,
        serverName: serverData?.name || inviteInfo?.server?.name,
        forceRefresh: true // ✅ Add this flag
      }
    });
    
    // Show success message
    const serverName = serverData?.name || inviteInfo?.server?.name || 'the server';
    alert(`Successfully joined ${serverName}!`);
    
  } catch (error) {
    console.error('❌ Error joining server:', error);
    setError('Failed to join server. Please try again.');
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
    if (error && !inviteInfo) {
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

    // Success state - render when inviteInfo exists
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-700/50">
          {/* Error message if joining fails */}
          {error && inviteInfo && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          {/* Server Info */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-4">You're invited to join</h1>
            
            {/* Server Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-indigo-500/30">
              <img 
                src={inviteInfo?.server?.iconUrl || 'https://ui-avatars.com/api/?name=Server&background=6366F1&color=fff&bold=true'} 
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
            <div className="text-gray-400 text-sm space-y-1">
              <p>
                Invited by {inviteInfo?.inviter?.username || 'Unknown User'}
              </p>
              {inviteInfo?.server?.memberCount !== undefined && (
                <p>{inviteInfo.server.memberCount} members</p>
              )}
              {inviteInfo?.uses !== undefined && (
                <p>{inviteInfo.uses} people have used this invite</p>
              )}
              {inviteInfo?.expiresAt && (
                <p className="text-xs">
                  Expires: {new Date(inviteInfo.expiresAt).toLocaleDateString()}
                </p>
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

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && inviteInfo && (
            <div className="mt-6 p-3 bg-slate-700/50 rounded-lg text-xs text-slate-400">
              <p><strong>Debug:</strong> Invite Code: {code}</p>
              <p>Server ID: {inviteInfo.server?._id}</p>
              <p>Uses: {inviteInfo.uses}/{inviteInfo.maxUses || '∞'}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default InviteJoinPage;
