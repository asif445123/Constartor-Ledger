export interface Attendance {
  date: string;
  day: string;
}

export interface LaborExpenseEntry {
  date: string;
  day: string;
  amount: number;
  note: string;
}

export interface Labor {
  id: string;
  name: string;
  rate: number;
  mobile: string;
  site: string;
  att: number;
  kharcha: number;
  attendance: Attendance[];
  expenses: LaborExpenseEntry[];
}

export interface OwnerHistoryEntry {
  date: string;
  day: string;
  mobile: string;
  amount: number;
  type: "deal" | "receipt";
  desc?: string;
  from?: string;
}

export interface Owner {
  id: string;
  name: string;
  site: string;
  mobile: string;
  contractTotal: number;
  originalContract: number;
  received: number;
  history: OwnerHistoryEntry[];
  date: string;
  day: string;
  desc: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  day: string;
  site: string;
}

export const DAY_NAMES_UR = [
  "اتوار",
  "پیر",
  "منگل",
  "بدھ",
  "جمعرات",
  "جمعہ",
  "ہفتہ",
];

export function getDayName(dateString: string): string {
  const d = new Date(dateString);
  return DAY_NAMES_UR[d.getDay()] ?? "";
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
