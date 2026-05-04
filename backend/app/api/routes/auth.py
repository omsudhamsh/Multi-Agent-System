from fastapi import APIRouter, Depends, HTTPException, Request
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from app.core.config import settings
from app.db.database import AsyncSessionLocal
from app.db.models import User
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["auth"])

oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@router.get("/login/google")
async def login_google(request: Request):
    """Redirect to Google login."""
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def auth_google(request: Request):
    """Handle Google login callback."""
    try:
        token = await oauth.google.authorize_access_token(request)
        userinfo = token.get('userinfo')
        if userinfo:
            user_id = userinfo.get("sub")
            email = userinfo.get("email")
            name = userinfo.get("name")
            picture = userinfo.get("picture")
            
            # Upsert user in database
            async with AsyncSessionLocal() as session:
                db_user = await session.get(User, user_id)
                if not db_user:
                    db_user = User(id=user_id, email=email, name=name, picture=picture)
                    session.add(db_user)
                else:
                    db_user.name = name
                    db_user.picture = picture
                await session.commit()
            
            # Set session
            request.session['user'] = userinfo
            return RedirectResponse(url="http://localhost:3000/")
    except Exception as e:
        logger.error(f"Error during Google login: {e}")
        raise HTTPException(status_code=400, detail=f"Google login failed: {str(e)}")

@router.get("/logout")
async def logout(request: Request):
    """Logout user."""
    request.session.pop('user', None)
    return RedirectResponse(url="http://localhost:3000/")

@router.get("/me")
async def get_me(request: Request):
    """Get current user info."""
    user = request.session.get('user')
    if not user:
        return {"authenticated": False}
    return {"authenticated": True, "user": user}
