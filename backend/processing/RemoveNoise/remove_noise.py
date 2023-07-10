import numpy as np
import cv2
from matplotlib import pyplot as plt
from PIL import Image
from io import BytesIO


def remove_noise(image_data):
    image_array = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    if len(image.shape) == 2: #grayScale
        noiseless = cv2.fastNlMeansDenoising(image, None, 20, 7, 21)
    elif len(image.shape) == 3:
        noiseless = cv2.fastNlMeansDenoisingColored(image, None, 20, 20, 7, 21)


    #now we need to sharpen the image

    kernel = np.array([[0, -1, 0],
                       [-1, 5, -1],
                       [0, -1, 0]])
    image_sharp = cv2.filter2D(src=noiseless, ddepth=-1, kernel=kernel)

    # new_image = Image.fromarray(image_sharp)
    new_image = Image.fromarray(noiseless)
    return new_image


