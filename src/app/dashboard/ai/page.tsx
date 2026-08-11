
"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";
import { generateAIReport } from "../../lib/aiLearningReport";

export default function AIDashboardPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAI = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data } = await supabase
        .from("exam_attempts")
        .select(`
          topic_stats,
          score,
          created_at,
          exam_packages(
            title
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data?.topic_stats) {
        const ai = generateAIReport(data.topic_stats);
        setReport(ai);
      }

      setLoading(false);
    };

    loadAI();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F7FA]">
        <Navbar />

        <section className="flex min-h-[75vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#234F42]" />

            <p className="mt-5 text-sm font-medium text-slate-500">
              Menyiapkan analisis pembelajaran...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#061B3A]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200 backdrop-blur">
              Learning Intelligence
            </div>

            <h1 className="font-poppins text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Analisis Pembelajaran
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Pahami pola belajarmu melalui analisis hasil ujian dan
              identifikasi topik yang sudah dikuasai maupun yang masih
              membutuhkan perhatian.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* INTRO CARD */}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#234F42]">
                  Personal Learning Profile
                </p>

                <h2 className="mt-2 font-poppins text-2xl font-extrabold text-[#061B3A]">
                  Gambaran kemampuanmu
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Hasil di bawah ini disusun berdasarkan performa pada ujian
                  terakhir yang tercatat di MediVault.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EEF6F3]">
                <div className="h-6 w-6 rounded-full border-[3px] border-[#234F42]" />
              </div>

            </div>
          </div>

          {/* STRONGEST + WEAKEST */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* STRONGEST */}
            <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm md:p-7">

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                    Strengths
                  </p>

                  <h2 className="mt-2 font-poppins text-2xl font-extrabold text-[#061B3A]">
                    Topik Terkuat
                  </h2>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                  Performa tinggi
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Area materi yang menunjukkan performa paling baik pada
                hasil ujian terakhir.
              </p>

              <div className="mt-6 space-y-3">
                {report?.strongest?.length > 0 ? (
                  report.strongest.map((item: any) => (
                    <div
                      key={item.topic}
                      className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-poppins font-bold text-[#061B3A]">
                          {item.topic}
                        </p>

                        <span className="shrink-0 text-lg font-extrabold text-emerald-700">
                          {item.score}%
                        </span>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all"
                          style={{
                            width: `${Math.min(item.score, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                    <p className="text-sm text-slate-500">
                      Belum cukup data untuk menentukan topik terkuat.
                    </p>
                  </div>
                )}
              </div>
            </div>

    {/* REKOMENDASI BELAJAR */}
<div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-[#F4FFFB] via-white to-[#F0FBF7] shadow-sm">

  <div className="p-6 md:p-8">

    {/* HEADER */}
    <div className="flex items-start gap-4">

      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF7F1] text-[#234F42] shadow-sm">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
        </svg>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#234F42]">
          Personal Learning
        </p>

        <h2 className="mt-1 font-poppins text-2xl font-extrabold tracking-tight text-[#061B3A] md:text-3xl">
          Rekomendasi Belajar
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Fokuskan waktu belajarmu pada materi yang paling membutuhkan
          penguatan.
        </p>
      </div>

    </div>


    {/* RECOMMENDATION LIST */}
    <div className="mt-7 space-y-4">

      {report?.weakest?.length > 0 ? (

        report.weakest.map((item: any, index: number) => (

          <div
            key={item.topic}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
          >

            {/* TOP */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF7F3] text-sm font-extrabold text-[#234F42]">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                    Prioritas {index + 1}
                  </p>

                  <h3 className="mt-1 font-poppins text-lg font-extrabold text-[#061B3A]">
                    {item.topic}
                  </h3>
                </div>

              </div>


              {/* SCORE */}
              <div className="flex items-center gap-3 sm:text-right">

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Kemampuan saat ini
                  </p>

                  <p className="mt-0.5 text-2xl font-extrabold text-[#234F42]">
                    {item.score}%
                  </p>
                </div>

              </div>

            </div>


            {/* PROGRESS */}
            <div className="mt-5">

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Progress penguasaan</span>
                <span>{item.score}%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-[#234F42] transition-all duration-700"
                  style={{
                    width: `${Math.min(item.score, 100)}%`,
                  }}
                />

              </div>

            </div>


            {/* RECOMMENDATION */}
            <div className="mt-5 grid gap-3 md:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#234F42] shadow-sm">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                    </svg>
                  </div>

                  <p className="text-sm font-bold text-[#061B3A]">
                    Review
                  </p>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Perkuat kembali konsep dasar materi.
                </p>

              </div>


              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#234F42] shadow-sm">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </div>

                  <p className="text-sm font-bold text-[#061B3A]">
                    Latihan
                  </p>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Kerjakan kembali soal untuk menguji pemahaman.
                </p>

              </div>


              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#234F42] shadow-sm">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                      <path d="M14 2v6h6" />
                      <path d="M8 13h8" />
                      <path d="M8 17h5" />
                    </svg>
                  </div>

                  <p className="text-sm font-bold text-[#061B3A]">
                    Pembahasan
                  </p>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Pelajari alasan di balik setiap jawaban.
                </p>

              </div>

            </div>


            {/* CTA */}
            <div className="mt-5">

              <button
                onClick={() => {
                  window.location.href = `/materi/${encodeURIComponent(
                    item.topic
                  )}`;
                }}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#234F42] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#1C3B32] hover:shadow-lg"
              >

                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>

                <span>Pelajari Materi</span>

                <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>

              </button>

            </div>

          </div>

        ))

      ) : (

        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">

          <p className="font-semibold text-[#061B3A]">
            Belum ada rekomendasi belajar.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Kerjakan lebih banyak latihan untuk mendapatkan rekomendasi
            yang lebih personal.
          </p>

        </div>

      )}

    </div>

  </div>

</div>
          </div>

          {/* BOTTOM INSIGHT */}
          <div className="rounded-[2rem] border border-slate-200 bg-[#061B3A] p-6 text-white shadow-sm md:p-8">

            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                Learning Insight
              </p>

              <h2 className="mt-2 font-poppins text-2xl font-extrabold">
                Belajar lebih terarah, bukan sekadar lebih lama.
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Gunakan hasil analisis ini untuk menentukan prioritas belajar.
                Pertahankan topik yang sudah kuat dan alokasikan lebih banyak
                waktu pada area yang masih membutuhkan penguatan.
              </p>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
