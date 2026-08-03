import React, { useState } from 'react';
import { CollectionPoint, CollectionRecord, IncidentReport, User } from '../types';
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Truck,
  Scale,
  Calendar,
  Layers,
  Phone,
  UserCheck,
  Building,
  ClipboardList,
} from 'lucide-react';

interface RecyclerViewProps {
  currentUser: User;
  points: CollectionPoint[];
  records: CollectionRecord[];
  incidents: IncidentReport[];
  onAddRecord: (record: Partial<CollectionRecord>) => void;
  onAddIncident: (incident: Partial<IncidentReport>) => void;
}

export const RecyclerView: React.FC<RecyclerViewProps> = ({
  currentUser,
  points,
  records,
  incidents,
  onAddRecord,
  onAddIncident,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | null>(points[0] || null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // New Record state
  const [logWasteType, setLogWasteType] = useState('carton');
  const [logWeightKg, setLogWeightKg] = useState('15.5');
  const [logNotes, setLogNotes] = useState('');

  // New Incident state
  const [incTitle, setIncTitle] = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incCategory, setIncCategory] = useState<'contenedor_lleno' | 'contaminacion' | 'via_bloqueada' | 'otro'>('contaminacion');
  const [incSeverity, setIncSeverity] = useState<'baja' | 'media' | 'alta'>('media');

  const myRecords = records.filter((r) => r.recyclerId === currentUser.id || true);
  const totalKgCollected = myRecords.reduce((acc, r) => acc + r.weightKg, 0);

  const handleSaveCollection = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord({
      recyclerId: currentUser.id,
      recyclerName: currentUser.name,
      pointId: selectedPoint?.id,
      wasteType: logWasteType as any,
      weightKg: parseFloat(logWeightKg) || 10,
      location: selectedPoint ? `${selectedPoint.neighborhood} - ${selectedPoint.address}` : 'Zona Centro',
      notes: logNotes || 'Recolección estándar sin novedades.',
    });
    setShowLogModal(false);
    setLogNotes('');
  };

  const handleSaveIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incTitle || !incDesc) return;
    onAddIncident({
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterRole: 'reciclador',
      title: incTitle,
      description: incDesc,
      category: incCategory,
      severity: incSeverity,
    });
    setShowIncidentModal(false);
    setIncTitle('');
    setIncDesc('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Truck className="w-3.5 h-3.5" />
            <span>Panel del Reciclador de Oficio</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Gestión de Rutas & Puntos de Acopio
          </h2>
          <p className="text-xs text-slate-400">
            Consulta puntos disponibles en Medellín/Bogotá, registra material acopiado e informa incidencias operativas.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
          >
            <Scale className="w-4 h-4" /> Registrar Recolección (Kg)
          </button>
          <button
            onClick={() => setShowIncidentModal(true)}
            className="px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" /> Reportar Novedad
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Acopiado</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{totalKgCollected.toFixed(1)}</span>
          <span className="text-xs text-slate-400 ml-1">kg</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Puntos Disponibles</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {points.filter((p) => p.status === 'disponible').length}
          </span>
          <span className="text-xs text-slate-400 ml-1">ubicaciones</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Registros Realizados</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{myRecords.length}</span>
          <span className="text-xs text-slate-400 ml-1">visitas</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Novedades Abiertas</span>
          <span className="text-2xl font-bold text-red-500">{incidents.filter((i) => i.status !== 'resuelto').length}</span>
          <span className="text-xs text-slate-400 ml-1">reportes</span>
        </div>
      </div>

      {/* Main Map Simulation & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Simulated Map */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" /> Mapa de Puntos de Recolección
              </h3>
              <p className="text-xs text-slate-500">Visualización de solicitudes comunitarias en Medellín / Zona Metropolitana</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              GPS Activo
            </span>
          </div>

          {/* Interactive Visual Map Box */}
          <div className="relative h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4">
            {/* Map Grid Patterns */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Roads SVG Simulation */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-800 stroke-2 pointer-events-none">
              <path d="M 50 100 Q 200 150 400 80 T 700 200" fill="none" strokeWidth="4" className="stroke-slate-700" />
              <path d="M 150 0 V 400" fill="none" strokeWidth="3" className="stroke-slate-800" />
              <path d="M 0 250 H 800" fill="none" strokeWidth="3" className="stroke-slate-800" />
            </svg>

            {/* Map Markers */}
            {points.map((pt, idx) => {
              const topPos = 20 + (idx * 22) % 60;
              const leftPos = 15 + (idx * 28) % 70;
              const isSelected = selectedPoint?.id === pt.id;

              return (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    isSelected ? 'z-30 scale-125' : 'z-10 hover:scale-110'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl flex items-center gap-1.5 shadow-lg ${
                      pt.status === 'disponible'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : pt.status === 'en_camino'
                        ? 'bg-blue-500 text-white font-bold'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-bold whitespace-nowrap hidden sm:inline">
                      {pt.neighborhood} ({pt.estimatedKg}kg)
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Disponible para recolección</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>En ruta de recolección</span>
              </div>
            </div>
          </div>

          {/* Selected Point Details Card */}
          {selectedPoint && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Punto Seleccionado: {selectedPoint.neighborhood}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  ~{selectedPoint.estimatedKg} Kg estimados
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedPoint.title}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-amber-500" /> {selectedPoint.address}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" /> {selectedPoint.citizenName}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedPoint.citizenContact}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowLogModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aceptar y Recolectar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Collection Log History */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-500" /> Historial de Recolecciones
          </h3>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {myRecords.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Aún no has registrado recolecciones hoy.</p>
            ) : (
              myRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white capitalize">{rec.wasteType}</span>
                    <span className="font-extrabold text-amber-600 dark:text-amber-400">{rec.weightKg} Kg</span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {rec.location}
                  </p>
                  <p className="text-[10px] text-slate-400 italic">"{rec.notes}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Collection Logger Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" /> Registrar Cantidad Recolectada
            </h3>

            <form onSubmit={handleSaveCollection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Tipo de Material</label>
                <select
                  value={logWasteType}
                  onChange={(e) => setLogWasteType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  <option value="carton">Cartón Corrugado</option>
                  <option value="pet">Plástico PET / Rígido</option>
                  <option value="papel">Papel / Archivo</option>
                  <option value="vidrio">Vidrio</option>
                  <option value="metal">Metal / Latas</option>
                  <option value="electronico">RAEE / Electrónicos</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Peso Recolectado (Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={logWeightKg}
                  onChange={(e) => setLogWeightKg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Notas u Observaciones</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Ej. Material seco entregado por el portero del edificio."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Guardar Recolección
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Reporter Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-base text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Reportar Novedad en Campo
            </h3>

            <form onSubmit={handleSaveIncident} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Título de la Novedad</label>
                <input
                  type="text"
                  placeholder="Ej. Contenedor contaminado con aceites"
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Categoría</label>
                  <select
                    value={incCategory}
                    onChange={(e) => setIncCategory(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="contaminacion">Contaminación</option>
                    <option value="contenedor_lleno">Contenedor Saturado</option>
                    <option value="via_bloqueada">Vía Bloqueada</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Severidad</label>
                  <select
                    value={incSeverity}
                    onChange={(e) => setIncSeverity(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta / Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">Descripción Detallada</label>
                <textarea
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  placeholder="Escribe detalles específicos para que la administración tome medidas..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
                >
                  Enviar Novedad
                </button>
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
