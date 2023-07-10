import io
from PIL import Image
from PIL.ExifTags import TAGS
from io import BytesIO

def transformation(image_data):
    # print(path)
    # # opening the image file
    # image_file = Image.open(f"C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\{path}")
    # the dimension of the image
    # width, height = image_file.size
    # Image.frombytes('RGB', (width,height), image_file.tobytes(), 'raw').show()

    image_bytes = BytesIO(image_data)
    image = Image.open(image_bytes)
    width, height = image.size
    # creating a new image with the same size as the original
    black_white_image = Image.new("L", (width, height))
    # Set the threshold value (adjust as needed)
    threshold = 128

    # going through the pixels and convert it
    for x in range(width):
        for y in range(height):
            # the pixel value
            pixel = image.getpixel((x, y))

            # the average fo the RGB value of the pixel
            avg = sum(pixel) / 3

            # setting the new value based on the average
            if avg > threshold:
                black_white_image.putpixel((x, y), 255)
            else:
                black_white_image.putpixel((x, y), 0)

    # save the black and white image
    # black_white_image.save(path)
    # black_white_image.show()
    return black_white_image