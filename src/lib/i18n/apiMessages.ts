import { NextRequest } from "next/server";

export type ApiLocale = "ur" | "en";

export const apiMessages = {
  ur: {
    loginRequired: "لاگ ان ضروری ہے",
    forbidden: "اجازت نہیں ہے",
    badRequest: "غلط درخواست",
    userNotFound: "صارف نہیں ملا",
    fillNameEmailPassword: "نام، ای میل اور پاسورڈ درج کریں",
    passwordTooShort: "پاسورڈ کم از کم 6 حروف کا ہونا چاہیے",
    emailAlreadyRegistered: "یہ ای میل پہلے سے رجسٹرڈ ہے",
    accountCreatedPending: "اکاؤنٹ بن گیا! لاگ ان کرنے سے پہلے منتظم کی منظوری کا انتظار کریں۔",
    registerError: "رجسٹریشن میں خرابی پیش آئی",
    fillEmailPassword: "ای میل اور پاسورڈ درج کریں",
    invalidCredentials: "غلط ای میل یا پاسورڈ",
    accountPending: "آپ کا اکاؤنٹ ابھی زیر جائزہ ہے۔ براہ کرم منتظم کی منظوری کا انتظار کریں۔",
    accountRejected: "آپ کا اکاؤنٹ منتظم نے مسترد کر دیا ہے۔",
    loginError: "لاگ ان میں خرابی پیش آئی",
    fillNameSite: "نام اور سائٹ لکھیں",
    ownerNotFound: "مالک نہیں ملا",
    enterAmount: "رقم درج کریں",
    laborNotFound: "مزدور نہیں ملا",
    fillDetails: "تفصیل درج کریں",
    enterDate: "تاریخ درج کریں",
    fillItemAmountSite: "آئٹم، رقم اور سائٹ لکھیں!",
    expenseNotFound: "خرچہ نہیں ملا",
  },
  en: {
    loginRequired: "Login required",
    forbidden: "Access denied",
    badRequest: "Invalid request",
    userNotFound: "User not found",
    fillNameEmailPassword: "Please enter name, email, and password",
    passwordTooShort: "Password must be at least 6 characters",
    emailAlreadyRegistered: "This email is already registered",
    accountCreatedPending: "Account created! Please wait for admin approval before logging in.",
    registerError: "An error occurred during registration",
    fillEmailPassword: "Please enter email and password",
    invalidCredentials: "Invalid email or password",
    accountPending: "Your account is still under review. Please wait for admin approval.",
    accountRejected: "Your account was rejected by the admin.",
    loginError: "An error occurred during login",
    fillNameSite: "Please enter name and site",
    ownerNotFound: "Owner not found",
    enterAmount: "Please enter an amount",
    laborNotFound: "Laborer not found",
    fillDetails: "Please fill in the details",
    enterDate: "Please enter a date",
    fillItemAmountSite: "Please fill in item, amount, and site!",
    expenseNotFound: "Expense not found",
  },
} as const;

export function getApiLocale(req: NextRequest): ApiLocale {
  const header = req.headers.get("x-locale");
  return header === "en" ? "en" : "ur";
}

export function getApiMessages(req: NextRequest) {
  return apiMessages[getApiLocale(req)];
}
