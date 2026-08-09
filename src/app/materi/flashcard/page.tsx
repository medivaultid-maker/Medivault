import InfoLayout from "../../components/info/InfoLayout";
import InfoHero from "../../components/info/InfoHero";
import Link from "next/link";

import {
  Brain,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";

const flashcards = [
  {
    title: "Anatomi",
    description:
      "Flashcard untuk membantu mengingat struktur dan konsep penting anatomi.",
    available: false,
  },
  {
    title: "Histologi",
    description:
      "Flashcard untuk membantu mengingat konsep dan struktur penting histologi sebelum ujian.",
    href: "/materi/flashcard/histologi",
    available: true,
  },
  {
    title: "Fisiologi",
    description:
      "Flashcard untuk membantu mengingat struktur dan konsep penting fisiologi.",
    available: false,
  },
  {
    title: "Mikrobiologi",
    description:
      "Flashcard untuk review cepat konsep dan mikroorganisme penting.",
    available: false,
  },
  {
    title: "Parasitologi",
    description:
      "Flashcard untuk membantu mengingat parasit dan penyakit yang ditimbulkannya.",
    available: false,
  },
];

export default function FlashcardPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Flashcard Ujian"
        subtitle="Kartu belajar singkat untuk membantu mengingat konsep dan poin penting sebelum ujian."
        icon={<Brain size={40} />}
      />

      <section className="mx-auto max-w-7xl px-6 pt-2 pb-10">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {flashcards.map((item) => {
            const card = (
              <div
                className={`h-full rounded-[32px] border bg-white p-7 shadow-lg transition ${
                  item.available
                    ? "border-[#E7F6F0] hover:-translate-y-2 hover:shadow-xl"
                    : "border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
                    <Brain size={28} />
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
              <div key={item.title}>{card}</div>
            );
          })}
        </div>
      </section>
    </InfoLayout>
  );
}