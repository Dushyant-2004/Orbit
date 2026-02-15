'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, FlipHorizontal, Download, Share2, Sparkles, RefreshCw, Package } from 'lucide-react';
import { FadeIn, ScrollReveal } from '@/components/animations/PageTransition';

const arProducts = [
  {
    id: '1',
    name: 'Quantum Pro Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
    overlay: '/overlays/headphones.png',
    category: 'Audio',
  },
  {
    id: '2',
    name: 'Stellar Sunglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200',
    overlay: '/overlays/sunglasses.png',
    category: 'Eyewear',
  },
  {
    id: '3',
    name: 'Nova Smart Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    overlay: '/overlays/watch.png',
    category: 'Wearables',
  },
  {
    id: '4',
    name: 'Aura VR Glasses',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200',
    overlay: '/overlays/vr.png',
    category: 'VR/AR',
  },
];

export default function ARTryOnPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(arProducts[0]);
  const [isMirrored, setIsMirrored] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    } finally {
      setLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (isMirrored) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        setCapturedImage(canvas.toDataURL('image/png'));
      }
    }
  };

  // Download photo
  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.download = `orbit-ar-tryon-${Date.now()}.png`;
      link.href = capturedImage;
      link.click();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-neon-purple" />
              <span className="text-sm text-gray-300">AR Experience</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Virtual Try-On
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience products in augmented reality before you buy. Try on glasses, 
              headphones, watches, and more using your camera.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Camera View */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.2}>
              <div className="glass-card overflow-hidden">
                {/* Camera Container */}
                <div className="relative aspect-video bg-dark-300 flex items-center justify-center">
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      cameraActive ? 'block' : 'hidden'
                    } ${isMirrored ? 'scale-x-[-1]' : ''}`}
                  />
                  
                  {/* Hidden Canvas for capture */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Placeholder when camera is off */}
                  {!cameraActive && !capturedImage && (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">Camera Preview</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Start camera to try on products virtually
                      </p>
                      <motion.button
                        onClick={startCamera}
                        className="btn-primary flex items-center gap-2 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                      >
                        {loading ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                        Start Camera
                      </motion.button>
                    </div>
                  )}

                  {/* Captured Image Preview */}
                  <AnimatePresence>
                    {capturedImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 bg-dark-400 flex items-center justify-center"
                      >
                        <img
                          src={capturedImage}
                          alt="Captured"
                          className="max-w-full max-h-full object-contain"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AR Overlay - Demo indicator */}
                  {cameraActive && selectedProduct && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 px-3 py-1 glass-card text-xs text-neon-blue">
                        AR Mode: {selectedProduct.name}
                      </div>
                      {/* Simulated AR overlay region */}
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-dashed border-neon-blue/30 rounded-lg flex items-center justify-center">
                        <span className="text-neon-blue/50 text-xs">AR Overlay Region</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={cameraActive ? stopCamera : startCamera}
                      className={`p-3 rounded-lg transition-colors ${
                        cameraActive ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {cameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setIsMirrored(!isMirrored)}
                      className={`p-3 rounded-lg transition-colors ${
                        isMirrored ? 'bg-neon-blue text-white' : 'bg-white/10 text-gray-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={!cameraActive}
                    >
                      <FlipHorizontal className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {capturedImage ? (
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => setCapturedImage(null)}
                        className="btn-ghost"
                        whileHover={{ scale: 1.05 }}
                      >
                        Retake
                      </motion.button>
                      <motion.button
                        onClick={downloadPhoto}
                        className="p-3 glass-card text-gray-400 hover:text-white rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="p-3 glass-card text-gray-400 hover:text-white rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      onClick={capturePhoto}
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!cameraActive}
                    >
                      Capture Photo
                    </motion.button>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Product Selection */}
          <div>
            <FadeIn delay={0.4}>
              <div className="glass-card p-6">
                <h3 className="text-lg font-medium text-white mb-4">Select Product</h3>
                <div className="space-y-3">
                  {arProducts.map((product) => (
                    <motion.button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors ${
                        selectedProduct.id === product.id
                          ? 'bg-neon-blue/20 border border-neon-blue'
                          : 'bg-white/5 border border-transparent hover:bg-white/10'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-300">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="text-white font-medium">{product.name}</h4>
                        <p className="text-gray-400 text-sm">{product.category}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="glass-card p-6 mt-6">
                <h3 className="text-lg font-medium text-white mb-4">How it Works</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, text: 'Enable your camera' },
                    { step: 2, text: 'Select a product to try on' },
                    { step: 3, text: 'Position yourself in frame' },
                    { step: 4, text: 'Capture and share!' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue text-sm font-medium">
                        {item.step}
                      </div>
                      <span className="text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Note about demo */}
            <div className="mt-6 p-4 glass-card-dark border border-yellow-500/20">
              <p className="text-yellow-400/80 text-sm">
                <strong>Demo Mode:</strong> This is a UI demonstration. In production, 
                AI face detection and product overlays would be applied in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
