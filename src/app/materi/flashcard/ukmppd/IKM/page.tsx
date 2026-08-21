import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/ikm-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi ilmu kesehatan masyarakat untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/ikm-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal IKM untuk melatih pemahaman konsep.",
  },
  {
    src: "/images/ukmppd/ikm-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan singkat untuk membantu memahami konsep penting IKM.",
  },
];

export default function IKMVPage() {
  return (
    <FlashcardProductPage
      title="IKM"
      subtitle="Flashcard Anki ilmu kesehatan masyarakat untuk membantu menguasai konsep penting UKMPPD."
      description="Kumpulan flashcard ilmu kesehatan masyarakat yang membantu review konsep epidemiologi, promotif, preventif, dan kesehatan masyarakat."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_IKM"
      previews={previews}
    />
  );
}