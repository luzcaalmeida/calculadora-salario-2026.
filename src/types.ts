export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export type TaxRegime = 'Normal' | 'RNH' | 'IRS Jovem';
export type MaritalStatus = 'Não Casado' | 'Casado (Único Titular)' | 'Casado (Dois Titulares)';

export interface WorkerData {
  hourlyRate: number;
  hoursWorked: number;
  dailyAllowance: number; // Valor da diária
  daysWorked: number; // Dias com diária
  seniority: number; // Diuturnidades
  bonuses: number; // Prémios
  expenses: number; // Outras despesas
  monthlyHolidaySubsidy: number; // Subsídio de férias mensal
  monthlyChristmasSubsidy: number; // Subsídio de natal mensal
  taxRegime: TaxRegime;
  maritalStatus: MaritalStatus;
  dependents: number;
  hasDisability: boolean;
}

export interface DailyLogEntry {
  date: string; // YYYY-MM-DD
  normalHours: number;
  hasDailyAllowance: boolean;
}

export interface PayrollCalculation {
  basePay: number;
  grossSalary: number;
  taxableIncome: number;
  taxFreeIncome: number;
  irsRetention: number;
  socialSecurity: number;
  netSalary: number;
  totalAllowances: number;
  holidaySubsidyValue: number;
  christmasSubsidyValue: number;
}
