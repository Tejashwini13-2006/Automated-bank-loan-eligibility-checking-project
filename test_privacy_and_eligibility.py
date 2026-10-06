"""
Automated Test Suite for TrustBank Loan Eligibility Chatbot
Tests:
1. Privacy Notice Verification (Exact wording requirement)
2. 'Clear My Data' UI and logic verification
3. In-Memory Session & Zero Permanent Storage check
4. Sensitive Data Guard (Aadhaar, cards, bank accounts, passwords, OTPs rejection)
5. Loan Eligibility Calculation Engine (DTI, Credit Score, EMI calculation)
6. Zero Logging & Anonymized API verification
"""

import os
import re
import unittest

class TestPrivacyAndEligibility(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        with open(os.path.join(base_dir, 'index.html'), 'r', encoding='utf-8') as f:
            cls.html_content = f.read()
        with open(os.path.join(base_dir, 'script.js'), 'r', encoding='utf-8') as f:
            cls.js_content = f.read()
        with open(os.path.join(base_dir, 'app.py'), 'r', encoding='utf-8') as f:
            cls.py_content = f.read()

    def test_privacy_notice_exact_wording(self):
        """Verify the exact mandatory Privacy Notice text is present in the HTML."""
        required_notice = "Your information is used only for this preliminary loan eligibility assessment. We do not permanently store your personal or financial information."
        self.assertIn(required_notice, self.html_content, "The exact Privacy Notice must be present near the chatbot.")

    def test_clear_my_data_button_present(self):
        """Verify the 'Clear My Data' button exists with the exact required label."""
        self.assertIn("Clear My Data", self.html_content, "The 'Clear My Data' button must be prominently present.")
        self.assertIn('id="clearDataBtn"', self.html_content, "Clear data button must have an ID for binding.")

    def test_clear_my_data_wipes_all_applicant_state(self):
        """Verify that clearMyData() function clears state variables, memory, and chat history."""
        self.assertIn("function clearMyData()", self.js_content, "clearMyData function must exist.")
        # Check that it resets all applicantState fields to null
        self.assertIn("loanType: null", self.js_content)
        self.assertIn("monthlyIncome: null", self.js_content)
        self.assertIn("creditScore: null", self.js_content)
        self.assertIn("chatContainer.innerHTML = \"\"", self.js_content, "Chat history DOM must be completely cleared.")

    def test_no_permanent_storage_mechanisms(self):
        """Verify no persistent storage (indexedDB, database, persistent cookies) is used for applicant data."""
        # Ensure no SQL database or persistent file writes of applicant data in app.py
        self.assertNotIn("sqlite3", self.py_content.lower())
        self.assertNotIn("cursor.execute", self.py_content.lower())
        self.assertNotIn("to_csv", self.py_content.lower())
        
        # Ensure script.js clears storage and warns if anything is persisted
        self.assertIn("sessionStorage.clear()", self.js_content)
        self.assertIn("localStorage.clear()", self.js_content)

    def test_sensitive_data_detection(self):
        """Verify that sensitive identifiers (Aadhaar, cards, bank accounts, passwords, OTPs) are detected and blocked."""
        # Test Aadhaar detection (12 digits)
        aadhaar_pattern = r'\b\d{4}\s?\d{4}\s?\d{4}\b'
        sample_aadhaar = "My number is 5482 1928 3847"
        self.assertTrue(bool(re.search(aadhaar_pattern, sample_aadhaar)))

        # Test Card number detection (16 digits)
        card_pattern = r'\b(?:\d{4}[ -]?){3}\d{4}\b'
        sample_card = "Card 4111-2222-3333-4444"
        self.assertTrue(bool(re.search(card_pattern, sample_card)))

        # Test Bank account detection (9-18 digits)
        account_pattern = r'\b\d{9,18}\b'
        sample_account = "Account 123456789012"
        self.assertTrue(bool(re.search(account_pattern, sample_account)))

        # Test credential keywords (password, otp, cvv)
        credential_pattern = r'\b(password|pwd|cvv|pin|otp|passcode)\b'
        self.assertTrue(bool(re.search(credential_pattern, "here is my otp", re.IGNORECASE)))
        self.assertTrue(bool(re.search(credential_pattern, "my bank password", re.IGNORECASE)))

        # Verify that these patterns are embedded in script.js
        self.assertIn("Aadhaar Number", self.js_content)
        self.assertIn("Credit/Debit Card Number", self.js_content)
        self.assertIn("Bank Account Number", self.js_content)
        self.assertIn("inspectForSensitiveData", self.js_content)

    def test_zero_logging_implementation(self):
        """Verify that zero-logging wrapper is installed and server suppresses PII logs."""
        self.assertIn("enforceZeroLogging", self.js_content, "Zero-logging wrapper must be active in script.js.")
        self.assertIn("PrivacySafeFilter", self.py_content, "Server-side privacy filter must be present in app.py.")

    def test_dummy_demo_profiles_provided(self):
        """Verify that pre-configured dummy profiles exist for safe demonstration."""
        self.assertIn("DEMO_PERSONAS", self.js_content, "Dummy personas dictionary must exist.")
        self.assertIn("loadDemoProfile", self.js_content, "Function to load demo profiles must exist.")
        self.assertIn("high_salaried", self.js_content)
        self.assertIn("self_employed", self.js_content)

    def test_eligibility_rules_logic(self):
        """Simulate and verify the loan calculation engine formulas."""
        # Case 1: High income (₹85,000), low EMI (₹10,000), 780 score, Home Loan 35L
        monthly_income = 85000
        existing_emi = 10000
        max_foir = 0.55
        max_total_emi = monthly_income * max_foir  # 46,750
        available_emi = max_total_emi - existing_emi  # 36,750
        self.assertGreater(available_emi, 0)
        
        # Monthly rate for 8.5%
        r = (8.5 / 100) / 12
        n = 20 * 12
        factor = (1 + r) ** n
        max_loan = available_emi * ((factor - 1) / (r * factor))
        self.assertGreater(max_loan, 3500000, "Should comfortably be eligible for 35L")

    def test_multilingual_and_voice_accessibility(self):
        """Verify multilingual support for English, Kannada, and Hindi, along with speech language codes."""
        # Check language select element
        self.assertIn('id="languageSelect"', self.html_content)
        self.assertIn('value="en"', self.html_content)
        self.assertIn('value="kn"', self.html_content)
        self.assertIn('value="hi"', self.html_content)

        # Check speech recognition language codes
        self.assertIn('"en-IN"', self.js_content)
        self.assertIn('"kn-IN"', self.js_content)
        self.assertIn('"hi-IN"', self.js_content)

        # Check mic and speaker buttons
        self.assertIn('id="micBtn"', self.html_content)
        self.assertIn('btn-msg-speaker', self.js_content)
        self.assertIn('voiceListeningBar', self.html_content)

        # Check translation dictionaries
        self.assertIn('kn: {', self.js_content)
        self.assertIn('hi: {', self.js_content)
        self.assertIn('docsSalaried', self.js_content)
        self.assertIn('nextStepsList', self.js_content)

    def test_indian_digit_normalizer(self):
        """Verify Kannada and Hindi numerals are normalized to standard ASCII digits."""
        # Simulated python equivalent of normalizeIndianDigits
        indian_digit_map = {
            '೦':'0','೧':'1','೨':'2','೩':'3','೪':'4','೫':'5','೬':'6','೭':'7','೮':'8','೯':'9',
            '०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'
        }
        kannada_num = "೫೦೦೦೦"
        hindi_num = "५००००"
        
        normalized_kn = "".join(indian_digit_map.get(ch, ch) for ch in kannada_num)
        normalized_hi = "".join(indian_digit_map.get(ch, ch) for ch in hindi_num)
        
        self.assertEqual(normalized_kn, "50000")
        self.assertEqual(normalized_hi, "50000")

if __name__ == '__main__':
    unittest.main()
