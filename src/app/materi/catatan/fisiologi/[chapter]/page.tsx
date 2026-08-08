"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import InfoLayout from "../../../../components/info/InfoLayout";
import InfoHero from "../../../../components/info/InfoHero";

import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
} from "lucide-react";

import { supabase } from "../../../../lib/supabase";

const chapters = [
  "Konsep Dasar Fisiologi & Kompartemen Sel dan Jaringan",
  "Dinamika Membran & Komunikasi Sel",
  "Neuron Sifat Seluler dan Jaringannya",
  "Sistem Saraf Pusat",
  "Fisiologi Sensorik dan Divisi Eferen",
  "Otot dan Pengaturan Gerak Tubuh",
  "Kardiovaskular",
  "Aliran Darah dan Pengendalian Tekanan Darah",
  "K10",
  "Pertukaran dan Transpor Gas",
  "Keseimbangan Cairan & Elektrolit",
  "Metabolisme & Keseimbangan Energi",
  "Fisiologi Ginjal",
  "Pengendalian Endokrin",
  "Sistem Pencernaan",
  "Sistem Imun",
  "Sistem Reproduksi",
];

type Material = {
  id: string;
  title: string;
  subject: string;
  chapter: number;
  content: string;
  content_html: string | null;
  source_file: string | null;
  published: boolean;
};

export default function ChapterPage() {
  const params = useParams();

  const chapterNumber = Number(params.chapter);

  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const title =
    chapters[chapterNumber - 1] || "Materi Tidak Ditemukan";

  const previousChapter = chapterNumber - 1;
  const nextChapter = chapterNumber + 1;

  useEffect(() => {
    async function fetchMaterial() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("subject", "Fisiologi")
        .eq("chapter", chapterNumber)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error(error);
        setError("Gagal mengambil materi.");
        setLoading(false);
        return;
      }

      setMaterial(data);
      setLoading(false);
    }

    if (chapterNumber) {
      fetchMaterial();
    }
  }, [chapterNumber]);

  return (
    <InfoLayout>
      <InfoHero
        title={material?.title || title}
        subtitle={`Mikrobiologi • Bab ${String(chapterNumber).padStart(
          2,
          "0"
        )}`}
        icon={<BookOpen size={40} />}
      />

      <section className="mx-auto max-w-5xl px-6 py-12">

        {/* Kembali */}
        <Link
          href="/materi/catatan/fisiologi"
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] hover:underline"
        >
          <ArrowLeft size={18} />
          Kembali ke Fisiologi
        </Link>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-[#0F766E]">
              <Loader2 size={24} className="animate-spin" />
              <span className="font-bold">
                Memuat materi...
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-center">
            <p className="font-bold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Materi tidak ditemukan */}
        {!loading && !error && !material && (
          <div className="rounded-[28px] border border-[#E7F6F0] bg-white p-10 text-center shadow-lg">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
              <FileText size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#061B3A]">
              Materi Belum Tersedia
            </h2>

            <p className="mt-3 text-slate-500">
              Rangkuman untuk Bab {chapterNumber} belum tersedia.
            </p>

          </div>
        )}

        {/* Materi */}
        {!loading && !error && material && (
          <article>

            {/* Header materi */}
            <div className="mb-8 rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg md:p-10">

              <div className="flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-black text-[#0F766E]">
                  {material.subject}
                </span>

                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
                  BAB {String(material.chapter).padStart(2, "0")}
                </span>

              </div>

              <h1 className="mt-6 text-3xl font-black leading-tight text-[#061B3A] md:text-4xl">
                {material.title}
              </h1>

              {material.source_file && (
                <p className="mt-4 text-sm text-slate-400">
                  Sumber: {material.source_file}
                </p>
              )}

            </div>

            {/* Isi materi */}
            <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg md:p-10">

              <div className="flex items-center gap-3 border-b border-slate-100 pb-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#0F766E]">
                  <BookOpen size={24} />
                </div>

                <h2 className="text-2xl font-black text-[#061B3A]">
                  Rangkuman Materi
                </h2>

              </div>

              {/* RICH TEXT */}
              <div
                className="
                  material-content
                  mt-8
                  text-[16px]
                  leading-8
                  text-slate-700

                  [&_p]:mb-5

                  [&_h1]:mb-5
                  [&_h1]:mt-8
                  [&_h1]:text-3xl
                  [&_h1]:font-black
                  [&_h1]:leading-tight
                  [&_h1]:text-[#061B3A]

                  [&_h2]:mb-4
                  [&_h2]:mt-8
                  [&_h2]:text-2xl
                  [&_h2]:font-black
                  [&_h2]:leading-tight
                  [&_h2]:text-[#0F766E]

                  [&_h3]:mb-3
                  [&_h3]:mt-6
                  [&_h3]:text-xl
                  [&_h3]:font-black
                  [&_h3]:text-[#061B3A]

                  [&_strong]:font-black
                  [&_em]:italic
                  [&_u]:underline

                  [&_ul]:mb-5
                  [&_ul]:ml-6
                  [&_ul]:list-disc

                  [&_ol]:mb-5
                  [&_ol]:ml-6
                  [&_ol]:list-decimal

                  [&_li]:mb-2

                  [&_table]:my-8
                  [&_table]:w-full
                  [&_table]:border-collapse

                  [&_th]:border
                  [&_th]:border-slate-200
                  [&_th]:bg-[#ECFDF5]
                  [&_th]:px-4
                  [&_th]:py-3
                  [&_th]:text-left
                  [&_th]:font-black
                  [&_th]:text-[#061B3A]

                  [&_td]:border
                  [&_td]:border-slate-200
                  [&_td]:px-4
                  [&_td]:py-3

                  [&_blockquote]:my-6
                  [&_blockquote]:rounded-2xl
                  [&_blockquote]:border-l-4
                  [&_blockquote]:border-[#0F766E]
                  [&_blockquote]:bg-[#ECFDF5]
                  [&_blockquote]:px-6
                  [&_blockquote]:py-4
                  [&_blockquote]:text-[#115E59]
                "
                dangerouslySetInnerHTML={{
                  __html:
                    material.content_html ||
                    material.content
                      .split("\n")
                      .map((line) =>
                        line.trim()
                          ? `<p>${line}</p>`
                          : "<p><br></p>"
                      )
                      .join(""),
                }}
              />

            </div>

          </article>
        )}

        {/* Navigasi */}
        <div className="mt-10 flex items-center justify-between gap-4">

          {previousChapter >= 1 ? (
            <Link
              href={`/materi/catatan/mikrobiologi/${previousChapter}`}
              className="flex items-center gap-2 rounded-2xl border border-[#E7F6F0] bg-white px-5 py-3 text-sm font-bold text-[#0F766E] shadow-sm transition hover:shadow-md"
            >
              <ChevronLeft size={18} />
              Bab Sebelumnya
            </Link>
          ) : (
            <div />
          )}

          {nextChapter <= chapters.length ? (
            <Link
              href={`/materi/catatan/fisiologi/${nextChapter}`}
              className="flex items-center gap-2 rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#115E59]"
            >
              Bab Berikutnya
              <ChevronRight size={18} />
            </Link>
          ) : (
            <div />
          )}

        </div>

      </section>
    </InfoLayout>
  );
}