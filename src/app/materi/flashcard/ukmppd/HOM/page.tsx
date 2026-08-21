import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/hom-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi hematologi dan onkologi medik untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/hom-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal hematologi dan onkologi medik.",
  },
  {
    src: "/images/ukmppd/hom-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan untuk membantu memahami konsep dan diagnosis.",
  },
];

export default function HOMVPage() {
  return (
    <FlashcardProductPage
      title="HOM"
      subtitle="Flashcard Anki hematologi dan onkologi medik untuk membantu persiapan menghadapi UKMPPD."
      description="Kumpulan flashcard hematologi dan onkologi medik yang membantu review konsep, diagnosis, dan tatalaksana penting."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_HOM"
      previews={previews}
    />
  );
}