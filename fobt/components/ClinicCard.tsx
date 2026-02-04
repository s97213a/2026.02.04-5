
import React from 'react';
import type { Clinic } from '../types';
import { MapPinIcon, PhoneIcon } from './icons';

interface ClinicCardProps {
  clinic: Clinic;
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}`;
  const telUrl = `tel:${clinic.phone.replace(/#/,',')}`;

  const ActionButton: React.FC<{ href: string; label: string; children: React.ReactNode, bgColorClass: string, textColorClass: string, hoverBgColorClass: string }> = ({ href, label, children, bgColorClass, textColorClass, hoverBgColorClass }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${bgColorClass} ${textColorClass} ${hoverBgColorClass}`}
    >
      {children}
    </a>
  );

  return (
    <li className="bg-white dark:bg-slate-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="p-4 sm:p-5 flex-grow">
        <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{clinic.name}</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{clinic.address}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{clinic.phone}</p>
      </div>
      <div className="px-4 pb-4 sm:px-5 flex justify-end items-center space-x-3">
        <ActionButton href={mapUrl} label={`查看 ${clinic.name} 的地圖`} bgColorClass="bg-blue-100 dark:bg-blue-900/50" textColorClass="text-blue-600 dark:text-blue-400" hoverBgColorClass="hover:bg-blue-200 dark:hover:bg-blue-800/60">
          <MapPinIcon className="w-5 h-5" />
        </ActionButton>
        <ActionButton href={telUrl} label={`撥打電話給 ${clinic.name}`} bgColorClass="bg-green-100 dark:bg-green-900/50" textColorClass="text-green-600 dark:text-green-400" hoverBgColorClass="hover:bg-green-200 dark:hover:bg-green-800/60">
          <PhoneIcon className="w-5 h-5" />
        </ActionButton>
      </div>
    </li>
  );
};

export default ClinicCard;
