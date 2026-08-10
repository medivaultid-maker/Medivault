import InfoLayout from "../../../components/info/InfoLayout";
import InfoHero from "../../../components/info/InfoHero";
import Link from "next/link";

import {
  GraduationCap,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";

const flashcards = [
  {
    title: "Penyakit Dalam",
    description:
      "Flashcard untuk membantu mengingat konsep, diagnosis, dan tatalaksana penting penyakit dalam.",
    available: false,
  },
  {
    title: "Bedah",
    description:
      "Flashcard untuk review cepat konsep dan kasus penting dalam bidang bedah.",
    available: false,
  },
  {
    title: "Ilmu Kesehatan Anak",
    description:
      "Flashcard untuk membantu mengingat konsep dan kasus penting pediatri.",
    available: false,
  },
  {
    title: "Obstetri & Ginekologi",
    description:
      "Flashcard untuk review konsep penting obstetri dan ginekologi.",
    available: false,
  },
  {
    title: "Neurologi",
    description:
      "Flashcard untuk membantu mengingat diagnosis dan konsep penting neurologi.",
    available: false,
  },
  {
    title: "Mata",
    description:
      "Flashcard untuk review cepat penyakit dan konsep penting oftalmologi.",
    available: false,
  },
  {
    title: "THT",
    description:
      "Flashcard untuk membantu mengingat konsep dan kasus penting THT.",
    available: false,
  },
  {
  title: "Kulit & Kelamin",
  description:
    "Flashcard untuk review diagnosis dan konsep penting dermatologi.",
  href: "/materi/flashcard/ukmppd/kulit-kelamin",
  available: true,
},
{
    title: "Mastering Soal",
    description:
      "Soal yang sering keluar dan menjebak di UKMPPD.",
    href: "/materi/flashcard/ukmppd/mastering-soal",
  available: true,
  },
  {
    title: "Mastering Soal Pt. 2",
    description:
      "Soal yang sering keluar dan menjebak di UKMPPD.",
    href: "/materi/flashcard/ukmppd/mastering-soal-pt.2",
  available: true,
  },
];

export default function UKMPPDFlashcardPage() {
  return (
    <InfoLayout>

      <InfoHero
        title="Flashcard Ujian UKMPPD"
        subtitle="Kartu belajar singkat untuk membantu mengingat konsep dan poin penting dalam persiapan ujian kompetensi dokter."
        icon={<GraduationCap size={40} />}
      />

      <section className="mx-auto max-w-7xl px-6 pt-2 pb-10">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {flashcards.map((item) => {

            const card = (
              <div
                className={`h-full rounded-[32px] border bg-white p-7 shadow-[0_14px_40px_rgba(6,27,58,0.06)] transition ${
  item.available
    ? "border-[#E7F6F0] hover:-translate-y-2 hover:shadow-xl"
    : "border-slate-200 opacity-70"
}`}
              >

                <div className="flex items-center justify-between">

                 <div
  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
    item.available
      ? "bg-[#ECFDF5] text-[#0F766E]"
      : "bg-slate-100 text-slate-400"
  }`}
>
  <GraduationCap size={28} />
</div>

                  {item.available ? (
  <ChevronRight
    size={24}
    className="text-[#0F766E]"
  />
) : (
  <LockKeyhole
    size={20}
    className="text-slate-400"
  />
)}

                </div>

                <h2 className="mt-6 text-2xl font-black text-[#061B3A]">
                  {item.title}
                </h2>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-6">

                  <span
  className={`rounded-full px-4 py-2 text-sm font-bold ${
    item.available
      ? "bg-[#ECFDF5] text-[#0F766E]"
      : "bg-slate-100 text-slate-500"
  }`}
>
  {item.available
    ? "Lihat Flashcard"
    : "Coming Soon"}
</span>

                </div>

              </div>
            );

            return item.available ? (
  <Link
    key={item.title}
    href={item.href}
    className="block"
  >
    {card}
  </Link>
) : (
  <div key={item.title}>
    {card}
  </div>
);
          })}

        </div>

      </section>

    </InfoLayout>
  );
}