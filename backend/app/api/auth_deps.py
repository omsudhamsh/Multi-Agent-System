from fastapi import Request, HTTPException

def get_current_user(request: Request):
    """Dependency to get the current authenticated user."""
    user = request.session.get('user')
    if not user:
        # Default to guest for now to allow local testing without forcing auth
        # In production, you'd raise an exception:
        # raise HTTPException(status_code=401, detail="Not authenticated")
        return {"email": "guest", "name": "Guest User", "sub": "guest"}
    return user
