const CallUi = ({ channelId, onEndCall }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white bg-gray-900 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Voice/Video Call Active</h2>
        <p className="mb-4">You are in a call for channel: {channelId}</p>
        <button 
          onClick={onEndCall}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
        >
          End Call
        </button>
      </div>
    );
  };
  
  export default CallUi;
  