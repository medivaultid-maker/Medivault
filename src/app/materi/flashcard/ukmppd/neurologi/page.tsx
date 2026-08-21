import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/neurologi-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi neurologi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/neurologi-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal neurologi berdasarkan kasus klinis.",
  },
  {
    src: "/images/ukmppd/neurologi-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan tatalaksana kasus neurologi.",
  },
];

export default function NeurologiVPage() {
  return (
    <FlashcardProductPage
      title="Neurologi"
      subtitle="Flashcard Anki neurologi untuk membantu mengingat diagnosis dan konsep penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard neurologi yang membantu memperkuat pemahaman berbagai penyakit sistem saraf dan kasus klinis."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_NEUROLOGI"
      previews={previews}
    />
  );
}