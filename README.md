# TrustBank Privacy-First Loan Eligibility Chatbot

A secure, responsive, and privacy-centric Loan Eligibility Chatbot web application designed to evaluate loan applicants without compromising confidentiality or storing personally identifiable information (PII).

---

## 🔒 Privacy & Data-Secrecy Guarantees

1. **Zero Permanent Storage**:
   - The application does not write any applicant data to local storage, cookies, IndexedDB, or server-side databases.
   - All state is maintained purely in transient JavaScript in-memory variables (`applicantState`) and is completely destroyed when the tab is closed, refreshed, or reset.

2. **Ephemeral Session Scope**:
   - Applicant data is held only during the active evaluation session.
   - A `beforeunload` event listener immediately flushes state from RAM upon browser close.

3. **Clearly Visible "Clear My Data" Button**:
   - A dedicated button styled in prominent alert tones is placed at the top-right header of the application.
   - Clicking **"Clear My Data"**:
     - Resets `applicantState` to all `null` values.
     - Clears the chat message DOM history.
     - Clears any browser session cache.
     - Resets the privacy inspector to "0 items / Clean".
     - Displays a confirmation toast and restarts a clean welcome session.

4. **Strict Sensitive Credential Interception**:
   - The chatbot **never** requests sensitive personal or banking credentials.
   - An active interceptor detects and blocks:
     - **Aadhaar Numbers** (12 digits)
     - **Credit / Debit Card Numbers** (16 digits)
     - **Bank Account Numbers** (9–18 digits)
     - **Passwords / CVVs / Passcodes**
     - **OTPs and Security PINs**
     - **PAN Card Numbers**
   - If an applicant enters any of these patterns, the system blocks the input, flashes a security alert, and advises the user to provide only estimated financial figures.

5. **Mandatory Privacy Notice**:
   - Displayed prominently in a dedicated banner above the chatbot card:
     > **Privacy Notice:** Your information is used only for this preliminary loan eligibility assessment. We do not permanently store your personal or financial information.

6. **External AI / API Data Minimization**:
   - If external AI advisors or endpoints are invoked, only non-identifying dimensionless metrics (e.g., Debt-to-Income ratio, credit score tier, loan type) are transmitted. No names, phone numbers, emails, or account figures are ever communicated.
   - A clear indicator badge informs the user that external processing occurs with anonymized estimates.

7. **Zero-Logging Policy**:
   - Browser console methods (`console.log`, `console.warn`, `console.error`) are wrapped to redact user financial parameters.
   - The Flask backend (`app.py`) includes a custom logging filter (`PrivacySafeFilter`) and silences standard request logging to prevent PII exposure in server output.

8. **Pre-configured Dummy Data**:
   - Includes 3 one-click sample profiles for safe demonstrations:
     - 👤 **Salaried Professional**: ₹85,000/mo income, ₹10,000 EMI, 780 CIBIL (Home Loan)
     - 💼 **Self-Employed Business**: ₹1,50,000/mo income, ₹25,000 EMI, 730 CIBIL (Auto Loan)
     - ⚠️ **High DTI Applicant**: ₹30,000/mo income, ₹18,000 EMI, 630 CIBIL (Personal Loan)

---

## 📐 Eligibility Calculation Engine

The chatbot implements standard banking risk assessment models:
- **Fixed Obligation to Income Ratio (FOIR / DTI)**: Caps total debt obligations between 45% and 55% of monthly income.
- **Maximum Permissible EMI**: $\text{Disposable EMI} = (\text{Income} \times \text{Max FOIR}) - \text{Existing EMIs}$.
- **Present Value Annuity Formula**:
  $$P = \frac{\text{EMI} \times ((1 + r)^n - 1)}{r \times (1 + r)^n}$$
  *(where $r$ is the monthly interest rate, $n$ is total tenure in months)*.
- **Credit Score (CIBIL) Multipliers**:
  - $\ge 750$: Prime rates, 100% capacity
  - $700 - 749$: Standard rates (+0.50% p.a.), 90% capacity
  - $650 - 699$: Conditional rates (+1.50% p.a.), 75% capacity
  - $< 650$: Subprime / High risk, conditional or co-applicant required.

---

## 🚀 How to Run

### Method 1: Direct in Browser (No setup required)
Simply double-click `index.html` or open it in Google Chrome / any modern web browser.

### Method 2: Local Python Server
To run with the optional zero-logging Flask backend:
```bash
python app.py
```
Then navigate to `http://127.0.0.1:5000` in your browser.

---

## 🌐 Multilingual & Voice Accessibility

1. **Language Selector**:
   - Easily switch between **English**, **ಕನ್ನಡ (Kannada)**, and **हिंदी (Hindi)** from the top header dropdown.
   - Dynamically translates questions, option pills, calculation cards, document checklists, next steps, and error notices.
   - **Zero-Loss Language Switching**: Changing languages mid-session or after calculation **never** resets entered applicant data or progress.

2. **Microphone Voice Input (Speech-to-Text)**:
   - Microphone button 🎤 beside the chat input allows full speech communication.
   - Uses the browser's native **Web Speech API** (`SpeechRecognition` / `webkitSpeechRecognition`).
   - Automatically adapts recognition language:
     - English: `en-IN`
     - Kannada: `kn-IN`
     - Hindi: `hi-IN`
   - Real-time animated sound-wave indicator shows **"Listening... Speak now"** and automatically finishes when speech stops.

3. **Speaker Voice Output (Text-to-Speech)**:
   - Every chatbot message features a dedicated **Listen** 🔊 button.
   - Reads responses aloud via browser `window.speechSynthesis` with language matching `en-IN`, `kn-IN`, or `hi-IN`.
   - Complete voice loop supported: *User Speaks ➔ Transcribed ➔ Evaluated ➔ Spoken Aloud*.

---

## 🌐 Browser Compatibility & Limitations

- **Speech Recognition (`SpeechRecognition`)**:
  - **Supported**: Google Chrome, Microsoft Edge, Brave, Opera, Chromium-based browsers (Desktop & Android).
  - **Limitations**:
    - **Mozilla Firefox** does not enable native Web Speech Recognition by default without experimental flags (`media.webspeech.recognition.enable`).
    - **Safari (macOS/iOS)** has partial webkit speech recognition support requiring explicit microphone permission grants.
    - **Network Dependency**: Kannada (`kn-IN`) and Hindi (`hi-IN`) speech-to-text on desktop Chrome relies on Google's cloud voice models, requiring an active internet connection.
  - **Graceful Fallback**: If speech recognition is unsupported or blocked, the chatbot alerts the user with a friendly notice and allows full keyboard text entry.

- **Speech Synthesis (`SpeechSynthesis`)**:
  - **Supported**: Chrome, Edge, Safari, Firefox on Windows, macOS, Android, and iOS.
  - **Voice Quality**: Depends on the operating system's installed text-to-speech engines. Windows and macOS provide natural voice models for `en-IN` and `hi-IN`. `kn-IN` utilizes available system phonetic voices.

---

## 🧪 Automated Testing & Verification

1. **Unit & Multilingual Rule Verification**:
   ```bash
   python test_privacy_and_eligibility.py
   ```
   *Runs 10 automated tests verifying exact notice wording, state wipe, regex sanitization, loan calculations, Kannada/Hindi translations, and digit normalization.*

2. **End-to-End Headless Chrome CDP Verification**:
   ```bash
   python test_in_browser.py
   ```
   *Launches an isolated headless Chrome instance, tests English flow, switches to Kannada and Hindi, validates state preservation, verifies speech language codes (`en-IN`, `kn-IN`, `hi-IN`), clicks "Clear My Data", and asserts 100% memory and storage purge.*

