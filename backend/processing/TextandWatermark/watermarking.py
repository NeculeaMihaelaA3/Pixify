# The need for watermarks arises in situations like:
#
# When you’d like to make your mark on your digital product.
# When you want to discourage copying of your material
# To make copyright claims known without blocking image’s visibility
# To communicate a message such as on digital images, pitch deck or business presentations: Confidentiality, Warning, Incomplete, TBD (to be decided) etc.
# For marketing reasons
# To gain more recognition etc.
import random
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
import numpy as np
from io import BytesIO
import io

def image_to_bytes(photo):

    image = Image.open(photo)
    byte_arr = io.BytesIO()
    image.save(byte_arr, format='PNG')
    byte_value = byte_arr.getvalue()

    return byte_value

def add_watermark(image_data, watermark_text):
    angle = 15 #the angle for rotation
    image_bytes = BytesIO(image_data)
    base_image = Image.open(image_bytes).convert("RGBA")

    font_size = int(base_image.size[0] * 0.1) #10% of width
    font = ImageFont.truetype("arial.ttf", font_size)  #font file and font

    text_width, text_height = font.getsize(watermark_text)

    # Calculate the position so that the watermark is centered
    image_width, image_height = base_image.size
    # print(image_width, image_height)
    # position1 = ((image_width - text_width) / 2, (image_height - text_height) / 2)
    # position2 = ((image_width - text_width) / 5, (image_height - text_height) / 5)
    # position3 = ((image_width - text_width) - ((image_width - text_width) * 0.4), (image_height - text_height) - ((image_height - text_height) * 0.2))

    top_left = (0.1*image_width, 0.1*image_height)
    center = ((image_width - text_width) / 2, (image_height - text_height) / 2)
    bottom_right = ((image_width - text_width), (image_height - text_height))
    #blank image
    watermark = Image.new("RGBA", base_image.size)

    # Get a drawing context
    draw = ImageDraw.Draw(watermark)

    draw.text(top_left, watermark_text, fill=(255, 255, 255, 150), font=font)  # RGBA color and font
    draw.text(center, watermark_text, fill=(255, 255, 255, 150), font=font)
    draw.text(bottom_right, watermark_text, fill=(255, 255, 255, 150), font=font)

    watermark = watermark.rotate(angle, resample=Image.BICUBIC, expand=True)
    output = Image.new("RGBA", base_image.size)
    output.paste(base_image, (0, 0))

    watermark_position = ((output.width - watermark.width) // 2, (output.height - watermark.height) // 2)

    output.paste(watermark, watermark_position, watermark)
    final_width, final_height = output.size
    result = Image.frombytes('RGBA', (final_width, final_height), output.tobytes())

    return result
