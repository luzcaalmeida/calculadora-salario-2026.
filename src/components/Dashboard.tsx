import React, { useState } from 'react';
import { User, WorkerData, PayrollCalculation } from '../types';
import { calculatePayroll } from '../utils/payroll';
import EmployeeForm from './EmployeeForm';
import DailyHoursCalendar from './DailyHoursCalendar';
import PayrollResult from './PayrollResult';
import ReportTab from './ReportTab';
import { Calculator, LogOut, LayoutDashboard, FileSpreadsheet } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const defaultWorkerData: WorkerData = {
  hourlyRate: 10,
  hoursWorked: 0,
  dailyAllowance: 60,
  daysWorked: 0,
  seniority: 0,
  bonuses: 0,
  expenses: 0,
  monthlyHolidaySubsidy: 0,
  monthlyChristmasSubsidy: 0,
  taxRegime: 'Normal',
  maritalStatus: 'Não Casado',
  dependents: 0,
  hasDisability: false,
};

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'calculator' | 'report'>('calculator');
  const [workerData, setWorkerData] = useState<WorkerData>(defaultWorkerData);
  const [result, setResult] = useState<PayrollCalculation | null>(null);

  const handleCalculate = () => {
    const calcResult = calculatePayroll(workerData);
    setResult(calcResult);
  };

  const handleApplyCalendarTotals = (totalHours: number, totalAllowanceDays: number) => {
    setWorkerData(prev => ({
      ...prev,
      hoursWorked: totalHours,
      daysWorked: totalAllowanceDays,
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-cyan-500/30">
      <header className="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-950 border border-cyan-800 rounded-none flex items-center justify-center">
              <Calculator className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-100 leading-tight tracking-tight uppercase">Calculadora de Salários</h1>
              <p className="text-xs text-neutral-500 font-medium hidden sm:block tracking-widest uppercase">Cálculo de Vencimentos em Horas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-neutral-300">{user.name}</p>
              <p className="text-xs text-neutral-500">{user.company}</p>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-400 hover:text-cyan-400 hover:bg-cyan-950/30 rounded-none border border-transparent hover:border-cyan-900 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">TERMINAR SESSÃO</span>
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 border-t border-neutral-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-3 text-xs tracking-widest uppercase font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'calculator' 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Calculadora
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`py-3 text-xs tracking-widest uppercase font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'report' 
                ? 'border-cyan-400 text-cyan-400' 
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Planilha & Relatório
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calculator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <DailyHoursCalendar 
                userId={user.id} 
                onApplyTotals={handleApplyCalendarTotals} 
              />
              
              <EmployeeForm 
                data={workerData} 
                onChange={setWorkerData} 
                onCalculate={handleCalculate} 
              />
            </div>
            
            <div className="lg:col-span-4">
              <div className="sticky top-40">
                <PayrollResult result={result} />
              </div>
            </div>
          </div>
        ) : (
          <ReportTab userId={user.id} result={result} workerData={workerData} />
        )}
      </main>
    </div>
  );
}
