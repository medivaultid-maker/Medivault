import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/nefrologi-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi nefrologi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/nefrologi-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal nefrologi berdasarkan berbagai kasus klinis.",
  },
  {
    src: "/images/ukmppd/nefrologi-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan tatalaksana penyakit ginjal.",
  },
];

export default function NefrologiVPage() {
  return (
    <FlashcardProductPage
      title="Nefrologi"
      subtitle="Flashcard Anki nefrologi untuk membantu mengingat diagnosis dan tatalaksana penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard nefrologi yang membantu review berbagai penyakit ginjal, gangguan elektrolit, dan kondisi terkait."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_NEFROLOGI"
      previews={previews}
    />
  );
}