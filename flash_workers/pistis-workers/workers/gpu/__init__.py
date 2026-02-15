from fastapi import APIRouter
from pydantic import BaseModel

from .endpoint import gpu_hello
from .image_analysis import analyze_image

gpu_router = APIRouter()


class MessageRequest(BaseModel):
    """Request model for GPU worker."""

    message: str = "Hello from GPU!"


class ImageAnalysisRequest(BaseModel):
    """Request model for image analysis."""

    image_base64: str
    media_type: str = "image/jpeg"


@gpu_router.post("/hello")
async def hello(request: MessageRequest):
    """Simple GPU worker endpoint."""
    result = await gpu_hello({"message": request.message})
    return result


@gpu_router.post("/analyze-image")
async def analyze(request: ImageAnalysisRequest):
    """
    Analyze an image and generate a rich narrative story.

    This endpoint uses Claude AI to analyze images and create
    cinematic narratives about their subjects.
    """
    result = await analyze_image(
        image_base64=request.image_base64,
        media_type=request.media_type
    )
    return result
