
import React, { useState, useMemo } from 'react';
import type { Clinic, ServiceType } from './types';
import { screeningClinics, colonoscopyClinics } from './constants/clinicData';
import ClinicCard from './components/ClinicCard';
import { SearchIcon } from './components/icons';

const App: React.FC = () => {
  const [serviceType, setServiceType] = useState<ServiceType>('screening');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { clinics, districtOptions } = useMemo(() => {
    let data: Clinic[] = serviceType === 'screening' ? screeningClinics : [...colonoscopyClinics];

    const cityOrder: { [key: string]: number } = {
      '臺南市': 1, '嘉義市': 2, '嘉義縣': 3, '高雄市': 4,
    };

    if (serviceType === 'colonoscopy') {
      data.sort((a, b) => {
        const orderA = cityOrder[a.city] || 99;
        const orderB = cityOrder[b.city] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.district.localeCompare(b.district, 'zh-Hant');
      });
    }

    const allClinicsForService = serviceType === 'screening' ? screeningClinics : colonoscopyClinics;
    const uniqueOptionsMap = new Map<string, { city: string, district: string }>();
    allClinicsForService.forEach(c => {
        const key = `${c.city}_${c.district}`;
        if (!uniqueOptionsMap.has(key)) {
            uniqueOptionsMap.set(key, { city: c.city, district: c.district });
        }
    });

    let options = Array.from(uniqueOptionsMap.values()).map(item => ({
        value: `${item.city}_${item.district}`,
        label: item.city !== '臺南市' ? `${item.city} ${item.district}` : item.district,
        city: item.city,
        district: item.district,
    }));

    options.sort((a, b) => {
        let cityComparison = 0;
        if (serviceType === 'colonoscopy') {
            const orderA = cityOrder[a.city] || 99;
            const orderB = cityOrder[b.city] || 99;
            cityComparison = orderA - orderB;
        } else {
            cityComparison = a.city.localeCompare(b.city, 'zh-Hant');
        }
        if (cityComparison !== 0) return cityComparison;
        return a.district.localeCompare(b.district, 'zh-Hant');
    });
    
    return { clinics: data, districtOptions: options };
  }, [serviceType]);

  const { groupedClinics, sortedGroupKeys } = useMemo(() => {
    let filteredClinics = selectedArea === 'all'
      ? clinics
      : clinics.filter(c => `${c.city}_${c.district}` === selectedArea);

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase().trim();
      filteredClinics = filteredClinics.filter(clinic => 
        clinic.name.toLowerCase().includes(lowercasedQuery) ||
        clinic.address.toLowerCase().includes(lowercasedQuery)
      );
    }

    const grouped = filteredClinics.reduce((acc, clinic) => {
      const key = `${clinic.city}_${clinic.district}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(clinic);
      return acc;
    }, {} as Record<string, Clinic[]>);
    
    const keys: string[] = [];
    const seenKeys = new Set<string>();
    for (const clinic of filteredClinics) {
      const key = `${clinic.city}_${clinic.district}`;
      if (!seenKeys.has(key)) {
        keys.push(key);
        seenKeys.add(key);
      }
    }

    return { groupedClinics: grouped, sortedGroupKeys: keys };
  }, [clinics, selectedArea, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col items-center space-y-4">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              大腸癌篩檢及大腸鏡檢查院所
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              臺南市及鄰近縣市
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 font-medium">
              更新日期：115年2月5日
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center bg-slate-200/60 dark:bg-slate-800 rounded-full p-1">
              <button
                type="button"
                onClick={() => { setServiceType('screening'); setSelectedArea('all'); }}
                aria-pressed={serviceType === 'screening'}
                className={`px-6 py-1.5 text-sm font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-200/60 dark:focus:ring-offset-slate-800 ${
                  serviceType === 'screening'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                大腸癌篩檢
              </button>
              <button
                type="button"
                onClick={() => { setServiceType('colonoscopy'); setSelectedArea('all'); }}
                aria-pressed={serviceType === 'colonoscopy'}
                className={`px-6 py-1.5 text-sm font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-200/60 dark:focus:ring-offset-slate-800 ${
                  serviceType === 'colonoscopy'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                大腸鏡檢查
              </button>
            </div>
          </div>
          
          <div className="w-full max-w-md flex flex-col sm:flex-row justify-center items-center gap-2">
            <select
              id="district-select"
              aria-label="院所區域"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full sm:w-auto sm:flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-1.5 px-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">所有區域</option>
              {districtOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            
            <div className="relative w-full sm:w-auto sm:flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="search"
                id="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-1.5 pl-10 pr-3 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="搜尋院所..."
              />
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {sortedGroupKeys.length > 0 ? (
          <div className="space-y-12">
            {sortedGroupKeys.map(key => {
              const [city, district] = key.split('_');
              const headerText = city && city !== '臺南市' ? `${city} ${district}` : district;

              return (
                <section key={key} id={key}>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                    {headerText}
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {groupedClinics[key]?.map((clinic, index) => (
                      <ClinicCard key={`${clinic.name}-${index}`} clinic={clinic} />
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400">沒有找到符合條件的院所。</p>
          </div>
        )}
      </main>
       <footer className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
        <p>免費癌症篩檢諮詢專線: 0800-222-543</p>
        <p className="mt-1">資料來源：臺南市政府衛生局，僅供參考，請以各院所實際公告為準。</p>
      </footer>
    </div>
  );
};

export default App;
