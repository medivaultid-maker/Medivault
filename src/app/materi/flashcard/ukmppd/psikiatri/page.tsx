import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/psikiatri-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi psikiatri untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/psikiatri-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal psikiatri berdasarkan berbagai kasus klinis.",
  },
  {
    src: "/images/ukmppd/psikiatri-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan konsep penting psikiatri.",
  },
];

export default function PsikiatriVPage() {
  return (
    <FlashcardProductPage
      title="Psikiatri"
      subtitle="Flashcard Anki psikiatri untuk membantu mengingat diagnosis dan konsep penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard psikiatri yang membantu memperkuat pemahaman berbagai gangguan jiwa dan pendekatan kasus klinis."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_PSIKIATRI"
      previews={previews}
    />
  );
}