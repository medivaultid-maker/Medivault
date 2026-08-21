import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/kardiologi-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi penting kardiologi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/kardiologi-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal kardiologi berdasarkan kasus klinis.",
  },
  {
    src: "/images/ukmppd/kardiologi-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan tatalaksana kasus kardiologi.",
  },
];

export default function KardiologiVPage() {
  return (
    <FlashcardProductPage
      title="Kardiologi"
      subtitle="Flashcard Anki kardiologi untuk membantu mengingat diagnosis dan tatalaksana penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard kardiologi yang disusun untuk membantu memperkuat pemahaman berbagai penyakit jantung dan pembuluh darah."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_KARDIOLOGI"
      previews={previews}
    />
  );
}