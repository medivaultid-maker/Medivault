
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { generateAIReport } from "../lib/aiLearningReport";
import { generateRecommendation } from "../lib/studyRecommendation";
import { generateAchievements } from "../lib/achievement";

type ExamHistoryItem = {
  id: string;
  packageId: string;
  title: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  score: number;
  passingGrade: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  doubtCount: number;
  totalQuestions: number;
  status: string;
};

const categoryLabels: Record<string, string> = {
  "anatomi-teori": "Anatomi - Teori",
  "anatomi-praktikum": "Anatomi - Praktikum",
  "histologi-teori": "Histologi - Teori",
  "histologi-praktikum": "Histologi - Praktikum",
};

const getCatatanHref = (block: string) => {
  const normalized = block.toLowerCase().trim();

  if (normalized.includes("histologi")) {
    return "/materi/catatan/histologi";
  }

  if (normalized.includes("anatomi")) {
    return "/materi/catatan/anatomi";
  }

  if (normalized.includes("mikrobiologi")) {
    return "/materi/catatan/mikrobiologi";
  }

  if (normalized.includes("parasitologi")) {
    return "/materi/catatan/parasitologi";
  }

  if (normalized.includes("biokimia")) {
    return "/materi/catatan/biokimia";
  }

  if (normalized.includes("fisiologi")) {
    return "/materi/catatan/fisiologi";
  }

  return "/materi/catatan";
};

export default function DashboardPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
const [name, setName] = useState("User");
const [token, setToken] = useState(0);
const [history, setHistory] = useState<ExamHistoryItem[]>([]);
const [recommendation, setRecommendation] = useState<any>(null);
const [achievements, setAchievements] = useState<any[]>([]);
const [showMoreBlocks, setShowMoreBlocks] = useState(false);
  const studyBlocks = [
  {
    name: "Anatomi",
    icon: "🦴",
    key: "anatomi",
  },
  {
    name: "Histologi",
    icon: "🔬",
    key: "histologi",
  },
{
    name: "Biokimia",
    icon: "🧪",
    key: "biokimia",
  },
  {
    name: "Fisiologi",
    icon: "❤️",
    key: "fisiologi",
  },
  {
    name: "Parasitologi",
    icon: "🪱",
    key: "parasitologi",
  },
  {
    name: "Mikrobiologi",
    icon: "🦠",
    key: "mikrobiologi",
  },
];
  
  
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          window.location.href = "/login";
          return;
        }

        // ======================
        // PROFILE
        // ======================

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, token")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("PROFILE ERROR:", profileError);
        }

        setName(profile?.full_name || user.email || "User");
        setToken(profile?.token || 0);

        // ======================
        // HISTORY
        // ======================

        const { data: attempts, error: attemptsError } = await supabase
          .from("exam_attempts")
          .select(`
            id,
            package_id,
            score,
            passing_grade,
            correct_count,
            wrong_count,
            unanswered_count,
            doubt_count,
            total_questions,
            duration,
            status,
            created_at,
            topic_stats,
            exam_packages (
              title,
              category
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (attemptsError) {
          console.error("ATTEMPTS ERROR:", attemptsError);
        }

        // ======================
        // HISTORY DATA
        // ======================

        if (attempts) {
          setHistory(
            attempts.map((item: any) => ({
              id: item.id,
              packageId: item.package_id,

              title: item.exam_packages?.title || "Latihan Soal",
              category: item.exam_packages?.category || "",

              score: item.score || 0,
              passingGrade: item.passing_grade || 0,

              correctCount: item.correct_count || 0,
              wrongCount: item.wrong_count || 0,
              unansweredCount: item.unanswered_count || 0,
              doubtCount: item.doubt_count || 0,

              totalQuestions: item.total_questions || 0,
              duration: item.duration || 0,

              status: item.status || "completed",

              date: new Date(item.created_at).toLocaleDateString("id-ID"),

              time: new Date(item.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }))
          );
        }

        // ======================
        // ACHIEVEMENT
        // ======================

        if (attempts) {
          try {
            const badge = generateAchievements(
              attempts.map((item: any) => ({
                score: item.score,
              }))
            );

            setAchievements(badge);
          } catch (error) {
            console.error("ACHIEVEMENT ERROR:", error);
          }
        }

       // ======================
// STUDY RECOMMENDATION
// ======================

if (attempts && attempts.length > 0) {
  const latest = attempts[0];

  if (latest.topic_stats) {
    try {
      const report = generateAIReport(
        latest.topic_stats
      );

      const rec = generateRecommendation(
        report.weakest
      );

      setRecommendation(rec);
    } catch (error) {
      console.error(
        "RECOMMENDATION ERROR:",
        error
      );

      setRecommendation([]);
    }
  }
}

      } catch (error) {
        console.error(
          "DASHBOARD ERROR:",
          error
        );
      } finally {
        // WAJIB: dashboard tetap dibuka
        // walaupun salah satu proses di atas error.
        setCheckingAccess(false);
      }
    };

    loadDashboard();
  }, []);

  /* =========================
     DATA PER KATEGORI
  ========================= */

  const getData = (category: string) =>
    history
      .filter((h) => h.category === category)
      .slice(-6)
      .map((item, i) => ({
        name: i + 1,
        score: item.score,
      }));

        /* =========================
     STUDY BLOCK PROGRESS
  ========================= */

  const completedBlocks = studyBlocks.filter((block) => {
    return history.some((item) => {
      const category = item.category.toLowerCase();

      return category.includes(block.key);
    });
  });
const histologiCount = history.filter((item) =>
  item.category.toLowerCase().includes("histologi")
).length;
  const hasHistologyRecommendation = histologiCount >= 1;
  if (checkingAccess) {
    return (
      <main>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
            <h1 className="text-xl font-bold text-[#061B3A]">
              Memuat dashboard...
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Mohon tunggu sebentar.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#EEF6F3_0%,#F8FAFC_35%,#FFFFFF_100%)]">
      <Navbar />

      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-[1400px] px-2">

        {/* =========================
    PREMIUM HERO
========================= */}

<div className="relative mb-10 overflow-hidden rounded-[36px] bg-[#061B3A] text-white shadow-[0_24px_70px_rgba(6,27,58,0.20)]">

  {/* Decorative background */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">

    <div className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full border border-emerald-300/10" />

    <div className="absolute -right-20 -top-28 h-[400px] w-[400px] rounded-full border border-cyan-300/10" />

    <div className="absolute right-[8%] top-[12%] h-2 w-2 rounded-full bg-cyan-300/60 shadow-[0_0_20px_rgba(103,232,249,.8)]" />

    <div className="absolute right-[28%] top-[20%] h-1.5 w-1.5 rounded-full bg-emerald-300/70" />

    <div className="absolute right-[15%] bottom-[18%] h-2 w-2 rounded-full bg-white/30" />

    <div className="absolute -bottom-40 right-[18%] h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-3xl" />

    <div className="absolute left-1/3 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent" />

  </div>


  <div className="relative grid min-h-[330px] items-center gap-10 px-7 py-10 md:px-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-14">

    {/* LEFT */}

    <div className="relative z-10">

      {/* Small badge */}

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 backdrop-blur-md">

        <span className="text-base">
          👋
        </span>

        <span className="text-xs font-bold tracking-[0.12em] text-white/80">
          WELCOME BACK
        </span>

      </div>


      {/* Heading */}

      <h1 className="text-[2.7rem] font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[4rem]">

        Selamat datang,
        <br />

        <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
          {name}
        </span>

      </h1>


      {/* Description */}

      <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">

        Kenali progresmu, temukan yang perlu diperkuat, dan belajar lebih terarah bersama{" "}
        <span className="font-semibold text-white">
          Medivault
        </span>
        .

      </p>


      {/* Small stats */}

      <div className="mt-7 flex flex-wrap gap-3">

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/15">
            📚
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
              Aktivitas
            </p>

            <p className="text-sm font-bold text-white">
              {history.length} latihan
            </p>
          </div>

        </div>


        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/15">
            ✦
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
              Token
            </p>

            <p className="text-sm font-bold text-white">
              {token}
            </p>
          </div>

        </div>

      </div>

    </div>


    {/* RIGHT VISUAL */}

    <div className="relative hidden h-[280px] lg:block">

      {/* Glow */}

      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />


      {/* Rings */}

      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/10" />


      {/* Main book */}

      <div className="absolute left-1/2 top-1/2 flex h-32 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-[0_20px_60px_rgba(34,211,238,.12)] backdrop-blur-xl">

        <div className="text-7xl drop-shadow-[0_10px_20px_rgba(34,211,238,.25)]">
          📖
        </div>

      </div>


      {/* Floating brain */}

      <div className="absolute left-[10%] top-[25%] flex h-16 w-16 rotate-[-8deg] items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-3xl shadow-lg backdrop-blur-xl">
        🧠
      </div>


      {/* Floating target */}

      <div className="absolute right-[12%] top-[12%] flex h-16 w-16 rotate-[7deg] items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-3xl shadow-lg backdrop-blur-xl">
        🎯
      </div>


      {/* Floating graduation */}

      <div className="absolute bottom-[10%] right-[18%] flex h-16 w-16 rotate-[-5deg] items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-3xl shadow-lg backdrop-blur-xl">
        🎓
      </div>


      {/* Bottom glow */}

      <div className="absolute bottom-[6%] left-1/2 h-5 w-56 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-xl" />

    </div>

  </div>

</div>

{/* =========================
    PROGRESS BELAJAR
========================= */}

<div className="relative mb-10 overflow-hidden rounded-[36px] border border-emerald-100/80 bg-gradient-to-br from-white via-white to-[#F3FBF7] p-6 shadow-[0_20px_60px_rgba(6,27,58,0.07)] md:p-8">

  {/* Decorative background */}

  <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

  <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-cyan-100/30 blur-3xl" />

  <div className="pointer-events-none absolute right-0 top-0 h-40 w-80 rounded-full bg-gradient-to-bl from-emerald-100/50 to-transparent opacity-60" />


  {/* HEADER */}

  <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">

    <div className="flex items-center gap-4">

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-3xl shadow-sm">
        📚
      </div>

      <div>

        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">
          Progress Belajar
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-tight text-[#061B3A] md:text-3xl">
          Ringkasan Perkembanganmu
        </h2>

        <p className="mt-1 text-sm text-slate-500 md:text-base">
          Pantau pencapaian dan konsistensi belajarmu di Medivault.
        </p>

      </div>

    </div>


   

  </div>


  {/* CONTENT */}

  <div className="relative mt-8">

   


    {/* =========================
        COMPLETED BLOCKS
    ========================= */}

    <div>

      <div className="mb-4 flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-lg text-emerald-600">
          ✓
        </div>

        <div>

          <h3 className="text-lg font-black text-emerald-700">
            BLOK YANG SUDAH DIKERJAKAN
          </h3>

          <p className="text-xs text-slate-400">
            Materi yang sudah pernah kamu latih
          </p>

        </div>

      </div>


      <div className="grid gap-4 sm:grid-cols-2">

  {studyBlocks
    .filter((_, index) => showMoreBlocks || index < 4)
    .map((block) => {

          const completed = completedBlocks.some(
            (item) => item.key === block.key
          );

          return (
            <div
              key={block.key}
              className="group relative overflow-hidden rounded-[24px] border border-emerald-100/80 bg-white p-4 shadow-[0_8px_25px_rgba(6,27,58,.045)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_16px_35px_rgba(6,27,58,.09)]"
            >

              {/* subtle glow */}

              <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-emerald-100/50 blur-2xl" />


              <div className="relative flex items-center gap-4">

                {/* Icon */}

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-3xl shadow-sm transition duration-300 group-hover:scale-105">
                  {block.icon}
                </div>


                {/* Info */}

                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between gap-3">

  <h4 className="truncate text-lg font-black text-[#061B3A]">
    {block.name}
  </h4>

</div>


                 <div className="mt-2 flex items-center justify-between">

  <span className="text-xs font-medium text-slate-400">
    {completed
      ? "Sudah dikerjakan"
      : "Belum dikerjakan"}
  </span>

</div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

<div className="mt-5 flex justify-center">

  <button
    type="button"
    onClick={() => setShowMoreBlocks((prev) => !prev)}
    className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-5 py-3 text-sm font-bold text-emerald-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
  >
    <span>
      {showMoreBlocks
        ? "Sembunyikan blok"
        : "Lihat blok lainnya"}
    </span>

    <span
      className={`text-lg transition-transform duration-300 ${
        showMoreBlocks ? "rotate-180" : ""
      }`}
    >
      ↓
    </span>
  </button>

</div>
  

      

    </div>

  </div>

</div>

{/* =========================
    REKOMENDASI BELAJAR
========================= */}

{hasHistologyRecommendation && (
  <div className="relative mb-10 overflow-hidden rounded-[36px] border border-emerald-100/80 bg-gradient-to-br from-white via-[#F9FFFC] to-[#EFFAF6] p-6 shadow-[0_20px_60px_rgba(6,27,58,0.07)] md:p-8">

    {/* Decorative glow */}

    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-cyan-100/30 blur-3xl" />


    <div className="relative">

      {/* HEADER */}

      <div className="flex items-start gap-4">

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-3xl shadow-sm">
          💡
        </div>

        <div>

          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">
            Personal Learning
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#061B3A] md:text-3xl">
            Rekomendasi Belajar
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
            Berdasarkan aktivitas latihanmu, ada materi yang layak kamu pelajari kembali.
          </p>

        </div>

      </div>


      {/* RECOMMENDATION CARD */}

      <div className="mt-7 rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm md:p-6">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-3xl">
              🔬
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Materi yang disarankan
              </p>

              <h3 className="mt-1 text-xl font-black text-[#061B3A]">
                Histologi
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Kamu sudah menyelesaikan {histologiCount} latihan Histologi.
              </p>

            </div>

          </div>


          {/* CTA */}

          <Link
            href="/materi/catatan"
            className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#087A5A] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,122,90,.18)] transition hover:-translate-y-0.5 hover:bg-[#06684C]"
          >

            <span>
              Pelajari Histologi
            </span>

            <span className="text-lg transition-transform group-hover:translate-x-1">
              →
            </span>

          </Link>

        </div>

      </div>


      {/* FUTURE SUBTOPICS */}

      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-5 py-4">

        <div className="flex items-start gap-3">

          <span className="text-lg">
            📖
          </span>

          <div>

            <p className="text-sm font-bold text-[#061B3A]">
              Rekomendasi subbab akan tersedia segera
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Setelah subbab materi dimasukkan, rekomendasi belajar akan dibuat lebih spesifik sesuai topik yang perlu kamu pelajari.

            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
)}

         {/* =========================
    ACHIEVEMENT
========================= */}

{achievements.length > 0 && (

  <div className="relative mb-10 overflow-hidden rounded-[36px] border border-amber-100/80 bg-gradient-to-br from-[#FFFCF1] via-white to-[#F8FBFF] p-6 shadow-[0_20px_60px_rgba(6,27,58,0.07)] md:p-8">

    {/* Decorative glow */}

    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-emerald-100/30 blur-3xl" />


    {/* HEADER */}

    <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">

      <div className="flex items-center gap-4">

        {/* Trophy */}

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100 text-3xl shadow-[0_8px_25px_rgba(245,158,11,.12)]">

          🏆

        </div>


        <div>

          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B7791F]">
            Your Achievements
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#061B3A] md:text-3xl">
            Achievement
          </h2>

          <p className="mt-1 text-sm text-slate-500 md:text-base">
            Badge yang berhasil kamu kumpulkan.
          </p>

        </div>

      </div>


      {/* Achievement count */}

      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">

        <span className="h-2 w-2 rounded-full bg-emerald-500" />

        <span className="text-sm font-bold text-slate-600">
          {achievements.length} badge diperoleh
        </span>

      </div>

    </div>


    {/* BADGES */}

    <div className="relative mt-7 grid gap-4 md:grid-cols-3">

      {achievements.map((badge, index) => (

        <div
          key={index}
          className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_12px_35px_rgba(6,27,58,.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(6,27,58,.12)]"
        >

          {/* subtle card glow */}

          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-violet-100 to-transparent opacity-70 blur-xl transition duration-300 group-hover:opacity-100" />


          <div className="relative flex items-start gap-4">

            {/* Badge icon */}

            <div className="relative flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-[22px] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 text-4xl shadow-[0_10px_25px_rgba(99,102,241,.12)] transition-transform duration-300 group-hover:scale-105">

              <div className="absolute inset-1 rounded-[18px] border border-violet-100/70" />

              <span className="relative">
                {badge.icon}
              </span>

            </div>


            {/* Content */}

            <div className="min-w-0 flex-1 pt-1">

              <div className="flex items-start justify-between gap-2">

                <h3 className="text-base font-black leading-6 text-[#061B3A] md:text-lg">
                  {badge.title}
                </h3>

              </div>


              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                {badge.description}
              </p>

            </div>

          </div>


          {/* Bottom status */}

          <div className="relative mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

            <div className="flex items-center gap-2">

              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-xs text-emerald-600">
                ✓
              </span>

              <span className="text-xs font-bold text-emerald-600">
                Achievement unlocked
              </span>

            </div>

            <span className="text-xs font-semibold text-slate-300">
              #{String(index + 1).padStart(2, "0")}
            </span>

          </div>

        </div>

      ))}

    </div>

  </div>

)}


          {/* =========================
    PREMIUM STUDY RECOMMENDATION
========================= */}

{recommendation && recommendation.length > 0 && (

  <div className="relative mb-10 overflow-hidden rounded-[36px] border border-emerald-100/80 bg-gradient-to-br from-white via-[#F9FFFC] to-[#EFFAF6] shadow-[0_20px_60px_rgba(6,27,58,0.07)]">

    {/* BACKGROUND DECORATION */}

    <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />

    <div className="pointer-events-none absolute bottom-[-120px] left-[35%] h-72 w-72 rounded-full bg-cyan-100/30 blur-3xl" />


    <div className="relative p-6 md:p-8">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

        <div className="flex items-start gap-4">

          {/* ICON */}

          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-3xl shadow-sm">
            💡
          </div>


          {/* TITLE */}

          <div>

            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">
              Personal Learning
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#061B3A] md:text-3xl">
              Rekomendasi Belajar
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
              Materi yang disarankan berdasarkan hasil latihan terakhir kamu.
            </p>

          </div>

        </div>


        {/* AI BADGE */}

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">

          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />

          AI Learning Insight

        </div>

      </div>


      {/* =========================
          MAIN RECOMMENDATION
      ========================= */}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">


        {/* =========================
            FOCUS CARD
        ========================= */}

        <div className="relative overflow-hidden rounded-[30px] border border-emerald-100 bg-white p-6 shadow-[0_12px_35px_rgba(6,27,58,.055)] md:p-7">

          {/* subtle decoration */}

          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-50 blur-2xl" />


          <div className="relative">

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">
                  Fokus Utama
                </p>

                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#061B3A] md:text-3xl">
                  {recommendation[0]?.block || "Materi yang perlu diperkuat"}
                </h3>

              </div>


              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                📚
              </div>

            </div>


            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
              Kamu cukup sering mengalami kesalahan pada topik ini.
              Yuk, perkuat pemahamanmu sebelum lanjut ke materi berikutnya.
            </p>


            {/* SCORE */}

            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold text-slate-400">
                    Kemampuan saat ini
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#061B3A]">
                    {recommendation[0]?.score ?? 0}%
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-xs font-semibold text-slate-400">
                    Target
                  </p>

                  <p className="mt-1 text-lg font-black text-emerald-600">
                    80%+
                  </p>

                </div>

              </div>


              {/* PROGRESS */}

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      recommendation[0]?.score ?? 0,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>


            {/* CTA */}

            <Link
  href={getCatatanHref(recommendation[0]?.block || "")}
  className="group mt-5 flex items-center justify-between rounded-2xl bg-[#087A5A] px-5 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,122,90,.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#06684C] hover:shadow-[0_14px_30px_rgba(8,122,90,.25)]"
>

              <span>
                Mulai Belajar
              </span>

              <span className="text-xl transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>

            </Link>

          </div>

        </div>


        {/* =========================
            INSIGHT PANEL
        ========================= */}

        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-4">


          {/* DIFFICULTY */}

          <div className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm md:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                🎯
              </div>

              <div>

                <p className="text-[11px] font-semibold text-slate-400">
                  Tingkat Kesulitan
                </p>

                <p className="mt-1 text-sm font-black text-[#061B3A]">
                  Menengah
                </p>

              </div>

            </div>


            <div className="mt-4 flex gap-1">

              <span className="h-2 flex-1 rounded-full bg-emerald-500" />
              <span className="h-2 flex-1 rounded-full bg-emerald-500" />
              <span className="h-2 flex-1 rounded-full bg-emerald-300" />
              <span className="h-2 flex-1 rounded-full bg-slate-100" />
              <span className="h-2 flex-1 rounded-full bg-slate-100" />

            </div>

          </div>


          {/* RELEVANCE */}

          <div className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm md:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                ✨
              </div>

              <div>

                <p className="text-[11px] font-semibold text-slate-400">
                  Relevansi
                </p>

                <p className="mt-1 text-sm font-black text-[#061B3A]">
                  Tinggi
                </p>

              </div>

            </div>


            <div className="mt-4 flex gap-1">

              <span className="h-2 flex-1 rounded-full bg-emerald-500" />
              <span className="h-2 flex-1 rounded-full bg-emerald-500" />
              <span className="h-2 flex-1 rounded-full bg-emerald-500" />
              <span className="h-2 flex-1 rounded-full bg-emerald-500" />
              <span className="h-2 flex-1 rounded-full bg-slate-100" />

            </div>

          </div>


          {/* EST TIME */}

          <div className="rounded-[24px] border border-emerald-100 bg-white p-4 shadow-sm md:p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                🕐
              </div>

              <div>

                <p className="text-[11px] font-semibold text-slate-400">
                  Est. Waktu
                </p>

                <p className="mt-1 text-sm font-black text-[#061B3A]">
                  45–60 menit
                </p>

              </div>

            </div>

          </div>


        </div>

      </div>


      {/* =========================
          SUBTOPICS
      ========================= */}

      {recommendation[0]?.subtopics &&
        recommendation[0].subtopics.length > 0 && (

        <div className="mt-6 rounded-[28px] border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur md:p-6">

          <div className="flex items-center justify-between gap-4">

            <div>

              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">
                Recommended Topics
              </p>

              <h3 className="mt-1 text-lg font-black text-[#061B3A]">
                Subbab yang disarankan
              </h3>

            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {recommendation[0].subtopics.length} topik
            </span>

          </div>


          <div className="mt-4 grid gap-3 md:grid-cols-2">

            {recommendation[0].subtopics.map(
              (subtopic: string, index: number) => (

                <Link
                  key={index}
                  href={`/ai-soal?topic=${encodeURIComponent(subtopic)}`}
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/60 hover:shadow-sm"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm shadow-sm">
                      📖
                    </div>

                    <span className="text-sm font-bold text-[#061B3A]">
                      {subtopic}
                    </span>

                  </div>

                  <span className="text-lg text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600">
                    →
                  </span>

                </Link>

              )
            )}

          </div>

        </div>

      )}


      {/* =========================
          MORE RECOMMENDATIONS
      ========================= */}

      {recommendation.length > 1 && (

        <div className="mt-6">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                More Insights
              </p>

              <h3 className="mt-1 text-lg font-black text-[#061B3A]">
                Topik lain yang perlu diperkuat
              </h3>

            </div>

          </div>


          <div className="grid gap-4 md:grid-cols-2">

            {recommendation.slice(1).map(
              (item: any, index: number) => (

                <Link
                  key={index}
                  href={getCatatanHref(item.block)}
                  className="group rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs font-bold text-slate-400">
                        Perlu diperkuat
                      </p>

                      <h4 className="mt-1 font-black text-[#061B3A]">
                        {item.block}
                      </h4>

                    </div>

                    <div className="text-right">

                      <p className="text-xl font-black text-emerald-600">
                        {item.score}%
                      </p>

                    </div>

                  </div>


                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      style={{
                        width: `${Math.min(item.score, 100)}%`,
                      }}
                    />

                  </div>


                  <div className="mt-3 flex justify-end">

                    <span className="text-sm font-bold text-emerald-600 transition group-hover:translate-x-1">
                      Pelajari →
                    </span>

                  </div>

                </Link>

              )
            )}

          </div>

        </div>

      )}

    </div>

  </div>

)}


          {/* HISTORY */}

          <div
            id="riwayat-latihan"
            className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(6,27,58,.06)]"
          >

            <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <h2 className="text-2xl font-extrabold text-[#061B3A]">
                  Riwayat Latihan Soal Terakhir
                </h2>

                <p className="mt-2 text-slate-600">
                  Lihat hasil latihan terbaru dan perkembangan belajarmu.
                </p>

              </div>


              <Link
                href="/simulasi"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#061B3A] bg-white px-6 py-3 font-extrabold text-[#061B3A] transition hover:bg-[#061B3A] hover:text-white hover:shadow-lg"
              >
                Mulai Latihan →
              </Link>

            </div>


            {history.length === 0 ? (

              <div className="rounded-3xl bg-gradient-to-r from-slate-50 to-slate-100 p-8 text-center">

                <p className="font-bold text-slate-600">
                  Belum ada latihan yang diselesaikan. Yuk mulai latihan pertamamu.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <div className="min-w-[760px] overflow-hidden rounded-2xl border border-slate-100">

                  <div className="grid grid-cols-[1.5fr_1fr_0.6fr_0.8fr_1fr] gap-4 bg-slate-50 p-4 text-sm font-extrabold text-slate-500">

                    <span>Judul Latihan</span>
                    <span>Kategori</span>
                    <span>Skor</span>
                    <span>Status</span>
                    <span>Tanggal & Jam</span>

                  </div>


                  {history.slice(0, 10).map((item) => (

                    <div
                      key={item.id}
                      className="grid grid-cols-[1.5fr_1fr_0.6fr_0.8fr_1fr] gap-4 border-t border-slate-100 p-4 text-sm text-slate-700 transition hover:bg-slate-50"
                    >

                      {/* JUDUL */}

                      {item.status === "ongoing" ? (

                        <Link
                          href={`/ujian/${item.packageId}?attempt=${item.id}`}
                          className="font-extrabold text-[#061B3A] transition hover:text-[#234F42]"
                        >
                          {item.title}
                        </Link>

                      ) : (

                        <Link
                          href={`/hasil/${item.id}`}
                          className="font-extrabold text-[#061B3A] transition hover:text-[#234F42]"
                        >
                          {item.title}
                        </Link>

                      )}


                      {/* KATEGORI */}

                      <span>
                        {categoryLabels[item.category] || item.category}
                      </span>


                      {/* SKOR */}

                      <span className="font-extrabold text-[#234F42]">
                        {item.status === "ongoing" ? "-" : item.score}
                      </span>


                      {/* STATUS */}

                      <span
                        className={
                          item.status === "ongoing"
                            ? "font-bold text-orange-500"
                            : "font-bold text-[#234F42]"
                        }
                      >
                        {item.status === "ongoing"
                          ? "Sedang dikerjakan"
                          : "Selesai"}
                      </span>


                      {/* TANGGAL */}

                      <span>
                        {item.date} • {item.time}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            )}

          </div>

        </div>
      </section>
    </main>
  );
}
