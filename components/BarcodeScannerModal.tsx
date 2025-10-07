import React, { useState, useEffect, useRef } from 'react';
import { getFoodNutritionFromBarcode } from '../services/geminiService';
import type { FoodInfo } from '../types';
import { CloseIcon, BarcodeIcon } from './Icons';
import Loader from './Loader';

interface BarcodeScannerModalProps {
  onClose: () => void;
  onFoodScanned: (food: FoodInfo) => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose, onFoodScanned }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedFood, setScannedFood] = useState<FoodInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check your browser permissions.");
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSimulateScan = async () => {
    setIsLoading(true);
    setError(null);
    setScannedFood(null);

    // In a real app, a library like jsQR would read from the video stream.
    // Here we simulate finding a barcode.
    const simulatedBarcode = '0123456789012'; 

    try {
      const foodData = await getFoodNutritionFromBarcode(simulatedBarcode);
      if (foodData) {
        setScannedFood(foodData);
      } else {
        setError(`Could not find a product for barcode: ${simulatedBarcode}.`);
      }
    } catch (err) {
      setError("An error occurred while fetching nutrition data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = () => {
    if (scannedFood) {
      onFoodScanned(scannedFood);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-dark-card rounded-2xl w-full max-w-lg border border-dark-border shadow-2xl flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-dark-border">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarcodeIcon className="w-6 h-6 text-brand-primary" />
            Barcode Scanner
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dark-border transition-colors" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-6">
          <div className="relative w-full aspect-video bg-dark-bg rounded-lg overflow-hidden border border-dark-border mb-4">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
            {!stream && !error && <div className="absolute inset-0 flex items-center justify-center"><Loader /></div>}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-1/3 border-2 border-dashed border-brand-primary rounded-lg opacity-75"></div>
            </div>
          </div>
          
          {error && <p className="text-center text-red-400 mb-4">{error}</p>}

          {scannedFood && (
            <div className="bg-dark-bg p-4 rounded-lg text-center mb-4 border border-dark-border">
                <p className="font-semibold text-light-text">Found: {scannedFood.name}</p>
                <p className="text-medium-text">{scannedFood.calories} calories</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSimulateScan}
              className="w-full bg-brand-secondary text-dark-bg font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? <Loader size="sm" /> : 'Simulate Scan'}
            </button>
            <button
              onClick={handleAddFood}
              className="w-full bg-brand-primary text-dark-bg font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!scannedFood}
            >
              Add to Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;