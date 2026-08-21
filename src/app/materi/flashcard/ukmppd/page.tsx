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
    title: "Dermatovenerologi",
    description:
      "Flashcard untuk membantu mengingat diagnosis, tatalaksana, dan konsep penting dermatovenerologi.",
    href: "/materi/flashcard/ukmppd/dermatovenerologi",
    available: true,
  },
  {
    title: "Forensik",
    description:
      "Flashcard untuk review cepat konsep penting ilmu kedokteran forensik.",
    href: "/materi/flashcard/ukmppd/forensik",
    available: true,
  },
  {
    title: "GEH",
    description:
      "Flashcard untuk membantu mengingat konsep dan kasus penting gastroenterohepatologi.",
    href: "/materi/flashcard/ukmppd/GEH",
    available: true,
  },
  {
    title: "Ginekologi",
    description:
      "Flashcard untuk review diagnosis dan tatalaksana penting dalam bidang ginekologi.",
    href: "/materi/flashcard/ukmppd/ginekologi",
    available: true,
  },
  {
    title: "HOM",
    description:
      "Flashcard untuk membantu mengingat konsep penting hematologi dan onkologi medik.",
    href: "/materi/flashcard/ukmppd/HOM",
    available: true,
  },
  {
    title: "IKM",
    description:
      "Flashcard untuk review konsep penting ilmu kesehatan masyarakat.",
    href: "/materi/flashcard/ukmppd/IKM",
    available: true,
  },
  {
    title: "Kardiologi",
    description:
      "Flashcard untuk membantu mengingat diagnosis dan tatalaksana penting kardiologi.",
    href: "/materi/flashcard/ukmppd/kardiologi",
    available: true,
  },
  {
    title: "Mata",
    description:
      "Flashcard untuk review cepat penyakit dan konsep penting oftalmologi.",
    href: "/materi/flashcard/ukmppd/mata",
    available: true,
  },
  {
    title: "Neurologi",
    description:
      "Flashcard untuk membantu mengingat diagnosis dan konsep penting neurologi.",
    href: "/materi/flashcard/ukmppd/neurologi",
    available: true,
  },
  {
    title: "Obstetri",
    description:
      "Flashcard untuk review konsep, diagnosis, dan tatalaksana penting obstetri.",
    href: "/materi/flashcard/ukmppd/obstetri",
    available: true,
  },
  {
    title: "Pediatri",
    description:
      "Flashcard untuk membantu mengingat konsep dan kasus penting pediatri.",
    href: "/materi/flashcard/ukmppd/pediatri",
    available: true,
  },
  {
    title: "Psikiatri",
    description:
      "Flashcard untuk review diagnosis dan konsep penting psikiatri.",
    href: "/materi/flashcard/ukmppd/psikiatri",
    available: true,
  },
  {
    title: "Respirasi",
    description:
      "Flashcard untuk membantu mengingat diagnosis dan tatalaksana penting sistem respirasi.",
    href: "/materi/flashcard/ukmppd/respirasi",
    available: true,
  },
  {
    title: "THT",
    description:
      "Flashcard untuk review cepat penyakit dan konsep penting THT.",
    href: "/materi/flashcard/ukmppd/THT",
    available: true,
  },
  {
    title: "Endokrin",
    description:
      "Flashcard untuk membantu mengingat konsep, diagnosis, dan tatalaksana penting endokrinologi.",
    href: "/materi/flashcard/ukmppd/endokrin",
    available: true,
  },
  {
    title: "Kedokteran Tropis",
    description:
      "Flashcard untuk review penyakit infeksi dan konsep penting kedokteran tropis.",
    href: "/materi/flashcard/ukmppd/kedokteran-tropis",
    available: true,
  },
  {
    title: "Nefrologi",
    description:
      "Flashcard untuk membantu mengingat diagnosis dan tatalaksana penting nefrologi.",
    href: "/materi/flashcard/ukmppd/nefrologi",
    available: true,
  },
  {
    title: "Bedah",
    description:
      "Flashcard untuk review cepat konsep, diagnosis, dan tatalaksana penting bidang bedah.",
    href: "/materi/flashcard/ukmppd/bedah",
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