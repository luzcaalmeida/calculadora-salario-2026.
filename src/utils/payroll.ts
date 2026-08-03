import { WorkerData, PayrollCalculation } from '../types';

export function calculatePayroll(data: WorkerData): PayrollCalculation {
  // Remuneração base
  const basePay = data.hoursWorked > 0 ? data.hoursWorked * data.hourlyRate : data.baseSalary;
  
  // Ajudas de Custo (Diárias)
  // Assumindo um limite não tributável genérico de 62.75€ para obras no estrangeiro.
  const nonTaxableLimitPerDay = 62.75; 
  const totalAllowances = data.dailyAllowance * data.daysWorked;
  
  const taxFreeAllowances = Math.min(data.dailyAllowance, nonTaxableLimitPerDay) * data.daysWorked;
  const taxableAllowances = Math.max(0, data.dailyAllowance - nonTaxableLimitPerDay) * data.daysWorked;
  
  // Duodécimos dos subsídios (usando baseSalary como referência ou basePay)
  // Usualmente é o baseSalary ou o valor que receberia no mês.
  const referenceSalary = data.baseSalary > 0 ? data.baseSalary : basePay;
  const holidaySubsidyValue = (referenceSalary / 12) * (data.holidaySubsidyPercentage / 100);
  const christmasSubsidyValue = (referenceSalary / 12) * (data.christmasSubsidyPercentage / 100);
  
  // Rendimento Tributável
  const taxableIncome = basePay + data.seniority + data.bonuses + taxableAllowances + holidaySubsidyValue + christmasSubsidyValue;
  
  // Rendimento Não Tributável
  const taxFreeIncome = taxFreeAllowances + data.expenses;
  
  // Remuneração Bruta
  const grossSalary = taxableIncome + taxFreeIncome;
  
  // Segurança Social (11% a cargo do trabalhador sobre a base tributável)
  const socialSecurity = taxableIncome * 0.11;
  
  // Simulação de Retenção na Fonte de IRS
  // Nota: Estas são taxas simplificadas para efeitos de protótipo.
  let irsRate = 0.15; // taxa base 15%
  
  if (data.maritalStatus === 'Casado (Único Titular)') irsRate -= 0.02; // Menos retenção
  if (data.dependents > 0) irsRate -= (data.dependents * 0.015); // Menos retenção por dependente
  if (data.hasDisability) irsRate -= 0.03; // Benefício por deficiência
  
  if (data.taxRegime === 'IRS Jovem') {
    irsRate *= 0.5; // Redução simplificada do IRS Jovem
  } else if (data.taxRegime === 'RNH') {
    irsRate = 0.20; // Taxa fixa RNH 20%
  }
  
  // Garantir que a taxa não é negativa
  irsRate = Math.max(0, irsRate); 
  
  const irsRetention = taxableIncome * irsRate;
  
  // Salário Líquido
  const netSalary = grossSalary - socialSecurity - irsRetention;
  
  return {
    basePay,
    grossSalary,
    taxableIncome,
    taxFreeIncome,
    irsRetention,
    socialSecurity,
    netSalary,
    totalAllowances,
    holidaySubsidyValue,
    christmasSubsidyValue,
  };
}
