 // ─── Privacy Settings ──────────────────────────────────────────
 body('privacySettings.allowDirectMessages')
 .optional()
 .isIn(['everyone', 'friends', 'none']).withMessage('Invalid direct message setting'),

body('privacySettings.showEmail')
 .optional().isBoolean().withMessage('Show email must be a boolean'),

body('privacySettings.showPhone')
 .optional().isBoolean().withMessage('Show phone must be a boolean'),

body('privacySettings.allowFriendRequests')
 .optional().isBoolean().withMessage('Allow friend requests must be a boolean'),

body('privacySettings.showOnlineStatus')
 .optional().isBoolean().withMessage('Show online status must be a boolean'),

// ─── Video Settings ────────────────────────────────────────────
body('videoSettings.autoJoinVoice').optional().isBoolean().withMessage('Auto join voice must be a boolean'),
body('videoSettings.pushToTalk').optional().isBoolean().withMessage('Push to talk must be a boolean'),
body('videoSettings.noiseSuppression').optional().isBoolean().withMessage('Noise suppression must be a boolean'),
body('videoSettings.echoCancellation').optional().isBoolean().withMessage('Echo cancellation must be a boolean'),
body('videoSettings.autoGainControl').optional().isBoolean().withMessage('Auto gain control must be a boolean'),

body('videoSettings.videoQuality')
 .optional().isIn(['low', 'medium', 'high', 'auto']).withMessage('Invalid video quality setting'),

body('videoSettings.defaultCamera')
 .optional().trim().isLength({ max: 100 }).withMessage('Default camera name cannot exceed 100 characters'),

body('videoSettings.defaultMicrophone')
 .optional().trim().isLength({ max: 100 }).withMessage('Default microphone name cannot exceed 100 characters'),

body('videoSettings.defaultSpeaker')
 .optional().trim().isLength({ max: 100 }).withMessage('Default speaker name cannot exceed 100 characters'),

body('videoSettings.pushToTalkKey')
 .optional().trim().isLength({ max: 20 }).withMessage('Push to talk key cannot exceed 20 characters'),

// ─── Notification Settings ─────────────────────────────────────
body('notificationSettings.desktop').optional().isBoolean().withMessage('Desktop notifications must be a boolean'),
body('notificationSettings.mobile').optional().isBoolean().withMessage('Mobile notifications must be a boolean'),
body('notificationSettings.email').optional().isBoolean().withMessage('Email notifications must be a boolean'),
body('notificationSettings.sounds').optional().isBoolean().withMessage('Sound notifications must be a boolean'),
body('notificationSettings.mentions').optional().isBoolean().withMessage('Mention notifications must be a boolean'),
body('notificationSettings.directMessages').optional().isBoolean().withMessage('Direct message notifications must be a boolean'),
body('notificationSettings.friendRequests').optional().isBoolean().withMessage('Friend request notifications must be a boolean'),
body('notificationSettings.eventReminders').optional().isBoolean().withMessage('Event reminder notifications must be a boolean'),
body('notificationSettings.callNotifications').optional().isBoolean().withMessage('Call notifications must be a boolean'),

// ─── Auto Translation ──────────────────────────────────────────
body('autoTranslate').optional().isBoolean().withMessage('Auto translate must be a boolean'),

body('preferredTranslationLanguage')
 .optional()
 .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi'])
 .withMessage('Invalid preferred translation language'),

// ─── Status & Account ──────────────────────────────────────────
body('status')
 .optional()
 .isIn(['online', 'away', 'busy', 'invisible', 'offline'])
 .withMessage('Invalid status selection'),

body('isVerified').optional().isBoolean().withMessage('Is verified must be a boolean'),
body('emailVerified').optional().isBoolean().withMessage('Email verified must be a boolean'),
body('phoneVerified').optional().isBoolean().withMessage('Phone verified must be a boolean'),
body('twoFactorEnabled').optional().isBoolean().withMessage('Two factor enabled must be a boolean'),

// ─── Badges ────────────────────────────────────────────────────
body('badges')
 .optional().isArray().withMessage('Badges must be an array'),

body('badges.*.type')
 .optional()
 .isIn([
   'early_adopter', 'verified', 'developer', 'moderator', 'supporter',
   'event_organizer', 'translator', 'community_builder', 'gamer',
   'content_creator', 'helper', 'bug_hunter', 'beta_tester'
 ])
 .withMessage('Invalid badge type'),

body('badges.*.description')
 .optional()
 .trim().isLength({ max: 200 }).withMessage('Badge description cannot exceed 200 characters')
 .escape(),

// ─── Achievements ──────────────────────────────────────────────
body('achievements')
 .optional().isArray().withMessage('Achievements must be an array'),

body('achievements.*.name')
 .optional()
 .trim().isLength({ min: 1, max: 100 }).withMessage('Achievement name must be between 1 and 100 characters')
 .escape(),

body('achievements.*.description')
 .optional()
 .trim().isLength({ max: 500 }).withMessage('Achievement description cannot exceed 500 characters')
 .escape(),

body('achievements.*.icon')
 .optional()
 .trim().isLength({ max: 50 }).withMessage('Achievement icon cannot exceed 50 characters'),

body('achievements.*.progress.current')
 .optional().isInt({ min: 0 }).withMessage('Achievement current progress must be a non-negative integer'),

body('achievements.*.progress.total')
 .optional().isInt({ min: 1 }).withMessage('Achievement total progress must be a positive integer'),

// ─── Statistics ────────────────────────────────────────────────
body('statistics.messagesCount')
 .optional().isInt({ min: 0 }).withMessage('Messages count must be a non-negative integer'),

body('statistics.voiceMinutes')
 .optional().isInt({ min: 0 }).withMessage('Voice minutes must be a non-negative integer'),

body('statistics.videoMinutes')
 .optional().isInt({ min: 0 }).withMessage('Video minutes must be a non-negative integer'),

body('statistics.eventsCreated')
 .optional().isInt({ min: 0 }).withMessage('Events created must be a non-negative integer'),

body('statistics.eventsAttended')
 .optional().isInt({ min: 0 }).withMessage('Events attended must be a non-negative integer'),

body('statistics.serversJoined')
 .optional().isInt({ min: 0 }).withMessage('Servers joined must be a non-negative integer'),

body('statistics.friendsCount')
 .optional().isInt({ min: 0 }).withMessage('Friends count must be a non-negative integer'),