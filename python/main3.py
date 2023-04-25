#!/usr/bin/env python3

#ref: https://github.com/ageitgey/face_recognition/blob/master/examples/identify_and_draw_boxes_on_faces.py

import face_recognition
from PIL import Image, ImageDraw
import numpy as np

# This is an example of running face recognition on a single image
# and drawing a box around each person that was identified.

# Load a sample picture and learn how to recognize it.
print("loading images and encodings creation")
mamma_image = face_recognition.load_image_file("./known_people/mamma_1.jpg")
mamma_face_encoding = face_recognition.face_encodings(mamma_image)[0]

papa_image = face_recognition.load_image_file("./known_people/papa_1.jpg")
papa_face_encoding = face_recognition.face_encodings(papa_image)[0]

giovanni_image = face_recognition.load_image_file("./known_people/giovanni_1.jpg")
giovanni_face_encoding = face_recognition.face_encodings(giovanni_image)[0]

gregorio_image = face_recognition.load_image_file("./known_people/gregorio_1.jpg")
gregorio_face_encoding = face_recognition.face_encodings(gregorio_image)[0]

virginia_image = face_recognition.load_image_file("./known_people/virginia_1.jpg")
virginia_face_encoding = face_recognition.face_encodings(virginia_image)[0]

vittorio_image = face_recognition.load_image_file("./known_people/vittorio_1.jpg")
vittorio_face_encoding = face_recognition.face_encodings(vittorio_image)[0]

rachele_image = face_recognition.load_image_file("./known_people/rachele_1.jpg")
rachele_face_encoding = face_recognition.face_encodings(rachele_image)[0]

mattia_image = face_recognition.load_image_file("./known_people/mattia_1.jpg")
mattia_face_encoding = face_recognition.face_encodings(mattia_image)[0]

angeles_image = face_recognition.load_image_file("./known_people/angeles_1.jpg")
angeles_face_encoding = face_recognition.face_encodings(angeles_image)[0]

nicola_image = face_recognition.load_image_file("./known_people/nicola_o_1.jpg")
nicola_face_encoding = face_recognition.face_encodings(nicola_image)[0]

# Create arrays of known face encodings and their names
known_face_encodings = [
    mamma_face_encoding,
    papa_face_encoding,
    giovanni_face_encoding,
    gregorio_face_encoding,
    virginia_face_encoding,
    vittorio_face_encoding,
    rachele_face_encoding,
    mattia_face_encoding,
    angeles_face_encoding,
    nicola_face_encoding
]
known_face_names = [
    "mamma",
    "papa",
    "giovanni",
    "gregorio",
    "virginia",
    "vittorio",
    "rachele",
    "mattia",
    "angeles",
    "nicola"
]

print("loading unknown images")

# Load an image with an unknown face
#unknown_image_filename = "./unknown_people/IMG20210829120524_scaled_50.jpg"
unknown_image_filename = "IMG_20210823_214810311.jpg"
unknown_image = face_recognition.load_image_file( "./unknown_people/" + unknown_image_filename )

# Find all the faces and face encodings in the unknown image
print("finding face location in image")
face_locations = face_recognition.face_locations(unknown_image)
face_encodings = face_recognition.face_encodings(unknown_image, face_locations)

num_of_faces = len(face_locations)
print("in image {} I've found {} faces!".format(unknown_image_filename, num_of_faces) )


if num_of_faces > 0:
	# Convert the image to a PIL-format image so that we can draw on top of it with the Pillow library
	# See http://pillow.readthedocs.io/ for more about PIL/Pillow
	pil_image = Image.fromarray(unknown_image)
	# Create a Pillow ImageDraw Draw instance to draw with
	draw = ImageDraw.Draw(pil_image)

	# Loop through each face found in the unknown image
	for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
	    # See if the face is a match for the known face(s)
	    matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

	    name = "Unknown"

	    # If a match was found in known_face_encodings, just use the first one.
	    # if True in matches:
	    #     first_match_index = matches.index(True)
	    #     name = known_face_names[first_match_index]

	    # Or instead, use the known face with the smallest distance to the new face
	    face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
	    best_match_index = np.argmin(face_distances)
	    if matches[best_match_index]:
	        name = known_face_names[best_match_index]

	    # Draw a box around the face using the Pillow module
	    draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 255))

	    # Draw a label with a name below the face
	    #text_width, text_height = draw.textsize(name)
	    #draw.rectangle(((left, bottom - text_height - 10), (right, bottom)), fill=(0, 0, 255), outline=(0, 0, 255))
	    #draw.text((left + 6, bottom - text_height - 5), name, fill=(255, 255, 255, 255))

	    face_image = unknown_image[top:bottom, left:right]
	    face_pil_image = Image.fromarray(face_image)
	    face_pil_image.save("./faces_crops/" + name + ".jpg")


# Remove the drawing library from memory as per the Pillow docs
del draw

# Display the resulting image
#pil_image.show()

# You can also save a copy of the new image to disk if you want by uncommenting this line
#pil_image.save("image_with_boxes.jpg")
