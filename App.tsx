import React, { useState } from 'react';
import { ClassificationResult, User } from '../types';
import { WASTE_CATEGORIES, EDUCATIONAL_ARTICLES } from '../data/initialData';
import {
  Camera,
  Upload,
  Sparkles,
  History,
  Leaf,
  Droplets,
  Zap,
  Award,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Filter,
  Search,
} from 'lucide-react';

interface CitizenViewProps {
  currentUser: User;
  classifications: ClassificationResult[];
  onOpenScanModal: () => void;
}

export const CitizenView: React.FC<CitizenViewProps> = ({
  currentUser,
  classifications,
  onOpenScanModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<typeof EDUCATIONAL_ARTICLES[0] | null>(null);

  const userClassifications = classifications.filter((c) => c.userId === currentUser.id || true); // Default all for research view

  const filteredClassifications = userClassifications.filter((item) => {
    const matchesFilter = filterType === 'all' || item.wasteType === filterType;
    const matchesSearch = item.wasteName.toLowerCase().includes(searchTerm.toLowerCase()) || item.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate totals
  const totalItems = userClassifications.length;
  const totalCo2Kg = userClassifications.reduce((acc, curr) => acc + curr.co2AvoidedKg, 0).toFixed(2);
  const totalWaterLiters = userClassifications.reduce((acc, curr) => acc + curr.waterSavedLiters, 0).toFixed(1);
  const totalWeightKg = userClassifications.reduce((acc, curr) => acc + curr.estimatedWeightKg, 0).toFixed(2);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Classifier Trigger Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inteligencia Artificial Multimodal en la Nube</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hola, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Fotografía tu residuo para clasificarlo automáticamente en milisegundos con IA, descubrir su bolsa según la normativa colombiana y sumar impacto ambiental.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onOpenScanModal}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition"
            >
              <Camera className="w-4 h-4" /> Tomar Foto / Subir Imagen
            </button>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-slate-200">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{currentUser.points || 480} EcoPuntos Acumulados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Impact Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Residuos Clasificados</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalItems}</span>
            <span className="text-xs text-slate-400 ml-1">objetos</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Material Reciclado</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalWeightKg}</span>
            <span className="text-xs text-slate-400 ml-1">kg</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">CO₂ Evitado</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalCo2Kg}</span>
            <span className="text-xs text-slate-400 ml-1">kg CO₂e</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Agua Ahorrada</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalWaterLiters}</span>
            <span className="text-xs text-slate-400 ml-1">Litros</span>
          </div>
        </div>
      </div>

      {/* Colombian Norm Quick Reference Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Código de Colores Colombia (Res. 2184 de 2019)
            </h3>
            <p className="text-xs text-slate-500">Normativa oficial para la separación de residuos en la fuente</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-white border border-slate-400 shadow-xs"></span>
              <span className="font-bold text-xs text-slate-800 dark:text-slate-100">Bolsa Blanca</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Aprovechables Limpios</p>
            <p className="text-[11px] text-slate-500">Plástico PET, Botellas, Cartón seco, Papel de archivo, Vidrio entero, Latas de aluminio.</p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600"></span>
              <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">Bolsa Verde</span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">Orgánicos Biodegradables</p>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Cáscaras de frutas/verduras, restos de hortalizas, corte de jardín, cunchos de café.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 dark:border-slate-700 bg-slate-900 text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-700"></span>
              <span className="font-bold text-xs text-white">Bolsa Negra</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-300">No Aprovechables / Basura</p>
            <p className="text-[11px] text-slate-400">Servilletas usadas, papel higiénico, cartón sucio de grasa, colillas, empaques metalizados.</p>
          </div>

          <div className="p-4 rounded-xl border border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600"></span>
              <span className="font-bold text-xs text-red-900 dark:text-red-200">Rojo / Punto Especial</span>
            </div>
            <p className="text-[11px] font-semibold text-red-700 dark:text-red-300">Peligrosos & RAEE</p>
            <p className="text-[11px] text-red-600/80 dark:text-red-400/80">Baterías, celulares, cables, medicamentos vencidos, aceite de cocina usado (Punto Azul).</p>
          </div>
        </div>
      </div>

      {/* History of Classifications */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-500" /> Historial de Clasificaciones
            </h3>
            <p className="text-xs text-slate-500">Registro histórico procesado por el modelo de visión artificial</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar residuo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="all">Todas las categorías</option>
                <option value="pet">PET / Plásticos</option>
                <option value="carton">Cartón</option>
                <option value="papel">Papel</option>
                <option value="vidrio">Vidrio</option>
                <option value="metal">Metal</option>
                <option value="organico">Orgánico</option>
                <option value="electronico">Electrónico (RAEE)</option>
              </select>
            </div>
          </div>
        </div>

        {/* List of Classification Items */}
        <div className="space-y-4">
          {filteredClassifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <p className="text-sm">No se encontraron clasificaciones en el historial.</p>
              <button
                onClick={onOpenScanModal}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Escanear tu primer residuo con IA
              </button>
            </div>
          ) : (
            filteredClassifications.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.wasteName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                        {item.wasteType}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Confianza: {item.confidence}%
                      </span>
                      <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.wasteName}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{item.colombianNormNote}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <div
                    className="px-3 py-1 rounded-lg text-xs font-bold border"
                    style={{
                      backgroundColor: item.bagColor === 'Blanco' ? '#ffffff' : item.bagColor === 'Verde' ? '#16a34a' : item.bagColor === 'Negro' ? '#0f172a' : '#dc2626',
                      color: item.bagColor === 'Blanco' ? '#0f172a' : '#ffffff',
                      borderColor: item.bagColor === 'Blanco' ? '#cbd5e1' : '#000000',
                    }}
                  >
                    Bolsa {item.bagColor}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Educational Articles & Guides */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" /> Contenido Educativo & Guías de Reciclaje
          </h3>
          <p className="text-xs text-slate-500">Artículos universitarios sobre economía circular y gestión de residuos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EDUCATIONAL_ARTICLES.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/50 transition cursor-pointer flex gap-4"
            >
              <img src={art.imageUrl} alt={art.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{art.category}</span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">{art.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{art.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <button onClick={() => setSelectedArticle(null)} className="text-xs text-slate-400 hover:text-slate-600">
                Cerrar ✕
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedArticle.title}</h3>
            <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-44 object-cover rounded-xl" />
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
