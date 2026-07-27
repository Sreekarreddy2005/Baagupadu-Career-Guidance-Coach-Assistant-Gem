from fastapi.testclient import TestClient
from backend.api import app, verify_token

def mock_verify():
    return "test_user_1"

app.dependency_overrides[verify_token] = mock_verify

client = TestClient(app)

with client:
    response = client.post("/api/chat", json={"message": "hello", "session_id": "test_session"})
    print("STATUS:", response.status_code)
    print("BODY:", response.text)
