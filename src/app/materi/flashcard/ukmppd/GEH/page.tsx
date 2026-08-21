import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/geh-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi penting gastroenterohepatologi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/geh-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal GEH untuk melatih kemampuan memahami kasus klinis.",
  },
  {
    src: "/images/ukmppd/geh-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan untuk membantu memahami konsep dan tatalaksana.",
  },
];

export default function GEHVPage() {
  return (
    <FlashcardProductPage
      title="GEH"
      subtitle="Flashcard Anki gastroenterohepatologi untuk membantu memperkuat pemahaman konsep, diagnosis, dan tatalaksana UKMPPD."
      description="Kumpulan flashcard gastroenterohepatologi yang membantu review berbagai penyakit saluran cerna, hati, dan sistem terkait."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_GEH"
      previews={previews}
    />
  );
}