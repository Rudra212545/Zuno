// pages/HelpSupport.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Footer from "../components/Footer";
import {
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  Book,
  Shield,
  Settings,
  Users,
  Video,
  Globe,
  Send,
  Star,
  ExternalLink,
  Zap,
  AlertCircle,
  CheckCircle,
  Phone,
  Sparkles,
  Heart
} from "lucide-react";
import { setUser } from "../store/slices/userSlice";
import { set } from "../store/slices/uiSlice";
import ProfileNavigation from "../components/ProfileNavigation";

// Enhanced FAQ Item with animations
const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-600/30 rounded-2xl hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:scale-[1.02]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <button
        onClick={onToggle}
        className="relative w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-gray-700/20 hover:to-transparent transition-all duration-300"
      >
        <h3 className="text-white font-semibold text-lg group-hover:text-blue-100 transition-colors duration-300">{question}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
            isOpen 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30' 
              : 'bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-gray-600 group-hover:to-gray-700'
          }`}>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-white transform rotate-180 animate-pulse" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
            )}
          </div>
        </div>
      </button>
      
      {/* Animated answer section */}
      <div className={`overflow-hidden transition-all duration-500 ease-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-8 pb-6 text-gray-300 leading-relaxed relative">
          <div className="absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          <div className="pl-6">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Contact Support with better styling
const ContactSupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Support ticket submitted successfully! We'll get back to you within 24 hours.");
      setFormData({ subject: '', category: 'general', priority: 'medium', message: '' });
    } catch (error) {
      toast.error("Failed to submit support ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-2xl rounded-3xl border border-gray-600/30 shadow-2xl shadow-black/20 p-10 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl backdrop-blur-xl border border-blue-400/20">
            <MessageCircle className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Contact Support
            </h2>
            <p className="text-gray-400 mt-1">We're here to help you 24/7</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <label className="block text-gray-300 font-semibold mb-3 text-sm uppercase tracking-wider">Subject *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full p-5 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all duration-300 hover:bg-gray-700/50 backdrop-blur-xl"
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-gray-300 font-semibold mb-3 text-sm uppercase tracking-wider">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-5 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all duration-300 hover:bg-gray-700/50 backdrop-blur-xl cursor-pointer"
              >
                <option value="general">General Support</option>
                <option value="technical">Technical Issue</option>
                <option value="account">Account & Billing</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-gray-300 font-semibold mb-3 text-sm uppercase tracking-wider">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full p-5 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all duration-300 hover:bg-gray-700/50 backdrop-blur-xl cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-300 font-semibold mb-3 text-sm uppercase tracking-wider">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full p-5 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 outline-none transition-all duration-300 hover:bg-gray-700/50 resize-none backdrop-blur-xl"
              placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, or relevant context..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-700 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  <span className="text-lg">Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-lg">Submit Support Ticket</span>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default function HelpSupport() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, token } = useSelector((state) => state.user);
  const ui = useSelector((state) => state.ui);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [activeTab, setActiveTab] = useState('faq');
  
  // Refs for navbar
  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);
  
  // Mock data for navbar
  const notifications = [];
  const unreadNotifications = 0;

  // FAQ Data (same as before but with better categorization)
  const faqData = [
    {
      id: 1,
      category: 'Getting Started',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      questions: [
        {
          question: "How do I create a new server on Zuno?",
          answer: "To create a new server, click the '+' button in your server list on the left sidebar. Choose 'Create My Own' and follow the setup wizard to customize your server name, icon, and initial settings. You can also use templates for different types of communities!"
        },
        {
          question: "How do I join a server?",
          answer: "You can join a server by clicking on an invite link shared by a friend, or by using the 'Join a Server' option in your server list and entering an invite code. Look for invite links that start with 'zuno.com/invite/'."
        },
        {
          question: "What's the difference between text and voice channels?",
          answer: "Text channels are for written messages, file sharing, and discussions. Voice channels allow real-time voice and video communication with other members. You can also share your screen in voice channels!"
        }
      ]
    },
    {
      id: 2,
      category: 'Account & Privacy',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-500',
      questions: [
        {
          question: "How do I change my privacy settings?",
          answer: "Go to Settings → Privacy to control who can send you direct messages, see your email, and view your online status. You can also manage friend requests and visibility preferences. We recommend reviewing these settings regularly for optimal privacy."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account by going to Settings → My Account → Delete Account. Note that this action is irreversible and will permanently remove all your data including messages, servers, and friendships."
        },
        {
          question: "How do I enable two-factor authentication?",
          answer: "Navigate to Settings → Account Security → Two-Factor Authentication. Follow the setup process using your preferred authenticator app like Google Authenticator or Authy. This adds an extra layer of security to your account."
        }
      ]
    },
    {
      id: 3,
      category: 'Voice & Video',
      icon: <Video className="w-6 h-6" />,
      color: 'from-red-400 to-pink-500',
      questions: [
        {
          question: "Why can't others hear me in voice channels?",
          answer: "Check your microphone settings in Settings → Voice & Video. Ensure your microphone is not muted, the correct input device is selected, and your browser has microphone permissions. Try the mic test feature to verify everything is working."
        },
        {
          question: "How do I share my screen?",
          answer: "In a voice channel, click the screen share button (monitor icon) and select the application or screen you want to share. Other participants will be able to see your shared content. You can also share specific application windows for privacy."
        },
        {
          question: "What should I do if I'm experiencing poor audio quality?",
          answer: "Try enabling noise suppression and echo cancellation in Settings → Voice & Video. Also check your internet connection and consider using push-to-talk if background noise is an issue. Make sure you're using a good quality headset."
        }
      ]
    },
    {
      id: 4,
      category: 'Technical Issues',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-purple-400 to-violet-500',
      questions: [
        {
          question: "Zuno won't load or keeps crashing",
          answer: "Try refreshing your browser, clearing cache and cookies, or using an incognito/private window. If issues persist, try a different browser or check if Zuno is experiencing outages on our status page. Disable browser extensions that might interfere."
        },
        {
          question: "Messages aren't sending or receiving",
          answer: "Check your internet connection and try refreshing the page. If the issue continues, it might be a temporary server issue. You can check our status page for any ongoing problems. Try logging out and back in if the issue persists."
        },
        {
          question: "I'm having trouble with notifications",
          answer: "Ensure notification permissions are enabled in your browser settings. Also check Settings → Notifications in Zuno to customize which events trigger notifications. Clear your browser cache if notifications stopped working suddenly."
        }
      ]
    }
  ];

  // Filter FAQ based on search
  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  // Click outside detection (same as before)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        dispatch(set({ key: "showProfileMenu", value: false }));
      }
      
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        dispatch(set({ key: "showNotifications", value: false }));
      }
    };

    if (ui.showProfileMenu || ui.showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ui.showProfileMenu, ui.showNotifications, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(setUser(null));
    dispatch(set({ key: "showProfileMenu", value: false }));
    navigate('/');
  };

  return (
    <>
      <ProfileNavigation
        user={user}
        showNotifications={ui.showNotifications}
        setShowNotifications={(val) => dispatch(set({ key: "showNotifications", value: val }))}
        showProfileMenu={ui.showProfileMenu}
        setShowProfileMenu={(val) => dispatch(set({ key: "showProfileMenu", value: val }))}
        showMobileMenu={ui.showMobileMenu}
        setShowMobileMenu={(val) => dispatch(set({ key: "showMobileMenu", value: val }))}
        showChannels={ui.showChannels}
        setShowChannels={(val) => dispatch(set({ key: "showChannels", value: val }))}
        notifications={notifications}
        unreadNotifications={unreadNotifications}
        notificationsRef={notificationsRef}
        profileMenuRef={profileMenuRef}
        handleLogout={handleLogout} 
      /> 
      
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 py-12 px-6 pt-20">
          {/* Enhanced Page Header */}
          <div className="max-w-6xl mx-auto mb-16 text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative flex items-center justify-center gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl backdrop-blur-xl border border-blue-400/20">
                  <HelpCircle className="w-12 h-12 text-blue-400" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Help & Support
              </span>
            </h1>
            
            <div className="w-32 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto rounded-full mb-8 animate-pulse"></div>
            
            <p className="text-gray-300 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              Get help, find answers, and connect with our{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
                amazing support team
              </span>
            </p>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Book,
                  title: "Documentation",
                  description: "Comprehensive guides and tutorials",
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "from-blue-500/10 to-cyan-500/10",
                },
                {
                  icon: MessageCircle,
                  title: "Live Chat",
                  description: "Get instant help from our team",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "from-green-500/10 to-emerald-500/10",
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "Connect with other Zuno users",
                  color: "from-purple-500 to-violet-500",
                  bgColor: "from-purple-500/10 to-violet-500/10",
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-2xl rounded-3xl border border-gray-600/30 p-8 hover:border-transparent hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer transform hover:scale-105 overflow-hidden"
                >
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`p-4 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex justify-center">
              <div className="flex gap-4 bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-3 border border-gray-600/30 shadow-2xl">
                {[
                  { id: 'faq', label: 'FAQ', icon: HelpCircle },
                  { id: 'contact', label: 'Contact Support', icon: MessageCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 overflow-hidden ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/25 scale-105' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-50"></div>
                    )}
                    <tab.icon className={`w-6 h-6 relative z-10 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'faq' && (
              <>
                {/* Enhanced Search Bar */}
                <div className="mb-12">
                  <div className="relative max-w-3xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-25"></div>
                    <div className="relative bg-gray-800/80 backdrop-blur-2xl rounded-3xl border border-gray-600/30 p-2">
                      <div className="flex items-center">
                        <Search className="absolute left-6 text-gray-400 w-6 h-6 z-10" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search for help articles, tips, and solutions..."
                          className="w-full pl-16 pr-6 py-6 bg-transparent text-white text-lg placeholder-gray-400 focus:outline-none"
                        />
                        <div className="absolute right-2 top-2 bottom-2 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced FAQ Categories */}
                <div className="space-y-12">
                  {(searchTerm ? filteredFAQ : faqData).map((category) => (
                    <div
                      key={category.id}
                      className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-2xl rounded-3xl border border-gray-600/30 shadow-2xl shadow-black/10 p-10 overflow-hidden"
                    >
                      {/* Category background decoration */}
                      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${category.color} opacity-5 rounded-full blur-3xl`}></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-6 mb-8">
                          <div className={`p-4 bg-gradient-to-r ${category.color} rounded-2xl shadow-lg`}>
                            {category.icon}
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                              {category.category}
                            </h2>
                            <div className={`w-24 h-1 bg-gradient-to-r ${category.color} rounded-full mt-2`}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          {category.questions.map((faq, index) => (
                            <FAQItem
                              key={index}
                              question={faq.question}
                              answer={faq.answer}
                              isOpen={openFAQ === `${category.id}-${index}`}
                              onToggle={() => setOpenFAQ(openFAQ === `${category.id}-${index}` ? null : `${category.id}-${index}`)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced No Results */}
                {searchTerm && filteredFAQ.length === 0 && (
                  <div className="text-center py-20">
                    <div className="relative inline-block mb-8">
                      <div className="absolute -inset-4 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full blur-2xl"></div>
                      <AlertCircle className="relative w-24 h-24 text-gray-500 mx-auto animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-400 mb-4">No results found</h3>
                    <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                      We couldn't find any articles matching your search. Try adjusting your search terms or browse the categories above.
                    </p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'contact' && <ContactSupport />}
          </div>

        
        </div>
      </main>
      <Footer/>
    </>
  );
}
