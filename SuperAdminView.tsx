import React from 'react';
import { UserRole } from '../types';
import {
  Leaf,
  Camera,
  MapPin,
  BarChart3,
  ShieldCheck,
  FileCode2,
  Users,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenQuickScan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  darkMode,
  onToggleDarkMode,
  onOpenQuickScan,
}) => {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'ciudadano':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'reciclador':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'administrador':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'super_admin':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ciudadano':
        return 'Ciudadano Eco';
      case 'reciclador':
        return 'Reciclador de Oficio';
      case 'administrador':
        return 'Administrador';
      case 'super_admin':
        return 'Super Admin';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 dark:from-white dark:via-emerald-300 dark:to-teal-400 bg-clip-text text-transparent">
                EcoVision AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Research v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              IA & Computación Cloud para Economía Circular
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium">
          <button
            onClick={() => onTabChange('ciudadano')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ciudadano'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Escáner IA</span>
          </button>

          <button
            onClick={() => onTabChange('reciclador')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'reciclador'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Rutas & Zonas</span>
          </button>

          <button
            onClick={() => onTabChange('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'admin'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Panel Admin</span>
          </button>

          <button
            onClick={() => onTabChange('super_admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'super_admin'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </button>

          <button
            onClick={() => onTabChange('docs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'docs'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Docs Técnicos</span>
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Scan Button */}
          <button
            onClick={onOpenQuickScan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 active:scale-95 transition"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Escanear Foto</span>
          </button>

          {/* Role Switcher Select */}
          <div className="relative flex items-center">
            <Users className="w-3.5 h-3.5 absolute left-2.5 pointer-events-none text-slate-400" />
            <select
              value={currentRole}
              onChange={(e) => {
                const role = e.target.value as UserRole;
                onRoleChange(role);
                if (role === 'ciudadano') onTabChange('ciudadano');
                else if (role === 'reciclador') onTabChange('reciclador');
                else if (role === 'administrador') onTabChange('admin');
                else if (role === 'super_admin') onTabChange('super_admin');
              }}
              className={`pl-8 pr-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer appearance-none ${getRoleBadgeColor(
                currentRole
              )}`}
            >
              <option value="ciudadano">Rol: Ciudadano</option>
              <option value="reciclador">Rol: Reciclador</option>
              <option value="administrador">Rol: Administrador</option>
              <option value="super_admin">Rol: Super Admin</option>
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Cambiar tema claro/oscuro"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-1.5 text-[11px] font-medium bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => onTabChange('ciudadano')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'ciudadano' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
        >
          <Camera className="w-4 h-4" />
          <span>Escáner</span>
        </button>
        <button
          onClick={() => onTabChange('reciclador')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'reciclador' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500'}`}
        >
          <MapPin className="w-4 h-4" />
          <span>Mapa</span>
        </button>
        <button
          onClick={() => onTabChange('admin')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'admin' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Admin</span>
        </button>
        <button
          onClick={() => onTabChange('docs')}
          className={`flex flex-col items-center gap-0.5 ${activeTab === 'docs' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}`}
        >
          <FileCode2 className="w-4 h-4" />
          <span>Docs</span>
        </button>
      </div>
    </header>
  );
};
