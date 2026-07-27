import jwt
import requests
token = jwt.encode({"sub": "test_user_1"}, "secret", algorithm="HS256")
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
payload = {"message": "hey again now", "session_id": "test_session_123"}
print("Sending request to http://localhost:8001/api/chat...", flush=True)
res = requests.post("http://localhost:8001/api/chat", json=payload, headers=headers)
print("STATUS:", res.status_code)
print("BODY:", res.text)
