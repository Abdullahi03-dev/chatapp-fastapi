from fastapi import APIRouter, UploadFile, File, HTTPException
import cloudinary.uploader
# import app.cloudinary_config  # this runs the config on import

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/media")
async def upload_media(file: UploadFile = File(...)):
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

