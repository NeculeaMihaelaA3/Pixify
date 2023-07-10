import cv2
import numpy as np
import io
import time
from PIL import Image

path_to_model = "C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\InstanceSegmentation\\frozen_inference_graph_coco.pb"
path_to_config = "C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\InstanceSegmentation\\mask_rcnn_inception_v2_coco_2018_01_28.pbtxt"


# colors for representing different objects
colors = np.random.randint(125, 255, (80,3))

model = cv2.dnn.readNetFromTensorflow("C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\InstanceSegmentation\\frozen_inference_graph_coco.pb", "C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\InstanceSegmentation\\mask_rcnn_inception_v2_coco_2018_01_28.pbtxt")


with open("C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\InstanceSegmentation\\street.jpg", 'rb') as file:
    image_bytes = file.read()

def image_segmentation(image_data):
    model = cv2.dnn.readNetFromTensorflow(path_to_model, path_to_config)
    image_array = np.frombuffer(image_data, np.uint8)
    image_img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    img = cv2.resize(image_img, (650, 550))
    height, width, _ = img.shape
    black_image = np.zeros((height, width, 3), np.uint8)
    black_image[:] = (0, 0, 0)

    # process and detecting objects
    blob = cv2.dnn.blobFromImage(img, swapRB=True)
    model.setInput(blob)
    boxes, masks = model.forward(["detection_out_final", "detection_masks"])
    # boxes array holds the values x-y coordinates of the detected objects
    # mask hold the mask valuess

    no_of_objects = boxes.shape[2]
    # print(no_of_objects)

    for i in range(no_of_objects):
        box = boxes[0, 0, i] #last 4: (x, y, width, height) cc of obj
        class_id = box[1]
        score = box[2]
        if score < 0.5:
            continue
        x = int(box[3] * width)
        y = int(box[4] * height)
        x2 = int(box[5] * width)
        y2 = int(box[6] * height)
        cv2.rectangle(img, (x, y), (x2, y2), (255, 0, 0), 3)

        roi = black_image[y: y2, x: x2]
        roi_height, roi_width, _ = roi.shape
        mask = masks[i, int(class_id)]
        mask = cv2.resize(mask, (roi_width, roi_height))
        _, mask = cv2.threshold(mask, 0.5, 255, cv2.THRESH_BINARY)

        contours, _ = cv2.findContours(np.array(mask, np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        color = colors[int(class_id)]
        for cnt in contours:
            cv2.fillPoly(roi, [cnt], (int(color[0]), int(color[1]), int(color[2])))

    image_extension = '.jpg'  # Default extension

    if img.dtype == np.uint8:
        if len(img.shape) == 2:
            image_extension = '.png'
        elif img.shape[2] == 3:
            image_extension = '.jpg'
        elif img.shape[2] == 4:
            image_extension = '.png'

    success, image_bytes = cv2.imencode(image_extension, img)
    image_bytes_array = image_bytes.tobytes()
    image_stream = io.BytesIO(image_bytes_array)
    # Open the image stream using PIL's Image.open()
    result = Image.open(image_stream)
    Image.open(image_stream)
    return result

    # cv2.imshow("Final", np.hstack([img, black_image]))
    # overlay_frame = ((0.6 * black_image) + (0.4 * img)).astype("uint8")
    # cv2.imshow("Overlay Frame", overlay_frame)
    # cv2.waitKey(0)

# result = image_segmentation(image_bytes)
# print(result)
#
# result.show()
