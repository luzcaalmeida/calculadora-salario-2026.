import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { DailyLogEntry, PayrollCalculation, WorkerData } from '../types';
import { Download, FileSpreadsheet } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../utils/firebaseError';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ReportTabProps {
  userId: string;
  result: PayrollCalculation | null;
  workerData: WorkerData;
}

export default function ReportTab({ userId, result, workerData }: ReportTabProps) {
  const [logs, setLogs] = useState<DailyLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(collection(db, 'users', userId, 'hoursLog'));
        const snapshot = await getDocs(q);
        const fetchedLogs: DailyLogEntry[] = [];
        snapshot.forEach(docSnap => {
          fetchedLogs.push(docSnap.data() as DailyLogEntry);
        });
        // Sort by date descending
        fetchedLogs.sort((a, b) => b.date.localeCompare(a.date));
        setLogs(fetchedLogs);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${userId}/hoursLog`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [userId]);

  const exportCSV = () => {
    // 1. Logs data
    const logsHeaders = ['Data', 'Horas Trabalhadas', 'Ajudas de Custo (Diaria)'];
    const logsRows = logs.map(log => [
      log.date,
      log.normalHours.toString(),
      log.hasDailyAllowance ? 'Sim' : 'Nao'
    ]);

    // 2. Results data
    const resultRows = [];
    if (result) {
      resultRows.push(['', '', '']);
      resultRows.push(['--- Resumo do Processamento ---', '', '']);
      resultRows.push(['Remuneracao Base', `${result.basePay.toFixed(2)} €`, '']);
      resultRows.push(['Subsidios (Ferias + Natal)', `${(result.holidaySubsidyValue + result.christmasSubsidyValue).toFixed(2)} €`, '']);
      resultRows.push(['Ajudas de Custo Totais', `${result.totalAllowances.toFixed(2)} €`, '']);
      resultRows.push(['Remuneracao Bruta Total', `${result.grossSalary.toFixed(2)} €`, '']);
      resultRows.push(['Retencao de IRS', `${result.irsRetention.toFixed(2)} €`, '']);
      resultRows.push(['Seguranca Social', `${result.socialSecurity.toFixed(2)} €`, '']);
      resultRows.push(['Salario Liquido', `${result.netSalary.toFixed(2)} €`, '']);
    }

    const csvContent = [
      logsHeaders.join(','),
      ...logsRows.map(row => row.join(',')),
      ...resultRows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_horas_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 flex flex-col min-h-[600px]">
      <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-neutral-100 flex items-center gap-2 uppercase tracking-wide">
          <FileSpreadsheet className="w-5 h-5 text-cyan-500" />
          Planilha de Horas
        </h2>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium transition-colors border border-neutral-700 uppercase tracking-widest"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-8">
        
        {/* Tabela de logs */}
        <div className="flex-1 overflow-auto border border-neutral-800 bg-neutral-950/50">
          {isLoading ? (
            <div className="p-8 text-center text-neutral-500 uppercase tracking-widest text-sm">Carregando dados...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 uppercase tracking-widest text-sm">Nenhum registo encontrado.</div>
          ) : (
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="bg-neutral-900 text-neutral-400 border-b border-neutral-800 uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Horas Trabalhadas</th>
                  <th className="px-6 py-4 font-medium">Diária</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {logs.map(log => (
                  <tr key={log.date} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap">
                      {format(parseISO(log.date), "dd 'de' MMMM, yyyy", { locale: pt })}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="bg-cyan-950/30 text-cyan-400 px-2 py-1 border border-cyan-900/30">
                        {log.normalHours}h
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {log.hasDailyAllowance ? (
                        <span className="text-indigo-400">Sim</span>
                      ) : (
                        <span className="text-neutral-600">Não</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Resumo dos Valores (Resultados) */}
        {result && (
          <div className="border border-neutral-800 bg-neutral-950 p-6">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-4">Resumo do Processamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-neutral-900 border border-neutral-800">
                <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Bruto Total</div>
                <div className="text-xl font-medium text-neutral-200">{result.grossSalary.toFixed(2)} €</div>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800">
                <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Ajudas Totais</div>
                <div className="text-xl font-medium text-neutral-200">{result.totalAllowances.toFixed(2)} €</div>
              </div>
              <div className="p-4 bg-neutral-900 border border-neutral-800">
                <div className="text-xs text-neutral-500 uppercase tracking-wide mb-1">Descontos</div>
                <div className="text-xl font-medium text-red-400">{(result.irsRetention + result.socialSecurity).toFixed(2)} €</div>
              </div>
              <div className="p-4 bg-cyan-950/20 border border-cyan-900/50">
                <div className="text-xs text-cyan-600/70 uppercase tracking-wide mb-1">Líquido</div>
                <div className="text-2xl font-bold text-cyan-400">{result.netSalary.toFixed(2)} €</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
