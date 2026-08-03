import React, { useState, useRef } from 'react';
import { ClassificationResult } from '../types';
import { WASTE_CATEGORIES } from '../data/initialData';
import {
  X,
  Upload,
  Camera,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  RefreshCw,
  Leaf,
  Droplets,
  Zap,
} from 'lucide-react';

interface WasteClassifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassified: (result: ClassificationResult) => void;
  userId?: string;
  userName?: string;
}

export const WasteClassifierModal: React.FC<WasteClassifierModalProps> = ({
  isOpen,
  onClose,
  onClassified,
  userId = 'u-1',
  userName = 'Andrés Gómez',
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartCamera = async () => {
    try {
      setCameraActive(true);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Por favor sube un archivo de imagen.');
      setCameraActive(false);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);

        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
        setCameraActive(false);
      }
    }
  };

  const handleRunAiClassification = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          userId,
          userName,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        setResult(data.result);
        onClassified(data.result);
      } else {
        throw new Error(data.error || 'Fallo en la inferencia');
      }
    } catch (err: any) {
      setError('Error al procesar la imagen con el servidor de IA. Reintentando...');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (cameraActive && videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const categoryMeta = result ? WASTE_CATEGORIES[result.wasteType] || WASTE_CATEGORIES['pet'] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Clasificador de Residuos IA</h3>
              <p className="text-xs text-slate-500">Multimodal Vision EfficientNet / Gemini 3.6 Flash</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetModal();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Step 1: Camera or Upload */}
          {!selectedImage && !cameraActive && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Arrastra tu fotografía o haz clic para subir
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Soporta imágenes JPG, PNG o WebP de botellas, cajas, latas, empaques o residuos orgánicos.
                </p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-medium shadow-md shadow-emerald-600/20">
                  <Upload className="w-3.5 h-3.5" /> Seleccionar Imagen
                </span>
              </div>

              <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
                <span>O TAMBIÉN PUEDES</span>
                <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></span>
              </div>

              <button
                onClick={handleStartCamera}
                className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs flex items-center justify-center gap-2 transition"
              >
                <Camera className="w-4 h-4 text-emerald-500" />
                <span>Usar Cámara en Tiempo Real</span>
              </button>
            </div>
          )}

          {/* Camera View */}
          {cameraActive && (
            <div className="space-y-4 text-center">
              <div className="relative rounded-2xl overflow-hidden bg-black max-h-80 flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full max-h-80 object-cover" />
                <div className="absolute inset-0 border-2 border-emerald-500/50 pointer-events-none rounded-2xl flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-emerald-400/80 rounded-xl"></div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCapturePhoto}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <Camera className="w-4 h-4" /> Capturar Fotografía
                </button>
                <button
                  onClick={() => setCameraActive(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Selected Image Preview & Analysis trigger */}
          {selectedImage && !result && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden max-h-72 bg-slate-900 border border-slate-200 dark:border-slate-800">
                <img src={selectedImage} alt="Preview" className="w-full h-72 object-cover" />
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="font-semibold text-sm animate-pulse">Analizando residuo con IA...</p>
                    <p className="text-xs text-slate-400 mt-1">Extrayendo características morfológicas y norma de Colombia</p>
                  </div>
                )}
              </div>

              {!isProcessing && (
                <div className="flex gap-3">
                  <button
                    onClick={handleRunAiClassification}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Sparkles className="w-4 h-4" /> Clasificar Residuo
                  </button>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Cambiar Imagen
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Classification Result Display */}
          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Main Badge Result */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-5">
                <img
                  src={result.imageUrl}
                  alt={result.wasteName}
                  className="w-24 h-24 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                />
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {result.wasteType.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Confianza: <b>{result.confidence}%</b>
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {result.inferenceTimeMs}ms
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{result.wasteName}</h4>

                  {/* Colombian Bag Color Tag */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border shadow-xs" style={{
                    backgroundColor: result.bagColor === 'Blanco' ? '#f8fafc' : result.bagColor === 'Verde' ? '#f0fdf4' : result.bagColor === 'Negro' ? '#0f172a' : '#fef2f2',
                    color: result.bagColor === 'Blanco' ? '#0f172a' : result.bagColor === 'Verde' ? '#15803d' : result.bagColor === 'Negro' ? '#ffffff' : '#b91c1c',
                    borderColor: result.bagColor === 'Blanco' ? '#cbd5e1' : result.bagColor === 'Verde' ? '#86efac' : result.bagColor === 'Negro' ? '#334155' : '#fca5a5'
                  }}>
                    <span className="w-3 h-3 rounded-full border border-black/20" style={{
                      backgroundColor: result.bagColor === 'Blanco' ? '#ffffff' : result.bagColor === 'Verde' ? '#16a34a' : result.bagColor === 'Negro' ? '#1e293b' : '#dc2626'
                    }}></span>
                    <span>Bolsa / Contenedor: {result.bagColor}</span>
                  </div>
                </div>
              </div>

              {/* Colombian Norm Instructions */}
              <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Normativa Colombiana (Res. 2184 de 2019):
                </span>
                <p>{result.colombianNormNote}</p>
              </div>

              {/* Recycling Steps */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  ¿Cómo debes reciclar este residuo?
                </h5>
                <ul className="space-y-2">
                  {result.recyclingSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Environmental Impact Savings */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4" /> Impacto Ambiental Generado (Aprox. {result.estimatedWeightKg} kg)
                </h5>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-xs text-slate-500 block">CO₂ Evitado</span>
                    <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{result.co2AvoidedKg} kg</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-xs text-slate-500 block">Agua Ahorrada</span>
                    <span className="font-bold text-sm text-teal-600 dark:text-teal-400">{result.waterSavedLiters} L</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="text-xs text-slate-500 block">Energía</span>
                    <span className="font-bold text-sm text-amber-600 dark:text-amber-400">{result.energySavedKwh} kWh</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetModal}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Escanear Otro Residuo
                </button>
                <button
                  onClick={() => {
                    resetModal();
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
