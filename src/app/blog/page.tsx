"use client";

import { useState } from "react";

import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";

import {
  Newspaper,
  Clock3,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const articles = [
  {
    title: "Persiapan UKMPPD / UKOMNAS",
    category: "UKMPPD",
    time: "5 menit baca",
    description:
      "Strategi belajar yang efektif untuk menghadapi ujian kompetensi dokter.",
  },
  {
    title: "Tips Belajar Anatomi",
    category: "Anatomi",
    time: "4 menit baca",
    description:
      "Teknik menghafal anatomi lebih cepat dengan metode visual dan latihan soal.",
  },
  {
    title: "Belajar Histologi Lebih Mudah",
    category: "Histologi",
    time: "4 menit baca",
    description:
      "Memahami preparat histologi dengan pendekatan sederhana dan sistematis.",
  },
  {
    title: "Dasar Farmakologi",
    category: "Farmakologi",
    time: "6 menit baca",
    description:
      "Ringkasan obat-obatan penting yang sering muncul dalam CBT kedokteran.",
  },
  {
    title: "Persiapan OSCE",
    category: "OSCE",
    time: "5 menit baca",
    description:
      "Tips meningkatkan kepercayaan diri saat menghadapi ujian keterampilan klinis.",
  },
  {
    title: "Catatan Koas",
    category: "Koas",
    time: "3 menit baca",
    description:
      "Pengalaman dan tips menjalani kepaniteraan klinik dengan lebih efektif.",
  },
];

export default function BlogPage() {

  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = [
    "Semua",
    "UKMPPD",
    "OSCE",
    "Anatomi",
    "Histologi",
    "Farmakologi",
    "Koas",
  ];

  const filteredArticles =
    selectedCategory === "Semua"
      ? articles
      : articles.filter(
          (article) => article.category === selectedCategory
        );

  return (
    <InfoLayout>
      <InfoHero
        title="Blog Medivault"
        subtitle="Temukan artikel, tips belajar, dan informasi terbaru untuk membantu perjalanan Anda menjadi dokter yang kompeten."
        icon={<Newspaper size={40} />}
      />

     {/* CATEGORIES */}
<section className="mx-auto max-w-6xl px-6 pt-4">
  <div className="flex flex-wrap justify-center gap-4">
    {categories.map((item) => (
      <button
        key={item}
        onClick={() => setSelectedCategory(item)}
        className={`rounded-full border px-5 py-2 font-semibold transition ${
          selectedCategory === item
            ? "bg-[#0F766E] text-white"
            : "border-[#DDFBEF] bg-[#ECFDF5] text-[#0F766E] hover:bg-[#0F766E] hover:text-white"
        }`}
      >
        {item}
      </button>
    ))}
  </div>
</section>

      {/* ARTICLES */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-16">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <div
              key={article.title}
              className="overflow-hidden rounded-[32px] border border-[#E7F6F0] bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-[#ECFDF5] to-[#DDFBEF]">
                <BookOpen
                  size={70}
                  className="text-[#0F766E]"
                />
              </div>

              <div className="p-8">
                <span className="rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-bold text-[#0F766E]">
                  {article.category}
                </span>

                <h2 className="mt-5 text-2xl font-black text-[#061B3A]">
                  {article.title}
                </h2>

                <p className="mt-4 leading-8 text-slate-600">
                  {article.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={16} />
                    {article.time}
                  </div>

                  <button className="flex items-center gap-2 font-bold text-[#0F766E] transition hover:gap-3">
                    Baca

                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <InfoCTA />
    </InfoLayout>
  );
}