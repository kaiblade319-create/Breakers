import { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appTitle: 'InCare',
    appTagline: 'One financial navigation layer across healthcare support options',
    caregiverMode: 'Caregiver Mode',
    patientMode: 'Patient View',
    emergencyHelpline: 'National Ayushman Helpline: 14555 | Maharashtra MJPJAY: 155388',
    switchCase: 'Load Example Case',
    editProfile: 'Edit Patient Profile',
    activeCase: 'Active Patient Journey',
    cancerExample: 'Doc Example: 52yo Cancer in MH (₹6L)',
    cardiacExample: 'Cardiac Bypass in Delhi (₹4L)',
    dialysisExample: 'Chronic Kidney Disease Dialysis (₹2.5L)',

    // Tabs
    tabSupportMap: 'Financial Support Map',
    tabDocuments: 'Document Readiness',
    tabOneApplication: 'One-App Pathways',
    tabTracking: 'My Support Journey',
    tabInsurance: 'Insurance Guide',
    tabAiNavigator: 'AI Financial Care Navigator',

    // Financial Support Map
    estimatedCost: 'Estimated Treatment Cost',
    totalPotentialAid: 'Total Identified Financial Support',
    estimatedOutOfPocket: 'Estimated Out-of-Pocket Expense',
    supportSources: 'Financial Support Sources',
    sourceHeader: 'Support Source',
    coverageHeader: 'Potential Support',
    statusHeader: 'Eligibility Status',
    nextActionHeader: 'Next Action',
    viewDetails: 'View Verified Rules',
    costReductionNotice: 'With verified multi-channel navigation, patient out-of-pocket is reduced from ₹6 Lakh to estimated manageable balance.',
    
    // Document Readiness
    docsReadyTitle: 'Unified Document Readiness',
    docsReadySubtitle: 'You already have {ready} of the {total} documents required across your applications.',
    missingNotice: 'You have missing documents that could delay approval.',
    uploadDocument: 'Upload / Add Document',
    dragDropText: 'Drag & drop medical documents or click to browse (Aadhaar, Bills, Biopsy, Estimates)',
    verified: 'Verified',
    missing: 'Missing',
    underReview: 'Under Review',
    actionRequired: 'Action Required',

    // One Application -> Multiple Pathways
    oneAppTitle: 'One Application → Multiple Pathways',
    oneAppSubtitle: 'The patient shouldn\'t have to repeatedly enter the same information across 4 different platforms.',
    generateDossier: 'Generate Unified Application Dossier',
    downloadPdf: 'Download Pre-filled Package',
    pathwayGovt: 'Government Scheme Pre-Auth Form',
    pathwayInsurance: 'TPA Cashless Request (IRDAI Form)',
    pathwayHospital: 'Hospital Charitable MSW Trust Letter',
    pathwayNgo: 'NGO & Charitable Grant Application',

    // Status Tracking
    supportJourneyTitle: 'My Support Journey & Real-Time Tracking',
    pendingActionsToday: 'You have {count} pending actions today.',
    actionManagementNotice: 'Shifting your healthcare journey from passive information retrieval to proactive action management.',
    streamProgress: 'Approval & Settlement Progress',

    // AI Navigator
    aiAssistantTitle: 'AI Financial Care Navigator',
    aiAssistantSubtitle: 'Ask any questions about financial assistance, claim queries, scheme rules, or delays.',
    aiPrompt1: 'My father has cancer and treatment will cost around ₹4 lakh. We don\'t have much money. What can we do?',
    aiPrompt2: 'Why is my insurance reimbursement delayed or query raised?',
    aiPrompt3: 'Can I combine Ayushman Bharat / MJPJAY with my private health insurance?',
    aiPrompt4: 'Draft a fee concession appeal letter to the hospital charitable trust.',
    send: 'Ask Navigator',
    inputPlaceholder: 'Describe your medical situation, cost estimate, or ask for guidance...',

    // Next best actions
    nextBestActionsTitle: 'Your Next-Best Actions Today',
    priority: 'Priority',
    department: 'Department / Desk',
  },
  hi: {
    appTitle: 'InCare (इनकेयर)',
    appTagline: 'स्वास्थ्य खर्च सहायता विकल्पों के लिए एक एकीकृत वित्तीय नेविगेशन मंच',
    caregiverMode: 'केयरगिवर (परिजन) मोड',
    patientMode: 'मरीज़ दृश्य',
    emergencyHelpline: 'राष्ट्रीय आयुष्मान हेल्पलाइन: 14555 | महाराष्ट्र MJPJAY: 155388',
    switchCase: 'उदाहरण केस चुनें',
    editProfile: 'मरीज़ प्रोफाइल बदलें',
    activeCase: 'सक्रिय मरीज़ विवरण',
    cancerExample: 'दस्तावेज़ उदाहरण: 52 वर्षीय कैंसर मरीज (₹6 लाख)',
    cardiacExample: 'हृदय बाईपास सर्जरी दिल्ली (₹4 लाख)',
    dialysisExample: 'किडनी डायलिसिस उपचार (₹2.5 लाख)',

    // Tabs
    tabSupportMap: 'वित्तीय सहायता नक्शा',
    tabDocuments: 'दस्तावेज़ तैयारी (Readiness)',
    tabOneApplication: 'एक आवेदन → कई रास्ते',
    tabTracking: 'मेरी सहायता यात्रा (ट्रैकिंग)',
    tabInsurance: 'बीमा व क्लेम गाइड',
    tabAiNavigator: 'एआई फाइनेंशियल केयर नेविगेटर',

    // Financial Support Map
    estimatedCost: 'अनुमानित उपचार लागत',
    totalPotentialAid: 'पहचानी गई कुल वित्तीय सहायता',
    estimatedOutOfPocket: 'मरीज़ की जेब से अनुमानित खर्च',
    supportSources: 'वित्तीय सहायता के स्रोत',
    sourceHeader: 'सहायता स्रोत',
    coverageHeader: 'संभावित सहायता',
    statusHeader: 'पात्रता स्थिति',
    nextActionHeader: 'अगला कदम',
    viewDetails: 'नियम विवरण देखें',
    costReductionNotice: 'सत्यापित बहु-स्रोत नेविगेशन द्वारा, मरीज़ की जेब का खर्च ₹6 लाख से घटकर अत्यंत कम हो जाता है।',

    // Document Readiness
    docsReadyTitle: 'एकीकृत दस्तावेज़ तैयारी',
    docsReadySubtitle: 'आपके सभी आवेदनों के लिए आवश्यक {total} में से {ready} दस्तावेज़ पहले से तैयार हैं।',
    missingNotice: 'आपके कुछ ज़रूरी दस्तावेज़ अभी बाकी हैं, जिससे मंजूरी में देरी हो सकती है।',
    uploadDocument: 'दस्तावेज़ अपलोड / जोड़ें',
    dragDropText: 'दस्तावेज़ यहाँ खींचें या चुनने के लिए क्लिक करें (आधार, बिल, बायोप्सी, अनुमान पत्र)',
    verified: 'सत्यापित (Verified)',
    missing: 'बाकी (Missing)',
    underReview: 'जाँच में (Under Review)',
    actionRequired: 'कार्रवाई आवश्यक',

    // One Application -> Multiple Pathways
    oneAppTitle: 'एक आवेदन → कई रास्ते',
    oneAppSubtitle: 'मरीज़ या परिजन को बार-बार अलग-अलग दफ्तरों में एक ही जानकारी नहीं भरनी पड़ेगी।',
    generateDossier: 'संयुक्त आवेदन पैकेज तैयार करें',
    downloadPdf: 'फॉर्म डाउनलोड करें',
    pathwayGovt: 'सरकारी योजना प्री-ऑथ फॉर्म',
    pathwayInsurance: 'टीपीए कैशलेस अनुरोध फॉर्म',
    pathwayHospital: 'अस्पताल एमएसडब्ल्यू रियायत प्रार्थना पत्र',
    pathwayNgo: 'एनजीओ व ट्रस्ट सहायता आवेदन',

    // Status Tracking
    supportJourneyTitle: 'मेरी सहायता यात्रा एवं स्थिति ट्रैकिंग',
    pendingActionsToday: 'आज आपके पास {count} लंबित कार्रवाइयां हैं।',
    actionManagementNotice: 'सूचना ढूंढने की उलझन से आगे बढ़कर आज ही आवश्यक कदम उठाएं।',
    streamProgress: 'मंजूरी एवं क्लेम प्रगति',

    // AI Navigator
    aiAssistantTitle: 'एआई फाइनेंशियल केयर नेविगेटर',
    aiAssistantSubtitle: 'उपचार खर्च, सरकारी योजना नियम, बीमा क्लेम या कागजी कार्रवाई पर सवाल पूछें।',
    aiPrompt1: 'मेरे पिताजी को कैंसर है और इलाज का खर्च लगभग ₹4 लाख है। हमारे पास अधिक पैसे नहीं हैं। हम क्या करें?',
    aiPrompt2: 'मेरा बीमा क्लेम क्यों अटका हुआ है या उस पर क्वेरी क्यों आई है?',
    aiPrompt3: 'क्या मैं आयुष्मान भारत/MJPJAY और निजी बीमा दोनों का एक साथ लाभ ले सकता हूँ?',
    aiPrompt4: 'अस्पताल के चैरिटेबल ट्रस्ट को फीस माफी/रियायत के लिए प्रार्थना पत्र लिखें।',
    send: 'पूछें',
    inputPlaceholder: 'अपनी बीमारी, अनुमानित खर्च या स्थिति लिखें...',

    // Next best actions
    nextBestActionsTitle: 'आज के आपके सबसे महत्वपूर्ण अगले कदम',
    priority: 'प्राथमिकता',
    department: 'विभाग / काउंटर',
  },
  mr: {
    appTitle: 'InCare (इनकेअर)',
    appTagline: 'आरोग्य उपचार खर्चात मदतीसाठी एकात्मिक आर्थिक मार्गदर्शन प्लॅटफॉर्म',
    caregiverMode: 'काळजीवाहू (कुटुंबीय) मोड',
    patientMode: 'रुग्ण दृश्य',
    emergencyHelpline: 'राष्ट्रीय आयुष्मान हेल्पलाईन: 14555 | महाराष्ट्र MJPJAY: 155388',
    switchCase: 'उदाहरण केस निवडा',
    editProfile: 'रुग्ण माहिती बदला',
    activeCase: 'सक्रिय रुग्ण तपशील',
    cancerExample: 'दस्तऐवज उदाहरण: 52 वर्षे कर्करोग रुग्ण (₹6 लाख)',
    cardiacExample: 'हृदय शस्त्रक्रिया दिल्ली (₹4 लाख)',
    dialysisExample: 'किडनी डायलिसिस उपचार (₹2.5 लाख)',

    // Tabs
    tabSupportMap: 'आर्थिक सहाय्य नकाशा',
    tabDocuments: 'कागदपत्र तयारी (Readiness)',
    tabOneApplication: 'एक अर्ज → अनेक मार्ग',
    tabTracking: 'माझा सहाय्य प्रवास (ट्रॅकिंग)',
    tabInsurance: 'विमा व क्लेम मार्गदर्शक',
    tabAiNavigator: 'एआय फायनान्शियल केअर नेव्हिगेटर',

    // Financial Support Map
    estimatedCost: 'उपचाराचा अंदाजित खर्च',
    totalPotentialAid: 'उपलब्ध एकूण आर्थिक सहाय्य',
    estimatedOutOfPocket: 'रुग्णाच्या खिशातील अंदाजित खर्च',
    supportSources: 'आर्थिक मदतीचे मार्ग',
    sourceHeader: 'मदतीचा स्त्रोत',
    coverageHeader: 'संभाव्य मदत',
    statusHeader: 'पात्रता स्थिती',
    nextActionHeader: 'पुढील पाऊल',
    viewDetails: 'नियम व अटी पहा',
    costReductionNotice: 'सर्व शासकीय व विमा योजनांच्या एकत्रित वापरामुळे, रुग्णाचा प्रत्यक्ष खर्च ₹6 लाखांवरून खूप कमी होतो.',

    // Document Readiness
    docsReadyTitle: 'कागदपत्रांची तयारी',
    docsReadySubtitle: 'तुमच्या सर्व अर्जांसाठी आवश्यक असलेल्या {total} पैकी {ready} कागदपत्रे आधीच तयार आहेत.',
    missingNotice: 'तुमची काही महत्त्वाची कागदपत्रे शिल्लक आहेत, ज्यामुळे मंजुरीस उशीर होऊ शकतो.',
    uploadDocument: 'कागदपत्र अपलोड करा',
    dragDropText: 'कागदपत्रे येथे ड्रॅग करा किंवा फाईल निवडा (आधार, बिल, बायोप्सी, अंदाजपत्रक)',
    verified: 'तपासलेले (Verified)',
    missing: 'बाकी (Missing)',
    underReview: 'पडताळणी चालू',
    actionRequired: 'कृती आवश्यक',

    // One Application -> Multiple Pathways
    oneAppTitle: 'एक अर्ज → अनेक मार्ग',
    oneAppSubtitle: 'रुग्णाला किंवा नातेवाईकाला प्रत्येक कार्यालयात पुन्हा पुन्हा तीच माहिती भरण्याची गरज नाही.',
    generateDossier: 'एकात्मिक अर्ज संच तयार करा',
    downloadPdf: 'फॉर्म डाऊनलोड करा',
    pathwayGovt: 'MJPJAY / आयुष्मान पूर्व-मंजुरी अर्ज',
    pathwayInsurance: 'टीपीए कॅशलेस विनंती फॉर्म',
    pathwayHospital: 'धर्मादाय रुग्णालय सवलत विनंती पत्र',
    pathwayNgo: 'एनजीओ व ट्रस्ट सहाय्य अर्ज',

    // Status Tracking
    supportJourneyTitle: 'माझा सहाय्य प्रवास व सद्यस्थिती ट्रॅकिंग',
    pendingActionsToday: 'आज तुमच्यासाठी {count} प्रलंबित कृती आहेत.',
    actionManagementNotice: 'केवळ माहिती शोधण्याऐवजी आजच आवश्यक कृती करा आणि उपचार खर्चात सवलत मिळवा.',
    streamProgress: 'मंजुरी व क्लेम प्रगती',

    // AI Navigator
    aiAssistantTitle: 'एआय फायनान्शियल केअर नेव्हिगेटर',
    aiAssistantSubtitle: 'उपचार खर्च, शासकीय योजना, विमा क्लेम किंवा कागदपत्रांबद्दल प्रश्न विचारा.',
    aiPrompt1: 'माझ्या वडिलांना कॅन्सर असून उपचाराचा खर्च अंदाजे ₹4 लाख आहे. आमच्याकडे पुरेसे पैसे नाहीत. आम्ही काय करावे?',
    aiPrompt2: 'माझा विमा क्लेम का अडकला आहे किंवा त्यावर क्वेरी का आली आहे?',
    aiPrompt3: 'मला MJPJAY आणि खाजगी विमा या दोन्हीचा एकाच वेळी लाभ घेता येईल का?',
    aiPrompt4: 'रुग्णालयाच्या ट्रस्टला उपचार खर्चात सवलतीसाठी विनंती अर्ज लिहा.',
    send: 'विचारा',
    inputPlaceholder: 'तुमची समस्या, आजार व अंदाजित खर्च लिहा...',

    // Next best actions
    nextBestActionsTitle: 'आज करावयाची महत्त्वाची पावले',
    priority: 'प्राधान्य',
    department: 'विभाग / कक्ष',
  }
};
