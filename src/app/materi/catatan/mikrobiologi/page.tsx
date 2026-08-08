import Link from "next/link";
import InfoLayout from "../../../components/info/InfoLayout";
import InfoHero from "../../../components/info/InfoHero";

import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
} from "lucide-react";

const chapters = [
  "Diagnostik Mikrobiologi Klinik",
  "Peran Instalasi Laboratorium Infeksi (PPRA)",
  "Morfologi & Struktur Mikroorganisme",
  "Flora Normal",
  "Interaksi Host-Parasit",
  "Imunologi Infeksi: Bakteri, Virus & Jamur",
  "Bakteri Penyebab Infeksi Saluran Napas",
  "Enterobacteriaceae",
  "Enterobacteriaceae Fermenter",
  "Bakteri Infeksi Saluran Kemih",
  "Bakteri Infeksi Saluran Genitalia",
  "Bakteri Infeksi Saluran Darah",
  "Bakteri Anaerob",
  "Candida",
];

export default function MikrobiologiPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Mikrobiologi"
        subtitle="Rangkuman materi mikrobiologi yang disusun berdasarkan bab pembelajaran."
        icon={<BookOpen size={40} />}
      />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Link
          href="/materi/catatan"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] hover:underline"
        >
          <ArrowLeft size={18} />
          Kembali ke Catatan Materi
        </Link>

        <div className="mb-10">
          <h2 className="text-3xl font-black text-[#061B3A]">
            Daftar Bab
          </h2>

          <p className="mt-3 text-slate-600">
            Pilih bab yang ingin kamu pelajari.
          </p>
        </div>

        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <Link
              key={chapter}
              href={`/materi/catatan/mikrobiologi/${index + 1}`}
              className="group flex items-center gap-5 rounded-2xl border border-[#E7F6F0] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-sm font-black text-[#0F766E]">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  Bab {index + 1}
                </p>

                <h3 className="mt-1 text-lg font-black text-[#061B3A]">
                  {chapter}
                </h3>
              </div>

              <ChevronRight
                size={22}
                className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]"
              />
            </Link>
          ))}
        </div>
      </section>
    </InfoLayout>
  );
}