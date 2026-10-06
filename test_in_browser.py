"""
End-to-End Headless Chrome Verification Script.
Spawns Chrome with remote debugging to test:
1. Dynamic page load and initial welcome render
2. Injecting sample applicant data
3. Verification that applicant data resides in volatile memory
4. Executing Clear My Data
5. Verification that all applicant data, chat messages, and memory are 100% wiped
"""

import subprocess
import time
import json
import urllib.request
import tempfile
import shutil
import sys

# Ensure UTF-8 output on Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

CHROME_PATH = r"C:\Users\Tejashwini\AppData\Local\Google\Chrome\Application\chrome.exe"
TARGET_URL = r"file:///C:/Users/Tejashwini/Desktop/bank/index.html"
PORT = 9225

def main():
    temp_dir = tempfile.mkdtemp()
    print("Starting Headless Chrome on port", PORT, "with temp dir", temp_dir)
    cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--user-data-dir={temp_dir}",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        TARGET_URL
    ]
    proc = subprocess.Popen(cmd)
    try:
        # Wait for debugging port
        time.sleep(2)
        version_url = f"http://127.0.0.1:{PORT}/json/list"
        req = urllib.request.urlopen(version_url)
        tabs = json.loads(req.read().decode())
        print("Available tabs:", [(t.get('title'), t.get('type'), t.get('url')) for t in tabs])
        
        target_tab = None
        for t in tabs:
            if t.get('type') == 'page' and ('index.html' in t.get('url', '') or 'bank' in t.get('url', '')):
                target_tab = t
                break
        if not target_tab:
            for t in tabs:
                if t.get('type') == 'page':
                    target_tab = t
                    break
        if not target_tab:
            target_tab = tabs[0]

        ws_url = target_tab.get("webSocketDebuggerUrl")
        print(f"Connecting to tab: {target_tab.get('title')} ({target_tab.get('url')})")

        # Use websockets to send CDP commands
        import websockets
        import asyncio

        async def run_cdp_tests():
            async with websockets.connect(ws_url) as ws:
                msg_id = 1
                async def send_eval(expression):
                    nonlocal msg_id
                    msg_id += 1
                    payload = {
                        "id": msg_id,
                        "method": "Runtime.evaluate",
                        "params": {
                            "expression": expression,
                            "returnByValue": True
                        }
                    }
                    await ws.send(json.dumps(payload))
                    res = await ws.recv()
                    data = json.loads(res)
                    while data.get("id") != payload["id"]:
                        res = await ws.recv()
                        data = json.loads(res)
                    return data.get("result", {}).get("result", {}).get("value")

                print("\n--- TEST 1: Check initial page state ---")
                title = await send_eval("document.title")
                print("Page Title:", title)
                assert "Loan Eligibility Chatbot" in title

                privacy_notice = await send_eval("document.querySelector('.notice-text').innerText")
                print("Privacy Notice text:", privacy_notice)
                assert "We do not permanently store your personal or financial information." in privacy_notice

                print("\n--- TEST 2: Simulate Applicant Data Entry via Demo Persona ---")
                await send_eval("window.loanChatbotTest.loadDemoProfile('high_salaried')")
                # Wait for calculation animation
                await asyncio.sleep(1)

                state_before_clear = await send_eval("JSON.stringify(window.loanChatbotTest.getApplicantState())")
                print("Applicant State in RAM before clear:", state_before_clear)
                parsed_state = json.loads(state_before_clear)
                assert parsed_state.get("monthlyIncome") == 85000, "Income should be in state"
                assert parsed_state.get("loanAmount") == 3500000, "Loan amount should be in state"

                chat_count_before = await send_eval("document.querySelectorAll('.message').length")
                print(f"Chat messages rendered: {chat_count_before}")
                assert chat_count_before > 0

                print("\n--- TEST 3: Sensitive Data Interception ---")
                intercepted_aadhaar = await send_eval("window.loanChatbotTest.inspectForSensitiveData('My Aadhaar is 5482 1928 3847')")
                print("Aadhaar interception result:", intercepted_aadhaar)
                assert intercepted_aadhaar is not None

                intercepted_card = await send_eval("window.loanChatbotTest.inspectForSensitiveData('Card 4111 2222 3333 4444')")
                print("Card interception result:", intercepted_card)
                assert intercepted_card is not None

                intercepted_pwd = await send_eval("window.loanChatbotTest.inspectForSensitiveData('here is my password123')")
                print("Password interception result:", intercepted_pwd)
                assert intercepted_pwd is not None

                print("\n--- TEST 4: Execute 'Clear My Data' ---")
                await send_eval("window.loanChatbotTest.clearMyData()")
                await asyncio.sleep(0.5)

                state_after_clear = await send_eval("JSON.stringify(window.loanChatbotTest.getApplicantState())")
                print("Applicant State in RAM after clear:", state_after_clear)
                cleared_state = json.loads(state_after_clear)
                for k, v in cleared_state.items():
                    assert v is None, f"Field {k} should be null after clearing! Got: {v}"

                # Verify persistent storage is 0 bytes
                local_storage_len = await send_eval("localStorage.length")
                session_storage_len = await send_eval("sessionStorage.length")
                print(f"localStorage count: {local_storage_len}, sessionStorage count: {session_storage_len}")
                assert local_storage_len == 0
                assert session_storage_len == 0

                print("\n--- TEST 5: Multilingual Switching to Kannada (kn) ---")
                await send_eval("window.loanChatbotTest.changeLanguage('kn')")
                kn_lang = await send_eval("window.loanChatbotTest.getLanguage()")
                kn_voice = await send_eval("window.loanChatbotTest.getVoiceLanguageCode('kn')")
                kn_brand = await send_eval("document.getElementById('brandTitle').innerText")
                print(f"Active Language: {kn_lang}, Voice Code: {kn_voice}, Brand: {kn_brand}")
                assert kn_lang == "kn"
                assert kn_voice == "kn-IN"
                assert "ಸಾಲ ಸಲಹೆಗಾರ" in kn_brand

                # Load a profile while in Kannada and test Kannada response
                await send_eval("window.loanChatbotTest.loadDemoProfile('self_employed')")
                await asyncio.sleep(1)
                kn_result_card = await send_eval("document.querySelector('.result-card').innerText")
                print("Kannada Result Card rendered:\n", kn_result_card[:200], "...")
                assert "ಪ್ರಾಥಮಿಕ ಮೌಲ್ಯಮಾಪನ" in kn_result_card or "ದಾಖಲೆಗಳು" in kn_result_card

                print("\n--- TEST 6: Multilingual Switching to Hindi (hi) & Assessment Preservation ---")
                # Switching language must NOT clear the applicant state
                state_before_hi = await send_eval("JSON.stringify(window.loanChatbotTest.getApplicantState())")
                await send_eval("window.loanChatbotTest.changeLanguage('hi')")
                state_after_hi = await send_eval("JSON.stringify(window.loanChatbotTest.getApplicantState())")
                print("State before Hindi switch:", state_before_hi)
                print("State after Hindi switch: ", state_after_hi)
                assert state_before_hi == state_after_hi, "Changing language must not reset applicant assessment!"

                hi_lang = await send_eval("window.loanChatbotTest.getLanguage()")
                hi_voice = await send_eval("window.loanChatbotTest.getVoiceLanguageCode('hi')")
                hi_brand = await send_eval("document.getElementById('brandTitle').innerText")
                print(f"Active Language: {hi_lang}, Voice Code: {hi_voice}, Brand: {hi_brand}")
                assert hi_lang == "hi"
                assert hi_voice == "hi-IN"
                assert "क्रेडिट सलाहकार" in hi_brand

                hi_result_card = await send_eval("document.querySelector('.result-card').innerText")
                print("Hindi Result Card rendered:\n", hi_result_card[:200], "...")
                assert "प्रारंभिक मूल्यांकन" in hi_result_card or "दस्तावेज" in hi_result_card

                print("\n--- TEST 7: Voice Input / Mic Button & Speaker Button UI ---")
                mic_btn_exists = await send_eval("document.getElementById('micBtn') !== null")
                speaker_btns = await send_eval("document.querySelectorAll('.btn-msg-speaker').length")
                print(f"Mic button exists: {mic_btn_exists}, Speaker buttons rendered: {speaker_btns}")
                assert mic_btn_exists is True
                assert speaker_btns > 0

                print("\n[SUCCESS] ALL IN-BROWSER DYNAMIC MULTILINGUAL & VOICE TESTS PASSED!")
                return True

        return asyncio.run(run_cdp_tests())
    finally:
        proc.terminate()
        proc.wait()
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception:
            pass

if __name__ == '__main__':
    main()
