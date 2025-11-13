from fastapi import APIRouter, UploadFile, File, HTTPException
import cloudinary.uploader
from app.cloudinary_config import cloudinary  # ensure this config file runs config on import

router = APIRouter(prefix="/upload", tags=["Upload"])

# If your cloudinary_config.py doesn't run automatically on import,
# you can call configure_cloudinary() here; otherwise omit.
try:
    cloudinary()
except Exception:
    # it's fine if your config is already executed in cloudinary_config.py
    pass

@router.post("/media")
async def upload_media(file: UploadFile = File(...)):
    """
    Upload an image/audio/file to Cloudinary and return the secure_url.
    Accepts images and audio files. For audio, Cloudinary needs resource_type='video' or 'raw' depending on account.
    """
    try:
        filename = file.filename
        content_type = file.content_type or ""

        # If it's audio, upload as resource_type='video' (Cloudinary treats audio/video similarly).
        if content_type.startswith("audio/"):
            result = cloudinary.uploader.upload(
                file.file,
                resource_type="video",   # use 'video' for most audio files on Cloudinary
                folder="chat_media",
                public_id=filename.rsplit(".", 1)[0]
            )
        else:
            # default: image / other types
            result = cloudinary.uploader.upload(
                file.file,
                folder="chat_media",
                public_id=filename.rsplit(".", 1)[0]
            )

        return {"url": result.get("secure_url")}
    except Exception as e:
        print("UPLOAD ERROR:", e)
    raise HTTPException(status_code=500, detail=str(e))

