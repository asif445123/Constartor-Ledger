"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import "@/app/login/auth.css";

type ScreenState = "form" | "forgot";

// Password-only login for the hidden /admin route. No email field is ever
// shown — the admin account's address is resolved server-side from ADMIN_EMAIL.
export default function AdminLoginGate() {
  const { adminLogin, adminForgotPassword } = useAuth();
  const { t, locale, setLocale } = useLanguage();

  const [screen, setScreen] = useState<ScreenState>("form");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<{ text: string; link?: string | null } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    const result = await adminLogin(password, rememberMe);
    if (!result.ok) {
      setMessage({ text: result.message || t.authContext.loginFailed, type: "error" });
    }
    setIsLoading(false);
  }

  async function handleForgot() {
    setForgotLoading(true);
    setForgotMessage(null);
    const result = await adminForgotPassword();
    setForgotMessage({ text: result.message || "", link: result.resetLink });
    setForgotLoading(false);
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
            {screen === "forgot" ? (
              <>
                <h2 className="auth-title font-display">{t.login.forgotPasswordTitle}</h2>
                <p className="auth-subtitle">{t.login.forgotPasswordSubtitle}</p>

                {forgotMessage && (
                  <div className="message success">
                    <p>{forgotMessage.text}</p>
                    {forgotMessage.link && (
                      <>
                        <p style={{ marginTop: 8, fontSize: "0.85em", opacity: 0.85 }}>
                          {t.login.resetLinkNote}
                        </p>
                        <a
                          href={forgotMessage.link}
                          className="link-button"
                          style={{ wordBreak: "break-all", display: "block", marginTop: 4 }}
                        >
                          {forgotMessage.link}
                        </a>
                      </>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  className="submit-button"
                  onClick={handleForgot}
                  disabled={forgotLoading}
                >
                  {forgotLoading && <span className="spinner" />}
                  {t.login.sendResetLink}
                </button>

                <button className="link-button" onClick={() => setScreen("form")} style={{ marginTop: 12 }}>
                  {t.login.backToLoginFromForgot}
                </button>
              </>
            ) : (
              <>
                <h2 className="auth-title font-display">{t.adminLogin.title}</h2>
                <p className="auth-subtitle">{t.adminLogin.subtitle}</p>

                {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="adminPassword">{t.adminLogin.passwordLabel}</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        id="adminPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder={t.adminLogin.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "-4px 0 4px",
                      fontSize: "0.85em",
                    }}
                  >
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                      />
                      {t.login.rememberMe}
                    </label>
                    <button type="button" className="link-button" onClick={() => setScreen("forgot")}>
                      {t.login.forgotPasswordLink}
                    </button>
                  </div>

                  <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading && <span className="spinner" />}
                    {isLoading ? t.adminLogin.processing : t.adminLogin.loginButton}
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
