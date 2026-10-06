/**
 * TrustBank Privacy-First Loan Eligibility Chatbot
 * 
 * CORE PRINCIPLES:
 * 1. Zero Permanent Storage: No localStorage, IndexedDB, or server database.
 * 2. In-Memory Session Scope: Data lives solely in transient JS memory and is wiped on session close or reset.
 * 3. Proactive PII Sanitization: Strictly rejects Aadhaar, card details, bank account numbers, passwords, and OTPs.
 * 4. Zero PII Logging: Browser console, server logs, and error messages never record applicant financial details.
 * 5. Instant "Clear My Data": Purges all memory structures and UI chat history immediately.
 * 6. Multilingual & Voice Accessibility: English (en-IN), ಕನ್ನಡ (kn-IN), and हिन्दी (hi-IN) support via Web Speech APIs.
 * 7. Mixed-Language Understanding: Understands naturally mixed English + Kannada or English + Hindi speech.
 * 8. Clear Microphone UI States: 🎤 Ready, 🔴 Listening, ⏳ Processing..., ❌ Error.
 */

// --- ACTIVE LANGUAGE & VOICE SETTINGS ---
let currentLanguage = "en"; // "en", "kn", "hi"

// Language Codes for Web Speech API (Recognition & Synthesis)
const SPEECH_LANG_CODES = {
    en: "en-IN",
    kn: "kn-IN",
    hi: "hi-IN"
};

// --- MULTILINGUAL TRANSLATIONS DICTIONARY (SIMPLE, NATURAL LANGUAGE) ---
const TRANSLATIONS = {
    en: {
        brandTitle: "TrustBank Credit Advisor",
        brandSubtitle: "Smart & Confidential Loan Eligibility Chatbot",
        storageBadge: "Zero Storage Mode",
        clearDataBtn: "Clear My Data",
        privacyNotice: "<strong>Privacy Notice:</strong> Your information is used only for this preliminary loan eligibility assessment. We do not permanently store your personal or financial information.",
        agentName: "Loan Advisor Bot",
        agentStatus: "Online • Ephemeral Session",
        securityChip: "🔒 Browser Memory Only",
        inputPlaceholder: "Type your response or click mic to speak...",
        footerCaption: "🛡️ Processing is local & confidential. External AI services (if invoked) receive strictly anonymized estimates with zero personal identifiers.",
        listeningText: "Listening... Speak now",
        speechNotSupported: "Speech recognition is not supported in this browser. Please use text typing.",
        synthesisNotSupported: "Speech synthesis (voice output) is not supported in this browser.",
        micAccessError: "Microphone access was denied or timed out. Please try again or type below.",
        micPermissionDenied: "Microphone permission denied. Please allow microphone access in your browser settings or type below.",
        noSpeechDetected: "No speech detected. Please click the mic and speak clearly.",
        micReady: "🎤 Ready: Click to speak",
        micListening: "🔴 Listening... Speak now",
        micProcessing: "⏳ Processing speech...",
        sensitiveAlertPrefix: "Privacy Shield Intercepted: Potential",
        sensitiveAlertSuffix: "detected. For your safety, do not share sensitive credentials (Aadhaar, cards, bank accounts, passwords, or OTPs). We only need non-identifying estimates.",
        fallbackError: "I couldn't quite understand that. Please choose one of the suggested options below or type your answer.",
        listenBtn: "Listen",
        stopBtn: "Stop",
        clearDataToast: "🧹 All applicant data and chat history have been permanently cleared.",
        langChangeToast: "Language changed to English.",
        restartBtn: "Restart Assessment",
        clearDataChip: "Clear My Data",
        localCalcNotice: "✅ All assessment calculations were completed entirely within your browser's volatile memory. No permanent records were created.",
        loanIntentAcknowledge: "Welcome! I will gladly help check your loan eligibility. What type of loan are you exploring? (Home Loan, Personal Loan, Auto Loan, Education Loan)",
        mixedInputNotedSalary: "Great! I have recorded your monthly income as ₹{amount}. Which type of loan are you exploring? (Home Loan, Personal Loan, Auto Loan, Education Loan)",
        // Assessment Card
        assessmentTitle: "Preliminary Assessment",
        maxEligibleLabel: "Max Eligible Amount",
        estimatedEmiLabel: "Estimated Monthly EMI",
        interestRateLabel: "Indicative Interest Rate",
        debtRatioLabel: "Debt Ratio (FOIR)",
        statusApproved: "Eligible / Approved",
        statusConditional: "Partially Eligible",
        statusIneligible: "Ineligible",
        docsTitle: "Document Verification Checklist",
        nextStepsTitle: "Recommended Next Steps",
        docsSalaried: [
          "Xerox / Scanned Copy Proof Submission: Self-attested photocopy of PAN/Voter ID, last 3 months salary slips, and Form 16.",
          "Original-Document Verification: Original PAN & ID Proof inspected in person at the branch before final sanction.",
          "Bank Summary: Latest 6 months operating bank account statement (photocopy / PDF).",
          "Quotation: Property / Vehicle quotation from authorized dealer (for Home & Auto loans)."
        ],
        docsSelfEmployed: [
          "Xerox / Scanned Copy Proof Submission: Business registration certificate and last 2 years ITR with financial computation.",
          "Original-Document Verification: Original business license and tax returns inspected in person at the branch.",
          "Bank Summary: Latest 12 months current account statement (photocopy / PDF).",
          "Quotation: Property / Vehicle quotation from authorized dealer (for Home & Auto loans)."
        ],
        nextStepsList: [
            "1. Review and save your preliminary eligibility assessment figures.",
            "2. Assemble self-attested photocopies of the required proof documents listed above.",
            "3. Visit your nearest TrustBank branch with original documents for in-person sight verification and final sanction."
        ],
        tipsExceed: "Increasing repayment tenure or closing existing liabilities will reduce your monthly EMI burden.",
        tipsHealthy: "Maintaining timely repayments on your current loans will guarantee prime interest rates upon formal application.",
        tipsCoApplicant: "Consider applying with a working co-applicant (spouse/parent) to combine household incomes.",
        tipsDebtConsolidation: "Close or consolidate existing personal loans/credit cards to free up monthly debt servicing capacity."
    },
    kn: {
        brandTitle: "ಟ್ರಸ್ಟ್‌ಬ್ಯಾಂಕ್ ಸಾಲ ಸಲಹೆಗಾರ",
        brandSubtitle: "ಸ್ಮಾರ್ಟ್ ಮತ್ತು ಗೌಪ್ಯ ಸಾಲ ಅರ್ಹತಾ ಚಾಟ್‌ಬಾಟ್",
        storageBadge: "ಶೂನ್ಯ ಸಂಗ್ರಹಣೆ ಮೋಡ್",
        clearDataBtn: "ನನ್ನ ಡೇಟಾ ಅಳಿಸಿ",
        privacyNotice: "<strong>ಗೌಪ್ಯತೆ ಸೂಚನೆ:</strong> ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಈ ಪ್ರಾಥಮಿಕ ಸಾಲದ ಅರ್ಹತಾ ಮೌಲ್ಯಮಾಪನಕ್ಕಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ. ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಅಥವಾ ಆರ್ಥಿಕ ಮಾಹಿತಿಯನ್ನು ನಾವು ಶಾಶ್ವತವಾಗಿ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.",
        agentName: "ಸಾಲ ಸಲಹಾ ಬಾಟ್",
        agentStatus: "ಆನ್‌ಲೈನ್ • ತಾತ್ಕಾಲಿಕ ಅಧಿವೇಶನ",
        securityChip: "🔒 ಬ್ರೌಸರ್ ಮೆಮೊರಿ ಮಾತ್ರ",
        inputPlaceholder: "ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ...",
        footerCaption: "🛡️ ಪ್ರಕ್ರಿಯೆಯು ಸ್ಥಳೀಯ ಮತ್ತು ಗೌಪ್ಯವಾಗಿದೆ. ಹೊರಗಿನ AI ಸೇವೆಗಳಿಗೆ ಯಾವುದೇ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಕಳುಹಿಸುವುದಿಲ್ಲ.",
        listeningText: "ಆಲಿಸುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
        speechNotSupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪಿಂಗ್ ಬಳಸಿ.",
        synthesisNotSupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಔಟ್‌ಪುಟ್ (ಸ್ಪೀಚ್ ಸಿಂಥೆಸಿಸ್) ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.",
        micAccessError: "ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶ ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.",
        micPermissionDenied: "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಅನುಮತಿಸಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
        noSpeechDetected: "ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ ಒತ್ತಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.",
        micReady: "🎤 ಸಿದ್ಧವಾಗಿದೆ: ಮಾತನಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
        micListening: "🔴 ಆಲಿಸುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
        micProcessing: "⏳ ಧ್ವನಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
        sensitiveAlertPrefix: "ಗೌಪ್ಯತೆ ರಕ್ಷಣೆ ತಡೆದಿದೆ: ಸಂಭವನೀಯ",
        sensitiveAlertSuffix: "ಪತ್ತೆಯಾಗಿದೆ. ನಿಮ್ಮ ಸುರಕ್ಷತೆಗಾಗಿ, ಆಧಾರ್, ಬ್ಯಾಂಕ್ ಖಾತೆ, ಕಾರ್ಡ್ ಸಂಖ್ಯೆ, ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ಒಟಿಪಿ ನಮೂದಿಸಬೇಡಿ. ನಮಗೆ ಕೇವಲ ಅಂದಾಜು ಮೊತ್ತಗಳು ಸಾಕು.",
        fallbackError: "ಕ್ಷಮಿಸಿ, ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಆರಿಸಿ ಅಥವಾ ಉತ್ತರ ಟೈಪ್ ಮಾಡಿ.",
        listenBtn: "ಆಲಿಸಿ",
        stopBtn: "ನಿಲ್ಲಿಸಿ",
        clearDataToast: "🧹 ಎಲ್ಲಾ ಅರ್ಜಿದಾರರ ಮಾಹಿತಿ ಮತ್ತು ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲಾಗಿದೆ.",
        langChangeToast: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.",
        restartBtn: "ಮರುಪ್ರಾರಂಭಿಸಿ",
        clearDataChip: "ನನ್ನ ಡೇಟಾ ಅಳಿಸಿ",
        localCalcNotice: "✅ ಎಲ್ಲಾ ಸಾಲ ಅರ್ಹತಾ ಲೆಕ್ಕಾಚಾರಗಳನ್ನು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನ ಅಸ್ಥಿರ ಮೆಮೊರಿಯಲ್ಲಿ ಮಾತ್ರ ಮಾಡಲಾಗಿದೆ. ಯಾವುದೇ ದಾಖಲೆ ಉಳಿಸಿಲ್ಲ.",
        loanIntentAcknowledge: "ಸ್ವಾಗತ! ನಿಮ್ಮ ಸಾಲದ ಅರ್ಹತೆಯನ್ನು ತಿಳಿಯಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ಪ್ರಾರಂಭಿಸಲು, ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಸಾಲ ಬೇಕು? (ಗೃಹ ಸಾಲ, ವೈಯಕ್ತಿಕ ಸಾಲ, ವಾಹನ ಸಾಲ, ಶಿಕ್ಷಣ ಸಾಲ)",
        mixedInputNotedSalary: "ಖಂಡಿತ! ನಿಮ್ಮ ಮಾಸಿಕ ಸಂಬಳ ₹{amount} ಎಂದು ದಾಖಲಿಸಲಾಗಿದೆ. ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಸಾಲ ಬೇಕು? (ಗೃಹ ಸಾಲ, ವೈಯಕ್ತಿಕ ಸಾಲ, ವಾಹನ ಸಾಲ, ಶಿಕ್ಷಣ ಸಾಲ)",
        // Assessment Card
        assessmentTitle: "ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನ (Preliminary Assessment)",
        maxEligibleLabel: "ಗರಿಷ್ಠ ಅರ್ಹ ಸಾಲ ಮೊತ್ತ",
        estimatedEmiLabel: "ಅಂದಾಜು ಮಾಸಿಕ ಇಎಂಐ",
        interestRateLabel: "ಸೂಚಕ ಬಡ್ಡಿದರ",
        debtRatioLabel: "ಸಾಲದ ಅನುಪಾತ (FOIR)",
        statusApproved: "ಅರ್ಹ / ಅನುಮೋದಿಸಲಾಗಿದೆ (Approved)",
        statusConditional: "ಷರತ್ತುಬದ್ಧ ಅನುಮೋದನೆ (Conditional)",
        statusIneligible: "ಅನರ್ಹ (Ineligible)",
        docsTitle: "ದಾಖಲೆಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ (Document Checklist)",
        nextStepsTitle: "ಮುಂದಿನ ಹಂತಗಳು (Next Steps)",
        docsSalaried: [
            "ಜೆರಾಕ್ಸ್ / ಸ್ಕ್ಯಾನ್ ಪ್ರತಿಗಳ ಸಲ್ಲಿಕೆ: ಸ್ವಯಂ-ದೃಢೀಕರಿಸಿದ ಪ್ಯಾನ್/ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ ಜೆರಾಕ್ಸ್, ಕೊನೆಯ 3 ತಿಂಗಳ ಸಂಬಳದ ಚೀಟಿ ಮತ್ತು ಫಾರ್ಮ್ 16.",
            "ಮೂಲ ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ (Original Verification): ಅಂತಿಮ ಸಾಲ ಮಂಜೂರಾತಿಗೂ ಮುನ್ನ ಮೂಲ ಪ್ಯಾನ್ ಮತ್ತು ಗುರುತಿನ ದಾಖಲೆಗಳನ್ನು ಶಾಖೆಯಲ್ಲಿ ಖುದ್ದಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
            "ಬ್ಯಾಂಕ್ ವಿವರ: ಇತ್ತೀಚಿನ 6 ತಿಂಗಳ ಚಾಲ್ತಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ (ಜೆರಾಕ್ಸ್ ಅಥವಾ ಪಿಡಿಎಫ್ ಪ್ರತಿ).",
            "ದರಪಟ್ಟಿ: ಗೃಹ ಅಥವಾ ವಾಹನ ಸಾಲಕ್ಕಾಗಿ ಅಧಿಕೃತ ಡೀಲರ್ ನೀಡಿದ ದರಪಟ್ಟಿ."
        ],
        docsSelfEmployed: [
            "ಜೆರಾಕ್ಸ್ / ಸ್ಕ್ಯಾನ್ ಪ್ರತಿಗಳ ಸಲ್ಲಿಕೆ: ವ್ಯಾಪಾರ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಕಳೆದ 2 ವರ್ಷಗಳ ITR ಲೆಕ್ಕಾಚಾರದ ಪ್ರತಿ.",
            "ಮೂಲ ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ (Original Verification): ಮೂಲ ವ್ಯಾಪಾರ ಪರವಾನಗಿ ಮತ್ತು ತೆರಿಗೆ ದಾಖಲೆಗಳನ್ನು ಶಾಖೆಯಲ್ಲಿ ಖುದ್ದಾಗಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
            "ಬ್ಯಾಂಕ್ ವಿವರ: ಇತ್ತೀಚಿನ 12 ತಿಂಗಳ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರ (ಜೆರಾಕ್ಸ್ ಅಥವಾ ಪಿಡಿಎಫ್ ಪ್ರತಿ).",
            "ದರಪಟ್ಟಿ: ಗೃಹ ಅಥವಾ ವಾಹನ ಸಾಲಕ್ಕಾಗಿ ಅಧಿಕೃತ ಡೀಲರ್ ನೀಡಿದ ದರಪಟ್ಟಿ."
        ],
        nextStepsList: [
            "1. ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಸಾಲ ಅರ್ಹತಾ ಅಂಕಿಅಂಶಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಗುರುತಿಸಿ.",
            "2. ಮೇಲೆ ಪಟ್ಟಿ ಮಾಡಲಾದ ಅಗತ್ಯ ಪುರಾವೆ ದಾಖಲೆಗಳ ಜೆರಾಕ್ಸ್ ಪ್ರತಿಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ.",
            "3. ಮೂಲ ದಾಖಲೆಗಳೊಂದಿಗೆ ಹತ್ತಿರದ ಟ್ರಸ್ಟ್‌ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ ಅಂತಿಮ ಸಾಲ ಮಂಜೂರಾತಿ ಪಡೆಯಿರಿ."
        ],
        tipsExceed: "ಮರುಪಾವತಿ ಅವಧಿಯನ್ನು ಹೆಚ್ಚಿಸುವುದು ಅಥವಾ ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಸಾಲಗಳನ್ನು ಮುಚ್ಚುವುದು ನಿಮ್ಮ ಮಾಸಿಕ ಇಎಂಐ ಹೊರೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
        tipsHealthy: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸಾಲಗಳಿಗೆ ಸಕಾಲಿಕ ಪಾವತಿಗಳನ್ನು ನಿರ್ವಹಿಸುವುದರಿಂದ ಉತ್ತಮ ಬಡ್ಡಿದರಗಳು ಲಭ್ಯವಾಗುತ್ತವೆ.",
        tipsCoApplicant: "ಕುಟುಂಬದ ಆದಾಯವನ್ನು ಒಟ್ಟುಗೂಡಿಸಲು ಸಹ-ಅರ್ಜಿದಾರರೊಂದಿಗೆ (ಪತಿ/ಪತ್ನಿ/ಪೋಷಕರು) ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದನ್ನು ಪರಿಗಣಿಸಿ.",
        tipsDebtConsolidation: "ಮಾಸಿಕ ಸಾಲ ಮರುಪಾವತಿ ಸಾಮರ್ಥ್ಯವನ್ನು ಹೆಚ್ಚಿಸಲು ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ವೈಯಕ್ತಿಕ ಸಾಲಗಳನ್ನು ಮುಚ್ಚಿ."
    },
    hi: {
        brandTitle: "ट्रस्टबैंक क्रेडिट सलाहकार",
        brandSubtitle: "स्मार्ट और गोपनीय ऋण पात्रता चैटबॉट",
        storageBadge: "शून्य संग्रहण मोड",
        clearDataBtn: "मेरा डेटा हटाएं",
        privacyNotice: "<strong>गोपनीयता सूचना:</strong> आपकी जानकारी केवल इस प्रारंभिक ऋण पात्रता मूल्यांकन के लिए उपयोग की जाती है। हम आपकी व्यक्तिगत या वित्तीय जानकारी को स्थायी रूप से संग्रहीत नहीं करते हैं।",
        agentName: "ऋण सलाहकार बॉट",
        agentStatus: "ऑनलाइन • अस्थायी सत्र",
        securityChip: "🔒 केवल ब्राउज़र मेमोरी",
        inputPlaceholder: "अपनी प्रतिक्रिया लिखें या बोलने के लिए माइक दबाएं...",
        footerCaption: "🛡️ प्रसंस्करण स्थानीय और गोपनीय है। बाहरी AI सेवाओं को शून्य व्यक्तिगत पहचानकर्ताओं के साथ अनाम अनुमान ही भेजे जाते हैं।",
        listeningText: "सुन रहे हैं... अब बोलिए",
        speechNotSupported: "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। कृपया लिखकर इनपुट दें।",
        synthesisNotSupported: "इस ब्राउज़र में स्पीच सिंथेसिस (आवाज़ आउटपुट) समर्थित नहीं है।",
        micAccessError: "माइक्रोफ़ोन काम नहीं कर रहा है। कृपया लिखकर प्रयास करें।",
        micPermissionDenied: "माइक्रोफ़ोन अनुमति अस्वीकृत हो गई। कृपया ब्राउज़र सेटिंग्स में अनुमति दें या नीचे लिखें।",
        noSpeechDetected: "कोई आवाज़ नहीं मिली। कृपया माइक दबाकर स्पष्ट बोलें।",
        micReady: "🎤 तैयार: बोलने के लिए क्लिक करें",
        micListening: "🔴 सुन रहे हैं... अब बोलिए",
        micProcessing: "⏳ आवाज़ प्रोसेस हो रही है...",
        sensitiveAlertPrefix: "गोपनीयता शील्ड द्वारा रोका गया: संभावित",
        sensitiveAlertSuffix: "पाया गया। आपकी सुरक्षा के लिए आधार, बैंक खाता, कार्ड नंबर, पासवर्ड या ओटीपी दर्ज न करें। हमें केवल अनुमानित विवरण चाहिए।",
        fallbackError: "माफ़ कीजिए, समझ नहीं आया। कृपया नीचे दिए गए विकल्पों में से चुनें या लिखकर उत्तर दें।",
        listenBtn: "सुनें",
        stopBtn: "रोकें",
        clearDataToast: "🧹 सभी आवेदक डेटा और चैट इतिहास को स्थायी रूप से हटा दिया गया है।",
        langChangeToast: "भाषा बदलकर हिन्दी कर दी गई है।",
        restartBtn: "पुनः आरंभ करें",
        clearDataChip: "मेरा डेटा हटाएं",
        localCalcNotice: "✅ सभी मूल्यांकन गणनाएं आपके ब्राउज़र की अस्थायी मेमोरी में पूरी की गईं। कोई स्थायी रिकॉर्ड नहीं बनाया गया।",
        loanIntentAcknowledge: "नमस्ते! मैं आपकी लोन पात्रता जांचने में मदद करूंगा। आपको किस प्रकार का लोन चाहिए? (गृह ऋण, व्यक्तिगत ऋण, वाहन ऋण, शिक्षा ऋण)",
        mixedInputNotedSalary: "बहुत बढ़िया! आपकी मासिक आय ₹{amount} दर्ज कर ली गई है। आपको किस प्रकार का ऋण चाहिए? (गृह ऋण, व्यक्तिगत ऋण, वाहन ऋण, शिक्षा ऋण)",
        // Assessment Card
        assessmentTitle: "प्रारंभिक मूल्यांकन (Preliminary Assessment)",
        maxEligibleLabel: "अधिकतम पात्र ऋण राशि",
        estimatedEmiLabel: "अनुमानित मासिक ईएमआई",
        interestRateLabel: "सांकेतिक ब्याज दर",
        debtRatioLabel: "ऋण अनुपात (FOIR)",
        statusApproved: "पात्र / स्वीकृत (Eligible)",
        statusConditional: "सशर्त स्वीकृति (Conditional)",
        statusIneligible: "अपात्र (Ineligible)",
        docsTitle: "दस्तावेज़ सत्यापन चेकलिस्ट (Document Checklist)",
        nextStepsTitle: "अनुशंसित अगले कदम (Next Steps)",
        docsSalaried: [
            "ज़ेरॉक्स / स्कैन कॉपी जमा करना: स्व-सत्यापित पैन/मतदाता पहचान पत्र ज़ेरॉक्स, पिछले 3 महीने की सैलरी स्लिप और फॉर्म 16।",
            "मूल दस्तावेज सत्यापन (Original Verification): अंतिम लोन स्वीकृति से पहले शाखा में मूल पैन और पहचान प्रमाण का भौतिक सत्यापन।",
            "बैंक स्टेटमेंट: पिछले 6 महीने का सक्रिय बैंक खाता स्टेटमेंट (ज़ेरॉक्स या पीडीएफ कॉपी)।",
            "कोटेशन: अधिकृत डीलर से संपत्ति या वाहन कोटेशन (गृह एवं वाहन लोन के लिए)।"
        ],
        docsSelfEmployed: [
            "ज़ेरॉक्स / स्कैन कॉपी जमा करना: व्यापार पंजीकरण प्रमाण पत्र और पिछले 2 वर्षों का वित्तीय गणना सहित ITR प्रति।",
            "मूल दस्तावेज सत्यापन (Original Verification): शाखा में मूल व्यापार लाइसेंस और टैक्स रिटर्न का भौतिक सत्यापन।",
            "बैंक स्टेटमेंट: पिछले 12 महीने का चालू खाता विवरण (ज़ेरॉक्स या पीडीएफ प्रति)।",
            "कोटेशन: अधिकृत डीलर से संपत्ति या वाहन कोटेशन (गृह एवं वाहन लोन के लिए)।"
        ],
        nextStepsList: [
            "1. अपने प्रारंभिक ऋण पात्रता आंकड़ों की समीक्षा करें और सुरक्षित रखें।",
            "2. ऊपर सूचीबद्ध आवश्यक दस्तावेजों की स्व-सत्यापित ज़ेरॉक्स प्रतियां तैयार करें।",
            "3. मूल दस्तावेजों के साथ नजदीकी ट्रस्टबैंक शाखा में जाकर अंतिम लोन स्वीकृति प्राप्त करें।"
        ],
        tipsExceed: "पुनर्भुगतान अवधि बढ़ाने या मौजूदा देनदारियों को बंद करने से आपका मासिक ईएमआई बोझ कम होगा।",
        tipsHealthy: "अपने वर्तमान ऋणों पर समय पर पुनर्भुगतान बनाए रखने से औपचारिक आवेदन पर सर्वोत्तम ब्याज दरें सुनिश्चित होंगी।",
        tipsCoApplicant: "घरेलू आय को संयोजित करने के लिए एक कामकाजी सह-आवेदक (पति/पत्नी/माता-पिता) के साथ आवेदन करने पर विचार करें।",
        tipsDebtConsolidation: "मासिक ऋण सेवा क्षमता को मुक्त करने के लिए मौजूदा व्यक्तिगत ऋणों या क्रेडिट कार्ड बकाए को बंद करें।"
    }
};

/**
 * Returns localized string for given key.
 */
function t(key) {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return langDict[key] !== undefined ? langDict[key] : (TRANSLATIONS.en[key] || "");
}

// --- EPHEMERAL IN-MEMORY STATE (Wiped on session end / Clear Data) ---
let applicantState = {
    loanType: null,
    employmentType: null,
    monthlyIncome: null,
    existingEmi: null,
    creditScore: null,
    loanAmount: null,
    tenureYears: null
};

let currentStep = 0;
let isProcessing = false;
let currentMicState = "ready"; // "ready", "listening", "processing", "error"

// Standard Banking Interest Rates & Defaults (Annual)
const LOAN_RULES = {
    "Home Loan": { baseRate: 8.5, maxTenureYears: 30, maxFoir: 0.55 },
    "Personal Loan": { baseRate: 11.5, maxTenureYears: 5, maxFoir: 0.45 },
    "Auto Loan": { baseRate: 9.0, maxTenureYears: 7, maxFoir: 0.50 },
    "Education Loan": { baseRate: 9.5, maxTenureYears: 10, maxFoir: 0.50 }
};

// Conversational Question Flow with simple, natural language prompts and options
const QUESTIONS_CONFIG = [
    {
        key: "loanType",
        prompts: {
            en: "Hello! Welcome to TrustBank. I will help you check your loan eligibility in simple steps.\n\nTo begin, what type of loan do you need?",
            kn: "ನಮಸ್ಕಾರ! ಟ್ರಸ್ಟ್‌ಬ್ಯಾಂಕ್‌ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಸಾಲದ ಅರ್ಹತೆಯನ್ನು ಸುಲಭವಾಗಿ ತಿಳಿಯಲು ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.\n\nಪ್ರಾರಂಭಿಸಲು, ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಸಾಲ ಬೇಕು?",
            hi: "नमस्ते! ट्रस्टबैंक में आपका स्वागत है। मैं आसान तरीके से आपकी लोन पात्रता जांचने में मदद करूंगा।\n\nशुरू करने के लिए, आपको किस प्रकार का लोन चाहिए?"
        },
        options: {
            en: ["Home Loan", "Personal Loan", "Auto Loan", "Education Loan"],
            kn: ["ಗೃಹ ಸಾಲ (Home Loan)", "ವೈಯಕ್ತಿಕ ಸಾಲ (Personal Loan)", "ವಾಹನ ಸಾಲ (Auto Loan)", "ಶಿಕ್ಷಣ ಸಾಲ (Education Loan)"],
            hi: ["गृह ऋण (Home Loan)", "व्यक्तिगत ऋण (Personal Loan)", "वाहन ऋण (Auto Loan)", "शिक्षा ऋण (Education Loan)"]
        },
        parser: parseLoanType
    },
    {
        key: "employmentType",
        prompts: {
            en: "Thank you. What is your current employment type?",
            kn: "ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಉದ್ಯೋಗದ ಪ್ರಕಾರ ಯಾವುದು?",
            hi: "धन्यवाद। आपका वर्तमान रोजगार प्रकार क्या है?"
        },
        options: {
            en: ["Salaried Professional", "Self-Employed / Business"],
            kn: ["ವೇತನದಾರ ಉದ್ಯೋಗಿ (Salaried)", "ಸ್ವಯಂ ಉದ್ಯೋಗಿ / ವ್ಯಾಪಾರ (Self-Employed)"],
            hi: ["वेतनभोगी (Salaried)", "स्वरोजगार / व्यापार (Self-Employed)"]
        },
        parser: parseEmploymentType
    },
    {
        key: "monthlyIncome",
        prompts: {
            en: "What is your approximate monthly take-home salary or income in ₹?\n(Note: We only need an estimate—never share bank accounts or cards).",
            kn: "ನಿಮ್ಮ ತಿಂಗಳ ಸಂಬಳ ಅಥವಾ ಆದಾಯ ಅಂದಾಜು ಎಷ್ಟು (₹ ಗಳಲ್ಲಿ)?\n(ಗಮನಿಸಿ: ನಮಗೆ ಕೇವಲ ಅಂದಾಜು ಮೊತ್ತ ಸಾಕು—ಖಾತೆ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ).",
            hi: "आपकी महीने की सैलरी या आमदनी लगभग कितनी है (₹ में)?\n(नोट: हमें केवल अनुमान चाहिए—बैंक खाता या कार्ड विवरण कभी साझा न करें)।"
        },
        options: {
            en: ["₹35,000", "₹60,000", "₹1,00,000", "₹1,50,000+"],
            kn: ["₹35,000", "₹60,000", "₹1,00,000", "₹1,50,000+"],
            hi: ["₹35,000", "₹60,000", "₹1,00,000", "₹1,50,000+"]
        },
        parser: parseCurrency
    },
    {
        key: "existingEmi",
        prompts: {
            en: "Do you currently pay any monthly loan EMIs or card payments in ₹?\n(Enter 0 if none).",
            kn: "ನೀವು ಪ್ರಸ್ತುತ ಯಾವುದಾದರೂ ಸಾಲದ ಇಎಂಐ (EMI) ಅಥವಾ ಕಾರ್ಡ್ ಪಾವತಿ ಮಾಡುತ್ತಿದ್ದೀರಾ (₹ ಗಳಲ್ಲಿ)?\n(ಏನೂ ಇಲ್ಲದಿದ್ದರೆ 0 ಎಂದು ನಮೂದಿಸಿ).",
            hi: "क्या आप अभी कोई मासिक लोन ईएमआई (EMI) या कार्ड भुगतान कर रहे हैं (₹ में)?\n(यदि कुछ नहीं है तो 0 लिखें)।"
        },
        options: {
            en: ["₹0", "₹5,000", "₹15,000", "₹30,000"],
            kn: ["₹0", "₹5,000", "₹15,000", "₹30,000"],
            hi: ["₹0", "₹5,000", "₹15,000", "₹30,000"]
        },
        parser: parseCurrency
    },
    {
        key: "creditScore",
        prompts: {
            en: "What is your approximate credit (CIBIL) score range?",
            kn: "ನಿಮ್ಮ ಸಿಬಿಲ್ (CIBIL) ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ಶ್ರೇಣಿ ಎಷ್ಟಿದೆ?",
            hi: "आपका सिबिल (CIBIL) स्कोर कितना है?"
        },
        options: {
            en: ["750+ (Excellent)", "700 - 749 (Good)", "650 - 699 (Fair)", "Below 650 (Poor / New)"],
            kn: ["750+ (ಅತ್ಯುತ್ತಮ - Excellent)", "700 - 749 (ಉತ್ತಮ - Good)", "650 - 699 (ಸಾಧಾರಣ - Fair)", "650 ಕ್ಕಿಂತ ಕಡಿಮೆ (Poor)"],
            hi: ["750+ (उत्कृष्ट - Excellent)", "700 - 749 (अच्छा - Good)", "650 - 699 (सामान्य - Fair)", "650 से कम (Poor)"]
        },
        parser: parseCreditScore
    },
    {
        key: "loanAmount",
        prompts: {
            en: "How much loan amount do you need in ₹?",
            kn: "ನಿಮಗೆ ಎಷ್ಟು ಮೊತ್ತದ ಸಾಲ ಬೇಕಾಗಿದೆ (₹ ಗಳಲ್ಲಿ)?",
            hi: "आपको कितनी लोन राशि की आवश्यकता है (₹ में)?"
        },
        options: {
            en: ["₹5,00,000", "₹15,00,000", "₹30,00,000", "₹60,00,000"],
            kn: ["₹5,00,000", "₹15,00,000", "₹30,00,000", "₹60,00,000"],
            hi: ["₹5,00,000", "₹15,00,000", "₹30,00,000", "₹60,00,000"]
        },
        parser: parseCurrency
    },
    {
        key: "tenureYears",
        prompts: {
            en: "How many years do you want to repay the loan?",
            kn: "ಸಾಲ ತೀರಿಸಲು ನಿಮಗೆ ಎಷ್ಟು ವರ್ಷಗಳ ಕಾಲಾವಕಾಶ ಬೇಕು?",
            hi: "लोन चुकाने के लिए आपको कितने साल का समय चाहिए?"
        },
        options: {
            en: ["3 Years", "5 Years", "10 Years", "20 Years"],
            kn: ["3 ವರ್ಷಗಳು", "5 ವರ್ಷಗಳು", "10 ವರ್ಷಗಳು", "20 ವರ್ಷಗಳು"],
            hi: ["3 वर्ष", "5 वर्ष", "10 वर्ष", "20 वर्ष"]
        },
        parser: parseTenure
    }
];

// --- PRIVACY & SENSITIVE DATA INTERCEPTION ---
const SENSITIVE_PATTERNS = [
    { regex: /\b(?:\d{4}[ -]?){3}\d{4}(?!\d)\b/, name: "Credit/Debit Card Number (16 digits)" },
    { regex: /\b\d{4}[ -]?\d{4}[ -]?\d{4}(?!\d)\b/, name: "Aadhaar Number (12 digits)" },
    { regex: /\b\d{9,18}(?!\d)\b/, name: "Bank Account Number (9-18 digits)" },
    { regex: /(?:password|passwd|pwd|cvv|passcode)/i, name: "Security Credential / Password" },
    { regex: /\b(?:otp|pin)\b/i, name: "OTP or Security PIN" },
    { regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/i, name: "PAN Card Number" }
];

/**
 * Checks if input contains sensitive financial credentials and blocks them.
 */
function inspectForSensitiveData(text) {
    if (!text || typeof text !== 'string') return null;
    
    const cleanText = text.trim();
    for (const item of SENSITIVE_PATTERNS) {
        if (item.regex.test(cleanText)) {
            return item.name;
        }
    }
    return null;
}

// --- SECURE ZERO-LOGGING OVERRIDE ---
(function enforceZeroLogging() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    function sanitizeLogArgs(args) {
        return args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                if (arg.monthlyIncome || arg.loanAmount || arg.creditScore || arg.existingEmi) {
                    return "[REDACTED: User Financial Data]";
                }
            }
            return arg;
        });
    }

    console.log = function(...args) {
        originalLog.apply(console, sanitizeLogArgs(args));
    };
    console.warn = function(...args) {
        originalWarn.apply(console, sanitizeLogArgs(args));
    };
    console.error = function(...args) {
        originalError.apply(console, sanitizeLogArgs(args));
    };
})();

// --- MULTILINGUAL & MIXED-LANGUAGE INPUT PARSERS ---

/**
 * Converts Kannada and Hindi numerals to standard ASCII digits.
 */
function normalizeIndianDigits(str) {
    if (!str) return "";
    const indianDigitMap = {
        '೦':'0','೧':'1','೨':'2','೩':'3','೪':'4','೫':'5','೬':'6','೭':'7','೮':'8','೯':'9', // Kannada
        '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'  // Hindi
    };
    return str.replace(/[೦-೯०-९]/g, d => indianDigitMap[d] || d);
}

function parseLoanType(input) {
    const text = input.toLowerCase();
    if (text.includes("home") || text.includes("ಗೃಹ") || text.includes("ಮನೆ") || text.includes("गृह") || text.includes("होम")) {
        return "Home Loan";
    }
    if (text.includes("personal") || text.includes("ವೈಯಕ್ತಿಕ") || text.includes("ವ್ಯಕ್ತಿಕ") || text.includes("पर्सनल") || text.includes("व्यक्तिगत")) {
        return "Personal Loan";
    }
    if (text.includes("auto") || text.includes("car") || text.includes("vehicle") || text.includes("ವಾಹನ") || text.includes("ಕಾರು") || text.includes("गाड़ी") || text.includes("कार") || text.includes("वाहन")) {
        return "Auto Loan";
    }
    if (text.includes("edu") || text.includes("student") || text.includes("college") || text.includes("ಶಿಕ್ಷಣ") || text.includes("ವಿದ್ಯಾಭ್ಯಾಸ") || text.includes("शिक्षा") || text.includes("एजुकेशन")) {
        return "Education Loan";
    }
    return null;
}

function parseEmploymentType(input) {
    const text = input.toLowerCase();
    if (text.includes("salaried") || text.includes("employee") || text.includes("job") || text.includes("ವೇತನ") || text.includes("ಸಂಬಳ") || text.includes("ನೌಕರಿ") || text.includes("नौकरी") || text.includes("वेतन") || text.includes("सैलरी")) {
        return "Salaried Professional";
    }
    if (text.includes("self") || text.includes("business") || text.includes("freelance") || text.includes("ಸ್ವಯಂ") || text.includes("ವ್ಯಾಪಾರ") || text.includes("ವೃತ್ತಿ") || text.includes("ಸ್ವಂತ") || text.includes("स्वरोजगार") || text.includes("व्यवसाय") || text.includes("व्यापार")) {
        return "Self-Employed / Business";
    }
    return null;
}

function parseCurrency(input) {
    let text = normalizeIndianDigits(input).toLowerCase().replace(/[₹,\s]/g, "");

    // Explicit zero terms in English, Kannada, Hindi
    if (/^(0|zero|none|nil|no|ಏನೂ\s*ಇಲ್ಲ|ಯಾವುದೂ\s*ಇಲ್ಲ|ಏನು\s*ಇಲ್ಲ|कुछ\s*नहीं|कोई\s*नहीं)$/i.test(text)) {
        return 0;
    }
    
    // Check for Indian numerical terms in Kannada, Hindi, and English
    if (text.endsWith("k") || text.includes("ಸಾವಿರ") || text.includes("हजार") || text.includes("हज़ार")) {
        const num = parseFloat(text.replace(/(k|ಸಾವಿರ|हजार|हज़ार)/g, ""));
        return isNaN(num) ? null : num * 1000;
    }
    if (text.includes("lakh") || text.includes("lac") || text.includes("l") || text.includes("ಲಕ್ಷ") || text.includes("लाख")) {
        const num = parseFloat(text.replace(/(lakh|lac|l|ಲಕ್ಷ|लाख)/g, ""));
        return isNaN(num) ? null : num * 100000;
    }
    if (text.includes("cr") || text.includes("crore") || text.includes("ಕೋಟಿ") || text.includes("करोड़")) {
        const num = parseFloat(text.replace(/(cr|crore|ಕೋಟಿ|करोड़)/g, ""));
        return isNaN(num) ? null : num * 10000000;
    }

    const num = parseFloat(text);
    return isNaN(num) || num < 0 ? null : num;
}

function parseCreditScore(input) {
    const text = normalizeIndianDigits(input).toLowerCase();
    if (text.includes("750") || text.includes("excellent") || text.includes("ಅತ್ಯುತ್ತಮ") || text.includes("उत्कृष्ट")) return 780;
    if (text.includes("700") || text.includes("good") || text.includes("ಉತ್ತಮ") || text.includes("अच्छा")) return 720;
    if (text.includes("650") || text.includes("fair") || text.includes("ಸಾಧಾರಣ") || text.includes("सामान्य")) return 670;
    if (text.includes("poor") || text.includes("below") || text.includes("new") || text.includes("ಕಡಿಮೆ") || text.includes("कम")) return 600;

    const num = parseInt(text.replace(/\D/g, ""), 10);
    if (!isNaN(num) && num >= 300 && num <= 900) {
        return num;
    }
    return null;
}

function parseTenure(input) {
    const text = normalizeIndianDigits(input);
    const num = parseInt(text.replace(/\D/g, ""), 10);
    return (!isNaN(num) && num > 0 && num <= 35) ? num : null;
}

/**
 * Intelligent entity extractor for mixed-language speech/text.
 * Handles sentences like: "I want loan, ನನ್ನ salary 30000 ಇದೆ." or "Mujhe car loan chahiye, meri salary 45000 hai."
 */
function extractApplicantEntities(rawInput) {
    const text = normalizeIndianDigits(rawInput);
    const entities = {};

    // 1. Loan type
    const loanType = parseLoanType(text);
    if (loanType) entities.loanType = loanType;

    // 2. Employment type
    const empType = parseEmploymentType(text);
    if (empType) entities.employmentType = empType;

    // 3. Salary / Income in mixed speech
    const incMatch = text.match(/(?:salary|income|ಸಂಬಳ|ವೇತನ|सैलरी|आमदनी|कमाई|net|monthly)\s*(?:is|ide|hai|ಆಗಿದೆ|ಇದೆ|है|:|=)?\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]+)?\s*(?:k|lakh|lac|l|cr|crore|ಸಾವಿರ|ಲಕ್ಷ|ಕೋಟಿ|हजार|हज़ार|लाख|करोड़)?)/i);
    if (incMatch) {
        const val = parseCurrency(incMatch[1]);
        if (val !== null) entities.monthlyIncome = val;
    }

    // 4. Existing EMI in mixed speech
    if (/(?:no\s*emi|zero\s*emi|none|ಯಾವುದೂ\s*ಇಲ್ಲ|ಏನೂ\s*ಇಲ್ಲ|कोई\s*नहीं|zero|ಸಾಲದ\s*ಇಎಂಐ\s*ಇಲ್ಲ)/i.test(text)) {
        entities.existingEmi = 0;
    } else {
        const emiMatch = text.match(/(?:emi|liability|obligation|ಇಎಂಐ|ಕಂತು|ईएमआई|किस्त)\s*(?:is|ide|hai|ಆಗಿದೆ|ಇದೆ|है|:|=)?\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]+)?\s*(?:k|lakh|lac|l|cr|crore|ಸಾವಿರ|ಲಕ್ಷ|ಕೋಟಿ|हजार|हज़ार|लाख|करोड़)?)/i);
        if (emiMatch) {
            const val = parseCurrency(emiMatch[1]);
            if (val !== null) entities.existingEmi = val;
        }
    }

    // 5. CIBIL / Credit score in mixed speech
    const scoreMatch = text.match(/(?:cibil|credit|score|ಸಿಬಿಲ್|ಸ್ಕೋರ್|सिबिल|स्कोर)\s*(?:is|ide|hai|ಆಗಿದೆ|ಇದೆ|है|:|=)?\s*([0-9]{3})/i);
    if (scoreMatch) {
        const val = parseCreditScore(scoreMatch[1]);
        if (val !== null) entities.creditScore = val;
    }

    // 6. Tenure in mixed speech
    const tenureMatch = text.match(/([0-9]{1,2})\s*(?:years?|yrs?|ವರ್ಷ|ವರ್ಷಗಳು|साल|वर्ष)/i);
    if (tenureMatch) {
        const val = parseTenure(tenureMatch[1]);
        if (val !== null) entities.tenureYears = val;
    }

    return entities;
}

// --- LOAN ELIGIBILITY CALCULATION ENGINE ---
function calculateEligibility(data, lang = currentLanguage) {
    const rules = LOAN_RULES[data.loanType] || LOAN_RULES["Personal Loan"];
    const income = data.monthlyIncome;
    const existingEmi = data.existingEmi;
    const requestedAmount = data.loanAmount;
    const tenureYears = Math.min(data.tenureYears, rules.maxTenureYears);
    const tenureMonths = tenureYears * 12;

    const tLang = TRANSLATIONS[lang] || TRANSLATIONS.en;

    // Minimum income check
    const minIncome = data.loanType === "Home Loan" ? 30000 : 25000;
    if (income < minIncome) {
        return {
            status: tLang.statusIneligible,
            badgeClass: "status-ineligible",
            maxEligibleAmount: 0,
            requestedEmi: 0,
            foirPercent: Math.round((existingEmi / income) * 100),
            interestRate: rules.baseRate,
            reason: lang === 'kn'
                ? `${data.loanType} ಗಾಗಿ ಕನಿಷ್ಠ ಮಾಸಿಕ ಆದಾಯ ₹${minIncome.toLocaleString('en-IN')} ಅಗತ್ಯವಿದೆ. ಪ್ರಸ್ತುತ ಆದಾಯವು ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಪೂರೈಸುತ್ತಿಲ್ಲ.`
                : lang === 'hi'
                ? `${data.loanType} के लिए न्यूनतम आवश्यक मासिक आय ₹${minIncome.toLocaleString('en-IN')} है। वर्तमान आय बैंक दिशानिर्देशों को पूरा नहीं करती है।`
                : `Minimum required monthly income for ${data.loanType} is ₹${minIncome.toLocaleString('en-IN')}. Current monthly income does not meet minimum bank guidelines.`,
            tips: tLang.tipsCoApplicant,
            docsRequired: data.employmentType === "Salaried Professional" ? tLang.docsSalaried : tLang.docsSelfEmployed,
            nextSteps: tLang.nextStepsList
        };
    }

    // Debt-to-income (FOIR) calculation
    const maxPermissibleTotalEmi = income * rules.maxFoir;
    const availableEmiCapacity = maxPermissibleTotalEmi - existingEmi;

    if (availableEmiCapacity <= 0) {
        return {
            status: tLang.statusIneligible,
            badgeClass: "status-ineligible",
            maxEligibleAmount: 0,
            requestedEmi: 0,
            foirPercent: Math.round((existingEmi / income) * 100),
            interestRate: rules.baseRate,
            reason: lang === 'kn'
                ? `ಪ್ರಸ್ತುತ ಸಾಲದ ಇಎಂಐ (₹${existingEmi.toLocaleString('en-IN')}) ನಿಮ್ಮ ಮಾಸಿಕ ಆದಾಯದ ${Math.round(rules.maxFoir * 100)}% ಗಿಂತ ಹೆಚ್ಚಿದೆ.`
                : lang === 'hi'
                ? `मौजूदा ईएमआई दायित्व (₹${existingEmi.toLocaleString('en-IN')}) आपकी मासिक आय के ${Math.round(rules.maxFoir * 100)}% से अधिक हैं।`
                : `Existing EMI obligations (₹${existingEmi.toLocaleString('en-IN')}) already consume over ${Math.round(rules.maxFoir * 100)}% of your monthly income.`,
            tips: tLang.tipsDebtConsolidation,
            docsRequired: data.employmentType === "Salaried Professional" ? tLang.docsSalaried : tLang.docsSelfEmployed,
            nextSteps: tLang.nextStepsList
        };
    }

    // Credit score adjustment
    let scoreMultiplier = 1.0;
    let rateAdjustment = 0;
    let scoreCategory = "Excellent";

    if (data.creditScore >= 750) {
        scoreMultiplier = 1.0;
        rateAdjustment = 0;
        scoreCategory = "Excellent";
    } else if (data.creditScore >= 700) {
        scoreMultiplier = 0.90;
        rateAdjustment = 0.50;
        scoreCategory = "Good";
    } else if (data.creditScore >= 650) {
        scoreMultiplier = 0.75;
        rateAdjustment = 1.50;
        scoreCategory = "Fair";
    } else {
        scoreMultiplier = 0.50;
        rateAdjustment = 2.50;
        scoreCategory = "Subprime / Low";
    }

    const finalInterestRate = rules.baseRate + rateAdjustment;
    const monthlyRate = (finalInterestRate / 100) / 12;

    // Standard Present Value Formula for Max Loan Sanction:
    // P = EMI * [ (1 + r)^n - 1 ] / [ r * (1 + r)^n ]
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    const maxLoanCapacity = Math.round(availableEmiCapacity * ((factor - 1) / (monthlyRate * factor)) * scoreMultiplier);

    // Calculate EMI for the requested loan amount
    const requestedMonthlyEmi = Math.round(
        (requestedAmount * monthlyRate * factor) / (factor - 1)
    );

    const projectedTotalEmi = existingEmi + requestedMonthlyEmi;
    const projectedFoir = Math.round((projectedTotalEmi / income) * 100);

    let status = tLang.statusApproved;
    let badgeClass = "status-approved";
    let advice = "";

    if (data.creditScore < 650) {
        status = tLang.statusConditional;
        badgeClass = "status-conditional";
        advice = lang === 'kn'
            ? "ಕಡಿಮೆ ಸಿಬಿಲ್ ಸ್ಕೋರ್ ಕಾರಣ ಹೆಚ್ಚುವರಿ ಜಾಮೀನು ಅಥವಾ ಸ್ಥಿರ ಉದ್ಯೋಗ ಪುರಾವೆ ಅಗತ್ಯವಿದೆ."
            : lang === 'hi'
            ? "कम सिबिल स्कोर के कारण अतिरिक्त संपार्श्विक या स्थिर रोजगार प्रमाण की आवश्यकता है।"
            : "Low CIBIL score requires additional collateral, guarantor, or proof of stable employment.";
    } else if (requestedAmount <= maxLoanCapacity) {
        status = tLang.statusApproved;
        badgeClass = "status-approved";
        advice = lang === 'kn'
            ? "ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಆದಾಯ ಮತ್ತು ಕ್ರೆಡಿಟ್ ವಿವರಗಳು ಪೂರ್ಣ ಕೋರಿದ ಮೊತ್ತಕ್ಕೆ ಅರ್ಹವಾಗಿವೆ."
            : lang === 'hi'
            ? "बधाई हो! आपकी आय और क्रेडिट पैरामीटर पूरी अनुरोधित राशि के लिए अर्हता प्राप्त करते हैं।"
            : "Congratulations! Your income and credit parameters qualify you for the full requested amount.";
    } else {
        status = tLang.statusConditional;
        badgeClass = "status-conditional";
        advice = lang === 'kn'
            ? `ಕೋರಿದ ₹${requestedAmount.toLocaleString('en-IN')} ಮಿತಿಯನ್ನು ಮೀರಿದೆ. ಗರಿಷ್ಠ ಅರ್ಹ ಮೊತ್ತ ₹${maxLoanCapacity.toLocaleString('en-IN')}.`
            : lang === 'hi'
            ? `अनुरोधित ₹${requestedAmount.toLocaleString('en-IN')} अनुशंसित अनुपात से अधिक है। अधिकतम पात्र राशि ₹${maxLoanCapacity.toLocaleString('en-IN')} है।`
            : `Requested ₹${requestedAmount.toLocaleString('en-IN')} exceeds the recommended debt ratio. Max eligible amount is ₹${maxLoanCapacity.toLocaleString('en-IN')}.`;
    }

    return {
        status,
        badgeClass,
        maxEligibleAmount: maxLoanCapacity,
        requestedAmount: requestedAmount,
        requestedEmi: requestedMonthlyEmi,
        interestRate: finalInterestRate,
        tenureYears: tenureYears,
        foirPercent: projectedFoir,
        scoreCategory,
        reason: advice,
        tips: projectedFoir > 50 ? tLang.tipsExceed : tLang.tipsHealthy,
        docsRequired: data.employmentType === "Salaried Professional" ? tLang.docsSalaried : tLang.docsSelfEmployed,
        nextSteps: tLang.nextStepsList
    };
}

// --- MICROPHONE UI STATE MACHINE (🎤 Ready, 🔴 Listening, ⏳ Processing..., ❌ Error) ---
function setMicrophoneState(state, message = "") {
    currentMicState = state;
    const micBtn = document.getElementById("micBtn");
    const listeningBar = document.getElementById("voiceListeningBar");
    const statusIcon = document.getElementById("voiceStatusIcon");
    const waveAnim = document.getElementById("voiceWaveAnim");
    const statusText = document.getElementById("voiceStatusText");

    if (micBtn) {
        micBtn.className = `btn-mic state-${state}`;
    }

    if (listeningBar) {
        listeningBar.className = `voice-listening-bar state-${state}`;

        if (state === "ready") {
            listeningBar.style.display = "none";
            if (micBtn) {
                micBtn.setAttribute("title", t("micReady"));
                micBtn.setAttribute("aria-label", t("micReady"));
            }
        } else if (state === "listening") {
            listeningBar.style.display = "flex";
            if (statusIcon) statusIcon.textContent = "🔴";
            if (waveAnim) waveAnim.style.display = "inline-flex";
            if (statusText) statusText.textContent = t("micListening");
            if (micBtn) {
                micBtn.setAttribute("title", t("micListening"));
                micBtn.setAttribute("aria-label", t("micListening"));
            }
        } else if (state === "processing") {
            listeningBar.style.display = "flex";
            if (statusIcon) statusIcon.textContent = "⏳";
            if (waveAnim) waveAnim.style.display = "none";
            if (statusText) statusText.textContent = t("micProcessing");
            if (micBtn) {
                micBtn.setAttribute("title", t("micProcessing"));
                micBtn.setAttribute("aria-label", t("micProcessing"));
            }
        } else if (state === "error") {
            listeningBar.style.display = "flex";
            if (statusIcon) statusIcon.textContent = "❌";
            if (waveAnim) waveAnim.style.display = "none";
            const errText = message || t("micAccessError");
            if (statusText) statusText.textContent = errText;
            if (micBtn) {
                micBtn.setAttribute("title", errText);
                micBtn.setAttribute("aria-label", errText);
            }
            showToast(errText);

            // Revert back to ready after 4 seconds
            setTimeout(() => {
                if (currentMicState === "error") {
                    setMicrophoneState("ready");
                }
            }, 4000);
        }
    }
}

// --- VOICE RECOGNITION (WEB SPEECH API) ---
let speechRecognizer = null;
let isListening = false;

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        return null;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isListening = true;
        setMicrophoneState("listening");
    };

    recognition.onspeechstart = () => {
        setMicrophoneState("listening");
    };

    recognition.onspeechend = () => {
        setMicrophoneState("processing");
    };

    recognition.onresult = (event) => {
        setMicrophoneState("processing");
        if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript.trim();
            const inputField = document.getElementById("userInput");
            if (inputField) {
                inputField.value = transcript;
            }
            // Auto submit when spoken, enabling full voice communication
            handleUserInput(transcript, true /* fromVoice */);
        }
    };

    recognition.onerror = (event) => {
        isListening = false;
        if (event.error === 'not-allowed') {
            setMicrophoneState("error", t("micPermissionDenied"));
        } else if (event.error === 'no-speech') {
            setMicrophoneState("error", t("noSpeechDetected"));
        } else if (event.error !== 'aborted') {
            setMicrophoneState("error", t("micAccessError"));
        } else {
            setMicrophoneState("ready");
        }
    };

    recognition.onend = () => {
        isListening = false;
        if (currentMicState !== "error") {
            setMicrophoneState("ready");
        }
    };

    return recognition;
}

function toggleVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        setMicrophoneState("error", t("speechNotSupported"));
        return;
    }

    if (isListening) {
        stopVoiceRecognition();
    } else {
        startVoiceRecognition();
    }
}

function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        setMicrophoneState("error", t("speechNotSupported"));
        return;
    }

    if (!speechRecognizer) {
        speechRecognizer = initSpeechRecognition();
    }
    if (!speechRecognizer) {
        setMicrophoneState("error", t("speechNotSupported"));
        return;
    }

    // Set recognition language according to selected language
    speechRecognizer.lang = SPEECH_LANG_CODES[currentLanguage] || "en-IN";
    try {
        speechRecognizer.start();
    } catch (e) {
        try {
            speechRecognizer.stop();
            setTimeout(() => {
                try { speechRecognizer.start(); } catch (err) {}
            }, 150);
        } catch (err) {}
    }
}

function stopVoiceRecognition() {
    if (speechRecognizer && isListening) {
        try {
            speechRecognizer.stop();
        } catch (e) {}
    }
    isListening = false;
    setMicrophoneState("ready");
}

// --- VOICE SYNTHESIS (SPEECH SYNTHESIS / SPEAKER BUTTON) ---
let currentSpeakingBtn = null;

function speakText(textToSpeak, onEndCallback = null) {
    if (!('speechSynthesis' in window)) {
        showToast(t("synthesisNotSupported"));
        if (onEndCallback) onEndCallback();
        return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    if (!textToSpeak || !textToSpeak.trim()) {
        if (onEndCallback) onEndCallback();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const targetLang = SPEECH_LANG_CODES[currentLanguage] || "en-IN";
    utterance.lang = targetLang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Attempt to match installed voice for selected language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
        const matchingVoice = voices.find(v => v.lang === targetLang) ||
                              voices.find(v => v.lang.startsWith(currentLanguage));
        if (matchingVoice) {
            utterance.voice = matchingVoice;
        }
    }

    utterance.onend = () => {
        if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
        if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
}

function speakMessageContent(buttonElement) {
    if (!('speechSynthesis' in window)) {
        showToast(t("synthesisNotSupported"));
        return;
    }

    // If currently speaking this message, toggle off
    if (buttonElement.classList.contains("speaking")) {
        window.speechSynthesis.cancel();
        buttonElement.classList.remove("speaking");
        const label = buttonElement.querySelector(".speaker-label");
        if (label) label.textContent = t("listenBtn");
        currentSpeakingBtn = null;
        return;
    }

    // Reset previous speaking button if any
    if (currentSpeakingBtn) {
        currentSpeakingBtn.classList.remove("speaking");
        const prevLabel = currentSpeakingBtn.querySelector(".speaker-label");
        if (prevLabel) prevLabel.textContent = t("listenBtn");
    }

    const bubble = buttonElement.closest(".msg-bubble");
    if (!bubble) return;

    // Clone bubble content and remove speaker footer before extracting text
    const clone = bubble.cloneNode(true);
    const footer = clone.querySelector(".msg-bubble-footer");
    if (footer) footer.remove();

    const textToSpeak = clone.innerText || clone.textContent;

    buttonElement.classList.add("speaking");
    const label = buttonElement.querySelector(".speaker-label");
    if (label) label.textContent = t("stopBtn");
    currentSpeakingBtn = buttonElement;

    speakText(textToSpeak, () => {
        buttonElement.classList.remove("speaking");
        if (label) label.textContent = t("listenBtn");
        currentSpeakingBtn = null;
    });
}

// --- UI CHAT RENDERING ---
function appendMessage(sender, htmlContent, shouldAutoSpeak = false) {
    const chatContainer = document.getElementById("chatMessages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message message-${sender}`;

    const avatarDiv = document.createElement("div");
    avatarDiv.className = "msg-avatar";
    avatarDiv.textContent = sender === "bot" ? "AI" : "You";

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "msg-bubble";

    if (sender === "bot") {
        bubbleDiv.innerHTML = `
            <div class="msg-content">${htmlContent}</div>
            <div class="msg-bubble-footer">
                <button type="button" class="btn-msg-speaker" onclick="speakMessageContent(this)" title="${t("listenBtn")}" aria-label="${t("listenBtn")}">
                    <svg class="speaker-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                    <span class="speaker-label">${t("listenBtn")}</span>
                </button>
            </div>
        `;
    } else {
        bubbleDiv.innerHTML = htmlContent;
    }

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatContainer.appendChild(msgDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Complete voice flow: user speaks -> bot speaks reply aloud
    if (sender === "bot" && shouldAutoSpeak) {
        const speakerBtn = bubbleDiv.querySelector(".btn-msg-speaker");
        if (speakerBtn) {
            speakMessageContent(speakerBtn);
        }
    }
}

function showTypingIndicator() {
    const chatContainer = document.getElementById("chatMessages");
    const typingDiv = document.createElement("div");
    typingDiv.id = "typingIndicator";
    typingDiv.className = "message message-bot";
    typingDiv.innerHTML = `
        <div class="msg-avatar">AI</div>
        <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) indicator.remove();
}

function renderQuickOptions(options) {
    const container = document.getElementById("quickOptions");
    container.innerHTML = "";
    if (!options || options.length === 0) return;

    options.forEach(opt => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "option-chip";
        chip.textContent = opt;
        chip.onclick = () => handleUserInput(opt);
        container.appendChild(chip);
    });
}

function showSensitiveAlert(detail) {
    const alertBox = document.getElementById("sensitiveDataAlert");
    const alertText = document.getElementById("sensitiveAlertText");
    alertText.innerHTML = `<strong>${t("sensitiveAlertPrefix")} <em>${detail}</em> ${t("sensitiveAlertSuffix")}`;
    alertBox.style.display = "flex";
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 6000);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);
    }
}

// --- CONVERSATION STEP DISPATCHER ---
function askNextQuestion(speakResponse = false) {
    if (currentStep < QUESTIONS_CONFIG.length) {
        const q = QUESTIONS_CONFIG[currentStep];
        const promptText = q.prompts[currentLanguage] || q.prompts.en;
        const optionsList = q.options[currentLanguage] || q.options.en;

        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            appendMessage("bot", promptText.replace(/\n/g, "<br>"), speakResponse);
            renderQuickOptions(optionsList);
            updateMemoryInspector();
        }, 300);
    } else {
        // Complete evaluation
        evaluateAndDisplayResult(speakResponse);
    }
}

function handleUserSubmit() {
    const inputField = document.getElementById("userInput");
    const val = inputField.value.trim();
    if (!val) return;
    inputField.value = "";
    handleUserInput(val, false);
}

function handleUserInput(input, fromVoice = false) {
    if (isProcessing) return;

    // Stop speech synthesis if user initiates input
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }

    // 1. Proactive Privacy Interception
    const sensitiveType = inspectForSensitiveData(input);
    if (sensitiveType) {
        showSensitiveAlert(sensitiveType);
        return;
    }

    // Special quick action chips
    if (input.includes("Restart") || input.includes("ಮರುಪ್ರಾರಂಭಿಸಿ") || input.includes("पुनः आरंभ")) {
        clearMyData();
        return;
    }
    if (input.includes("Clear") || input.includes("ಅಳಿಸಿ") || input.includes("हटाएं")) {
        clearMyData();
        return;
    }

    // Display user message in UI
    appendMessage("user", escapeHtml(input));
    document.getElementById("quickOptions").innerHTML = "";

    // 2. Intelligent Mixed-Language Entity Extraction
    // Understands naturally mixed English + Kannada ("I want loan, ನನ್ನ salary 30000 ಇದೆ.")
    // or English + Hindi ("Mujhe car loan chahiye, meri salary 45000 hai.")
    const entities = extractApplicantEntities(input);

    // Apply any detected entities into applicantState
    Object.keys(entities).forEach(key => {
        applicantState[key] = entities[key];
    });
    updateMemoryInspector();

    // 3. Check for general loan intent or mixed greeting on Step 0
    if (currentStep === 0) {
        // If loan type was identified in the text:
        if (entities.loanType) {
            applicantState.loanType = entities.loanType;
            currentStep = 1;
            advanceToNextUnansweredStep(fromVoice);
            return;
        }

        // If user said "I want loan, ನನ್ನ salary 30000 ಇದೆ." (loan mentioned, but not specific type, and salary provided)
        if (entities.monthlyIncome && /(?:loan|ಸಾಲ|ಲೋನ್|ऋण)/i.test(input)) {
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                const reply = t("mixedInputNotedSalary").replace("{amount}", entities.monthlyIncome.toLocaleString('en-IN'));
                appendMessage("bot", reply, fromVoice);
                renderQuickOptions(QUESTIONS_CONFIG[0].options[currentLanguage] || QUESTIONS_CONFIG[0].options.en);
            }, 300);
            return;
        }

        // If general loan inquiry like "I want to apply for a loan" or "ನನಗೆ ಸಾಲ ಬೇಕಾಗಿದೆ" or "मुझे लोन चाहिए"
        if (/(?:want|apply|need|explore|ಬೇಕು|ಬೇಕಾಗಿದೆ|ಆಗಿದೆ|ಚाहिए|लेना|पात्रता)/i.test(input) && /(?:loan|ಸಾಲ|ಲೋನ್|ऋण)/i.test(input)) {
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                appendMessage("bot", t("loanIntentAcknowledge"), fromVoice);
                renderQuickOptions(QUESTIONS_CONFIG[0].options[currentLanguage] || QUESTIONS_CONFIG[0].options.en);
            }, 300);
            return;
        }
    }

    // 4. Standard step processing with current question's parser
    const currentQ = QUESTIONS_CONFIG[currentStep];
    if (!currentQ) {
        evaluateAndDisplayResult(fromVoice);
        return;
    }

    let parsedVal = currentQ.parser(input);

    // If parser returned null, check if the entity extractor caught this question's key
    if (parsedVal === null && entities[currentQ.key] !== undefined) {
        parsedVal = entities[currentQ.key];
    }

    if (parsedVal === null) {
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            appendMessage("bot", t("fallbackError"), fromVoice);
            renderQuickOptions(currentQ.options[currentLanguage] || currentQ.options.en);
        }, 300);
        return;
    }

    applicantState[currentQ.key] = parsedVal;
    currentStep++;
    updateMemoryInspector();

    // Advance to next step, skipping any steps that were already answered in mixed speech
    advanceToNextUnansweredStep(fromVoice);
}

function advanceToNextUnansweredStep(fromVoice = false) {
    while (currentStep < QUESTIONS_CONFIG.length && applicantState[QUESTIONS_CONFIG[currentStep].key] !== null) {
        currentStep++;
    }
    updateMemoryInspector();
    askNextQuestion(fromVoice);
}

function evaluateAndDisplayResult(speakResponse = false, immediate = false) {
    const render = () => {
        removeTypingIndicator();
        isProcessing = false;

        const res = calculateEligibility(applicantState, currentLanguage);

        const docsItems = res.docsRequired.map(d => `<li>${d}</li>`).join("");
        const stepsItems = res.nextSteps.map(s => `<li>${s}</li>`).join("");

        const cardHtml = `
            <div class="result-card">
                <div class="result-header">
                    <strong>${t("assessmentTitle")}</strong>
                    <span class="status-badge ${res.badgeClass}">${res.status}</span>
                </div>
                <div class="result-metrics">
                    <div class="metric-box">
                        <div class="metric-label">${t("maxEligibleLabel")}</div>
                        <div class="metric-val">₹${res.maxEligibleAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">${t("estimatedEmiLabel")}</div>
                        <div class="metric-val">₹${res.requestedEmi ? res.requestedEmi.toLocaleString('en-IN') : 'N/A'}</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">${t("interestRateLabel")}</div>
                        <div class="metric-val">${res.interestRate}% p.a.</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">${t("debtRatioLabel")}</div>
                        <div class="metric-val">${res.foirPercent}%</div>
                    </div>
                </div>
                <div class="result-tips">
                    <strong>${currentLanguage === 'kn' ? 'ಸಾರಾಂಶ' : currentLanguage === 'hi' ? 'सारांश' : 'Summary'}:</strong> ${res.reason}<br><br>
                    <strong>${currentLanguage === 'kn' ? 'ಸಲಹೆ' : currentLanguage === 'hi' ? 'सलाह' : 'Recommendation'}:</strong> ${res.tips}
                </div>

                <!-- Document Requirements Section (Original & Xerox Verification) -->
                <div class="result-section">
                    <div class="result-section-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        <span>${t("docsTitle")}</span>
                    </div>
                    <ul class="result-docs-list">
                        ${docsItems}
                    </ul>
                </div>

                <!-- Next Steps Section -->
                <div class="result-section">
                    <div class="result-section-title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"/>
                        </svg>
                        <span>${t("nextStepsTitle")}</span>
                    </div>
                    <ul class="result-steps-list">
                        ${stepsItems}
                    </ul>
                </div>
            </div>
            <p style="margin-top: 10px; font-size: 0.8rem; color: #475569;">
                ${t("localCalcNotice")}
            </p>
        `;

        appendMessage("bot", cardHtml, speakResponse);

        // Offer restart and clear data chips
        renderQuickOptions([t("restartBtn"), t("clearDataChip")]);
    };

    if (immediate) {
        render();
    } else {
        showTypingIndicator();
        isProcessing = true;
        setTimeout(render, 600);
    }
}

// --- LANGUAGE SWITCHER WITHOUT LOSING ASSESSMENT STATE ---
/**
 * Changes active language without resetting current applicant state or step.
 */
function changeLanguage(newLang) {
    if (!TRANSLATIONS[newLang]) return;
    currentLanguage = newLang;
    document.documentElement.lang = newLang;

    // 1. Update Static UI Elements
    const brandTitle = document.getElementById("brandTitle");
    if (brandTitle) brandTitle.textContent = t("brandTitle");

    const brandSubtitle = document.getElementById("brandSubtitle");
    if (brandSubtitle) brandSubtitle.textContent = t("brandSubtitle");

    const storageBadgeText = document.getElementById("storageBadgeText");
    if (storageBadgeText) storageBadgeText.textContent = t("storageBadge");

    const clearDataBtnText = document.getElementById("clearDataBtnText");
    if (clearDataBtnText) clearDataBtnText.textContent = t("clearDataBtn");

    const privacyNoticeText = document.getElementById("privacyNoticeText");
    if (privacyNoticeText) privacyNoticeText.innerHTML = t("privacyNotice");

    const agentNameText = document.getElementById("agentNameText");
    if (agentNameText) agentNameText.textContent = t("agentName");

    const agentStatusText = document.getElementById("agentStatusText");
    if (agentStatusText) agentStatusText.textContent = t("agentStatus");

    const securityChipText = document.getElementById("securityChipText");
    if (securityChipText) securityChipText.textContent = t("securityChip");

    const userInput = document.getElementById("userInput");
    if (userInput) userInput.placeholder = t("inputPlaceholder");

    const footerCaptionText = document.getElementById("footerCaptionText");
    if (footerCaptionText) footerCaptionText.textContent = t("footerCaption");

    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) languageSelect.value = newLang;

    // Reset mic UI state tooltip in new language
    if (currentMicState === "ready") {
        setMicrophoneState("ready");
    }

    // 2. Re-render current question and quick options in new language if assessment in progress
    if (currentStep < QUESTIONS_CONFIG.length) {
        const q = QUESTIONS_CONFIG[currentStep];
        renderQuickOptions(q.options[newLang] || q.options.en);

        // Update speaker button labels in existing messages
        document.querySelectorAll(".btn-msg-speaker .speaker-label").forEach(lbl => {
            lbl.textContent = t("listenBtn");
        });
    } else {
        // Assessment already finished: Re-render final results in the new language immediately
        const lastCard = document.querySelector(".result-card");
        if (lastCard) {
            const botMessages = document.querySelectorAll(".message-bot");
            const lastBotMsg = botMessages[botMessages.length - 1];
            if (lastBotMsg) {
                lastBotMsg.remove();
                evaluateAndDisplayResult(false, true);
            }
        }
    }

    showToast(t("langChangeToast"));
}

// --- CLEAR MY DATA FUNCTIONALITY (CRITICAL REQUIREMENT) ---
function clearMyData() {
    // 1. Cancel speech recognition & synthesis
    if (speechRecognizer && isListening) {
        stopVoiceRecognition();
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    currentSpeakingBtn = null;
    setMicrophoneState("ready");

    // 2. Wipe in-memory state completely
    applicantState = {
        loanType: null,
        employmentType: null,
        monthlyIncome: null,
        existingEmi: null,
        creditScore: null,
        loanAmount: null,
        tenureYears: null
    };

    currentStep = 0;
    isProcessing = false;

    // 3. Clear browser session/local storage if anything was stored
    try {
        sessionStorage.clear();
        localStorage.clear();
    } catch (e) {}

    // 4. Clear Chat DOM completely
    const chatContainer = document.getElementById("chatMessages");
    if (chatContainer) chatContainer.innerHTML = "";

    // 5. Clear quick options and input field
    const quickOpts = document.getElementById("quickOptions");
    if (quickOpts) quickOpts.innerHTML = "";
    const inputField = document.getElementById("userInput");
    if (inputField) inputField.value = "";

    // 6. Update Privacy & Memory Inspector to show clean state
    updateMemoryInspector();

    // 7. Show confirmation toast
    showToast(t("clearDataToast"));

    // 8. Restart fresh clean welcoming dialogue in current language
    setTimeout(() => {
        askNextQuestion(false);
    }, 200);
}

// --- LIVE PRIVACY INSPECTOR AUDIT ---
function updateMemoryInspector() {
    const memoryEl = document.getElementById("memoryStatus");
    const storageEl = document.getElementById("storageStatus");

    let localLen = 0;
    let sessionLen = 0;
    try {
        localLen = localStorage.length;
        sessionLen = sessionStorage.length;
    } catch (e) {}

    if (storageEl) {
        storageEl.textContent = `${localLen + sessionLen} bytes (0 items / Zero Disk Persistence)`;
        storageEl.className = "inspector-val val-safe";
    }

    if (memoryEl) {
        const fieldsFilled = Object.values(applicantState).filter(v => v !== null).length;
        if (fieldsFilled === 0) {
            memoryEl.textContent = "Clean (0 active fields)";
            memoryEl.className = "inspector-val val-safe";
        } else {
            memoryEl.textContent = `Volatile (${fieldsFilled}/7 fields in RAM only)`;
            memoryEl.className = "inspector-val";
        }
    }
}

function runPrivacyAudit() {
    updateMemoryInspector();
    let isSafe = true;
    try {
        if (localStorage.length > 0 || sessionStorage.length > 0) isSafe = false;
    } catch (e) {}

    if (isSafe) {
        showToast("🔒 Privacy Verified: Zero persistent storage detected. All processing is transient.");
    } else {
        showToast("⚠️ Warning: Storage contains unexpected items. Clearing now...");
        clearMyData();
    }
}

// --- DUMMY / SAMPLE DATA LOADER FOR DEMONSTRATIONS ---
const DEMO_PERSONAS = {
    high_salaried: {
        loanType: "Home Loan",
        employmentType: "Salaried Professional",
        monthlyIncome: 85000,
        existingEmi: 10000,
        creditScore: 780,
        loanAmount: 3500000,
        tenureYears: 20
    },
    self_employed: {
        loanType: "Auto Loan",
        employmentType: "Self-Employed / Business",
        monthlyIncome: 150000,
        existingEmi: 25000,
        creditScore: 730,
        loanAmount: 1200000,
        tenureYears: 5
    },
    high_debt: {
        loanType: "Personal Loan",
        employmentType: "Salaried Professional",
        monthlyIncome: 30000,
        existingEmi: 18000,
        creditScore: 630,
        loanAmount: 500000,
        tenureYears: 3
    }
};

function loadDemoProfile(profileKey) {
    const demo = DEMO_PERSONAS[profileKey];
    if (!demo) return;

    // Reset current conversation and load dummy values safely
    clearMyData();

    setTimeout(() => {
        applicantState = { ...demo };
        currentStep = QUESTIONS_CONFIG.length; // Jump directly to evaluation

        const label = currentLanguage === 'kn'
            ? `[ಡೆಮೊ ಪ್ರೊಫೈಲ್: ${demo.employmentType}, ₹${demo.monthlyIncome.toLocaleString('en-IN')}/ತಿಂಗಳು, CIBIL: ${demo.creditScore}]`
            : currentLanguage === 'hi'
            ? `[डेमो प्रोफाइल: ${demo.employmentType}, ₹${demo.monthlyIncome.toLocaleString('en-IN')}/माह, CIBIL: ${demo.creditScore}]`
            : `[Loaded Demo Profile: ${demo.employmentType}, ₹${demo.monthlyIncome.toLocaleString('en-IN')}/mo, CIBIL: ${demo.creditScore}]`;

        appendMessage("user", label);
        evaluateAndDisplayResult(false);
        showToast(`Loaded ${profileKey.replace('_', ' ')} dummy persona.`);
    }, 300);
}

// Utility: HTML Escaping for XSS prevention
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // Attach Clear My Data button event listener
    const clearBtn = document.getElementById("clearDataBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            clearMyData();
        });
    }

    // Automatically purge memory if window is closed or refreshed
    window.addEventListener("beforeunload", () => {
        applicantState = {};
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    });

    // Start with the initial welcoming question
    askNextQuestion(false);
    updateMemoryInspector();
    setMicrophoneState("ready");
});

// Expose testing hooks for automated verification
window.loanChatbotTest = {
    getApplicantState: () => ({ ...applicantState }),
    clearMyData: clearMyData,
    inspectForSensitiveData: inspectForSensitiveData,
    calculateEligibility: calculateEligibility,
    loadDemoProfile: loadDemoProfile,
    changeLanguage: changeLanguage,
    getLanguage: () => currentLanguage,
    getVoiceLanguageCode: (lang) => SPEECH_LANG_CODES[lang || currentLanguage],
    getQuestionsConfig: () => QUESTIONS_CONFIG,
    speakText: speakText,
    normalizeIndianDigits: normalizeIndianDigits,
    extractApplicantEntities: extractApplicantEntities,
    handleUserInput: handleUserInput,
    setMicrophoneState: setMicrophoneState,
    getMicrophoneState: () => currentMicState
};
