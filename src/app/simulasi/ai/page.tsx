
"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

type WeakTopic = {
  block?: string | null;
  topics?: {
    topic?: string | null;
    accuracy?: number;
  }[];
  accuracy?: number;
};

export default function AISimulasiPage() {
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const [token, setToken] = useState(0);
  const [weakTopic, setWeakTopic] = useState<WeakTopic | null>(null);

  const [questionCount, setQuestionCount] = useState(20);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // ==========================================
        // 1. CEK USER
        // ==========================================

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }

        // ==========================================
        // 2. AMBIL PROFILE
        // ==========================================

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select("role, token, weakest_topics")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
          console.error(profileError);

          window.location.href = "/login";
          return;
        }

        // ==========================================
        // 3. CEK ROLE
        // ==========================================

        if (profile.role === "admin") {
          window.location.href = "/admin";
          return;
        }

        // ==========================================
        // 4. TOKEN
        // ==========================================

        setToken(Number(profile.token) || 0);

        // ==========================================
        // 5. AMBIL MATERI TERLEMAH
        // ==========================================

        const topics = Array.isArray(profile.weakest_topics)
          ? profile.weakest_topics
          : [];

        if (topics.length > 0) {
          setWeakTopic(topics[0]);
        } else {
          setWeakTopic(null);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);

        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==========================================
  // MULAI SIMULASI
  // ==========================================

  const startSimulation = async () => {
    if (starting) {
      return;
    }

    // ------------------------------------------
    // CEK MATERI
    // ------------------------------------------

    if (!weakTopic) {
      alert(
        "Belum ada materi yang dapat dianalisis. Kerjakan beberapa simulasi terlebih dahulu."
      );
      return;
    }

    // ------------------------------------------
    // CEK JUMLAH SOAL
    // ------------------------------------------

    if (questionCount < 1) {
      alert("Jumlah soal tidak valid.");
      return;
    }

    // ------------------------------------------
    // CEK TOKEN
    // ------------------------------------------

    if (token <= 0) {
      alert(
        "Akses simulasi kamu sudah habis. Silakan tambah akses terlebih dahulu."
      );
      return;
    }

    try {
      setStarting(true);

      // ========================================
      // 1. AMBIL USER TERBARU
      // ========================================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // ========================================
      // 2. AMBIL TOKEN TERBARU DARI DATABASE
      // ========================================
      //
      // Jangan hanya menggunakan state token.
      // State bisa sudah tidak sesuai jika saldo
      // berubah dari tab/perangkat lain.
      //

      const { data: latestProfile, error: latestProfileError } =
        await supabase
          .from("profiles")
          .select("token")
          .eq("id", user.id)
          .single();

      if (latestProfileError || !latestProfile) {
        console.error(
          "GET LATEST TOKEN ERROR:",
          latestProfileError
        );

        alert(
          "Gagal memeriksa saldo akses. Silakan coba lagi."
        );

        setStarting(false);
        return;
      }

      const latestToken = Number(latestProfile.token) || 0;

      // Sinkronkan tampilan dengan database
      setToken(latestToken);

      // ========================================
      // 3. CEK TOKEN TERBARU
      // ========================================

      if (latestToken <= 0) {
        alert(
          "Akses simulasi kamu sudah habis. Silakan tambah akses terlebih dahulu."
        );

        setStarting(false);
        return;
      }

      // ========================================
      // 4. POTONG 1 TOKEN
      // ========================================
      //
      // Kita menggunakan:
      //
      // .eq("id", user.id)
      // .eq("token", latestToken)
      //
      // Artinya token hanya akan dipotong jika
      // nilai token di database masih sama dengan
      // yang baru saja kita baca.
      //
      // Ini mencegah saldo tertimpa jika ada
      // perubahan token secara bersamaan.
      //

      const newToken = latestToken - 1;

      const {
        data: updatedProfile,
        error: updateTokenError,
      } = await supabase
        .from("profiles")
        .update({
          token: newToken,
        })
        .eq("id", user.id)
        .eq("token", latestToken)
        .select("token")
        .single();

      // ========================================
      // 5. VALIDASI PEMOTONGAN TOKEN
      // ========================================

      if (updateTokenError || !updatedProfile) {
        console.error(
          "DEDUCT TOKEN ERROR:",
          updateTokenError
        );

        alert(
          "Token gagal dipotong. Saldo kamu mungkin sudah berubah. Silakan coba lagi."
        );

        // Ambil saldo terbaru lagi agar UI sinkron
        const { data: refreshedProfile } =
          await supabase
            .from("profiles")
            .select("token")
            .eq("id", user.id)
            .single();

        if (refreshedProfile) {
          setToken(
            Number(refreshedProfile.token) || 0
          );
        }

        setStarting(false);
        return;
      }

      // ========================================
      // 6. UPDATE TOKEN DI UI
      // ========================================

      setToken(
        Number(updatedProfile.token) || 0
      );

      // ========================================
      // 7. SIMPAN CONFIG SIMULASI
      // ========================================
      //
      // Token SUDAH berhasil dipotong sebelum
      // config disimpan.
      //
      // Halaman /ujian/ai TIDAK akan memotong
      // token lagi.
      //

      const simulationConfig = {
        block: weakTopic.block || null,

        topic:
          weakTopic.topics &&
          weakTopic.topics.length > 0
            ? weakTopic.topics[0]?.topic || null
            : null,

        questionCount,

        // Informasi tambahan untuk menjaga konteks
        // bahwa akses sudah dibayar/dipotong.
        tokenCharged: true,
      };

      localStorage.setItem(
        "ai_simulation_config",
        JSON.stringify(simulationConfig)
      );

      // ========================================
      // 8. PINDAH KE HALAMAN UJIAN AI
      // ========================================

      window.location.href = "/ujian/ai";
    } catch (error) {
      console.error(
        "START AI SIMULATION ERROR:",
        error
      );

      alert(
        "Terjadi kesalahan saat menyiapkan simulasi."
      );

      setStarting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main>
        <Navbar />

        <section style={styles.loadingPage}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingIcon}>
              🤖
            </div>

            <h1 style={styles.loadingTitle}>
              Menyiapkan simulasi AI...
            </h1>

            <p style={styles.loadingText}>
              Menganalisis materi yang perlu kamu
              latih.
            </p>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // HALAMAN UTAMA
  // ==========================================

  return (
    <main>
      <Navbar />

      <section style={styles.page}>
        <div style={styles.container}>
          {/* ======================================
              HEADER
          ====================================== */}

          <div style={styles.header}>
            <div style={styles.badge}>
              🤖 Adaptive Learning
            </div>

            <h1 style={styles.title}>
              Simulasi Latihan AI
            </h1>

            <p style={styles.subtitle}>
              Sistem akan memilih soal dari bank
              soal yang tersedia berdasarkan materi
              yang masih perlu kamu kuasai.
            </p>
          </div>

          {/* ======================================
              MAIN CARD
          ====================================== */}

          <div style={styles.mainCard}>
            {/* ====================================
                FOKUS LATIHAN
            ==================================== */}

            <div style={styles.section}>
              <div style={styles.sectionLabel}>
                FOKUS LATIHAN
              </div>

              {weakTopic ? (
                <div style={styles.topicCard}>
                  <div style={styles.topicIcon}>
                    🧠
                  </div>

                  <div style={styles.topicContent}>
                    <p style={styles.topicLabel}>
                      Block
                    </p>

                    <h2 style={styles.topicTitle}>
                      {weakTopic.block ||
                        "Materi yang perlu dilatih"}
                    </h2>

                    {weakTopic.topics &&
                      weakTopic.topics.length > 0 &&
                      weakTopic.topics[0]?.topic && (
                        <p style={styles.subtopic}>
                          Topik:{" "}
                          <strong>
                            {
                              weakTopic.topics[0]
                                .topic
                            }
                          </strong>
                        </p>
                      )}

                    {typeof weakTopic.accuracy ===
                      "number" && (
                      <p style={styles.accuracy}>
                        Akurasi terakhir:{" "}
                        <strong>
                          {Math.round(
                            weakTopic.accuracy
                          )}
                          %
                        </strong>
                      </p>
                    )}

                    <p
                      style={
                        styles.topicDescription
                      }
                    >
                      Materi ini dipilih berdasarkan
                      hasil pengerjaan soal kamu
                      sebelumnya.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={styles.emptyTopic}>
                  <span style={styles.emptyIcon}>
                    📊
                  </span>

                  <div>
                    <strong
                      style={styles.emptyTitle}
                    >
                      Belum ada analisis kemampuan
                    </strong>

                    <p style={styles.emptyText}>
                      Kerjakan beberapa simulasi
                      terlebih dahulu agar sistem
                      dapat menentukan materi yang
                      perlu kamu latih.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ====================================
                JUMLAH SOAL
            ==================================== */}

            <div style={styles.section}>
              <div style={styles.sectionLabel}>
                JUMLAH SOAL
              </div>

              <p style={styles.helperText}>
                Pilih jumlah soal yang ingin kamu
                kerjakan.
              </p>

              <div style={styles.countGrid}>
                {[10, 20, 30, 50].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() =>
                      setQuestionCount(count)
                    }
                    disabled={starting}
                    style={{
                      ...styles.countButton,
                      ...(questionCount === count
                        ? styles.countButtonActive
                        : {}),
                      opacity: starting ? 0.6 : 1,
                      cursor: starting
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    <strong>{count}</strong>

                    <span>soal</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ====================================
                SUMBER SOAL
            ==================================== */}

            <div style={styles.section}>
              <div style={styles.sectionLabel}>
                SUMBER SOAL
              </div>

              <div style={styles.sourceCard}>
                <div style={styles.checkCircle}>
                  ✓
                </div>

                <div>
                  <strong
                    style={styles.sourceTitle}
                  >
                    Bank Soal yang Tersedia
                  </strong>

                  <p style={styles.sourceText}>
                    Soal dipilih dari paket soal
                    yang sudah diunggah dan
                    tersedia di sistem. Sistem akan
                    memprioritaskan soal yang sesuai
                    dengan materi yang perlu kamu
                    latih.
                  </p>
                </div>
              </div>
            </div>

            {/* ====================================
                INFO
            ==================================== */}

            <div style={styles.infoBox}>
              <span style={styles.infoIcon}>
                💡
              </span>

              <div>
                <strong>
                  Bagaimana simulasi ini bekerja?
                </strong>

                <p>
                  Sistem akan memprioritaskan soal
                  yang berkaitan dengan kelemahanmu,
                  kemudian mengacak soal agar setiap
                  sesi latihan tetap bervariasi.
                </p>
              </div>
            </div>

            {/* ====================================
                FOOTER
            ==================================== */}

            <div style={styles.footer}>
              <div style={styles.accessInfo}>
                <span>Akses tersedia</span>

                <strong>{token}</strong>
              </div>

              <button
                type="button"
                onClick={startSimulation}
                disabled={
                  starting ||
                  !weakTopic ||
                  token <= 0
                }
                style={{
                  ...styles.startButton,
                  opacity:
                    starting ||
                    !weakTopic ||
                    token <= 0
                      ? 0.5
                      : 1,
                  cursor:
                    starting ||
                    !weakTopic ||
                    token <= 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {starting
                  ? "Menyiapkan..."
                  : "🚀 Mulai Simulasi"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  // ==========================================
  // LOADING
  // ==========================================

  loadingPage: {
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },

  loadingCard: {
    background: "#FFFFFF",
    border: "1px solid #E5EAF2",
    borderRadius: "24px",
    padding: "40px",
    boxShadow:
      "0 18px 45px rgba(15,23,42,.06)",
    textAlign: "center",
    maxWidth: "460px",
  },

  loadingIcon: {
    fontSize: "42px",
    marginBottom: "18px",
  },

  loadingTitle: {
    color: "#061B3A",
    fontSize: "26px",
    margin: "0 0 10px",
  },

  loadingText: {
    color: "#64748B",
    lineHeight: 1.6,
    margin: 0,
  },

  // ==========================================
  // PAGE
  // ==========================================

  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left,#EEF6F3 0%,#F8FAFC 35%,#FFFFFF 100%)",
    padding: "64px 24px 90px",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    textAlign: "center",
    marginBottom: "36px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 16px",
    borderRadius: "999px",
    background: "#EEF6F3",
    border: "1px solid #DCE5E0",
    color: "#234F42",
    fontSize: "14px",
    fontWeight: 800,
    marginBottom: "16px",
  },

  title: {
    fontSize: "42px",
    fontWeight: 900,
    color: "#061B3A",
    margin: "0 0 12px",
  },

  subtitle: {
    color: "#64748B",
    fontSize: "16px",
    lineHeight: 1.7,
    maxWidth: "680px",
    margin: "0 auto",
  },

  // ==========================================
  // MAIN CARD
  // ==========================================

  mainCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "28px",
    padding: "36px",
    boxShadow:
      "0 20px 60px rgba(6,27,58,.08)",
  },

  section: {
    marginBottom: "30px",
  },

  sectionLabel: {
    color: "#64748B",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "1px",
    marginBottom: "12px",
  },

  // ==========================================
  // TOPIC
  // ==========================================

  topicCard: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "22px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg,#F0F8F5 0%,#F8FAFC 100%)",
    border: "1px solid #DCE5E0",
  },

  topicIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#234F42",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    flexShrink: 0,
  },

  topicContent: {
    flex: 1,
  },

  topicLabel: {
    margin: "0 0 5px",
    color: "#64748B",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },

  topicTitle: {
    color: "#061B3A",
    fontSize: "24px",
    fontWeight: 900,
    margin: "0 0 5px",
  },

  subtopic: {
    color: "#234F42",
    fontSize: "14px",
    margin: "0 0 6px",
  },

  accuracy: {
    color: "#64748B",
    fontSize: "13px",
    margin: "0 0 8px",
  },

  topicDescription: {
    color: "#64748B",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: 0,
  },

  // ==========================================
  // EMPTY TOPIC
  // ==========================================

  emptyTopic: {
    display: "flex",
    gap: "14px",
    padding: "20px",
    borderRadius: "18px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    color: "#64748B",
  },

  emptyIcon: {
    fontSize: "26px",
    flexShrink: 0,
  },

  emptyTitle: {
    color: "#061B3A",
  },

  emptyText: {
    margin: "6px 0 0",
    lineHeight: 1.6,
    fontSize: "14px",
  },

  // ==========================================
  // QUESTION COUNT
  // ==========================================

  helperText: {
    color: "#64748B",
    fontSize: "14px",
    margin: "0 0 14px",
  },

  countGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0,1fr))",
    gap: "12px",
  },

  countButton: {
    padding: "18px 10px",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    color: "#64748B",
  },

  countButtonActive: {
    background: "#061B3A",
    border: "1px solid #061B3A",
    color: "#FFFFFF",
    boxShadow:
      "0 10px 25px rgba(6,27,58,.18)",
  },

  // ==========================================
  // SOURCE
  // ==========================================

  sourceCard: {
    display: "flex",
    gap: "14px",
    padding: "18px",
    borderRadius: "16px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
  },

  checkCircle: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#234F42",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    flexShrink: 0,
  },

  sourceTitle: {
    color: "#061B3A",
    fontSize: "15px",
  },

  sourceText: {
    color: "#64748B",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: "5px 0 0",
  },

  // ==========================================
  // INFO
  // ==========================================

  infoBox: {
    display: "flex",
    gap: "12px",
    padding: "18px",
    borderRadius: "16px",
    background: "#FFFBEB",
    border: "1px solid #FDE68A",
    color: "#78350F",
    marginBottom: "30px",
  },

  infoIcon: {
    fontSize: "20px",
    flexShrink: 0,
  },

  // ==========================================
  // FOOTER
  // ==========================================

  footer: {
    borderTop: "1px solid #E2E8F0",
    paddingTop: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  accessInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    color: "#64748B",
    fontSize: "13px",
  },

  startButton: {
    padding: "16px 28px",
    borderRadius: "15px",
    border: "none",
    background:
      "linear-gradient(135deg,#061B3A 0%,#234F42 100%)",
    color: "#FFFFFF",
    fontSize: "15px",
    fontWeight: 800,
    boxShadow:
      "0 14px 30px rgba(6,27,58,.18)",
  },
};
