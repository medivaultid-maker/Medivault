import { supabase } from "./supabase";

/* ==========================
   PACKAGE
========================== */

export async function getPackages() {
  return await supabase
    .from("exam_packages")
    .select("*")
    .eq("status", "published");
}

export async function createPackage(
  packageData: {
    title: string;
    category: string;
    block: string;
    duration: number;
    token_cost: number;
    total_questions: number;
  },
  questions: Array<{
    topic?: string;
    question: string;
    image?: string | null;
    options?: string[] | null;
    answer?: number | null;
    essay_answer?: string[] | null;
    discussion?: string | null;
    discussion_image?: string | null;
  }>
) {
  // 1. Buat paket
  const { data: paket, error: packageError } = await supabase
    .from("exam_packages")
    .insert([
      {
        title: packageData.title,
        category: packageData.category,
        block: packageData.block,
        duration: packageData.duration,
        token_cost: packageData.token_cost,
        total_questions: packageData.total_questions,
        status: "published",
      },
    ])
    .select()
    .single();

  if (packageError || !paket) {
    console.error("Gagal membuat paket:", packageError);

    return {
      data: null,
      error:
        packageError ||
        new Error("Paket gagal dibuat"),
    };
  }

  // 2. Siapkan data soal
  const questionRows = questions.map((q, index) => ({
    package_id: paket.id,

    topic: q.topic || null,

    question: q.question,
    image: q.image || null,

    options: q.options || null,
    answer: q.answer ?? null,

    essay_answer:
      q.essay_answer?.filter(
        (value) => value.trim() !== ""
      ) || [],

    discussion: q.discussion || "",
    discussion_image: q.discussion_image || null,

    order_no: index + 1,
  }));

  // 3. Simpan soal
  const {
    data: savedQuestions,
    error: questionError,
  } = await supabase
    .from("questions")
    .insert(questionRows)
    .select();

  if (questionError) {
    console.error(
      "Gagal menyimpan soal:",
      questionError
    );

    // Hapus paket jika soal gagal disimpan
    await supabase
      .from("exam_packages")
      .delete()
      .eq("id", paket.id);

    return {
      data: null,
      error: questionError,
    };
  }

  return {
    data: {
      package: paket,
      questions: savedQuestions,
    },
    error: null,
  };
}