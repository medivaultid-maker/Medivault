import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/bedah-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi bedah untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/bedah-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal bedah berdasarkan berbagai kasus klinis.",
  },
  {
    src: "/images/ukmppd/bedah-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan diagnosis dan tatalaksana kasus bedah.",
  },
];

export default function BedahPage() {
  return (
    <FlashcardProductPage
      title="Bedah"
      subtitle="Flashcard Anki bedah untuk membantu mengingat diagnosis, konsep, dan tatalaksana penting dalam persiapan UKMPPD."
      description="Kumpulan flashcard bedah yang membantu review berbagai kondisi dan kasus bedah yang penting untuk menghadapi UKMPPD."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_BEDAH"
      previews={previews}
    />
  );
}