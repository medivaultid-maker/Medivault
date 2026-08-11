"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import Navbar from "../../../components/Navbar";

function AISoalContent() {
  const searchParams = useSearchParams();

  const topic = searchParams.get("topic") || "Materi Kedokteran";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#EEF6F3_0%,#F8FAFC_35%,#FFFFFF_100%)]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#061B3A]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            ← Kembali ke Dashboard
          </Link>

          <div className="mt-8 max-w-3xl">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Personal Learning
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Latihan Soal Personal
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Latihan ini disusun berdasarkan topik yang masih perlu
              kamu perkuat dari hasil latihan sebelumnya.
            </p>

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-8 md:px-10 md:py-12">

        <div className="mx-auto max-w-4xl">

          {/* TOPIC CARD */}
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm md:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Topik yang perlu diperkuat
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-[#061B3A]">
                  {topic}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  MediVault akan mengarahkan latihan pada topik ini
                  agar waktu belajarmu lebih terfokus.
                </p>

              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7F1]">

                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>

              </div>

            </div>

          </div>


          {/* AI GENERATOR */}
          <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

            <div className="p-6 md:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#061B3A] text-white">

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 3v18" />
                    <path d="M3 12h18" />
                    <path d="M5.5 5.5l13 13" />
                    <path d="M18.5 5.5l-13 13" />
                  </svg>

                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#234F42]">
                    Adaptive Question Generator
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold text-[#061B3A]">
                    Buat Latihan Soal
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Soal akan difokuskan pada topik{" "}
                    <span className="font-bold text-[#061B3A]">
                      {topic}
                    </span>
                    .
                  </p>

                </div>

              </div>


              {/* INFO */}
              <div className="mt-7 grid gap-3 md:grid-cols-3">

                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Fokus
                  </p>

                  <p className="mt-2 font-bold text-[#061B3A]">
                    {topic}
                  </p>

                </div>


                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Level
                  </p>

                  <p className="mt-2 font-bold text-[#061B3A]">
                    Menyesuaikan kemampuan
                  </p>

                </div>


                <div className="rounded-2xl bg-slate-50 p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tujuan
                  </p>

                  <p className="mt-2 font-bold text-[#061B3A]">
                    Memperkuat pemahaman
                  </p>

                </div>

              </div>


              {/* BUTTON */}
              <div className="mt-8">

                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-slate-200 px-6 py-4 text-base font-bold text-slate-500"
                >

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 3v18" />
                    <path d="M3 12h18" />
                  </svg>

                  Generate Soal {topic}

                </button>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Fitur generator soal akan dihubungkan ke sistem AI
                  MediVault.
                </p>

              </div>

            </div>

          </div>


          {/* BACK TO SIMULATION */}
          <div className="mt-6 text-center">

            <Link
              href="/simulasi"
              className="text-sm font-semibold text-[#234F42] transition hover:text-[#061B3A]"
            >
              Atau pilih latihan soal yang tersedia →
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}


export default function AISoalPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F5F7FA]">
          <Navbar />

          <div className="flex min-h-[70vh] items-center justify-center">
            <p className="text-sm text-slate-500">
              Memuat latihan...
            </p>
          </div>
        </main>
      }
    >
      <AISoalContent />
    </Suspense>
  );
}