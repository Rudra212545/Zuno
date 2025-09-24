import React, { useState, useRef } from 'react';
import { X, Copy, Users, Clock, Hash, Eye, Settings, Check, UserPlus, Calendar, Hash as HashIcon, Trash2 } from 'lucide-react';
import axios from 'axios';

const InvitePeopleModal = ({ isOpen, onClose, server, user }) => {
  const [inviteLink, setInviteLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [inviteSettings, setInviteSettings] = useState({
    expiresAfter: '7days',
    maxUses: 'unlimited',
    grantTempMembership: false
  });
  const [existingInvites, setExistingInvites] = useState([]);
  const linkInputRef = useRef(null);

  // Convert expiry setting to seconds
  const getExpiryInSeconds = (expiresAfter) => {
    const expiryMap = {
      '30min': 30 * 60,
      '1hour': 60 * 60,
      '6hours': 6 * 60 * 60,
      '12hours': 12 * 60 * 60,
      '1day': 24 * 60 * 60,
      '7days': 7 * 24 * 60 * 60,
      '30days': 30 * 24 * 60 * 60,
      'never': null
    };
    return expiryMap[expiresAfter];
  };

  // Generate new invite link
  const generateInviteLink = async () => {
    setIsGenerating(true);
    setError('');

    console.log('🧑‍💻 User object:', user);
    console.log('🏢 Server object:', server);

    try {
      const token = localStorage.getItem('token');
      
      // Build the payload
      const payload = {
        maxUses: inviteSettings.maxUses === 'unlimited' ? null : parseInt(inviteSettings.maxUses, 10),
        expiresIn: getExpiryInSeconds(inviteSettings.expiresAfter) // Convert to seconds
      };
      
      console.log('📤 Sending payload:', payload);
      
      // ✅ Use the correct API endpoint from your backend
      const response = await axios.post(
        `http://localhost:3000/api/v1/invite/${server._id}`, // Fixed endpoint
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Invite response:', response.data);
      
      // Extract invite code from response
      const inviteCode = response.data.invite?.code || response.data.data?.invite?.code;
      if (inviteCode) {
        setInviteLink(`${window.location.origin}/invite/${inviteCode}`);
        fetchExistingInvites(); // Refresh the list
      } else {
        setError('Failed to get invite code from server response');
      }
      
    } catch (error) {
      console.error('❌ Error generating invite:', error);
      
      let errorMessage = 'Something went wrong';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server error details:', error.response.data);
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fetch existing invites
  const fetchExistingInvites = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // ✅ Use the correct API endpoint
      const response = await axios.get(
        `http://localhost:3000/api/v1/invite/server/${server._id}`, // Fixed endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('📋 Existing invites:', response.data);
      setExistingInvites(response.data.invites || response.data.data?.invites || []);
    } catch (error) {
      console.error('❌ Error fetching invites:', error);
      if (error.response?.status !== 404) {
        setError('Failed to fetch existing invites');
      }
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      linkInputRef.current?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Revoke invite
  const revokeInvite = async (inviteCode) => {
    try {
      const token = localStorage.getItem('token');
      
      // ✅ Use the correct API endpoint
      await axios.delete(
        `http://localhost:3000/api/v1/invite/${inviteCode}`, // Fixed endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      fetchExistingInvites(); // Refresh the list
      console.log('✅ Invite revoked:', inviteCode);
    } catch (error) {
      console.error('❌ Error revoking invite:', error);
      setError('Failed to revoke invite');
    }
  };

  // Load existing invites when modal opens
  React.useEffect(() => {
    if (isOpen) {
      console.log('🔄 Modal opened, fetching existing invites');
      fetchExistingInvites();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-700/50 transform transition-all duration-300 animate-in overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-700/50 bg-gradient-to-r from-emerald-900/20 to-teal-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Invite People
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Invite friends to join <span className="font-semibold text-slate-300">{server?.name}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-slate-700 rounded-xl transition-colors duration-200 group"
              disabled={isGenerating}
            >
              <X className="w-6 h-6 text-slate-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-8 mt-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            {error}
            <button 
              onClick={() => setError('')}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Invite Link */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invite Link Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-emerald-400" />
                    Invite Link
                  </label>
                  {!inviteLink && (
                    <button
                      onClick={generateInviteLink}
                      disabled={isGenerating}
                      className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Link'}
                    </button>
                  )}
                </div>

                {inviteLink ? (
                  <div className="relative">
                    <div className="flex gap-3">
                      <input
                        ref={linkInputRef}
                        type="text"
                        value={inviteLink}
                        readOnly
                        className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-slate-600/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 text-white font-mono text-sm"
                      />
                      <button
                        onClick={copyToClipboard}
                        className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] min-w-[120px] justify-center ${
                          copied
                            ? 'bg-green-600 text-white'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check size={18} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-slate-800/30 border border-slate-600/30 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-slate-300 font-semibold text-lg mb-2">No Active Invite Link</p>
                    <p className="text-slate-500 text-sm">Generate an invite link to start inviting people to your server</p>
                  </div>
                )}
              </div>

              {/* Existing Invites */}
              {existingInvites.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Active Invites ({existingInvites.length})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600/60 scrollbar-track-transparent">
                    {existingInvites.map((invite) => (
                      <div key={invite._id} className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-600/30 rounded-xl hover:bg-slate-800/70 hover:border-slate-500/50 transition-all duration-200 group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <HashIcon className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white font-mono">
                              {invite.code}
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Users size={12} />
                                {invite.uses || 0} uses
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {invite.expiresAt ? `Expires ${new Date(invite.expiresAt).toLocaleDateString()}` : 'Never expires'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => revokeInvite(invite.code)} // Use code instead of _id
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-red-500/15 font-medium flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Settings
                </h3>

                {/* Expiration */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-400">Expire after</label>
                  <select
                    value={inviteSettings.expiresAfter}
                    onChange={(e) => setInviteSettings(prev => ({ ...prev, expiresAfter: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-white text-sm"
                  >
                    <option value="30min">30 minutes</option>
                    <option value="1hour">1 hour</option>
                    <option value="6hours">6 hours</option>
                    <option value="12hours">12 hours</option>
                    <option value="1day">1 day</option>
                    <option value="7days">7 days</option>
                    <option value="30days">30 days</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                {/* Max Uses */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-400">Max uses</label>
                  <select
                    value={inviteSettings.maxUses}
                    onChange={(e) => setInviteSettings(prev => ({ ...prev, maxUses: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-600/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 text-white text-sm"
                  >
                    <option value="1">1 use</option>
                    <option value="5">5 uses</option>
                    <option value="10">10 uses</option>
                    <option value="25">25 uses</option>
                    <option value="50">50 uses</option>
                    <option value="100">100 uses</option>
                    <option value="unlimited">No limit</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t border-slate-700/50 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl font-semibold transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
              disabled={isGenerating}
            >
              Close
            </button>
            <button
              onClick={generateInviteLink}
              disabled={isGenerating}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : (
                'Generate New Link'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitePeopleModal;
