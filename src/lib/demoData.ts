// lib/demoData.ts
import { Labor, Owner, Expense } from "@/lib/types";

export const demoLabors: Labor[] = [
  {
    id: "demo-l1",
    name: "شاہد حسین",
    site: "ماڈل ٹاؤن سائٹ",
    mobile: "03009998888",
    rate: 1500,
    att: 20,
    kharcha: 10000,
    attendance: [
      { date: "2026-06-01", day: "پیر" },
      { date: "2026-06-02", day: "منگل" },
    ],
    expenses: [
      { date: "2026-06-05", day: "جمعہ", amount: 5000, note: "ایڈوانس" },
      { date: "2026-06-12", day: "جمعہ", amount: 5000, note: "ایڈوانس" },
    ],
  },
  {
    id: "demo-l2",
    name: "بلال احمد",
    site: "جوہر ٹاؤن سائٹ",
    mobile: "03001112222",
    rate: 1800,
    att: 18,
    kharcha: 8000,
    attendance: [
      { date: "2026-06-03", day: "بدھ" },
      { date: "2026-06-04", day: "جمعرات" },
    ],
    expenses: [
      { date: "2026-06-10", day: "بدھ", amount: 8000, note: "ایڈوانس" },
    ],
  },
];

export const demoOwners: Owner[] = [
  {
    id: "demo-o1",
    name: "محمد اکرم",
    site: "ماڈل ٹاؤن سائٹ",
    mobile: "03001234567",
    contractTotal: 500000,
    originalContract: 450000,
    received: 200000,
    date: "2026-06-01",
    day: "پیر",
    desc: "ڈیمو ڈیٹا",
    history: [
      {
        date: "2026-06-01",
        day: "پیر",
        mobile: "03001234567",
        amount: 50000,
        type: "deal",
        desc: "اضافی کام",
      },
      {
        date: "2026-06-15",
        day: "پیر",
        mobile: "03001234567",
        amount: 200000,
        type: "receipt",
        from: "نقد",
      },
    ],
  },
  {
    id: "demo-o2",
    name: "عثمان علی",
    site: "جوہر ٹاؤن سائٹ",
    mobile: "03007654321",
    contractTotal: 750000,
    originalContract: 750000,
    received: 500000,
    date: "2026-06-05",
    day: "بدھ",
    desc: "ڈیمو ڈیٹا",
    history: [
      {
        date: "2026-06-20",
        day: "ہفتہ",
        mobile: "03007654321",
        amount: 500000,
        type: "receipt",
        from: "بینک ٹرانسفر",
      },
    ],
  },
];

export const demoExpenses: Expense[] = [
  {
    id: "demo-e1",
    name: "سیمنٹ خریداری",
    amount: 25000,
    date: "2026-06-10",
    day: "بدھ",
    site: "ماڈل ٹاؤن سائٹ",
  },
  {
    id: "demo-e2",
    name: "مزدور اوزار",
    amount: 8000,
    date: "2026-06-12",
    day: "جمعہ",
    site: "جوہر ٹاؤن سائٹ",
  },
];