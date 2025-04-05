"use client";

import { useState } from "react";
import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";

export default function ScannerPage() {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  const devices = useDevices();

  function getTracker() {
    const cleanTracker = tracker?.startsWith('^') ? tracker.substring(1) : tracker;
    switch (cleanTracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const handleScan = (data: string) => {
    if (!pause) {
      const cleanData = data.startsWith('^') ? data.substring(1) : data;
      setQrData(cleanData);
    }
  };

  const handlePauseToggle = () => {
    setPause(!pause);
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #fff2e1, #f1ecfc, #ebfdf7)",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          width: "100%",
          padding: "0px 30px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid  rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src="/ethglobal-logo-vector.png"
          alt="Logo"
          style={{width: "160px" }}
        />
      </div>

      {/* Page Title Section */}
      <div style={{ textAlign: "center", padding: "40px 20px 10px" }}>
        <h1 className="text-4xl mb-2 lg:mb-3 lg:text-6xl font-bold">
          Scan Your QR Code
        </h1>
        <p className="lg:text-lg text-black-500 font-medium">
          Easily verify your participation at ETHGlobal events
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "30px",
          gap: "40px",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            width: "600px",
            border: "2px solid black",
          }}
        >
          <div style={{ position: "relative" }}>
            <Scanner
              formats={["qr_code"]}
              constraints={{ deviceId }}
              onScan={(detectedCodes) => {
                handleScan(detectedCodes[0].rawValue);
              }}
              onError={(error) => console.log(`onError: ${error}`)}
              styles={{
                container: { 
                  height: "400px", 
                  width: "400px", 
                  margin: "auto",
                  opacity: pause ? 0.5 : 1,
                  transition: "opacity 0.3s ease",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                },
                video: {
                  borderRadius: "12px",
                }
              }}
              components={{
                tracker: getTracker()            
              }}
              allowMultiple={false}
              scanDelay={1500}
              paused={pause}
            />
            {pause && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
              >
                Scanner Paused
              </div>
            )}
          </div>

          <h3 style={{ marginTop: 20, color: "#555" }}>
            Scan your EthGlobal QR Code 
          </h3>
          <p style={{ color: "#555" }}>
            Verify your identity with your EthGlobal QR Code.
          </p>

          {/* Controls Section */}
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
            <button
              onClick={handlePauseToggle}
              style={{
                backgroundColor: pause ? "#c6c9f6" : "#fca4a4",
                color: pause ? "#0a0a0a" : "#0a0a0a",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "10px",
                width: "400px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <img
                src="/qr-code-scan.png"
                alt="QR Scanner"
                style={{
                  width: "20px",
                  height: "20px",
                  filter: "none",
                }}
              />
              {pause ? "Enable Scanner" : "Disable Scanner"}
            </button>
          </div>

          {qrData && (
            <div>
              <h4>Scanned QR Data:</h4>
              <div
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: "10px",
                  borderRadius: "6px",
                  wordWrap: "break-word",
                }}
              >
                {qrData}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
