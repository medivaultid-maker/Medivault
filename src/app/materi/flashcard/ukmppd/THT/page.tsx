import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/tht-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi THT untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/tht-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal THT berdasarkan berbagai kasus klinis.",
  },
  {
    src: "/images/ukmppd/tht-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan tatalaksana kasus THT.",
  },
];

export default function THTVPage() {
  return (
    <FlashcardProductPage
      title="THT"
      subtitle="Flashcard Anki THT untuk membantu mengingat diagnosis, konsep, dan tatalaksana penting UKMPPD."
      description="Kumpulan flashcard THT yang membantu review berbagai penyakit telinga, hidung, tenggorokan, dan struktur terkait."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_THT"
      previews={previews}
    />
  );
}