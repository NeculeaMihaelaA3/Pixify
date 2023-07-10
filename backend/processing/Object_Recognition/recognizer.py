from imageai.Detection import ObjectDetection

#difinig paths
path_model = "C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\Object_Recognition\\Models\\yolo-tiny.h5"
path_input = "C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\Object_Recognition\\Input\\tree.jpg"
path_output = "C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\processing\\Object_Recognition\\Output\\walking-two-dogs.jpg"

# instantiating the class
recognizer = ObjectDetection()
recognizer.setModelTypeAsTinyYOLOv3()

# setting the path to the pre-trained Model
recognizer.setModelPath(path_model)

# loading the model
recognizer.loadModel()

# calling the detectObjectsFromImage() function
recognition = recognizer.detectObjectsFromImage(
    input_image = path_input,
    output_image_path = path_output
)

# iterating through the items found in the image
for eachItem in recognition:
    print(eachItem["name"] , " : ", eachItem["percentage_probability"])