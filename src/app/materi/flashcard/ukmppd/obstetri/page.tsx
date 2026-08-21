import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/obstetri-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi obstetri untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/obstetri-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal obstetri berdasarkan berbagai kasus kehamilan.",
  },
  {
    src: "/images/ukmppd/obstetri-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan tatalaksana kasus obstetri.",
  },
];

export default function ObstetriVPage() {
  return (
    <FlashcardProductPage
      title="Obstetri"
      subtitle="Flashcard Anki obstetri untuk membantu mengingat konsep, diagnosis, dan tatalaksana penting UKMPPD."
      description="Kumpulan flashcard obstetri yang membantu review berbagai kondisi kehamilan, persalinan, dan komplikasi obstetri."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_OBSTETRI"
      previews={previews}
    />
  );
}