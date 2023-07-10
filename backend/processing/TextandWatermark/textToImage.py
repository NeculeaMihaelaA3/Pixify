from PIL import Image, ImageDraw, ImageFont, ImageColor

img = Image.new(mode="RGBA", size=(400,300), color='darkorange')
# img.show()

draw = ImageDraw.Draw(img)
text = "Hello World!"

# draw.text((140, 100), text)
# draw.text((140, 100), text, fill='black')
font = ImageFont.truetype('Inconsolata-Light.ttf', 162)
draw.text((1240, 1600), text, font=font, fill='white')
img.show()