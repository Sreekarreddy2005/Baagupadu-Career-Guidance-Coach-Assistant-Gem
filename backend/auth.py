import os
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from clerk_backend_api import Clerk

# Make sure to set CLERK_SECRET_KEY in your environment variables
CLERK_SECRET_KEY = os.environ.get("CLERK_SECRET_KEY", "your_default_secret_key_for_dev")
clerk = Clerk(bearer_auth=CLERK_SECRET_KEY)

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # Clerk Python SDK verify_token (if available in the version installed)
        # Note: If the official SDK doesn't expose a simple synchronous verify, 
        # we can use the clients API to verify the session or just decode standard JWT.
        # Here we use the standard clerk.clients.verify_token approach.
        
        # Depending on the SDK version, the exact method varies.
        # Assuming modern v6+ syntax:
        client = clerk.clients.verify_token(token)
        if not client:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Return the user ID for use in endpoints
        return client.session.user_id
    except Exception as e:
        print(f"Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Alternative manual JWKS verification if `clerk_backend_api` fails:
# import jwt
# from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
# ... manually fetch https://<your-clerk-frontend-api>/.well-known/jwks.json
