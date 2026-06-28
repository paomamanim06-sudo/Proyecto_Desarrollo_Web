import React from 'react';
import { Shield, Mail, Phone, MapPin, Globe, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo e Intro */}
          <div className="space-y-4 col-span-1 md:col-span-1.5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/10">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">UNAMAD Conecta</span>
                <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider -mt-1">Apoyo Estudiantil</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              La plataforma integral de apoyo académico y gestión estudiantil para toda la comunidad universitaria de la Universidad Nacional Amazónica de Madre de Dios (UNAMAD).
            </p>
          </div>

          {/* Enlaces de Interés */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Enlaces Universitarios</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="https://www.unamad.edu.pe" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portal Institucional</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">Sistema SIGU</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">Aula Virtual Moodle</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">Repositorio Institucional</a>
              </li>
            </ul>
          </div>

          {/* Canales de Apoyo */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Canales de Apoyo</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Defensoría Universitaria</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Bienestar Estudiantil</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Soporte Tecnológico (OTI)</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition-colors cursor-pointer">Preguntas Frecuentes</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contacto UNAMAD</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Av. Jorge Chávez N° 1160, Puerto Maldonado, Madre de Dios - Perú</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>(082) 571160 - Central</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>soporte@unamad.edu.pe</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Separador y Copy */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} UNAMAD Conecta. Desarrollado para uso académico y de soporte estudiantil.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-300">Términos de Uso</a>
            <a href="#" className="hover:text-slate-300">Política de Privacidad</a>
            <a href="#" className="hover:text-slate-300">Ayuda</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
