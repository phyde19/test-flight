from fastapi import APIRouter

from config.settings import settings

router = APIRouter(
    prefix="/info"
)

@router.get("/public-settings")
def read_public_settings():
    return {
        "api_name": settings.api_name
    }