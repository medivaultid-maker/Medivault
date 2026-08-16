import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";
import Link from "next/link";

import {
  BookOpen,
  FileText,
  Microscope,
  Stethoscope,
  Layers,
  LockKeyhole,
  CalendarCheck,
} from "lucide-react";


const materials = [
  {
  icon: <CalendarCheck size={30} />,
  title: "Planner Preklinik",
  desc: "Bantu atur jadwal belajar, target blok, dan progres akademik selama masa preklinik.",
  href: "/materi/planner-preklinik",
},
  {
  icon: <BookOpen size={32} />,
  title: "Ebook Kedokteran",
  desc: "Kumpulan ebook kedokteran yang ringkas dan sistematis.",
  href: "/materi/ebook",
},
  {
    icon: <FileText size={30} />,
    title: "Catatan Materi",
    desc: "Ringkasan materi kuliah kedokteran yang disusun lebih sederhana dan sistematis.",
    href: "/materi/catatan",
  },
  {
  icon: <Microscope size={30} />,
  title: "Flashcard Ujian",
  desc: "Kartu belajar singkat untuk mengingat konsep dan poin penting sebelum ujian.",
  href: "/materi/flashcard",
},
  {
  icon: <Layers size={32} />,
  title: "Flashcard UKMPPD",
  desc: "Flashcard khusus untuk membantu review konsep dan materi penting dalam persiapan ujian kompetensi dokter.",
  href: "/materi/flashcard/ukmppd",
},
];


export default function MateriPage() {
  return (
    <InfoLayout>

      <InfoHero
        title="Materi Medivault"
        subtitle="Akses berbagai sumber belajar kedokteran mulai dari ebook, catatan materi, atlas, hingga catatan koas."
        icon={<BookOpen size={40} />}
      />


      <section className="mx-auto max-w-7xl px-6 pt-0 pb-10">

  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

    {materials.map((item) => {
  const card = (
    <div
      className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
        {item.icon}
      </div>

      <h2 className="mt-6 text-2xl font-black text-[#061B3A]">
        {item.title}
      </h2>

      <p className="mt-4 leading-7 text-slate-600">
        {item.desc}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            item.href
              ? "bg-[#ECFDF5] text-[#0F766E]"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {item.href ? "Lihat Materi" : "Coming Soon"}
        </span>

        {!item.href && (
          <LockKeyhole size={20} className="text-slate-400" />
        )}
      </div>
    </div>
  );

  return item.href ? (
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


      <InfoCTA />

    </InfoLayout>
  );
}