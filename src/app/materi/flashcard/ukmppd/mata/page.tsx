import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/mata-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi oftalmologi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/mata-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal mata berdasarkan berbagai kasus klinis.",
  },
  {
    src: "/images/ukmppd/mata-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan untuk membantu memahami diagnosis dan tatalaksana.",
  },
];

export default function MataVPage() {
  return (
    <FlashcardProductPage
      title="Mata"
      subtitle="Flashcard Anki oftalmologi untuk membantu mengingat penyakit, diagnosis, dan tatalaksana penting UKMPPD."
      description="Kumpulan flashcard oftalmologi yang membantu review berbagai penyakit mata yang penting untuk menghadapi UKMPPD."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_MATA"
      previews={previews}
    />
  );
}