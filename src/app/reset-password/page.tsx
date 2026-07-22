"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import "@/app/login/auth.css";

function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setMessage({ text: t.resetPassword.missingToken, type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ text: t.resetPassword.passwordMismatch, type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });
    const result = await resetPassword(token, password);
    if (result.ok) {
      setSuccess(true);
    } else {
      setMessage({ text: result.message || t.authContext.loginFailed, type: "error" });
    }
    setIsLoading(false);
  }

  return (
    <div className="auth-container blueprint-grid">
      <button
        type="button"
        onClick={() => setLocale(locale === "ur" ? "en" : "ur")}
        style={{ position: "absolute", top: 16, insetInlineEnd: 16, zIndex: 10 }}
        className="link-button"
      >
        {locale === "ur" ? "English" : "اردو"}
      </button>
      <div className="auth-wrapper">
        <div className="auth-card tick-corners">
          <div className="card-header" />
          <div className="card-content">
            {success ? (
              <div className="status-card pending">
                <div className="status-icon">✅</div>
                <h3 className="status-title">{t.resetPassword.successTitle}</h3>
                <p className="status-message">{t.resetPassword.successMessage}</p>
                <button className="submit-button" onClick={() => router.push("/login")}>
                  {t.resetPassword.backToLogin}
                </button>
              </div>
            ) : (
              <>
                <h2 className="auth-title font-display">{t.resetPassword.title}</h2>
                <p className="auth-subtitle">{t.resetPassword.subtitle}</p>

                {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

                {!token && (
                  <div className="message error">{t.resetPassword.missingToken}</div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="newPassword">{t.resetPassword.newPassword}</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        id="newPassword"
                        type="password"
                        placeholder={t.resetPassword.newPasswordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">{t.resetPassword.confirmPassword}</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder={t.resetPassword.confirmPasswordPlaceholder}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-button" disabled={isLoading || !token}>
                    {isLoading && <span className="spinner" />}
                    {isLoading ? t.resetPassword.submitting : t.resetPassword.submitButton}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
