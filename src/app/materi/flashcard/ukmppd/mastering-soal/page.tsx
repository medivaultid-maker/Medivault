"use client";

import InfoLayout from "../../../../components/info/InfoLayout";
import InfoHero from "../../../../components/info/InfoHero";
import { useState } from "react";

import {
  Stethoscope,
  CheckCircle2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
} from "lucide-react";

const previews = [
  {
    src: "/images/ukmppd/mastering-soal-ukmppd-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan soal UKMPPD yang disusun berdasarkan berbagai topik dan bidang ilmu kedokteran.",
  },
  {
    src: "/images/ukmppd/mastering-soal-ukmppd-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal yang digunakan untuk melatih kemampuan memahami kasus dan menentukan jawaban yang paling tepat.",
  },
  {
    src: "/images/ukmppd/mastering-soal-ukmppd-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Dilengkapi jawaban dan pembahasan singkat untuk membantu memahami konsep di balik setiap soal.",
  },
];

export default function MasteringSoalUKMPPDPage() {
  const [activePreview, setActivePreview] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const nextPreview = () => {
    setActivePreview((current) =>
      current === previews.length - 1 ? 0 : current + 1
    );
  };

  const previousPreview = () => {
    setActivePreview((current) =>
      current === 0 ? previews.length - 1 : current - 1
    );
  };

  return (
    <InfoLayout>

      {/* HERO */}
      <InfoHero
        title="Mastering Soal UKMPPD"
        subtitle="Latihan soal UKMPPD dalam bentuk flashcard Anki untuk membantu memperbanyak latihan, mengenali pola soal, dan memperkuat pemahaman konsep."
        icon={<Stethoscope size={40} />}
      />

      {/* DESKRIPSI PRODUK */}
      <section className="mx-auto max-w-7xl px-6 pt-2 pb-10">
        <div className="mx-auto max-w-5xl">

          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_14px_40px_rgba(6,27,58,0.06)] md:p-10">

            <h2 className="text-2xl font-black text-[#061B3A]">
              Mastering Soal UKMPPD
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Mastering Soal UKMPPD merupakan kumpulan soal latihan
              yang dikemas dalam bentuk flashcard Anki untuk membantu
              memperbanyak latihan, mengenali pola soal, dan memperkuat
              pemahaman konsep melalui pembahasan yang sistematis.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-[#3F628F]"
                />

                <p className="text-slate-600">
                  File flashcard siap digunakan di Anki
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-[#3F628F]"
                />

                <p className="text-slate-600">
                  Berisi kumpulan soal latihan UKMPPD
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-[#3F628F]"
                />

                <p className="text-slate-600">
                  Dilengkapi jawaban dan pembahasan
                </p>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="mt-1 shrink-0 text-[#3F628F]"
                />

                <p className="text-slate-600">
                  Membantu latihan dan review soal secara praktis
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2F7] text-[#3F628F]">
            <Eye size={28} />
          </div>

          <h2 className="mt-4 text-3xl font-black text-[#061B3A]">
            Preview Materi
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
            Lihat contoh soal dan pembahasan sebelum membeli.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {previews.map((preview, index) => (

            <button
              key={preview.src}
              onClick={() => {
                setActivePreview(index);
                setShowPreview(true);
              }}
              className="group overflow-hidden rounded-[28px] border border-slate-100 bg-white p-4 text-left shadow-[0_14px_40px_rgba(6,27,58,0.06)] transition hover:-translate-y-1 hover:shadow-xl"
            >

              <div className="relative overflow-hidden rounded-2xl bg-slate-50">

                <img
                  src={preview.src}
                  alt={preview.title}
                  className="h-72 w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-[#061B3A]/0 transition group-hover:bg-[#061B3A]/20">

                  <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#061B3A] opacity-0 shadow-lg transition group-hover:opacity-100">
                    Lihat Preview
                  </span>

                </div>

              </div>

              <h3 className="mt-5 text-xl font-black text-[#061B3A]">
                {preview.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {preview.desc}
              </p>

            </button>

          ))}

        </div>

      </section>

      {/* DETAIL + HARGA */}
      <section className="mx-auto max-w-7xl px-6 pt-6 pb-10">

        <div className="mx-auto max-w-5xl rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_14px_40px_rgba(6,27,58,0.06)] md:p-10">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold text-slate-500">
                Mastering Soal UKMPPD
              </p>

              <p className="mt-1 text-3xl font-black text-[#061B3A]">
                Rp25.000
              </p>

              <p className="mt-2 text-sm text-slate-500">
                File Anki (.apkg) siap digunakan
              </p>

            </div>

            <a
              href="http://lynk.id/medivault/p26e64g2nmpz/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0A1733] to-[#234F42] px-7 py-4 font-extrabold !text-white shadow-[0_18px_40px_rgba(6,27,58,0.18)] transition hover:-translate-y-0.5"
            >
              <ShoppingCart size={19} />
              Beli Materi
            </a>

          </div>

        </div>

      </section>

      {/* LIGHTBOX */}
      {showPreview && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#061B3A]/80 p-5 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >

          <div
            className="relative w-full max-w-5xl rounded-[28px] bg-white p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setShowPreview(false)}
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg transition hover:scale-105"
            >
              <X size={20} />
            </button>

            <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-slate-50 p-4">

              <img
                src={previews[activePreview].src}
                alt={previews[activePreview].title}
                className="max-h-[75vh] max-w-full rounded-xl object-contain"
              />

            </div>

            <div className="flex items-center justify-between px-2 pt-4">

              <div>

                <h3 className="font-black text-[#061B3A]">
                  {previews[activePreview].title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {activePreview + 1} dari {previews.length}
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={previousPreview}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={nextPreview}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white"
                >
                  <ChevronRight size={20} />
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </InfoLayout>
  );
}