import InfoLayout from "../../components/info/InfoLayout";
import InfoHero from "../../components/info/InfoHero";
import Link from "next/link";

import {
  BookOpen,
  Microscope,
} from "lucide-react";

const ebooks = [
  {
    title: "Ebook Anatomi",
    description:
      "Materi anatomi kedokteran yang ringkas dan sistematis.",
    icon: <BookOpen size={30} />,
    href: "http://lynk.id/medivault/vg6ryv10k6eg/checkout",
  },
  {
    title: "Ebook Histologi",
    description:
      "Materi histologi kedokteran untuk membantu memahami struktur jaringan.",
    icon: <Microscope size={30} />,
    href: "http://lynk.id/medivault/08z95gx6dj0g/checkout",
  },
  {
    title: "Ebook Mikrobiologi",
    description:
      "Materi mikrobiologi kedokteran yang ringkas dan mudah dipelajari.",
    icon: <Microscope size={30} />,
    href: "http://lynk.id/medivault/oj674kkpr5xg/checkout",
  },
  {
    title: "Ebook Parasitologi",
    description:
      "Ringkasan materi parasitologi untuk membantu persiapan belajar dan ujian.",
    icon: <Microscope size={30} />,
    href: "http://lynk.id/medivault/57keqrgx5kgr/checkout",
  },
];

export default function EbookPage() {
  return (
    <InfoLayout>

      {/* HERO */}
      <InfoHero
        title="Ebook Kedokteran"
        subtitle="Kumpulan ebook kedokteran untuk membantu belajar lebih terarah dan sistematis."
        icon={<BookOpen size={40} />}
      />

      {/* EBOOK */}
      <section className="mx-auto max-w-7xl px-6 pt-0 pb-10">

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {ebooks.map((ebook) => (
            <div
              key={ebook.title}
              className="flex h-full flex-col rounded-[26px] border border-slate-100 bg-white p-6 shadow-[0_14px_40px_rgba(6,27,58,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(6,27,58,0.10)]"
            >

              {/* ICON */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
                {ebook.icon}
              </div>

              {/* TITLE */}
              <h2 className="mt-5 text-xl font-black text-[#061B3A]">
                {ebook.title}
              </h2>

              {/* DESCRIPTION */}
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                {ebook.description}
              </p>

              {/* BUTTON */}
              <a
                href={ebook.href}
                target="_blank"
                rel="noopener noreferrer"
               className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#ECFDF5] px-5 py-3 text-sm font-extrabold text-[#0F766E] transition hover:bg-[#D1FAE5] hover:-translate-y-0.5"
              >
                Beli Ebook
              </a>

            </div>
          ))}

        </div>

      </section>

    </InfoLayout>
  );
}