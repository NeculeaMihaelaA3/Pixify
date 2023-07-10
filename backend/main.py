import base64
from flask import Flask, jsonify, request,send_file, make_response, Response
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime, timedelta
from processing.FFT.blur_detector_image import detect_blury
from processing.blackAndWhite import transformation
from processing.ExtractingMedata.extractingMetadata import get_metadata_from_image
from processing.ExtractingMedata.extract_pixels import extract_pixels
from processing.TextandWatermark.watermarking import add_watermark
from processing.InstanceSegmentation.instance_segmentation import image_segmentation
from processing.Conversion.image_type_conversion import convert_image_format
from processing.RemoveNoise.remove_noise import remove_noise
from processing.RedEyeRemover.removeRedEyes import red_eye_remover
import hashlib
from processing.FFT import *
import numpy as np
from io import BytesIO
from PIL import Image
# jwt creation library
import jwt as libjwt
from flask_bcrypt import Bcrypt
import os
from flask_sqlalchemy import SQLAlchemy


UPLOAD_FOLDER = "C:\\Users\\Miha\\Desktop\\Licenta_buna\\Flask\\uploads\\"
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
last_photo_uploaded = ""

app = Flask(__name__)
app.config["DEBUG"] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'

app.config['JWT_SECRET_KEY'] = "secret"
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app)

# initialize the db
db = SQLAlchemy(app)


# create db model
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(200), nullable=False)
    username = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    number = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    profile = db.Column(db.LargeBinary, nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    image_data = db.Column(db.LargeBinary, nullable=True)
    address = db.Column(db.String(300), nullable=True)
    birthdate = db.Column(db.String(100), nullable=True)
    gender = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        return '<Name %r>' % self.id


db.init_app(app)
if not os.path.exists('users.db'):
    db.create_all(app=app)
    print(f'Created database!')


def hash_password(password):
    sha256 = hashlib.sha256()
    sha256.update(password.encode('utf-8'))
    hashed_password = sha256.hexdigest()
    return hashed_password

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get("username",  None)
    password = request.json.get('password', None)

    user_db = Users.query.filter_by(username=username).all()

    if len(user_db) == 1:
        if user_db[0].password == hash_password(password):
            # creating JWT payload
            payload = {
                'exp': datetime.utcnow() + timedelta(days=365),
                'iat': datetime.utcnow(),
                'user_id': user_db[0].id
            }

            # encoding the payload
            access_token = libjwt.encode(
                payload,
                app.config.get('JWT_SECRET_KEY'),
                algorithm='HS256'
            )
            return jsonify({'access_token': access_token})
    return jsonify({'error': 'Invalid username or password'}), 401


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]

    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']
    file = request.files['file']
    with file.stream as f:
        photo_data = f.read()

    user = db.session.query(Users).filter_by(id=user_id).first()
    user.image_data = photo_data
    db.session.commit()
    return jsonify('File uploaded successfully')

@app.route('/upload_profile_photo', methods=['POST'])
def upload_profile_photo():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']

    file = request.files['file']
    with file.stream as f:
        photo_data = f.read()

    user = db.session.query(Users).filter_by(id=user_id).first()
    user.profile = photo_data
    db.session.commit()
    return jsonify('Profile photo uploaded successfully')


@app.route('/photoMetadata', methods=['POST'])
def uploadPhotoMetadata():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]
    #decoding the jwt
    payload = libjwt.decode(jwt, 'secret',  algorithms=['HS256'])
    user_id = payload['user_id']
    file = request.files['file']
    with file.stream as f:
        photo_data = f.read()

    user = db.session.query(Users).filter_by(id=user_id).first()
    user.image_data = photo_data
    db.session.commit()
    return jsonify('File for metadata was uploaded successfully in db!')


@app.route('/getmetadata', methods=['GET'])
def get_image_metadata():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]
    # decoding the jwt
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']
    #getting the user
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data
    info_dict = get_metadata_from_image(photo_data)
    info_metadata = ""
    for key in info_dict.keys():
        info_metadata += str(key) + ": " + str(info_dict[key]) + "\n"
    return jsonify(info_metadata)


@app.route('/image', methods=['GET'])
def get_image():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]
    # decoding the jwt
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data
    new_image = transformation(image_data=photo_data)
    with BytesIO() as output:
        new_image.save(output, format='JPEG')
        image_bytes = output.getvalue()
    return Response(image_bytes, mimetype='image/jpeg')


@app.route('/get_watermark', methods=['GET'])
def get_watermarked_image():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]
    header1 = request.headers.get("watermark")
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']
    #getting the user
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data

    new_image = add_watermark(image_data=photo_data, watermark_text=header1.split(" ", 1)[1])
    image_ycbcr = new_image.convert('YCbCr')
    with BytesIO() as output:
        image_ycbcr.save(output, format='JPEG')
        image_bytes = output.getvalue()

    return Response(image_bytes, mimetype='image/jpeg')


@app.route('/get_pixelplot', methods=['GET'])
def get_pixelplot():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]

    # decoding the jwt
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']

    #getting the user
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data

    red, green, blue = extract_pixels(photo_data)

    response = {
        'red': red,
        'green': green,
        'blue': blue
    }
    return jsonify(response)


@app.route('/get_detect_blurry', methods=['GET'])
def get_detect_blurry():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]

    # decoding the jwt
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']

    # getting the user
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data
    result, mean = detect_blury(image_data=photo_data)

    # Create the response with headers
    response = make_response()

    # Set the image data in the response
    with BytesIO() as output:
        result.save(output, format='JPEG')
        image_bytes = output.getvalue()

    # Set the image data and headers in the response
    response.data = image_bytes
    response.headers['Content-Type'] = str(mean)
    return response

@app.route('/get_img_segmentation', methods=['GET'])
def get_img_segmentation():

    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]

    # decoding the jwt
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']

    #getting the user
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data

    # return send_file(image_bytes, mimetype='image/jpeg') #jpeg
    result = image_segmentation(image_data=photo_data)
    with BytesIO() as output:
        result.save(output, format='JPEG')
        image_bytes = output.getvalue()

    return Response(image_bytes, mimetype='image/jpeg')


@app.route('/get_remove_noise', methods=['GET'])
def get_remove_noise():

    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]

    # decoding the jwt
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']

    #getting the user
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data

    result = remove_noise(image_data=photo_data)
    with BytesIO() as output:
        result.save(output, format='JPEG')
        image_bytes = output.getvalue()

    return Response(image_bytes, mimetype='image/jpeg')

@app.route('/get_remove_red_eyes', methods=['GET'])
def get_remove_red_eyes():

    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]

    # decoding the jwt
    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']

    #getting the user
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data

    result = red_eye_remover(image_data=photo_data)
    with BytesIO() as output:
        result.save(output, format='JPEG')
        image_bytes = output.getvalue()

    return Response(image_bytes, mimetype='image/jpeg')


@app.route('/get_convert_format', methods=['GET'])
def get_convert_format():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]

    original = request.headers.get("original").split(" ")[1]
    convert = request.headers.get("convert").split(" ")[1]
    print(convert)

    payload = libjwt.decode(jwt, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']
    user = db.session.query(Users).filter_by(id=user_id).first()
    photo_data = user.image_data
    result = convert_image_format(input_image_bytes = photo_data, new_format=convert)

    with BytesIO() as output:
        result.save(output, format=convert)
        image_bytes = output.getvalue()
    mim_type = get_mimetype(convert)

    return Response(image_bytes, mimetype = mim_type)


def get_mimetype(image_format):
    if image_format == 'JPEG':
        return 'image/jpeg'
    elif image_format == 'PNG':
        return 'image/png'
    elif image_format == 'BMP':
        return 'image/bmp'
    elif image_format == 'TIFF':
        return 'image/tiff'
    elif image_format == 'GIF':
        return 'image/gif'
    elif image_format == 'WEBP':
        return 'image/webp'


@app.route('/user', methods=['POST'])
def create_user():
    name = request.json.get('name')
    username = request.json.get('username')

    email = request.json.get('email')
    number = request.json.get('number')
    password = request.json.get('password')
    print(name, username, email, number, password)

    new_user = Users(full_name=name, username=username, email=email, number=number, password=hash_password(password))
    db.session.add(new_user)
    db.session.commit()
    return jsonify('user created succesfully')


@app.route('/save_user_data', methods=['POST'])
def save_user_date():
    header = request.headers.get("jwt")
    jwt = header.split(" ")[1]
    #decoding the jwt
    payload = libjwt.decode(jwt, 'secret',  algorithms=['HS256'])
    user_id = payload['user_id']
    user = db.session.query(Users).filter_by(id=user_id).first()

    username = request.json.get('username')
    email = request.json.get('email')
    number = request.json.get('number')
    # hash_password(password)
    password = hash_password(request.json.get('password'))
    birthdate = request.json.get('birthdate')
    address = request.json.get('address')
    gender = request.json.get('gender')

    user.username = username
    user.email = email
    user.number = number
    user.password = password
    user.birthdate = birthdate
    user.address = address
    user.gender = gender
    db.session.commit()
    return jsonify('user data updated succesfully succesfully')


@app.route('/getuser', methods=['GET', 'POST'])
def get_user():
    if request.method == 'GET':
        return jsonify('succesfully got the id')
    else:
        user_id = request.json.get('id')
        # print(user_id)
        user_db = Users.query.filter_by(id=user_id).all()
        if user_db[0].profile is not None:
            encoded_image_string = base64.b64encode(user_db[0].profile).decode('utf-8')
        else:
            encoded_image_string = ""

        user_logged = {
            'name': user_db[0].full_name,
            'username': user_db[0].username,
            'email': user_db[0].email,
            'number': user_db[0].number,
            'password': user_db[0].password,
            'profile': encoded_image_string,
            'address': user_db[0].address,
            'birthdate': user_db[0].birthdate,
            'gender': user_db[0].gender
        }
        # print(user_logged)
        return jsonify(user_logged)


@app.route('/get_usernames', methods=['GET'])
def get_usernames():
    usernames = Users.query.with_entities(Users.username).all()
    usernames_list = [username[0] for username in usernames]
    return jsonify(usernames_list)


app.run()