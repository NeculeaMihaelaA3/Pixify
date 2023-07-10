import numpy as np
import matplotlib.pyplot as plt
from skimage.io import imshow, imread
from skimage.color import rgb2yuv, rgb2hsv, rgb2gray, yuv2rgb, hsv2rgb
from scipy.signal import convolve2d
from skimage import color

dog = imread("C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\uploads\\scrie.jpg")

dog_grey = color.rgb2gray(dog)
# plt.figure(num=None, figsize=(100, 100), dpi=80)
# plt.imshow(dog)
# plt.show()

# Sharpen
sharpen = np.array([[0, -1, 0],
                    [-1, 5, -1],
                    [0, -1, 0]])
# Gaussian Blur
gaussian = (1 / 16.0) * np.array([[1., 2., 1.],
                                  [2., 4., 2.],
                                  [1., 2., 1.]])
fig, ax = plt.subplots(1, 2, figsize=(17, 10))
# ax[0].imshow(sharpen, cmap='gray')
# ax[0].set_title(f'Sharpen', fontsize=18)
# ax[0].show()
#
# ax[1].imshow(gaussian, cmap='gray')
# ax[1].set_title(f'Gaussian Blur', fontsize=18)

[axi.set_axis_off() for axi in ax.ravel()]

def multi_convolver(image, kernel, iterations):
    for i in range(iterations):
        image = convolve2d(image, kernel, 'same', boundary = 'fill', fillvalue = 0)
    return image

def convolver_rgb(image, kernel, iterations=1):
    # Convert RGB image to grayscale
    image_gray = rgb2gray(image)

    # Perform convolution on the grayscale image
    convolved_image = multi_convolver(image_gray, kernel, iterations)

    # Convert back to RGB
    reformed_image = np.dstack((convolved_image,) * 3)
    return np.array(reformed_image).astype(np.uint8)

# Load the image
dog = imread("C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\uploads\\text.jpg")

# Define the kernel (e.g., Gaussian kernel)
kernel = ...

# Apply convolution on the RGB image
# convolved_rgb_gauss = convolver_rgb(dog, kernel, 2)

def convolver_rgb(image, kernel, iterations=1):
    img_yuv = rgb2yuv(image)
    img_yuv[:, :, 0] = multi_convolver(img_yuv[:, :, 0], kernel,
                                       iterations)
    final_image = yuv2rgb(img_yuv)

    fig, ax = plt.subplots(1, 2, figsize=(17, 10))

    ax[0].imshow(image)
    ax[0].set_title(f'Original', fontsize=20)

    ax[1].imshow(final_image);
    ax[1].set_title(f'YUV Adjusted, Iterations = {iterations}',
                    fontsize=20)

    [axi.set_axis_off() for axi in ax.ravel()]

    fig.tight_layout()

    return final_image

final_image = convolver_rgb(dog, sharpen, iterations=2)

# Display the final result
plt.imshow(final_image.astype('uint8'))
plt.show()


#"C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\uploads\\deblur.jpg"