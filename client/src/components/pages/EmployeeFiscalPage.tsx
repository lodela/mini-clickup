import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { employeeService, EmployeeFiscalData } from '@/services/employeeService';

export default function EmployeeFiscalPage() {
  const [formData, setFormData] = useState<EmployeeFiscalData>({
    rfc: '',
    curp: '',
    fiscalCompliance: '',
    address: '',
    taxRegime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeService.updateFiscalData('current-user-id', formData);
      alert('Datos fiscales actualizados correctamente');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GlassCard variant="dialog" className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-white mb-6">Datos Fiscales (México)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/70">RFC</label>
            <input 
              className="bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/30 focus:ring-2 ring-blue-500 outline-none" 
              value={formData.rfc}
              onChange={e => setFormData({...formData, rfc: e.target.value})}
              placeholder="RFC con Homoclave"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/70">CURP</label>
            <input 
              className="bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/30 focus:ring-2 ring-blue-500 outline-none" 
              value={formData.curp}
              onChange={e => setFormData({...formData, curp: e.target.value})}
              placeholder="CURP"
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/70">Régimen Fiscal</label>
          <input 
            className="bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/30 focus:ring-2 ring-blue-500 outline-none" 
            value={formData.taxRegime}
            onChange={e => setFormData({...formData, taxRegime: e.target.value})}
            placeholder="Ej. Régimen Simplificado de Confianza"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/70">Domicilio Fiscal</label>
          <input 
            className="bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/30 focus:ring-2 ring-blue-500 outline-none" 
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            placeholder="Calle, Número, Colonia, CP, Ciudad, Estado"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-white/70">Constancia de Cumplimiento (URL/Link)</label>
          <input 
            className="bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/30 focus:ring-2 ring-blue-500 outline-none" 
            value={formData.fiscalCompliance}
            onChange={e => setFormData({...formData, fiscalCompliance: e.target.value})}
            placeholder="Link al documento PDF"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          Guardar Datos Fiscales
        </button>
      </form>
    </GlassCard>
  );
}
