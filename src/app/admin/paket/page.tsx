"use client";
import { supabase } from "../../lib/supabase";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import QuestionEditor from "../../components/admin/QuestionEditor";
import { TOPICS } from "../../lib/topics";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type QuestionItem = {
  id: string;
  topic: string;
  difficulty?: string;
  question: string;
  image?: string;
  options?: string[];
  answer?: number;
  essayAnswer?: string[];
  discussion: string;
  discussionImage?: string;
};

const categories = [
  // Anatomi
  { label: "CBT Anatomi", value: "anatomi-teori" },
  { label: "Praktikum Anatomi", value: "anatomi-praktikum" },

  // Histologi
  { label: "CBT Histologi", value: "histologi-teori" },
  { label: "Praktikum Histologi", value: "histologi-praktikum" },

  // Biokimia
  { label: "CBT Biokimia", value: "biokimia-teori" },
  { label: "Praktikum Biokimia", value: "biokimia-praktikum" },

  // Fisiologi
  { label: "CBT Fisiologi", value: "fisiologi-teori" },
  { label: "Praktikum Fisiologi", value: "fisiologi-praktikum" },

  // Parasitologi
  { label: "CBT Parasitologi", value: "parasitologi-teori" },
  { label: "Praktikum Parasitologi", value: "parasitologi-praktikum" },

  // Mikrobiologi
  { label: "CBT Mikrobiologi", value: "mikrobiologi-teori" },
  { label: "Praktikum Mikrobiologi", value: "mikrobiologi-praktikum" },
];
const blocks = [
  "Anatomi",
  "Histologi",
  "Biokimia",
  "Fisiologi",
  "Parasitologi",
  "Mikrobiologi",
];
function SortableJump({
  id,
  number,
}: {
  id: string;
  number: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition ||
      "transform 200ms cubic-bezier(0.2,0,0,1)",
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        document
          .getElementById(`soal-${number}`)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }}
      className="flex h-10 w-10 cursor-grab items-center justify-center rounded-lg border bg-slate-50 hover:bg-[#061B3A] hover:text-white active:cursor-grabbing"
    >
      {number}
    </button>
  );
}

export default function AdminPaketPage() {
  const [importText, setImportText] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

 const [title, setTitle] = useState("");
const [category, setCategory] = useState("anatomi-teori");
const [block, setBlock] = useState("Anatomi");
const isPraktikum = category.includes("praktikum");
const [duration, setDuration] = useState(60);
  const [tokenCost, setTokenCost] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  })
);

 const [questions, setQuestions] = useState<QuestionItem[]>([
  {
    id: crypto.randomUUID(),
    topic: "",
    difficulty: "medium",
    question: "",
    options: isPraktikum ? undefined : ["", "", "", "", ""],
    answer: isPraktikum ? undefined : 0,
    essayAnswer: [""],
    discussion: "",
  },
]);

  // ==========================================
  // AUTO-SAVE DRAFT
  // ==========================================

  const DRAFT_KEY = "medivault_admin_paket_draft_v1";

  const [draftStatus, setDraftStatus] = useState<
    "loading" | "saved" | "saving" | "empty"
  >("loading");

  const draftLoaded = useRef(false);

  // ==========================================
  // LOAD DRAFT SAAT HALAMAN DIBUKA
  // ==========================================

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);

      if (savedDraft) {
        const draft = JSON.parse(savedDraft);

        if (draft.title !== undefined) {
          setTitle(draft.title);
        }

        if (draft.category !== undefined) {
          setCategory(draft.category);
        }

        if (draft.block !== undefined) {
  setBlock(draft.block);
}

        if (draft.duration !== undefined) {
          setDuration(draft.duration);
        }

        if (draft.tokenCost !== undefined) {
          setTokenCost(draft.tokenCost);
        }

        if (draft.importText !== undefined) {
          setImportText(draft.importText);
        }

        if (
          Array.isArray(draft.questions) &&
          draft.questions.length > 0
        ) {
          setQuestions(draft.questions);
        }

        console.log("Draft MediVault berhasil dipulihkan");

        setDraftStatus("saved");
      } else {
        setDraftStatus("empty");
      }
    } catch (error) {
      console.error("Gagal memuat draft:", error);
      setDraftStatus("empty");
    }

    draftLoaded.current = true;
  }, []);

  // ==========================================
  // AUTO-SAVE SETIAP ADA PERUBAHAN
  // ==========================================

  useEffect(() => {
    if (!draftLoaded.current) return;

    setDraftStatus("saving");

    const timeout = setTimeout(() => {
      try {
        const draft = {
  title,
  category,
  block,
  duration,
  tokenCost,
  importText,
  questions,
  savedAt: new Date().toISOString(),
};

        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify(draft)
        );

        setDraftStatus("saved");
      } catch (error) {
        console.error("Gagal menyimpan draft:", error);

        setDraftStatus("empty");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [
  title,
  category,
  block,
  duration,
  tokenCost,
  importText,
  questions,
]);

  // ==========================================
  // HAPUS DRAFT
  // ==========================================

  const clearDraft = () => {
    const confirmed = window.confirm(
      "Hapus draft paket ini? Semua data yang belum dipublish akan hilang."
    );

    if (!confirmed) return;

    localStorage.removeItem(DRAFT_KEY);

   setTitle("");
setCategory("anatomi-teori");
setBlock("Anatomi");
setDuration(60);
setTokenCost(1);
setImportText("");

    setQuestions([
  {
    id: crypto.randomUUID(),
    topic: "",
    difficulty: "medium",
    question: "",
    options: ["", "", "", "", ""],
    answer: 0,
    essayAnswer: [""],
    discussion: "",
  },
]);

    setDraftStatus("empty");
  };

const answerRefs = useRef<HTMLInputElement[]>([]);
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50";

  const textareaClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50";

  const primaryButton =
    "rounded-xl bg-[#061B3A] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0A2A56]";

  const emeraldButton =
    "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700";

  useEffect(() => {
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || profile?.role !== "admin") {
      window.location.href = "/login";
    }
  };

  checkUser();
}, []);

  const optionLabels = ["A", "B", "C", "D", "E"];

  const normalizeImportText = (text: string) => {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ")

    // Rapikan tanda kutip
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")

    // Rapikan dash
    .replace(/[–—]/g, "-")

    // Rapikan spasi/tab
    .replace(/[ \t]+/g, " ")

    // ==========================================
    // PASTIKAN METADATA BERADA DI BARIS SENDIRI
    // ==========================================

    .replace(
      /\s+(?=Topic\s*:)/gi,
      "\n"
    )

    .replace(
      /\s+(?=Tingkat\s+Kesulitan\s*:)/gi,
      "\n"
    )

    // ==========================================
    // PISAHKAN JAWABAN
    // ==========================================

    .replace(
      /\s+(?=(?:Kunci\s*)?Jawaban\s*[:=\-])/gi,
      "\n"
    )

    // ==========================================
    // PISAHKAN PEMBAHASAN
    // ==========================================

    .replace(
      /\s+(?=(?:Pembahasan|Bahasan|Penjelasan|Discussion|Rationale)\s*[:=\-]?)/gi,
      "\n"
    )

    // ==========================================
    // PISAHKAN PILIHAN A-E
    //
    // Contoh:
    //
    // "... adalah A. Aorta B. Vena cava"
    //
    // menjadi:
    //
    // "... adalah"
    // "A. Aorta"
    // "B. Vena cava"
    // ==========================================

    .replace(
      /([^\n])\s+([A-E])\.\s+(?=[A-Za-z0-9])/g,
      "$1\n$2. "
    )

    .replace(
      /([^\n])\s+([A-E])\)\s+(?=[A-Za-z0-9])/g,
      "$1\n$2) "
    )

    // ==========================================
    // Rapikan newline
    // ==========================================

    .replace(/\n{3,}/g, "\n\n")

    .trim();
};

  const getAnswerIndex = (label: string) => {
    const idx = optionLabels.indexOf(label.toUpperCase());
    return idx >= 0 ? idx : 0;
  };

  const hasEnoughOptions = (block: string) => {
  const matches = block.match(
    /(?:^|\n)\s*[A-E]\s*[\.\)]\s+/gi
  );

  return (matches ?? []).length >= 3;
};

  const splitQuestionBlocks = (text: string) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: string[] = [];

  let currentLines: string[] = [];

  // ==========================================
  // CEK APAKAH BARIS ADALAH NOMOR SOAL
  // ==========================================

  const isQuestionNumber = (line: string) => {
    const match = line.match(
      /^(\d{1,3})\s*[.)]\s+/
    );

    if (!match) return false;

    const number = Number(match[1]);

    // Nomor 1-4 TIDAK langsung dianggap soal baru.
    // Kita hanya mengizinkan nomor besar seperti:
    // 5. 6. 7. dst.
    //
    // Untuk nomor 1-4, kita cek berdasarkan
    // apakah blok sebelumnya sudah selesai.

    return number >= 1;
  };

  // ==========================================
  // CEK APAKAH BLOK SUDAH SELESAI
  // ==========================================

  const hasAnswer = (lines: string[]) => {
    return lines.some((line) =>
      /^(?:kunci\s*)?(?:jawaban|answer|ans)\s*[:=\-]/i.test(
        line
      )
    );
  };

  const hasDiscussion = (lines: string[]) => {
    return lines.some((line) =>
      /^(?:pembahasan|bahasan|penjelasan|discussion|rationale)\s*:/i.test(
        line
      )
    );
  };

  const hasTopic = (lines: string[]) => {
    return lines.some((line) =>
      /^topic\s*:/i.test(line)
    );
  };

  const hasDifficulty = (lines: string[]) => {
    return lines.some((line) =>
      /^tingkat\s+kesulitan\s*:/i.test(line)
    );
  };

  // ==========================================
  // LOOP SEMUA BARIS
  // ==========================================

  lines.forEach((line) => {
    const numberMatch = line.match(
      /^(\d{1,3})\s*[.)]\s+/
    );

    const number = numberMatch
      ? Number(numberMatch[1])
      : null;

    // ==========================================
    // TENTUKAN APAKAH INI NOMOR SOAL BARU
    // ==========================================

    let newQuestion = false;

    if (
      number !== null &&
      currentLines.length > 0
    ) {
      // ----------------------------------------
      // Kalau blok sebelumnya SUDAH lengkap
      // sampai Topic + Difficulty,
      // nomor berapa pun = soal baru.
      // ----------------------------------------

      if (
        hasTopic(currentLines) &&
        hasDifficulty(currentLines)
      ) {
        newQuestion = true;
      }

      // ----------------------------------------
      // Kalau sudah ada Answer + Discussion +
      // metadata sebagian, kemungkinan besar
      // nomor berikutnya adalah soal baru.
      // ----------------------------------------

      else if (
        hasAnswer(currentLines) &&
        hasDiscussion(currentLines) &&
        (
          hasTopic(currentLines) ||
          hasDifficulty(currentLines)
        )
      ) {
        newQuestion = true;
      }

      // ----------------------------------------
      // Kalau nomor > 4 dan blok sebelumnya
      // sudah punya pilihan + jawaban,
      // anggap sebagai soal baru.
      // ----------------------------------------

      else if (
        number > 4 &&
        hasAnswer(currentLines)
      ) {
        newQuestion = true;
      }
    }

    // ==========================================
    // JIKA SOAL BARU
    // ==========================================

    if (newQuestion) {
      blocks.push(
        currentLines.join("\n").trim()
      );

      currentLines = [line];
      return;
    }

    // ==========================================
    // JIKA BUKAN SOAL BARU
    // ==========================================

    currentLines.push(line);
  });

  // ==========================================
  // PUSH BLOK TERAKHIR
  // ==========================================

  if (currentLines.length > 0) {
    blocks.push(
      currentLines.join("\n").trim()
    );
  }

  return blocks;
};

  const parseSingleQuestionBlock = (
  block: string
): QuestionItem => {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // ==========================================
  // DATA HASIL PARSING
  // ==========================================

  const questionLines: string[] = [];
  const discussionLines: string[] = [];

  const optionMap = [
    "",
    "",
    "",
    "",
    "",
  ];

  let currentOption: number | null = null;

  let answerIndex = 0;

  let isDiscussion = false;

  let optionsStarted = false;

  // ==========================================
  // TOPIC
  // ==========================================

  let topic = "";

  const topicMatch = block.match(
    /(?:^|\n)\s*Topic\s*:\s*(.+?)(?=\n|$)/i
  );

  if (topicMatch?.[1]) {
    topic = topicMatch[1].trim();
  }

  // ==========================================
  // DIFFICULTY
  // ==========================================

  let difficulty:
    | "easy"
    | "medium"
    | "hard" = "medium";

  const difficultyMatch = block.match(
    /(?:^|\n)\s*Tingkat\s+Kesulitan\s*:\s*(.+?)(?=\n|$)/i
  );

  const difficultyText =
    difficultyMatch?.[1]
      ?.trim()
      .toLowerCase() || "";

  if (
    difficultyText === "mudah" ||
    difficultyText === "easy"
  ) {
    difficulty = "easy";
  }

  if (
    difficultyText === "sulit" ||
    difficultyText === "hard"
  ) {
    difficulty = "hard";
  }

  if (
    difficultyText === "sedang" ||
    difficultyText === "medium"
  ) {
    difficulty = "medium";
  }

  // ==========================================
  // LOOP BARIS
  // ==========================================

  lines.forEach((rawLine, index) => {
    let line = rawLine.trim();

    if (!line) return;

    // ==========================================
    // HAPUS NOMOR SOAL PADA BARIS PERTAMA
    //
    // 1. Pernyataan...
    //
    // menjadi:
    //
    // Pernyataan...
    // ==========================================

    if (index === 0) {
      line = line
        .replace(
          /^\d{1,3}\s*[.)]\s*/,
          ""
        )
        .trim();
    }

    // ==========================================
    // METADATA
    // Jangan masuk ke question/discussion
    // ==========================================

    if (/^topic\s*:/i.test(line)) {
      return;
    }

    if (
      /^tingkat\s+kesulitan\s*:/i.test(line)
    ) {
      return;
    }

    // ==========================================
    // JAWABAN
    // ==========================================

    const answerMatch = line.match(
      /^(?:kunci\s*)?(?:jawaban|answer|ans)\s*[:=\-]?\s*([A-E])/i
    );

    if (answerMatch) {
      answerIndex = getAnswerIndex(
        answerMatch[1]
      );

      currentOption = null;

      return;
    }

    // ==========================================
    // PEMBAHASAN
    // ==========================================

    const discussionMatch = line.match(
      /^(?:pembahasan|bahasan|penjelasan|discussion|rationale)\s*[:=\-]?\s*(.*)$/i
    );

    if (discussionMatch) {
      isDiscussion = true;

      currentOption = null;

      const discussionText =
        discussionMatch[1]?.trim();

      if (discussionText) {
        discussionLines.push(
          discussionText
        );
      }

      return;
    }

    // ==========================================
    // SETELAH PEMBAHASAN
    // ==========================================

    if (isDiscussion) {
      discussionLines.push(line);
      return;
    }

    // ==========================================
    // PILIHAN A-E
    // ==========================================

    const optionMatch = line.match(
      /^([A-E])\s*[.)]\s*(.*)$/i
    );

    if (optionMatch) {
      const label =
        optionMatch[1].toUpperCase();

      const textAfterLabel =
        optionMatch[2]?.trim() || "";

      const optionIndex =
        getAnswerIndex(label);

      // ==========================================
      // KHUSUS ANATOMI
      //
      // Contoh:
      //
      // A. dorsalis pedis merupakan...
      //
      // Ini bukan pilihan A.
      // ==========================================

      const looksLikeAnatomyStatement =
        /^A\.\s+/i.test(
          textAfterLabel
        );

      const isDoubleLabel =
        /^A\.\s*A\./i.test(
          textAfterLabel
        );

      if (
        !optionsStarted &&
        optionIndex === 0 &&
        looksLikeAnatomyStatement &&
        !isDoubleLabel
      ) {
        questionLines.push(line);

        return;
      }

      // ==========================================
      // PILIHAN BENAR
      // ==========================================

      optionsStarted = true;

      optionMap[optionIndex] =
        textAfterLabel;

      currentOption =
        optionIndex;

      return;
    }

    // ==========================================
    // LANJUTAN TEKS PILIHAN
    // ==========================================

    if (
      optionsStarted &&
      currentOption !== null
    ) {
      optionMap[currentOption] +=
        (
          optionMap[currentOption]
            ? " "
            : ""
        ) + line;

      return;
    }

    // ==========================================
    // PERNYATAAN 1-4
    //
    // INI SANGAT PENTING
    //
    // 1. M. iliopsoas...
    // 2. M. quadriceps...
    // 3. M. sartorius...
    // 4. M. gastrocnemius...
    //
    // Semuanya masuk ke QUESTION.
    // ==========================================

    const statementMatch = line.match(
      /^([1-4])\s*[.)]\s+(.+)$/i
    );

    if (statementMatch) {
      questionLines.push(
        `${statementMatch[1]}. ${statementMatch[2]}`
      );

      return;
    }

    // ==========================================
    // BAGIAN SOAL BIASA
    // ==========================================

    questionLines.push(line);
  });

  // ==========================================
  // HASIL AKHIR
  // ==========================================

  return {
    id: crypto.randomUUID(),

    topic,

    difficulty,

    question: questionLines
      .join("\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim(),

    options: optionMap,

    answer: answerIndex,

    discussion: discussionLines
      .join(" ")
      .replace(/\s+/g, " ")
      .trim(),
  };
};

  const parseQuestionsFromText = () => {
  if (!importText.trim()) {
    return alert("Paste soal dulu!");
  }

  // ==========================================
  // 1. NORMALISASI
  // ==========================================

  const cleanText =
    normalizeImportText(importText);

  // ==========================================
  // 2. PECAH SOAL
  // ==========================================

  const blocks =
    splitQuestionBlocks(cleanText);

  console.log(
    "================================="
  );

  console.log(
    "JUMLAH BLOCK:",
    blocks.length
  );

  // ==========================================
  // 3. PARSE SETIAP BLOCK
  // ==========================================

  const parsed = blocks
    .map((block, index) => {
      const result =
        parseSingleQuestionBlock(block);

      console.log(
        `SOAL ${index + 1}:`,
        {
          topic: result.topic,
          difficulty:
            result.difficulty,
          question:
            result.question,
          answer:
            result.answer,
          discussion:
            result.discussion,
        }
      );

      return result;
    })
    .filter(
      (q) =>
        q.question ||
        q.options?.some(
          (opt) =>
            opt.trim()
        )
    );

  // ==========================================
  // 4. VALIDASI
  // ==========================================

  if (!parsed.length) {
    return alert(
      "Format soal belum terbaca. Cek lagi format copas PDF-nya."
    );
  }

  console.log(
    "================================="
  );

  console.log(
    "HASIL AKHIR:",
    parsed
  );

  console.log(
    "JUMLAH SOAL:",
    parsed.length
  );

  // ==========================================
  // 5. MASUKKAN KE FORM
  // ==========================================

  setQuestions(parsed);
};

  const updateQuestion = (i: number, val: string) => {
    const copy = [...questions];
    copy[i].question = val;
    setQuestions(copy);
  };

  const updateTopic = (i: number, val: string) => {
  const copy = [...questions];
  copy[i].topic = val;
  setQuestions(copy);
};

const updateDifficulty = (
  i: number,
  val: "easy" | "medium" | "hard"
) => {
  const copy = [...questions];
  copy[i].difficulty = val;
  setQuestions(copy);
};

const updateOption = (qi:number, oi:number, val:string)=>{
  const copy=[...questions];

  if(!copy[qi].options){
    copy[qi].options=["","","","",""];
  }

  copy[qi].options[oi]=val;

  setQuestions(copy);
};

  const updateAnswer = (qi: number, val: number) => {
    const copy = [...questions];
    copy[qi].answer = val;
    setQuestions(copy);
  };

  const updateDiscussion = (i: number, val: string) => {
    const copy = [...questions];
    copy[i].discussion = val;
    setQuestions(copy);
  };
  const updateEssayAnswer = (
  questionIndex: number,
  answerIndex: number,
  value: string
) => {
  const copy = [...questions];

  copy[questionIndex].essayAnswer![answerIndex] = value;

  setQuestions(copy);
};

const addEssayAnswer = (questionIndex: number) => {
  const copy = [...questions];

  if (!copy[questionIndex].essayAnswer) {
    copy[questionIndex].essayAnswer = [];
  }

  copy[questionIndex].essayAnswer!.push("");

  setQuestions(copy);
};

const deleteEssayAnswer = (
  questionIndex: number,
  answerIndex: number
) => {
  const copy = [...questions];

  copy[questionIndex].essayAnswer!.splice(answerIndex, 1);

  if (copy[questionIndex].essayAnswer!.length === 0) {
    copy[questionIndex].essayAnswer!.push("");
  }

  setQuestions(copy);
};

 const addQuestion = () => {
  setQuestions([
    ...questions,
    {
      id: crypto.randomUUID(),
      topic: "",
      difficulty: "medium",
      question: "",
      options: isPraktikum ? undefined : ["", "", "", "", ""],
      answer: isPraktikum ? undefined : 0,
      essayAnswer: [""],
      discussion: "",
    },
  ]);
};

  const deleteQuestion = (i: number) => {
    if (questions.length === 1) return alert("Minimal 1 soal");
    setQuestions(questions.filter((_, idx) => idx !== i));
  };
  const handleDragEnd = (event: any) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  setQuestions((items) => {
    const oldIndex = items.findIndex((q) => q.id === active.id);
    const newIndex = items.findIndex((q) => q.id === over.id);

    return arrayMove(items, oldIndex, newIndex);
  });
};

  const uploadImage = (i: number, file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const copy = [...questions];
      copy[i].image = reader.result as string;
      setQuestions(copy);
    };

    reader.readAsDataURL(file);
  };

  const uploadDiscussionImage = (i: number, file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const copy = [...questions];
      copy[i].discussionImage = reader.result as string;
      setQuestions(copy);
    };

    reader.readAsDataURL(file);
  };

 const publishPackage = async () => {
  if (!title.trim()) {
    alert("Nama paket belum diisi!");
    return;
  }

  // ==========================================
  // 1. SIMPAN PAKET
  // ==========================================

  const { data: paket, error: paketError } = await supabase
    .from("exam_packages")
    .insert([
      {
        title,
        category,
        block,
        duration,
        token_cost: tokenCost,
        total_questions: questions.length,
        status: "published",
      },
    ])
    .select()
    .single();

  if (paketError) {
    console.error("ERROR SIMPAN PAKET =", paketError);
    alert("Gagal menyimpan paket");
    return;
  }

  // ==========================================
  // 2. SIAPKAN DATA SOAL
  // ==========================================

  const questionsToInsert = questions.map((q, index) => ({
  package_id: paket.id,

  topic: q.topic?.trim() || null,

  difficulty: q.difficulty || "medium",

  block: paket.block,

  question: q.question?.trim() || "",

  image: q.image || null,

  options:
    !isPraktikum && q.options
      ? q.options
      : null,

  answer:
    !isPraktikum && q.answer !== undefined
      ? q.answer
      : null,

  essay_answer:
    isPraktikum && q.essayAnswer
      ? q.essayAnswer.filter(
          (answer) => answer.trim() !== ""
        )
      : null,

  discussion: q.discussion || "",
  discussion_image: q.discussionImage || null,

  order_no: index + 1,
}));

  // ==========================================
  // 3. SIMPAN SEMUA SOAL
  // ==========================================

 console.log("BLOCK PAKET =", paket.block);
console.log("SOAL YANG AKAN DIINSERT =", questionsToInsert);

const { data, error: soalError } = await supabase
  .from("questions")
  .insert(questionsToInsert)
  .select();

console.log("HASIL INSERT =", data);
console.log("ERROR INSERT =", soalError);

if (soalError) {
  console.error("ERROR SIMPAN SOAL =", soalError);
  alert("Paket berhasil dibuat, tetapi soal gagal disimpan.");
  return;
}

  // ==========================================
  // 4. BERHASIL
  // ==========================================

    alert("Paket & soal berhasil disimpan!");

  // Hapus draft hanya setelah paket + soal berhasil
  localStorage.removeItem(DRAFT_KEY);

  setDraftStatus("empty");

  window.location.href = "/admin";
};

  if (previewMode) {
    return (
      <main className="min-h-screen bg-slate-50 font-inter">
        <Navbar />

        <section className="border-b border-slate-200 bg-white px-6 py-6">
          <div className="mx-auto max-w-6xl">
            <button
              onClick={() => setPreviewMode(false)}
              className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Kembali Edit
            </button>

            <div className="rounded-2xl border border-slate-200 bg-[#061B3A] p-6 text-white">
              <p className="text-sm font-medium text-emerald-200">
                Preview Paket Ujian
              </p>

              <h1 className="mt-2 font-poppins text-3xl font-bold">
                {title || "Nama Paket Belum Diisi"}
              </h1>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Kategori</p>
                  <p className="mt-1 font-semibold">
                    {categories.find((c) => c.value === category)?.label}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Durasi</p>
                  <p className="mt-1 font-semibold">{duration} menit</p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Token</p>
                  <p className="mt-1 font-semibold">{tokenCost}</p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Jumlah Soal</p>
                  <p className="mt-1 font-semibold">{questions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="mx-auto max-w-6xl space-y-5">
           <QuestionEditor
  questions={questions}
  setQuestions={setQuestions}
  isPraktikum={isPraktikum}
  category={category}
/>

{questions.map((q, i) => (
  <div key={q.id} className="mt-5 rounded-xl bg-white p-5">
    <h3 className="font-bold">
      Pembahasan Soal {i + 1}
    </h3>

    <p className="mt-2 text-slate-700">
      {q.discussion}
    </p>
  </div>
))}
                </div>

               
          
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-inter">
      <Navbar />

      <section className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-emerald-600">
            
          </p>

          <h1 className="mt-1 font-poppins text-3xl font-extrabold text-[#061B3A]">
            Upload Soal
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Buat paket ujian CBT & praktikum, import soal dari PDF, atur kunci jawaban, dan
            tambahkan pembahasan sebelum dipublikasikan.
          </p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-poppins text-xl font-bold text-[#061B3A]">
                  Data Paket
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Informasi dasar paket ujian yang akan ditampilkan ke user.
                </p>
              </div>

              <div className="flex items-center gap-2">
  {draftStatus === "saving" && (
    <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
      Menyimpan...
    </span>
  )}

  {draftStatus === "saved" && (
    <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
      ✓ Draft tersimpan otomatis
    </span>
  )}

  {draftStatus === "empty" && (
    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
      Draft baru
    </span>
  )}

  <button
    type="button"
    onClick={clearDraft}
    className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
  >
    Hapus Draft
  </button>
</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
             <div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Nama Paket
  </label>

  <input
    type="text"
    className={inputClass}
    placeholder="Masukkan nama paket"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
</div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kategori Ujian
                </label>
                <select
                  className={inputClass}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Block
  </label>

  <select
    className={inputClass}
    value={block}
    onChange={(e) => setBlock(e.target.value)}
  >
    {blocks.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>

  <p className="mt-2 text-xs leading-5 text-slate-500">
    Block materi utama yang digunakan dalam paket ini.
  </p>
</div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Durasi Ujian
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Durasi dalam menit"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Isi durasi pengerjaan ujian dalam satuan menit. Contoh: 60
                  untuk 1 jam.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Biaya Token
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Jumlah token"
                  value={tokenCost}
                  onChange={(e) => setTokenCost(Number(e.target.value))}
                />
                
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Jumlah token yang dibutuhkan user untuk membuka paket ujian
                  ini.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center">
              <div>
                <h2 className="font-poppins text-xl font-bold text-[#061B3A]">
                  Import Soal dari PDF
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
  Support opsi A-E, tipe kombinasi angka, kunci jawaban,
  pembahasan, serta Topic dan Tingkat Kesulitan untuk setiap soal.
</p>
              </div>

              <button onClick={parseQuestionsFromText} className={primaryButton}>
                Generate Soal
              </button>
            </div>

            <textarea
              className={`${textareaClass} h-72`}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Format disarankan:

1. Pernyataan yang benar tentang anatomi jantung adalah...
1) Atrium kanan menerima darah vena
2) Ventrikel kiri memompa darah ke aorta
3) Katup trikuspid berada di sisi kanan
4) Vena pulmonalis membawa darah miskin oksigen

A. 1, 2, dan 3
B. 1 dan 3
C. 2 dan 4
D. 4 saja
E. Semua benar

Jawaban: A

Pembahasan:
Pernyataan 1, 2, dan 3 benar karena sesuai dengan alur sirkulasi jantung.

Topic: Jantung
Tingkat Kesulitan: Sedang`}
            />

            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              Gunakan label <b>Jawaban:</b> untuk kunci dan{" "}
              <b>Pembahasan:</b> untuk isi pembahasan.
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={() => setPreviewMode(true)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Preview Ujian
            </button>

            <button
              onClick={addQuestion}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#061B3A] shadow-sm transition hover:bg-slate-50"
            >
              + Tambah Soal
            </button>
          </div>

          {questions.map((q, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              
<div className="sticky top-0 z-20 mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 bg-white pb-4 pt-2 md:flex-row md:items-center">
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#061B3A] text-lg font-bold text-white">
      {i + 1}
    </div>

    <div>
      <h3 className="font-poppins text-xl font-bold text-[#061B3A]">
        Soal Nomor {i + 1}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Edit soal, jawaban, dan pembahasan.
      </p>
    </div>
  </div>

  <button
    onClick={() => deleteQuestion(i)}
    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
  >
    Hapus Soal
  </button>
</div>

<div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">

  {/* KOLOM SOAL */}
  <div className="flex h-full flex-col rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 shadow-sm">
    <div className="mb-6 rounded-xl bg-violet-100 p-4">
      
      <h3 className="text-3xl font-extrabold tracking-wide text-[#061B3A] uppercase">
        SOAL
      </h3>
    </div>

   <label className="mb-2 block font-semibold text-slate-700">
  Topic
</label>

<input
  type="text"
  className={`${inputClass} mb-4`}
  placeholder="Contoh: Jantung"
  value={q.topic}
  onChange={(e) => updateTopic(i, e.target.value)}
/>

<p className="mb-5 -mt-2 text-xs leading-5 text-slate-500">
  Ketik topic/subbab soal secara manual. Contoh: Nervus cranialis,
  Vaskularisasi otak, atau Traktus sensorik.
</p>

<label className="mb-2 block font-semibold text-slate-700">
  Tingkat Kesulitan
</label>

<select
  className={`${inputClass} mb-5`}
  value={q.difficulty}
  onChange={(e) =>
    updateDifficulty(
      i,
      e.target.value as "easy" | "medium" | "hard"
    )
  }
>
  <option value="easy">Mudah</option>
  <option value="medium">Sedang</option>
  <option value="hard">Sulit</option>
</select>

    <label className="font-semibold text-slate-700">
      Tulis Soal
    </label>

    <textarea
      className={`${textareaClass} h-[260px] resize-none`}
      placeholder="Tulis soal"
      value={q.question}
      onChange={(e) => updateQuestion(i, e.target.value)}
    />

    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <label className="mb-2 block font-semibold text-[#061B3A]">
        Gambar Soal
      </label>

      <input
        type="file"
        accept="image/*"
        className="text-sm text-slate-500"
        onChange={(e) => uploadImage(i, e.target.files?.[0])}
      />

      <div className="mt-3">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Atau tempel link gambar (ImgBB)
        </label>

        <input
          type="text"
          placeholder="https://i.ibb.co/xxxxx/gambar.png"
          value={q.image || ""}
          onChange={(e) => {
            const copy = [...questions];
            copy[i].image = e.target.value;
            setQuestions(copy);
          }}
          className={inputClass}
        />
      </div>

      {q.image && (
        <img
          src={q.image}
          alt={`Soal ${i + 1}`}
          className="mt-4 max-h-52 rounded-xl border border-slate-200 bg-white object-contain"
        />
      )}
    </div>
  </div>

  {/* KOLOM JAWABAN */}
  <div className="flex h-full flex-col rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-sm">
    <div className="mb-6 rounded-xl bg-blue-100 p-4">
     
      <h3 className="text-3xl font-extrabold tracking-wide text-emerald-700 uppercase">
        JAWABAN
      </h3>
    </div>

    {!isPraktikum ? (
      <>
        {optionLabels.map((label, oi) => (
          <div key={oi} className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Pilihan {label}
            </label>

            <input
              className={inputClass}
              value={q.options?.[oi] || ""}
              onChange={(e) => updateOption(i, oi, e.target.value)}
            />
          </div>
        ))}

        <hr className="border-slate-200" />

        <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
          Kunci Jawaban
        </label>

        <select
          className={inputClass}
          value={q.answer}
          onChange={(e) => updateAnswer(i, Number(e.target.value))}
        >
          {optionLabels.map((l, idx) => (
            <option key={idx} value={idx}>
              {l}
            </option>
          ))}
        </select>
      </>
    ) : (
      <>
        <>
  <div className="flex items-center justify-between">
  <label className="text-sm font-semibold text-slate-700">
    Kata Kunci Jawaban Benar
  </label>

  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
    {q.essayAnswer?.length || 0} Jawaban
  </span>
</div>

  <p className="mb-3 text-xs text-slate-500">
    Satu baris = satu jawaban yang dianggap benar.
  </p>

<div className="mt-3 rounded-xl bg-blue-50 p-3 text-xs leading-6 text-blue-700">
Misalnya:
<br />
• Deltoideus
<br />
• M. Deltoideus
<br />
• Musculus Deltoideus
</div>

  {(q.essayAnswer || [""]).map((item, idx) => (
  <div key={idx} className="mb-3 flex items-center gap-3">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
      {idx + 1}
    </div>

    <input
  ref={(el) => {
    if (el) answerRefs.current[idx] = el;
  }}
  className={`${inputClass} flex-1`}
  placeholder={`Jawaban ${idx + 1}`}
  value={item}
  onChange={(e) => {
    const copy = [...questions];
    copy[i].essayAnswer![idx] = e.target.value;
    setQuestions(copy);
  }}
/>

    <button
  type="button"
  onClick={() => deleteEssayAnswer(i, idx)}
  className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl font-bold text-red-600 hover:bg-red-100"
>
  ×
</button>

  </div>
))}

  <button
    type="button"
    onClick={() => {
      const copy = [...questions];

      copy[i].essayAnswer = [
 ...(copy[i].essayAnswer || []),
 ""
];
      setQuestions(copy);
    }}
    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 py-3 font-bold text-emerald-700 hover:bg-emerald-100"
  >
    + Tambah Jawaban Benar
  </button>
</>
      </>
    )}
  </div>

  {/* KOLOM PEMBAHASAN */}
<div className="flex h-full flex-col rounded-2xl border-2 border-violet-300 bg-violet-50 p-5 shadow-sm">
    <div className="mb-6 rounded-xl bg-emerald-100 p-4">
   
      <h3 className="text-3xl font-black tracking-wide text-blue-700 uppercase">
        PEMBAHASAN
      </h3>
    </div>

    <label className="font-semibold text-slate-700">
  Pembahasan
</label>

<textarea
  className={`${textareaClass} h-[260px] resize-none`}
  placeholder="Tulis pembahasan"
  value={q.discussion}
  onChange={(e) => updateDiscussion(i, e.target.value)}
/>

<div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
  <label className="mb-2 block font-semibold text-emerald-700">
    Gambar Pembahasan
  </label>

  <input
    type="file"
    accept="image/*"
    className="text-sm text-slate-500"
    onChange={(e) => uploadDiscussionImage(i, e.target.files?.[0])}
  />

  <div className="mt-3">
    <label className="mb-2 block text-sm font-medium text-slate-700">
      Atau tempel link gambar (ImgBB)
    </label>

    <input
      type="text"
      placeholder="https://i.ibb.co/xxxxx/gambar.png"
      value={q.discussionImage || ""}
      onChange={(e) => {
        const copy = [...questions];
        copy[i].discussionImage = e.target.value;
        setQuestions(copy);
      }}
      className={inputClass}
    />
  </div>

  {q.discussionImage && (
    <img
      src={q.discussionImage}
      className="mt-4 max-h-52 rounded-xl border border-slate-200 bg-white object-contain"
    />
  )}
</div>
  </div>
</div>

            </div>
          ))}

<div className="flex justify-center">
  <button
    onClick={addQuestion}
    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#061B3A] shadow-sm transition hover:bg-slate-50"
  >
    + Tambah Soal Berikutnya
  </button>
</div>
          <button onClick={publishPackage} className={`w-full ${emeraldButton}`}>
            Publish Paket
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
  Draft tersimpan otomatis di perangkat ini. Kamu aman untuk refresh halaman.
</p>
        </div>
      </section>
    </main>
  );
}
