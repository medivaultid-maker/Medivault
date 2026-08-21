import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/ginekologi-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi penting ginekologi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/ginekologi-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal ginekologi berdasarkan kasus klinis.",
  },
  {
    src: "/images/ukmppd/ginekologi-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan untuk membantu memahami diagnosis dan tatalaksana.",
  },
];

export default function GinekologiVPage() {
  return (
    <FlashcardProductPage
      title="Ginekologi"
      subtitle="Flashcard Anki ginekologi untuk membantu mengingat diagnosis, konsep, dan tatalaksana penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard ginekologi yang disusun untuk membantu memperkuat pemahaman berbagai kasus dan konsep penting."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_GINEKOLOGI"
      previews={previews}
    />
  );
}