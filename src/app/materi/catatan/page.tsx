import Link from "next/link";
import InfoLayout from "../../components/info/InfoLayout";
import InfoHero from "../../components/info/InfoHero";

import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Microscope,
  Brain,
  HeartPulse,
} from "lucide-react";

const subjects = [
  {
    title: "Anatomi",
    description:
      "Rangkuman materi anatomi manusia mulai dari struktur dasar hingga sistem organ.",
    icon: <Microscope size={30} />,
    total: 0,
    href: "/materi/catatan/anatomi",
  },
  {
    title: "Histologi",
    description:
      "Rangkuman materi histologi manusia mulai dari struktur dasar hingga sistem organ.",
    icon: <Microscope size={30} />,
    total: 0,
    href: "/materi/catatan/histologi",
  },
  {
  title: "Fisiologi",
  description:
    "Rangkuman materi fisiologi manusia mulai dari konsep dasar hingga berbagai sistem organ.",
  icon: <HeartPulse size={30} />,
  total: 17,
  href: "/materi/catatan/fisiologi",
},
{
    title: "Mikrobiologi",
    description:
      "Rangkuman materi mikrobiologi mulai dari dasar mikroorganisme hingga berbagai infeksi klinis.",
    icon: <Microscope size={30} />,
    total: 14,
    href: "/materi/catatan/mikrobiologi",
  },
  {
    title: "Parasitologi",
    description:
      "Rangkuman materi parasitologi, protozoa, helminth, arthropoda, serta penyakit yang ditimbulkannya.",
    icon: <Brain size={30} />,
    total: 0,
    href: "#",
  },
];

export default function CatatanMateriPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Catatan Materi"
        subtitle="Rangkuman materi kedokteran yang disusun per bab agar lebih mudah dipelajari dan dipahami."
        icon={<BookOpen size={40} />}
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <Link
          href="/materi"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] hover:underline"
        >
          <ArrowLeft size={18} />
          Kembali ke Materi
        </Link>

        <div className="mb-10">
          <h2 className="text-3xl font-black text-[#061B3A]">
            Pilih Materi
          </h2>

          <p className="mt-3 text-slate-600">
            Pilih bagian materi untuk melihat daftar bab yang tersedia.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const isAvailable = subject.total > 0;

            const card = (
              <div
                className={`h-full rounded-[32px] border bg-white p-8 shadow-lg transition ${
                  isAvailable
                    ? "border-[#E7F6F0] hover:-translate-y-2 hover:shadow-xl"
                    : "border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
                    {subject.icon}
                  </div>

                  {isAvailable && (
                    <ChevronRight
                      size={24}
                      className="text-[#0F766E]"
                    />
                  )}
                </div>

                <h3 className="mt-7 text-2xl font-black text-[#061B3A]">
                  {subject.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {subject.description}
                </p>

                <div className="mt-7 flex items-center justify-between">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      isAvailable
                        ? "bg-[#ECFDF5] text-[#0F766E]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isAvailable
                      ? `${subject.total} Bab`
                      : "Coming Soon"}
                  </span>
                </div>
              </div>
            );

            return isAvailable ? (
              <Link
                key={subject.title}
                href={subject.href}
                className="block"
              >
                {card}
              </Link>
            ) : (
              <div key={subject.title}>{card}</div>
            );
          })}
        </div>
      </section>
    </InfoLayout>
  );
}