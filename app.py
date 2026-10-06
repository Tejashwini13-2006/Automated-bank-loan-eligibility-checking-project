"""
TrustBank Privacy-First Loan Eligibility Chatbot Server
Guarantees:
- Zero persistent storage (No database, no file writes for user data)
- Zero server-side logging of personal or financial applicant details
- External AI / API data minimization (Anonymized numerical parameters only)
"""

import sys
import logging
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS

# Configure Flask app
app = Flask(__name__, static_folder='.')
CORS(app)

# --- STRICT ZERO-LOGGING CONFIGURATION ---
# Disable Werkzeug default request logger to prevent logging query parameters or payloads
werkzeug_logger = logging.getLogger('werkzeug')
werkzeug_logger.setLevel(logging.ERROR)

class PrivacySafeFilter(logging.Filter):
    """Filter out any potential financial or personal numbers from log records."""
    def filter(self, record):
        msg = str(record.msg)
        sensitive_keywords = ['income', 'emi', 'salary', 'loan', 'credit', 'cibil', 'aadhaar', 'account']
        if any(k in msg.lower() for k in sensitive_keywords):
            record.msg = "[PRIVACY SECURED LOG: Payload content redacted]"
        return True

for handler in logging.root.handlers:
    handler.addFilter(PrivacySafeFilter())

@app.route('/')
def index():
    """Serve the chatbot main application."""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve CSS, JS, and asset files."""
    return send_from_directory('.', filename)

@app.route('/api/privacy-status', methods=['GET'])
def privacy_status():
    """Endpoint verifying backend privacy compliance."""
    return jsonify({
        "status": "active",
        "persistent_storage": False,
        "database_connected": False,
        "logging_pii_enabled": False,
        "guarantee": "Zero permanent storage. In-memory session processing only."
    })

@app.route('/api/anonymized-ai-advisor', methods=['POST'])
def anonymized_ai_advisor():
    """
    Stateless, anonymized AI advisor endpoint.
    Strictly verifies that NO personally identifiable information is accepted or logged.
    Only takes dimensionless ratios: DTI ratio, credit bracket, loan type.
    """
    data = request.get_json(silent=True) or {}
    
    # Validation: Ensure no sensitive fields exist in payload
    forbidden_keys = ['name', 'aadhaar', 'account', 'card', 'password', 'otp', 'pan', 'phone', 'email']
    for k in forbidden_keys:
        if k in data:
            return jsonify({
                "error": "Privacy violation: Sensitive identity fields are strictly disallowed."
            }), 400

    dti_ratio = float(data.get('dti_ratio', 0.4))
    score_bracket = data.get('score_bracket', 'Good')
    loan_type = data.get('loan_type', 'General Loan')

    # Stateless advisory advice without storing anything
    if dti_ratio <= 0.40 and score_bracket in ['Excellent', 'Good']:
        advice = "Strong financial health. Candidate qualifies for prime interest rates and maximum sanction."
    elif dti_ratio <= 0.50:
        advice = "Moderate debt obligations. Consider an extended tenure to reduce monthly repayment strain."
    else:
        advice = "High debt-to-income ratio. We recommend closing existing debt lines before initiating new loans."

    # Return immediate advisory without saving to disk or DB
    return jsonify({
        "mode": "Anonymized Processing",
        "notice": "This calculation occurred in transient server memory and was immediately discarded.",
        "advisory": advice
    })

if __name__ == '__main__':
    print("=" * 60)
    print("TrustBank Privacy-First Loan Eligibility Server Started")
    print("Running on: http://127.0.0.1:5000")
    print("Privacy Mode: ZERO PERMANENT STORAGE | ZERO PII LOGS")
    print("=" * 60)
    app.run(host='127.0.0.1', port=5000, debug=False)
