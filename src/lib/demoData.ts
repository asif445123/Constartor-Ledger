// lib/demoData.ts
import { Labor, Owner, Expense } from "@/lib/types";

export const demoLabors: Labor[] = [
  {
    id: "demo-l1",
    name: "Shahid Hussain",
    site: "Model Town",
    mobile: "03009998888",
    rate: 1500,
    att: 20,
    kharcha: 10000,
    attendance: [
      { date: "2026-06-01", day: "Monday" },
      { date: "2026-06-02", day: "Tuesday" },
    ],
    expenses: [
      { date: "2026-06-05", day: "Wednesday", amount: 5000, note: "Advance" },
      { date: "2026-06-12", day: "Wednesday", amount: 5000, note: "Advance" },
    ],
  },
  {
    id: "demo-l2",
    name: "بلال احمد",
    site: "جوہر ٹاؤن ",
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
    name: "Muhammad Akram",
    site: "Model Town",
    mobile: "03001234567",
    contractTotal: 500000,
    originalContract: 450000,
    received: 200000,
    date: "2026-06-01",
    day: "Monday",
    desc: "Demo Data",
    history: [
      {
        date: "2026-06-01",
        day: "Monday",
        mobile: "03001234567",
        amount: 50000,
        type: "deal",
        desc: "New Stairs",
      },
      {
        date: "2026-06-15",
        day: "Monday",
        mobile: "03001234567",
        amount: 200000,
        type: "receipt",
        from: "Cash",
      },
    ],
  },
  {
    id: "demo-o2",
    name: "عثمان علی",
    site: "جوہر ٹاؤن ",
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
    name: "Purchase of Cement",
    amount: 25000,
    date: "2026-06-10",
    day: "Wednesday",
    site: "Model Town",
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