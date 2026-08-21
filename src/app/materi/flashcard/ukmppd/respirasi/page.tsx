import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/respirasi-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi respirasi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/respirasi-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal sistem respirasi berdasarkan kasus klinis.",
  },
  {
    src: "/images/ukmppd/respirasi-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan tatalaksana penyakit respirasi.",
  },
];

export default function RespirasiVPage() {
  return (
    <FlashcardProductPage
      title="Respirasi"
      subtitle="Flashcard Anki respirasi untuk membantu mengingat diagnosis dan tatalaksana penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard sistem respirasi yang membantu review berbagai penyakit paru dan saluran napas."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_RESPIRASI"
      previews={previews}
    />
  );
}