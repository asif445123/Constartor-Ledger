"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import ContactLinks from "@/components/ui/ContactLinks";
import "./auth.css";

type ScreenState = "form" | "pending" | "rejected" | "forgot";

export default function LoginPage() {
  const { login, register, forgotPassword } = useAuth();
  const { enterDemoMode } = useData();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [screen, setScreen] = useState<ScreenState>("form");

  // ── forgot-password screen state ──
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<{ text: string; link?: string | null } | null>(null);

  // ─────────────────────────────────────────────
  //  VALIDATE FORM
  // ─────────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = t.login.errInvalidEmail;
    }

    if (password.length < 6) {
      newErrors.password = t.login.errPassword;
    }

    if (!isLoginMode) {
      if (fullName.trim().length < 2) {
        newErrors.name = t.login.errName;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─────────────────────────────────────────────
  //  FORM SUBMIT HANDLER
  // ─────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    if (isLoginMode) {
      const result = await login(email, password, rememberMe);
      if (result.ok) {
        setMessage({ text: t.login.loggedIn, type: "success" });
      } else if (result.reason === "pending") {
        setScreen("pending");
      } else if (result.reason === "rejected") {
        setScreen("rejected");
      } else {
        setMessage({ text: result.message || t.login.invalidCreds, type: "error" });
      }
    } else {
      const result = await register(fullName, email, password);
      if (result.ok) {
        setMessage({
          text: result.message || t.login.accountCreated,
          type: "success",
        });
        if (result.pending) {
          setIsLoginMode(true);
          setFullName("");
          setEmail("");
          setPassword("");
        }
      } else {
        setMessage({ text: result.message || t.login.registerFailed, type: "error" });
      }
    }

    setIsLoading(false);
  };

  // ─────────────────────────────────────────────
  //  FORGOT PASSWORD SUBMIT
  // ─────────────────────────────────────────────
  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotMessage(null);
    const result = await forgotPassword(forgotEmail);
    setForgotMessage({ text: result.message || "", link: result.resetLink });
    setForgotLoading(false);
  };

  // ─────────────────────────────────────────────
  //  SWITCH MODE
  // ─────────────────────────────────────────────
  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrors({});
    setMessage({ text: "", type: "" });
    setEmail("");
    setPassword("");
    setFullName("");
    setScreen("form");
  };

  const openForgot = () => {
    setForgotEmail(email);
    setForgotMessage(null);
    setScreen("forgot");
  };

  // ─────────────────────────────────────────────
  //  DEMO MODE
  // ─────────────────────────────────────────────
  const handleViewDemo = () => {
    enterDemoMode();
    router.push("/dashboard");
  };

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
            {screen === "rejected" ? (
              <div className="status-card rejected">
                <div className="status-icon">🚫</div>
                <h3 className="status-title">{t.login.rejectedTitle}</h3>
                <p className="status-message">{t.login.rejectedMessage}</p>
                <ContactLinks whatsappMessage={t.contact.whatsappDefaultMessage} />
                <button className="link-button" onClick={() => setScreen("form")}>
                  {t.login.backToLogin}
                </button>
                <button type="button" className="demo-button" onClick={handleViewDemo}>
                  {t.login.viewDemo}
                </button>
              </div>
            ) : screen === "pending" ? (
              <div className="status-card pending">
                <div className="status-icon">⏳</div>
                <h3 className="status-title">{t.login.pendingTitle}</h3>
                <p className="status-message">{t.login.pendingMessage}</p>
                <ContactLinks whatsappMessage={t.contact.whatsappDefaultMessage} />
                <button className="link-button" onClick={() => setScreen("form")}>
                  {t.login.backToLogin}
                </button>
                <button type="button" className="demo-button" onClick={handleViewDemo}>
                  {t.login.viewDemo}
                </button>
              </div>
            ) : screen === "forgot" ? (
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

                <form onSubmit={handleForgotSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="forgotEmail">{t.login.email}</label>
                    <div className="input-wrapper">
                      <span className="input-icon">✉️</span>
                      <input
                        id="forgotEmail"
                        type="email"
                        placeholder={t.login.emailPlaceholder}
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        disabled={forgotLoading}
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-button" disabled={forgotLoading}>
                    {forgotLoading && <span className="spinner" />}
                    {t.login.sendResetLink}
                  </button>
                </form>

                <button className="link-button" onClick={() => setScreen("form")} style={{ marginTop: 12 }}>
                  {t.login.backToLoginFromForgot}
                </button>
              </>
            ) : (
              <>
                {/* ── TITLE ── */}
                <h2 className="auth-title font-display">
                  {isLoginMode ? t.login.welcomeTitle : t.login.signupTitle}
                </h2>
                <p className="auth-subtitle">
                  {isLoginMode ? t.login.welcomeSubtitle : t.login.signupSubtitle}
                </p>

                {/* ── MESSAGE ── */}
                {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

                {/* ── FORM ── */}
                <form onSubmit={handleSubmit} className="auth-form">
                  {!isLoginMode && (
                    <div className="form-group">
                      <label htmlFor="fullName">{t.login.fullName}</label>
                      <div className="input-wrapper">
                        <span className="input-icon">👷</span>
                        <input
                          id="fullName"
                          type="text"
                          placeholder={t.login.fullNamePlaceholder}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      {errors.name && <div className="error-text">{errors.name}</div>}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="email">{t.login.email}</label>
                    <div className="input-wrapper">
                      <span className="input-icon">✉️</span>
                      <input
                        id="email"
                        type="email"
                        placeholder={t.login.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <div className="error-text">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">{t.login.password}</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t.login.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
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
                    {errors.password && <div className="error-text">{errors.password}</div>}
                  </div>

                  {isLoginMode && (
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
                      <button type="button" className="link-button" onClick={openForgot}>
                        {t.login.forgotPasswordLink}
                      </button>
                    </div>
                  )}

                  <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading && <span className="spinner" />}
                    {isLoading ? t.login.processing : isLoginMode ? t.login.loginButton : t.login.signupButton}
                  </button>
                </form>

                <div className="auth-divider">
                  <span>{t.login.or}</span>
                </div>

                <div className="toggle-auth">
                  <p>
                    {isLoginMode ? t.login.noAccount : t.login.haveAccount}
                    <button type="button" className="link-button" onClick={switchMode} disabled={isLoading}>
                      {isLoginMode ? t.login.signUpLink : t.login.signInLink}
                    </button>
                  </p>
                </div>

                <button type="button" className="submit-button" onClick={handleViewDemo}>
                  {t.login.viewDemo}
                </button>
              </>
            )}
          </div>
        </div>

        {/* <div className="auth-footer">
          <p className="verse-arabic">{t.login.verseArabic}</p>
          <p className="verse-translation">&quot;{t.login.verseTranslation}&quot;</p>
        </div> */}
      </div>
    </div>
  );
}
