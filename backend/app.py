from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing import image
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)

# Load the pre-trained model
with open('../backend/MODEL_RMS/model_detection_rms.exe', 'rb') as f:
    model = pickle.load(f)

# function to preprocess the image
def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(256, 256))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array.astype('float32') / 255.0
    return img_array

# route to handle image prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    img_file = request.files['image']
    img_path = 'temp_img.jpg'  # Save the uploaded image temporarily
    img_file.save(img_path)
    
    # Preprocess the image
    img_array = preprocess_image(img_path)
    
    # Perform prediction
    prediction = model.predict(img_array)

    # Return prediction result
    if prediction[0][0] >= 0.5:
        result = "Patient has Alzheimer's disease"
    else:
        result = "Patient is Healthy"

    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(debug=True)
