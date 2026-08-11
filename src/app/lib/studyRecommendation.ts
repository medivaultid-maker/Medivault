
import { supabase } from "./supabase";

export async function generateRecommendation(weakest: any[]) {
  if (!weakest || weakest.length === 0) {
    return [];
  }

  const recommendations = await Promise.all(
    weakest.map(async (item) => {
      const block = item.topic;

      // Ambil semua soal dari block tersebut
      const { data: questions, error } = await supabase
        .from("questions")
        .select("topic")
        .eq("block", block);

      if (error) {
        console.error(
          `Gagal mengambil topic untuk block ${block}:`,
          error
        );
      }

      // Ambil topic unik dari soal yang benar-benar ada di database
      const subtopics = Array.from(
        new Set(
          (questions || [])
            .map((question: any) => question.topic)
            .filter(Boolean)
        )
      );

      return {
        block,
        score: item.score,
        subtopics,

        materials: [
          "Review konsep dasar",
          "Latihan soal kembali",
          "Pelajari pembahasan",
        ],
      };
    })
  );

  return recommendations;
}
