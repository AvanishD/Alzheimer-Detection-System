import React, { useState } from 'react';
import axios from 'axios';
import './ImagePrediction.css';

const MRIImagePrediction = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [predictionResult, setPredictionResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState(' ');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setFileName(file ? file.name : '');
        setErrorMessage('');
        
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);

            // Check if the file type is MRI image
            const allowedTypes = ['image/jpeg', 'image/png']; // Add more types if needed
            if (!allowedTypes.includes(selectedFile.type)) {
                setErrorMessage('Please upload a valid MRI image (JPEG or PNG)');
                return;
            }

            try {
                const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                setLoading(true);

                const { prediction } = response.data;
                setPredictionResult(prediction);

                //Clear prediction after 5 seconds
                setTimeout(() => {
                    setPredictionResult(' ');
                }, 5000);
                
                console.log("Predicton Result - ", prediction);
            } catch (error) {
                console.error('Error uploading image:', error);
                setPredictionResult('Error');
            }
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <h1>MRI Image Prediction</h1>
            <div className="form-container">
                <div className="file-input-container">
                    <label className="file-input-label">
                        Select File 
                        <input type="file" onChange={handleFileChange} className='input-file' />
                    </label>
                </div>
                <div>{fileName && <p>Uploaded File: {fileName}</p>}</div>
                <button onClick={handleUpload} className='button-upload'>Upload</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <div className="loading-container">
                {loading && <div className="loading-bar"></div>}
            </div>
            <div className="result-container">
                {predictionResult && <p className='result-text'>Prediction: {predictionResult}</p>}
            </div>
        </div>
    );
};

export default MRIImagePrediction;
