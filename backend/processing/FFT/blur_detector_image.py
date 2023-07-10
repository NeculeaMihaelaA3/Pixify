import io
import time
from PIL import Image
from PIL.ExifTags import TAGS
from io import BytesIO
#from pyimagesearch.blur_detector import detect_blur_fft
import numpy as np
import argparse
import imutils
import cv2

from processing.FFT.pyimagesearch.blur_detector import detect_blur_fft

thresh = 30
vis = 0
test = 0

def detect_blury(image_data):
    image_array = np.frombuffer(image_data, np.uint8)
    image_img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    orig = imutils.resize(image_img, width=500)
    gray = cv2.cvtColor(orig, cv2.COLOR_BGR2GRAY)
    # apply our blur detector using the FFT
    (mean, blurry) = detect_blur_fft(gray, size=60, thresh=thresh, vis=0)

    # draw on the image, indicating whether or not it is blurry
    image = np.dstack([gray] * 3)
    color = (0, 0, 255) if blurry else (0, 255, 0)
    text = "Blurry ({:.4f})" if blurry else "Not Blurry ({:.4f})"
    text = text.format(mean)
    cv2.putText(image, text, (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    # cv2.imshow("Output", image)
    # cv2.waitKey(0)

    # Determine the file extension based on the image type
    image_extension = '.jpg'  # Default extension

    if image.dtype == np.uint8:
        if len(image.shape) == 2:
            image_extension = '.png'
        elif image.shape[2] == 3:
            image_extension = '.jpg'
        elif image.shape[2] == 4:
            image_extension = '.png'

    # Convert the image to bytes
    success, image_bytes = cv2.imencode(image_extension, image)
    image_bytes_array = image_bytes.tobytes()
    image_stream = io.BytesIO(image_bytes_array)
    # Open the image stream using PIL's Image.open()
    result = Image.open(image_stream)
    return result, mean
























# result = detect_blury(image_bytes)
# detect_blury(image_bytes)
# image_bytes_array = image_bytes.tobytes()
# image = "C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\uploads\\scrie.jpg"
