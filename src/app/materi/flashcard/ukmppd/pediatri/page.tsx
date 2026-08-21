import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/pediatri-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi pediatri untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/pediatri-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal pediatri berdasarkan kasus anak.",
  },
  {
    src: "/images/ukmppd/pediatri-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan untuk membantu memahami diagnosis dan tatalaksana anak.",
  },
];

export default function PediatriVPage() {
  return (
    <FlashcardProductPage
      title="Pediatri"
      subtitle="Flashcard Anki pediatri untuk membantu mengingat diagnosis, konsep, dan tatalaksana penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard pediatri yang membantu review berbagai penyakit dan kondisi klinis pada anak."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_PEDIATRI"
      previews={previews}
    />
  );
}