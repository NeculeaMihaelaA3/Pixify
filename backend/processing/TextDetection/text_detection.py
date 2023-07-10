from imutils.object_detection import non_max_suppression
import numpy as np
import argparse
import time
import cv2
from PIL import Image
from pytesseract import pytesseract

image = Image.open("C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\uploads\\IvV2y.png")
image = image.resize((400,200))
# image.save('sample.png')
path_to_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
pytesseract.tesseract_cmd = path_to_tesseract

path_to_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
pytesseract.tesseract_cmd = path_to_tesseract