from PIL import Image
from PIL.ExifTags import TAGS
from io import BytesIO

def get_metadata_from_image(image_data):
    image_bytes = BytesIO(image_data)
    image = Image.open(image_bytes)

    info_dict = {
        "Filename": image.filename,
        "Image Size": image.size,
        "Image Height": image.height,
        "Image Width": image.width,
        "Image Format": image.format,
        "Image Mode": image.mode,
        "Image is Animated": getattr(image, "is_animated", False),
        "Frames in Image": getattr(image, "n_frames", 1),
        "Color palette table": image.getcolors(),
    }

    exifdata = image.getexif()
    for tag_id in exifdata:
        tag = TAGS.get(tag_id, tag_id)
        data = exifdata.get(tag_id)
        # decode bytes
        if isinstance(data, bytes):
            data = data.decode()
        info_dict[tag] = data

    return info_dict


