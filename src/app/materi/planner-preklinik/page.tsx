"use client";

import InfoLayout from "../../components/info/InfoLayout";
import InfoHero from "../../components/info/InfoHero";
import {
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Clock3,
  Target,
} from "lucide-react";

export default function PlannerPreklinikPage() {
  return (
    <InfoLayout>
      {/* HERO */}
      <InfoHero
        title="Planner Preklinik"
        subtitle="Bantu atur perjalanan belajar preklinik dengan lebih terstruktur, mulai dari jadwal belajar, target blok, hingga progres belajar."
        icon={<CalendarCheck size={40} />}
      />

      {/* DESKRIPSI */}
      <section className="mx-auto max-w-7xl px-6 pt-2 pb-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_14px_40px_rgba(6,27,58,0.06)] md:p-10">

            <h2 className="text-2xl font-black text-[#061B3A]">
              Planner Belajar Preklinik
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Planner Preklinik dibuat untuk membantu kamu mengatur proses
              belajar selama masa preklinik agar lebih terarah dan mudah
              dipantau. Kamu dapat menyusun target belajar, mengatur jadwal,
              dan melihat progresmu dalam satu tempat.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-[#0F766E]"
                />

                <p className="text-slate-600">
                  Membantu mengatur jadwal belajar dan target harian
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-[#0F766E]"
                />

                <p className="text-slate-600">
                  Membantu memantau progres belajar setiap blok
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-[#0F766E]"
                />

                <p className="text-slate-600">
                  Dapat digunakan untuk merencanakan persiapan ujian
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-[#0F766E]"
                />

                <p className="text-slate-600">
                  Bisa disesuaikan dengan kebutuhan belajar masing-masing
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FITUR */}
      <section className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
            <CalendarCheck size={28} />
          </div>

          <h2 className="mt-4 text-3xl font-black text-[#061B3A]">
            Apa yang Bisa Kamu Atur?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
            Gunakan planner untuk membantu mengatur perjalanan belajar
            preklinikmu dengan lebih terstruktur.
          </p>

        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">

          {/* JADWAL */}
          <div className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-[0_14px_40px_rgba(6,27,58,0.06)]">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
              <Clock3 size={26} />
            </div>

            <h3 className="mt-5 text-xl font-black text-[#061B3A]">
              Jadwal Belajar
            </h3>

            <p className="mt-3 leading-6 text-slate-500">
              Atur waktu belajar dan tentukan target yang ingin diselesaikan
              setiap harinya.
            </p>

          </div>

          {/* TARGET */}
          <div className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-[0_14px_40px_rgba(6,27,58,0.06)]">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
              <Target size={26} />
            </div>

            <h3 className="mt-5 text-xl font-black text-[#061B3A]">
              Target Belajar
            </h3>

            <p className="mt-3 leading-6 text-slate-500">
              Tentukan materi dan target yang ingin kamu kuasai sebelum
              menghadapi ujian.
            </p>

          </div>

          {/* PROGRES */}
          <div className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-[0_14px_40px_rgba(6,27,58,0.06)]">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
              <BookOpen size={26} />
            </div>

            <h3 className="mt-5 text-xl font-black text-[#061B3A]">
              Pantau Progres
            </h3>

            <p className="mt-3 leading-6 text-slate-500">
              Tandai materi yang sudah dipelajari dan lihat perkembangan
              belajarmu secara lebih terstruktur.
            </p>

          </div>

        </div>

      </section>

      {/* CTA NOTION */}
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-12">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-[#0A1733] p-8 shadow-[0_24px_70px_rgba(6,27,58,0.16)] md:p-10">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">
                Planner Preklinik
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Siap mengatur perjalanan belajarmu?
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-white/70">
                Buka Planner Preklinik dan mulai susun jadwal, target,
                serta progres belajar kamu.
              </p>

            </div>

            <a
              href="http://lynk.id/medivault/x759led885z9/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-extrabold text-[#061B3A] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ECFDF5]"
            >
              <ExternalLink size={19} />
              Buka Planner
            </a>

          </div>

        </div>

      </section>

    </InfoLayout>
  );
}