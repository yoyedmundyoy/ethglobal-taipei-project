'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FaceVerification() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw the current video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert canvas to base64 image
                const imageData = canvas.toDataURL('image/jpeg');
                setCapturedImage(imageData);

                // Stop the camera stream
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        startCamera();
    };

    return (
        <div style={{
            background: "linear-gradient(to right, #fff2e1, #f1ecfc, #ebfdf7)",
            minHeight: "100vh",
            fontFamily: "Arial, sans-serif",
        }}>
            {/* Top Bar */}
            <div style={{
                width: "100%",
                padding: "0px 30px",
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            }}>
                <img
                    src="/ethglobal-logo-vector.png"
                    alt="Logo"
                    style={{ width: "160px" }}
                />
            </div>

            {/* Page Title Section */}
            <div style={{ textAlign: "center", padding: "40px 20px 10px" }}>
                <h1 className="text-4xl mb-2 lg:mb-3 lg:text-6xl font-bold">
                    Face Verification
                </h1>
                <p className="lg:text-lg text-black-500 font-medium">
                    Take a photo to verify your identity
                </p>
            </div>

            {/* Main Card */}
            <div className="flex justify-center items-center p-4">
                <div style={{
                    backgroundColor: "#ffffff",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    width: "600px",
                    border: "2px solid black"
                }}>
                    <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                        {!capturedImage ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="w-full h-full object-cover"
                            />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="flex justify-center gap-4">
                        {!capturedImage ? (
                            <button
                                onClick={captureImage}
                                className="bg-[#c6c9f6] text-black font-bold py-2 px-6 rounded-full"
                            >
                                Take Photo
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={retakePhoto}
                                    className="bg-gray-200 text-black font-bold py-2 px-6 rounded-full"
                                >
                                    Retake
                                </button>
                                <button
                                    onClick={() => router.push('/verified')}
                                    className="bg-[#c6c9f6] text-black font-bold py-2 px-6 rounded-full"
                                >
                                    Use Photo
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
