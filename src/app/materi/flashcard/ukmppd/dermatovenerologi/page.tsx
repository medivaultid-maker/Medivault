import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/dermatovenerologi-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi penting dermatovenerologi untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/dermatovenerologi-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal dermatovenerologi untuk melatih kemampuan memahami kasus klinis.",
  },
  {
    src: "/images/ukmppd/dermatovenerologi-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Dilengkapi pembahasan untuk membantu memahami konsep dan diagnosis.",
  },
];

export default function DermatovenerologiVPage() {
  return (
    <FlashcardProductPage
      title="Dermatovenerologi"
      subtitle="Flashcard Anki dermatovenerologi untuk membantu mengingat diagnosis, konsep, dan tatalaksana penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard dermatovenerologi yang disusun untuk membantu memperkuat pemahaman terhadap berbagai penyakit kulit dan kelamin yang penting untuk persiapan UKMPPD."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_DERMATOVENEROLOGI"
      previews={previews}
    />
  );
}