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
    currentPasswordRequired: "نیا پاسورڈ سیٹ کرنے کے لیے موجودہ پاسورڈ درج کریں",
    currentPasswordWrong: "موجودہ پاسورڈ درست نہیں ہے",
    profileUpdated: "پروفائل اپڈیٹ ہو گئی",
    profileUpdateError: "پروفائل اپڈیٹ کرنے میں خرابی پیش آئی",
    passwordRequired: "پاسورڈ درج کریں",
    adminNotConfigured: "منتظم اکاؤنٹ ابھی تک سیٹ اپ نہیں ہوا",
    enterEmail: "ای میل درج کریں",
    resetLinkGenerated: "پاسورڈ ری سیٹ کا لنک بن گیا",
    resetEmailSent: "اگر یہ ای میل رجسٹرڈ ہے تو پاسورڈ ری سیٹ کا لنک اس پر بھیج دیا گیا ہے۔ اپنا ان باکس چیک کریں۔",
    emailSendError: "ای میل بھیجنے میں خرابی پیش آئی، براہ کرم بعد میں دوبارہ کوشش کریں",
    tokenInvalidOrExpired: "لنک غلط ہے یا میعاد ختم ہو چکی ہے",
    passwordResetSuccess: "پاسورڈ کامیابی سے تبدیل ہو گیا",
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
    currentPasswordRequired: "Enter your current password to set a new one",
    currentPasswordWrong: "Current password is incorrect",
    profileUpdated: "Profile updated",
    profileUpdateError: "Error updating profile",
    passwordRequired: "Please enter a password",
    adminNotConfigured: "Admin account has not been set up yet",
    enterEmail: "Please enter an email address",
    resetLinkGenerated: "Password reset link generated",
    resetEmailSent: "If this email is registered, a reset link has been sent to it. Check your inbox.",
    emailSendError: "There was an error sending the email — please try again later",
    tokenInvalidOrExpired: "This link is invalid or has expired",
    passwordResetSuccess: "Password reset successfully",
  },
} as const;

export function getApiLocale(req: NextRequest): ApiLocale {
  const header = req.headers.get("x-locale");
  return header === "en" ? "en" : "ur";
}

export function getApiMessages(req: NextRequest) {
  return apiMessages[getApiLocale(req)];
}
