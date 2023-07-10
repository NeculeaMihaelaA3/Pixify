from PIL import Image
from PIL.ExifTags import TAGS
from io import BytesIO
import numpy as np

def extract_pixels(image_data):
    image_bytes = BytesIO(image_data)
    image = Image.open(image_bytes)

    # Convert the image to RGB mode (if it's not already in RGB)
    if image.mode != 'RGB':
        image = image.convert('RGB')

    image_array = np.array(image)
    # Extract the red, green, and blue channels
    red_channel = image_array[:, :, 0]
    green_channel = image_array[:, :, 1]
    blue_channel = image_array[:, :, 2]

    # Flatten the channels to 1D vectors
    red_vector = red_channel.flatten()
    green_vector = green_channel.flatten()
    blue_vector = blue_channel.flatten()

    new_red = [x for i, x in enumerate(red_vector.tolist()) if (i % 200 == 0 or i % 17 == 0 or i%15==0)]
    new_green = [x for i, x in enumerate(green_vector.tolist()) if (i % 200 == 0 or i % 17 == 0 or i%15==0)]
    new_blue = [x for i, x in enumerate(blue_vector.tolist()) if (i % 200 == 0 or i % 17 == 0 or i%15==0)]

    return new_red, new_green, new_blue

