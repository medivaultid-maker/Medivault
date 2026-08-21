import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/kedokteran-tropis-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi kedokteran tropis untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/kedokteran-tropis-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal penyakit infeksi dan kedokteran tropis.",
  },
  {
    src: "/images/ukmppd/kedokteran-tropis-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan untuk membantu memahami diagnosis dan tatalaksana.",
  },
];

export default function KedokteranTropisVPage() {
  return (
    <FlashcardProductPage
      title="Kedokteran Tropis"
      subtitle="Flashcard Anki kedokteran tropis untuk membantu mengingat penyakit infeksi dan konsep penting UKMPPD."
      description="Kumpulan flashcard kedokteran tropis yang membantu review berbagai penyakit infeksi dan parasit yang penting untuk UKMPPD."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_KEDOKTERAN_TROPIS"
      previews={previews}
    />
  );
}