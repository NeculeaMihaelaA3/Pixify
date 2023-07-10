import cv2
import numpy as np

def fft(image):
    f = np.fft.fft2(image)
    fshift = np.fft.fftshift(f)
    return fshift

def ifft(fshift):
    f_ishift = np.fft.ifftshift(fshift)
    img_back = np.fft.ifft2(f_ishift)
    img_back = np.abs(img_back)
    return img_back

def blur(image, kernel_size):
    kernel = np.ones((kernel_size, kernel_size),np.float32)/(kernel_size**2)
    return cv2.filter2D(image,-1,kernel)

def main():
    image_path = "C:\\Users\\Miha\\Desktop\\Licenta\\Flask\\uploads\\deblur.jpg"  # provide your image path here
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    # Apply blur
    blurred = blur(image, kernel_size=5)

    # Perform FFT on blurred image
    fshift = fft(blurred)

    # Perform Inverse FFT to deblur
    deblurred = ifft(fshift)

    cv2.imwrite('blurred.jpg', blurred)
    cv2.imwrite('deblurred.jpg', deblurred)

if __name__ == "__main__":
    main()