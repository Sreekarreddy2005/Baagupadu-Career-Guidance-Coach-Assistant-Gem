import os
import jwt
from dotenv import load_dotenv
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # For our MVP/Local development, we can decode the Clerk JWT to extract the user_id (sub).
        # In a strict production environment, you would use jwt.PyJWKClient to fetch Clerk's JWKS and verify the signature.
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        
        user_id = decoded_token.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token structure")
            
        return user_id
    except Exception as e:
        print(f"Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Could not validate credentials")
