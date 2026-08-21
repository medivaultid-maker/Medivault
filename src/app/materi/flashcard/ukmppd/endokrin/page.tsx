import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/endokrin-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi endokrinologi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/endokrin-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal endokrinologi berdasarkan kasus klinis.",
  },
  {
    src: "/images/ukmppd/endokrin-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan tatalaksana penyakit endokrin.",
  },
];

export default function EndokrinVPage() {
  return (
    <FlashcardProductPage
      title="Endokrin"
      subtitle="Flashcard Anki endokrinologi untuk membantu mengingat konsep, diagnosis, dan tatalaksana penting UKMPPD."
      description="Kumpulan flashcard endokrinologi yang membantu review berbagai gangguan hormon dan metabolik."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_ENDOKRIN"
      previews={previews}
    />
  );
}