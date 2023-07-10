import cv2
from PIL import Image
import numpy as np

def fillHoles(mask):
    maskFloodfill = mask.copy()
    h, w = maskFloodfill.shape[:2]
    maskTemp = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(maskFloodfill, maskTemp, (0, 0), 255)
    mask2 = cv2.bitwise_not(maskFloodfill)
    return mask2 | mask


def red_eye_remover(image_data):
    image_array = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Output image
    imgOut = img.copy()

    # Load HAAR cascade
    eyesCascade = cv2.CascadeClassifier("C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\RedEyeRemover\\haarcascade_eye.xml")

    # Detect eyes
    eyes = eyesCascade.detectMultiScale(img, scaleFactor=1.3, minNeighbors=4, minSize=(100, 100))

    # For every detected eye
    for (x, y, w, h) in eyes:
        eye = img[y:y + h, x:x + w]

        #3 channels
        b = eye[:, :, 0]
        g = eye[:, :, 1]
        r = eye[:, :, 2]

        bg = cv2.add(b, g)

        #euristica
        mask = (r > 150) & (r > bg)
        #This step converts the False values to 0 and the True values to 255, producing a binary image mask.
        mask = mask.astype(np.uint8) * 255

        mask = fillHoles(mask)
        #This operation helps to expand and smooth the mask regions, potentially refining the eye boundaries.
        mask = cv2.dilate(mask, None, anchor=(-1, -1), iterations=3, borderType=1, borderValue=1)

        # Calculate the mean channel by averaging
        # the green and blue channels
        mean = bg / 2
        mask = mask.astype(np.bool)[:, :, np.newaxis]
        mean = mean[:, :, np.newaxis]

        # Copy the eye from the original image.
        eyeOut = eye.copy()

        # Copy the mean image to the output image.
        # np.copyto(eyeOut, mean, where=mask)
        eyeOut = np.where(mask, mean, eyeOut)

        # Copy the fixed eye to the output image.
        imgOut[y:y + h, x:x + w, :] = eyeOut

    cv2_rgb = cv2.cvtColor(imgOut, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(cv2_rgb)
    return pil_image
