import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutModal = ({ showLogoutConfirm, confirmLogout, cancelLogout, logoutConfirmRef }) => {
  if (!showLogoutConfirm) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        ref={logoutConfirmRef}
        className="bg-gradient-to-b from-slate-900/95 to-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-600/30 p-6 max-w-md w-full mx-4"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogOut size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
          <p className="text-gray-400 mb-6">Are you sure you want to log out of Dev Team workspace?</p>
          
          <div className="flex space-x-3">
            <button
              onClick={cancelLogout}
              className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;