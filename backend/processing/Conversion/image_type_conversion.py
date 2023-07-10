import io
from PIL import Image
import os
from PIL.ExifTags import TAGS
from io import BytesIO

def convert_image_format(input_image_bytes, new_format):
    try:
        img = Image.open(io.BytesIO(input_image_bytes))
        output_image_bytes = io.BytesIO()
        img.save(output_image_bytes, format=new_format)
        output_image_bytes.seek(0)
        print(f"Image converted successfully to {new_format} format!")
        result = Image.open(output_image_bytes)
        return result
    except Exception as e:
        print(f"Error occurred while converting the image: {str(e)}")
        return None
