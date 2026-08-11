"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState<{
  show: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
}>({
  show: false,
  type: "info",
  title: "",
  message: "",
});

  const isEmailValid = email.includes("@") && email.includes(".");
  const isPasswordValid = password.length >= 6;

   
const login = async () => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    alert("Email dan password wajib diisi.");
    return;
  }

  setLoading(true);

  const result = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  console.log("HASIL LOGIN:", result);

  if (result.error) {
    setLoading(false);
    alert(result.error.message);
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", result.data.user.id)
    .single();

  // Login berhasil → tetap loading sambil redirect
  if (profile?.role === "admin") {
    router.push("/admin");
  } else {
    router.push("/dashboard");
  }
};

const forgotPassword = async () => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    setPopup({
      show: true,
      type: "error",
      title: "Email Belum Diisi",
      message: "Masukkan email terlebih dahulu untuk mereset password.",
    });
    return;
  }

  setPopup({
    show: true,
    type: "info",
    title: "Memproses...",
    message: "Sedang mengirim link reset password.",
  });

  const { error } = await supabase.auth.resetPasswordForEmail(
    cleanEmail,
    {
      redirectTo: `${window.location.origin}/reset-password`,
    }
  );

  if (error) {
    setPopup({
      show: true,
      type: "error",
      title: "Gagal Mengirim",
      message: error.message,
    });
    return;
  }

  setPopup({
    show: true,
    type: "success",
    title: "Email Terkirim",
    message:
      "Link reset password telah dikirim ke email kamu. Silakan cek inbox atau folder spam.",
  });
};

const loginGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) {
    alert(error.message);
  }
};

  return (
    <main>
      {popup.show && (
  <div
    style={styles.popupOverlay}
    onClick={() =>
      setPopup((prev) => ({
        ...prev,
        show: false,
      }))
    }
  >
    <div
      style={styles.popupCard}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          ...styles.popupIcon,
          background:
            popup.type === "success"
              ? "#ECFDF5"
              : popup.type === "error"
              ? "#FEF2F2"
              : "#EFF6FF",
          color:
            popup.type === "success"
              ? "#059669"
              : popup.type === "error"
              ? "#DC2626"
              : "#2563EB",
        }}
      >
        {popup.type === "success"
          ? "✓"
          : popup.type === "error"
          ? "!"
          : "•••"}
      </div>

      <h2 style={styles.popupTitle}>
        {popup.title}
      </h2>

      <p style={styles.popupMessage}>
        {popup.message}
      </p>

      <button
        type="button"
        onClick={() =>
          setPopup((prev) => ({
            ...prev,
            show: false,
          }))
        }
        style={styles.popupButton}
      >
        Mengerti
      </button>
    </div>
  </div>
)}
      {loading && (
  <div style={styles.loadingOverlay}>
    <div style={styles.loadingCard}>
      <div style={styles.loadingLogo}>
        Medivault
      </div>

      <div style={styles.loadingSpinner}></div>

      <h2 style={styles.loadingTitle}>
        Login berhasil
      </h2>

      <p style={styles.loadingText}>
        Menyiapkan halaman kamu...
      </p>
    </div>
  </div>
)}
      <Navbar />

      <section style={styles.page}>
        <div style={styles.card}>
          <div
  style={{
    position: "absolute",
    width: 180,
    height: 180,
    background: "rgba(35,79,66,.08)",
    borderRadius: "999px",
    top: -60,
    right: -60,
    filter: "blur(30px)",
  }}
/>
          <div style={styles.header}>
            <h1 style={styles.title}>Masuk ke Medivault Exam</h1>
          </div>

          <div style={styles.form}>
            {/* EMAIL */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>

              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="nama@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />

                {email && (
                  <span style={styles.check}>
                    {isEmailValid ? "✔️" : "❌"}
                  </span>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>

              <div style={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />

                {password && (
                  <span style={{ ...styles.check, right: "42px" }}>
                    {isPasswordValid ? "✔️" : "❌"}
                  </span>
                )}

                <span
                  style={styles.eye}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={login}
              disabled={loading}
              style={{
                ...styles.primaryButton,
                transform: loading ? "scale(0.98)" : "scale(1)",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? <span style={styles.spinner}></span> : "Login"}
            </button>

            <button
  onClick={loginGoogle}
  style={styles.googleButton}
>
  Login dengan Google
</button>

            <button
  onClick={forgotPassword}
  style={styles.linkButton}
>
  Lupa password?
</button>
          </div>

          <p style={styles.bottomText}>
            Belum punya akun?{" "}
            <Link href="/register" style={styles.bottomLink}>
              Daftar sekarang
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left,#EEF6F3 0%,#F8FAFC 35%,#FFFFFF 100%)",
  padding: "24px 24px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
},
loadingOverlay: {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(6, 27, 58, 0.45)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
},

loadingCard: {
  width: "100%",
  maxWidth: "360px",
  background: "#ffffff",
  borderRadius: "28px",
  padding: "36px 28px",
  textAlign: "center",
  boxShadow: "0 30px 80px rgba(6, 27, 58, 0.25)",
},

loadingLogo: {
  fontSize: "28px",
  fontWeight: 900,
  color: "#061B3A",
  letterSpacing: "-0.5px",
  marginBottom: "24px",
},

loadingSpinner: {
  width: "42px",
  height: "42px",
  margin: "0 auto 20px",
  border: "4px solid #E2E8F0",
  borderTop: "4px solid #234F42",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
},

loadingTitle: {
  margin: 0,
  color: "#061B3A",
  fontSize: "20px",
  fontWeight: 900,
},

loadingText: {
  marginTop: "8px",
  marginBottom: 0,
  color: "#64748B",
  fontSize: "14px",
},
  card: {
    position: "relative",
overflow: "hidden",
    width: "100%",
    maxWidth: "500px",
    background: "white",
    border: "1px solid rgba(226,232,240,.8)",
    borderRadius: "28px",
    padding: "34px",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
  },

  header: {
    textAlign: "center",
    marginBottom: "28px",
  },

  badge: {
    display: "inline-block",
border: "1px solid #E2E8F0",
background: "#fff",
color: "#061B3A",
    padding: "8px 16px",
    borderRadius: "999px",
    fontWeight: 800,
    marginBottom: "16px",
  },

  title: {
    color: "#061b3a",
    fontSize: "32px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    color: "#061b3a",
    fontWeight: 800,
  },

  inputWrapper: {
    position: "relative",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    outline: "none",
  },

  check: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  primaryButton: {
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  background:
    "linear-gradient(90deg,#0A1733,#234F42)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow:
    "0 18px 40px rgba(6,27,58,.18)",
  transition: "all .2s ease",
},

  googleButton: {
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
background: "#fff",
    color: "#061b3a",
    fontWeight: 900,
    cursor: "pointer",
  },

  linkButton: {
    border: "none",
    background: "transparent",
    color: "#234F42",
    fontWeight: 900,
    cursor: "pointer",
  },

  bottomText: {
    textAlign: "center",
    marginTop: "24px",
    color: "#64748b",
  },

  bottomLink: {
    color: "#234F42",
    fontWeight: 900,
    textDecoration: "none",
  },

  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid white",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
  popupOverlay: {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(6, 27, 58, 0.45)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
},

popupCard: {
  width: "100%",
  maxWidth: "420px",
  background: "#ffffff",
  borderRadius: "28px",
  padding: "32px",
  textAlign: "center",
  boxShadow: "0 30px 80px rgba(6, 27, 58, 0.22)",
  border: "1px solid rgba(226,232,240,.8)",
},

popupIcon: {
  width: "64px",
  height: "64px",
  margin: "0 auto 18px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  fontWeight: 900,
},

popupTitle: {
  margin: 0,
  color: "#061B3A",
  fontSize: "22px",
  fontWeight: 900,
},

popupMessage: {
  marginTop: "10px",
  color: "#64748B",
  fontSize: "14px",
  lineHeight: 1.7,
},

popupButton: {
  width: "100%",
  marginTop: "24px",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(90deg,#0A1733,#234F42)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(6,27,58,.16)",
},
};
