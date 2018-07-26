import os
from flask import Flask, flash, request, redirect, url_for, send_from_directory, render_template, jsonify
from werkzeug.utils import secure_filename
import photohash

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
ROOT_DIRECTORY = os.path.dirname(__file__)
UPLOAD_FOLDER = ROOT_DIRECTORY + '/tmp'
similarity_offset = 4

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if request.files.__len__ == 0:
            flash('No file part')
            return redirect(request.url)
        files = request.files;
        # if user does not select file, browser also
        # submit an empty part without filename
        file_paths = []
        for key, file in files.items():
            if file.filename == '':
                flash('No selected file')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                file.save(path)
                file_paths.append(path)

        distance = photohash.distance(file_paths[0], file_paths[1])
        
        if distance <= similarity_offset:
            return jsonify(similar=True)
        else:
            return jsonify(similar=False)
            
                                                
    return render_template('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)
