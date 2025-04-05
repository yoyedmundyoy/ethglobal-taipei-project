import { useEffect, useRef, useState } from 'react';
import Webcam from 'webcam-easy';
import * as faceapi from 'face-api.js';

export default function WebcamCapture() {
  const [isLoading, setIsLoading] = useState(true);
  const [similarity, setSimilarity] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/refs/heads/master/weights/ssd_mobilenetv1_model-weights_manifest.json');
      await faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/refs/heads/master/weights/face_recognition_model-weights_manifest.json');
      await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/refs/heads/master/weights/face_landmark_68_model-weights_manifest.json');
      setIsLoading(false);
    };
    
    loadModels();
  }, []);
  
  // Set up webcam stream
  useEffect(() => {
    const webcam = new Webcam(webcamRef.current, 'user');
    webcam.start();
    
    return () => {
      webcam.stop();
    };
  }, []);
  
  const handleFaceDetection = async () => {
    if (!faceapi || isLoading) return;
  
    // Detect faces, landmarks, and descriptors from the webcam feed
    const detections = await faceapi
      .detectAllFaces(webcamRef.current, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptors();
  
    if (detections.length > 0) {
      // Publicly hosted image URL
      const storedImageURL = 'https://i.ibb.co/TqPYkGWh/image.png';
  
      // Fetch the image from the URL
      const image = await faceapi.fetchImage(storedImageURL);
  
      // Get face descriptor from the stored image
      const storedImageDescriptor = await faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();  // Make sure we're calling this on the detected face.
  
      if (storedImageDescriptor) {
        // Compare the detected face with the stored image's descriptor
        const faceMatcher = new faceapi.FaceMatcher(storedImageDescriptor);
        const match = faceMatcher.findBestMatch(detections[0].descriptor);
  
        // Update similarity score
        setSimilarity(match.toString());
      }
    }
  
    // Redraw the canvas to show face detections
    faceapi.matchDimensions(canvasRef.current, webcamRef.current.videoWidth, webcamRef.current.videoHeight);
    faceapi.draw.drawDetections(canvasRef.current, detections);
    faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);
  };
  
  

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        handleFaceDetection();
      }, 1000); // Check every 1 second
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div>
      {isLoading && <p>Loading face-api.js models...</p>}
      <div style={{ position: 'relative' }}>
        <video ref={webcamRef} width="640" height="480" autoPlay />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>
      {similarity && <p>Similarity score: {similarity}</p>}
    </div>
  );
}
