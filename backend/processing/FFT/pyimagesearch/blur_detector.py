# import the necessary packages
import matplotlib.pyplot as plt
import numpy as np


def detect_blur_fft(image, size=60, thresh=10, vis=False):

    #size: The size of the radius around the centerpoint of the image for which we will zero out the FFT shift
    #thresh: A value which the mean value of the magnitudes will be compared to for determining whether an image is considered blurry or not blurry
    #vis:  A boolean indicating whether to visualize/plot the original input image and magnitude image using matplotlib

    (h, w) = image.shape
    (cX, cY) = (int(w / 2.0), int(h / 2.0)) #center

    print(image)
    #FFT is a mathematical technique that transforms the image from the spatial domain to the frequency domain
    fft = np.fft.fft2(image)
    #Shifting the FFT allows for easier analysis of the frequency components.
    fftShift = np.fft.fftshift(fft)


    # zero-out the center of the FFT shift (i.e., remove low
    # frequencies), apply the inverse shift such that the DC
    # component once again becomes the top-left, and then apply
    # the inverse FFT
    fftShift[cY - size:cY + size, cX - size:cX + size] = 0 #This step removes low frequencies from consideration,
    fftShift = np.fft.ifftshift(fftShift)
    recon = np.fft.ifft2(fftShift)
    # print(recon)
    # compute the magnitude spectrum of the reconstructed image,
    # then compute the mean of the magnitude values
    magnitude = 20 * np.log(np.abs(recon)) #it's a vector
    # print(magnitude)
    mean = np.mean(magnitude)
    # the image will be considered "blurry" if the mean value of the
    # magnitudes is less than the threshold value
    return (mean, mean <= thresh)
