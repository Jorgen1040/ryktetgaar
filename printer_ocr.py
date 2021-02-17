import pytesseract
import os
import glob
from shutil import copy2

basepath = "./ryktet-går-kort/Cropped"
words = ""
i = 0

for file in glob.iglob("./ryktet-går-kort/Cropped/**/*.png", recursive=True):
    i += 1
    print(file)
    copy2(file, f"./kort/{i}.png")
    words += pytesseract.image_to_string(file, lang="nor")

with open("./kort/ocr.txt", "w") as f:
    f.write(words)
