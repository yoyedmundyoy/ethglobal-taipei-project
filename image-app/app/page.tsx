"use client";

import WebcamCapture from '../components/WebcamCapture';

export default function Home() {
  // const storedImage = 'https://i.ibb.co/whmnGrg1/image.png'; // Image file path

  return (
    <div>
      <h1>Face Detection and Comparison</h1>
      <WebcamCapture />
    </div>
  );
}
