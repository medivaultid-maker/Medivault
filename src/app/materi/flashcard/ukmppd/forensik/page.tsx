import FlashcardProductPage from "../../../../components/info/FlashcardProductPage";

const previews = [
  {
    src: "/images/ukmppd/forensik-v-preview.png",
    title: "Daftar Materi",
    desc: "Kumpulan materi penting ilmu kedokteran forensik untuk persiapan UKMPPD.",
  },
  {
    src: "/images/ukmppd/forensik-v-soal.png",
    title: "Contoh Soal",
    desc: "Contoh soal forensik untuk melatih kemampuan memahami kasus.",
  },
  {
    src: "/images/ukmppd/forensik-v-pembahasan.png",
    title: "Contoh Pembahasan",
    desc: "Pembahasan singkat untuk membantu memahami konsep kedokteran forensik.",
  },
];

export default function ForensikVPage() {
  return (
    <FlashcardProductPage
      title="Forensik"
      subtitle="Flashcard Anki kedokteran forensik untuk membantu mengingat konsep penting dan menghadapi soal UKMPPD."
      description="Kumpulan flashcard kedokteran forensik yang disusun untuk membantu memperkuat pemahaman konsep dan mengenali pola kasus yang sering ditanyakan."
      price="Rp25.000"
      checkoutUrl="LINK_CHECKOUT_FORENSIK"
      previews={previews}
    />
  );
}