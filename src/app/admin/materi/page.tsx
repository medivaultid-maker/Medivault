"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  Save,
  Plus,
  Pencil,
  Trash2,
  X,
  Sparkles,
  FileText,
  Upload,
  Loader2,
  Eye,
  RefreshCw,
} from "lucide-react";
import mammoth from "mammoth";
import { supabase } from "../../lib/supabase";

type Material = {
  id: string;
  title: string;
  subject: string;
  chapter: number;
  content: string;
  content_html: string | null;
  source_file: string | null;
  published: boolean;
};

type SummarySection = {
  type:
    | "concept"
    | "key_points"
    | "high_yield"
    | "comparison"
    | "mnemonic"
    | "clinical_pearl"
    | "algorithm"
    | "image";

  title: string;
  content: string;
  items: string[];
  image_query: string;
};

type SummaryQuiz = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type AISummary = {
  title: string;
  introduction: string;
  sections: SummarySection[];
  quick_quiz: SummaryQuiz[];
};

export default function AdminMateriPage() {
  const editorRef = useRef<HTMLDivElement>(null);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mikrobiologi");
  const [chapter, setChapter] = useState("");
  const [published, setPublished] = useState(false);
  const [sourceFile, setSourceFile] = useState("");

  const [selectedWordFile, setSelectedWordFile] =
  useState<File | null>(null);

const [generatingAI, setGeneratingAI] =
  useState(false);

const [aiSummary, setAISummary] =
  useState<AISummary | null>(null);

const [showAIPreview, setShowAIPreview] =
  useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function generateAISummary() {
  if (!selectedWordFile) {
    alert("Pilih file Word terlebih dahulu.");
    return;
  }

  if (!selectedWordFile.name.toLowerCase().endsWith(".docx")) {
    alert("File harus berformat .docx");
    return;
  }

  try {
    setGeneratingAI(true);

    const arrayBuffer =
      await selectedWordFile.arrayBuffer();

    const result =
      await mammoth.extractRawText({
        arrayBuffer,
      });

    const extractedText =
      result.value.trim();

    if (!extractedText) {
      alert("Isi Word tidak berhasil dibaca.");
      return;
    }

    setSourceFile(selectedWordFile.name);

    const response = await fetch(
      "/api/generate-material-summary",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: extractedText,
          title,
          subject,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Gagal membuat rangkuman AI."
      );
    }

   setAISummary(data.summary);

setTitle(
  data.summary.title || title
);

// Masukkan hasil AI ke editor
const generatedText = summaryToText(data.summary);

if (editorRef.current) {
  editorRef.current.innerHTML =
    textToHtml(generatedText);
}

setShowAIPreview(true);

  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Gagal membuat rangkuman AI."
    );
  } finally {
    setGeneratingAI(false);
  }
}

function summaryToText(
  summary: AISummary
) {
  let text =
    `${summary.title}\n\n`;

  text +=
    `${summary.introduction}\n\n`;

  summary.sections.forEach(
    (section) => {
      text +=
        `${section.title}\n`;

      if (section.content) {
        text +=
          `${section.content}\n`;
      }

      if (section.items?.length) {
        section.items.forEach(
          (item) => {
            text += `• ${item}\n`;
          }
        );
      }

      text += "\n";
    }
  );

  return text;
}



  async function fetchMaterials() {
    setLoading(true);

    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .order("chapter", { ascending: true });

    if (error) {
      console.error(error);
      alert("Gagal mengambil data materi.");
    } else {
      setMaterials(data || []);
    }

    setLoading(false);
  }

  function openCreate() {
  setEditingId(null);
  setTitle("");
  setSubject("Mikrobiologi");
  setChapter("");
  setPublished(false);
  setSourceFile("");

  setSelectedWordFile(null);
  setAISummary(null);
  setShowAIPreview(false);

  setShowEditor(true);

  setTimeout(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  }, 50);
}

  function openEdit(material: Material) {
    setEditingId(material.id);

    setTitle(material.title);
    setSubject(material.subject);
    setChapter(String(material.chapter));
    setPublished(material.published);
    setSourceFile(material.source_file || "");

    setShowEditor(true);

    setTimeout(() => {
      if (!editorRef.current) return;

      if (material.content_html) {
        editorRef.current.innerHTML = material.content_html;
      } else {
        editorRef.current.innerHTML = textToHtml(material.content);
      }
    }, 50);
  }

  function closeEditor() {
    setShowEditor(false);
    setEditingId(null);
  }

  function textToHtml(text: string) {
    return text
      .split("\n")
      .map((line) => {
        if (!line.trim()) return "<p><br></p>";
        return `<p>${escapeHtml(line)}</p>`;
      })
      .join("");
  }

  function escapeHtml(text: string) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function exec(command: string, value?: string) {
    editorRef.current?.focus();

    document.execCommand(command, false, value);

    if (editorRef.current) {
      editorRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function setHeading(value: string) {
    editorRef.current?.focus();

    if (value === "p") {
      document.execCommand("formatBlock", false, "p");
    } else {
      document.execCommand("formatBlock", false, value);
    }
  }

  function handleColorChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    exec("foreColor", e.target.value);
  }

  async function saveMaterial() {
    if (!title.trim()) {
      alert("Judul materi wajib diisi.");
      return;
    }

    if (!chapter || Number.isNaN(Number(chapter))) {
      alert("Nomor bab wajib diisi.");
      return;
    }

    const html = editorRef.current?.innerHTML || "";

const plainText =
  editorRef.current?.innerText ||
  editorRef.current?.textContent ||
  "";

console.log("HTML YANG AKAN DISIMPAN:", html);
console.log("TEXT YANG AKAN DISIMPAN:", plainText);

    if (!plainText.trim()) {
      alert("Isi materi belum diisi.");
      return;
    }

    const {
  data: { session },
} = await supabase.auth.getSession();

console.log("SESSION:", session);
console.log("USER:", session?.user);

    const materialData = {
  title: title.trim(),
  subject: subject.trim(),
  chapter: Number(chapter),
  content: plainText,
  content_html: html,
  source_file: sourceFile.trim() || null,
  published,

  ai_generated: !!aiSummary,
  summary_json: aiSummary,
};

    if (editingId) {
      const { data, error } = await supabase
  .from("materials")
  .update(materialData)
  .eq("id", editingId)
  .select()
  .single();

console.log("DATA HASIL UPDATE:", data);
console.log("ERROR UPDATE:", error);

      if (error) {
        console.error(error);
        alert("Gagal memperbarui materi.");
        return;
      }

      alert("Materi berhasil diperbarui.");
    } else {
      const { data, error } = await supabase
  .from("materials")
  .insert(materialData)
  .select()
  .single();

console.log("DATA HASIL INSERT:", data);
console.log("ERROR INSERT:", error);

      if (error) {
  console.error("SUPABASE ERROR:", error);
  alert(`Gagal menyimpan materi: ${error.message}`);
  return;
}

      alert("Materi berhasil ditambahkan.");
    }

    closeEditor();
    fetchMaterials();
  }

  async function deleteMaterial(id: string) {
    const confirmDelete = confirm(
      "Yakin ingin menghapus materi ini?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("materials")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal menghapus materi.");
      return;
    }

    fetchMaterials();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-black text-[#061B3A]">
              Kelola Materi
            </h1>

            <p className="mt-2 text-slate-500">
              Tambahkan dan kelola rangkuman materi MediVault.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-5 py-3 font-bold text-white transition hover:bg-[#115E59]"
          >
            <Plus size={19} />
            Tambah Materi
          </button>

        </div>

        {/* LIST MATERIAL */}
        <div className="overflow-hidden rounded-[28px] border border-[#E7F6F0] bg-white shadow-lg">

          {loading ? (
            <div className="p-10 text-center text-slate-500">
              Memuat materi...
            </div>
          ) : materials.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              Belum ada materi.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {materials.map((material) => (
                <div
                  key={material.id}
                  className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between"
                >

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-black text-[#0F766E]">
                        BAB{" "}
                        {String(material.chapter).padStart(2, "0")}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {material.subject}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          material.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {material.published
                          ? "Published"
                          : "Draft"}
                      </span>

                    </div>

                    <h2 className="mt-3 text-xl font-black text-[#061B3A]">
                      {material.title}
                    </h2>

                    {material.source_file && (
                      <p className="mt-1 text-sm text-slate-400">
                        {material.source_file}
                      </p>
                    )}

                  </div>

                  <div className="flex shrink-0 gap-2">

                    <button
                      onClick={() => openEdit(material)}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteMaterial(material.id)
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* EDITOR */}
        {showEditor && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4 md:p-8">

            <div className="mx-auto max-w-5xl rounded-[32px] bg-white shadow-2xl">

              {/* EDITOR HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 p-6">

                <div>
                  <h2 className="text-2xl font-black text-[#061B3A]">
                    {editingId
                      ? "Edit Materi"
                      : "Tambah Materi"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Format materi dengan editor di bawah.
                  </p>
                </div>

                <button
                  onClick={closeEditor}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={22} />
                </button>

              </div>

              {/* FORM */}
              <div className="space-y-6 p-6">

                {/* TITLE */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Judul Materi
                  </label>

                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    placeholder="Contoh: Flora Normal"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  />
                </div>

                {/* SUBJECT + CHAPTER */}
                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Mata Kuliah
                    </label>

                    <input
                      value={subject}
                      onChange={(e) =>
                        setSubject(e.target.value)
                      }
                      placeholder="Mikrobiologi"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Nomor Bab
                    </label>

                    <input
                      type="number"
                      value={chapter}
                      onChange={(e) =>
                        setChapter(e.target.value)
                      }
                      placeholder="04"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                    />
                  </div>

                </div>

                {/* AI GENERATOR */}

<div className="rounded-[28px] border border-[#DDEFEA] bg-gradient-to-br from-[#F0FDFA] via-white to-[#F8FAFC] p-5">

  <div className="flex items-start gap-4">

    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F766E] text-white">
      <Sparkles size={22} />
    </div>

    <div>
      <h3 className="font-black text-[#061B3A]">
        Generate Rangkuman dengan AI
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        Upload materi Word dan MediVault akan
        mengubahnya menjadi rangkuman yang
        lebih visual, ringkas, dan mudah dipelajari.
      </p>
    </div>

  </div>

  <label className="mt-5 block cursor-pointer">

    <input
      type="file"
      accept=".docx"
      className="hidden"
      onChange={(e) => {
        const file =
          e.target.files?.[0] || null;

        setSelectedWordFile(file);

        if (file) {
          setSourceFile(file.name);
        }
      }}
    />

    <div className="rounded-2xl border-2 border-dashed border-[#B8DED6] bg-white p-7 text-center transition hover:border-[#0F766E] hover:bg-[#F8FFFD]">

      {selectedWordFile ? (
        <>
          <FileText
            size={34}
            className="mx-auto text-[#0F766E]"
          />

          <p className="mt-3 font-bold text-slate-800">
            {selectedWordFile.name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {(selectedWordFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </>
      ) : (
        <>
          <Upload
            size={34}
            className="mx-auto text-slate-400"
          />

          <p className="mt-3 font-bold text-slate-700">
            Pilih file Word
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Format .docx
          </p>
        </>
      )}

    </div>

  </label>

  <button
    type="button"
    onClick={generateAISummary}
    disabled={
      generatingAI ||
      !selectedWordFile
    }
    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-5 py-3.5 font-black text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
  >

    {generatingAI ? (
      <>
        <Loader2
          size={19}
          className="animate-spin"
        />

        Sedang membuat rangkuman...
      </>
    ) : (
      <>
        <Sparkles size={19} />

        Generate Rangkuman AI
      </>
    )}

  </button>

</div>

{aiSummary && (
  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">

    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <div className="flex items-center gap-2">

          <Sparkles
            size={18}
            className="text-[#0F766E]"
          />

          <h3 className="font-black text-[#061B3A]">
            Rangkuman AI berhasil dibuat
          </h3>

        </div>

        <p className="mt-1 text-sm text-slate-500">
          {aiSummary.sections.length} bagian
          materi berhasil dibuat.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">

        <button
          type="button"
          onClick={() =>
            setShowAIPreview(true)
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          <Eye size={16} />
          Preview
        </button>

        <button
          type="button"
          onClick={generateAISummary}
          className="inline-flex items-center gap-2 rounded-xl border border-[#DDEFEA] px-4 py-2 text-sm font-bold text-[#0F766E] hover:bg-[#F0FDFA]"
        >
          <RefreshCw size={16} />
          Generate Ulang
        </button>

      </div>

    </div>

  </div>
)}

{showAIPreview && aiSummary && (
  <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4 md:p-8">

    <div className="mx-auto max-w-5xl rounded-[32px] bg-slate-50 shadow-2xl">

      {/* HEADER */}

      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[32px] border-b border-slate-100 bg-white p-5">

        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#0F766E]">
            AI Preview
          </p>

          <h2 className="mt-1 text-xl font-black text-[#061B3A]">
            {aiSummary.title}
          </h2>
        </div>

        <button
          onClick={() =>
            setShowAIPreview(false)
          }
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
        >
          <X size={22} />
        </button>

      </div>

      {/* CONTENT */}

      <div className="space-y-5 p-5 md:p-8">

        {/* INTRO */}

        <div className="rounded-[28px] bg-white p-6 shadow-sm">

          <div className="mb-3 flex items-center gap-2">

            <span className="rounded-xl bg-[#E6FFFA] px-3 py-1 text-sm font-black text-[#0F766E]">
              🧠 KONSEP DASAR
            </span>

          </div>

          <p className="leading-8 text-slate-700">
            {aiSummary.introduction}
          </p>

        </div>

        {/* SECTIONS */}

        {aiSummary.sections.map(
          (section, index) => {

            const isHighYield =
              section.type === "high_yield";

            const isMnemonic =
              section.type === "mnemonic";

            const isPearl =
              section.type ===
              "clinical_pearl";

            return (
              <div
                key={index}
                className={`rounded-[28px] p-6 shadow-sm ${
                  isHighYield
                    ? "border border-amber-200 bg-amber-50"
                    : isMnemonic
                    ? "border border-violet-200 bg-violet-50"
                    : isPearl
                    ? "border border-rose-200 bg-rose-50"
                    : "bg-white"
                }`}
              >

                <h3 className="text-lg font-black text-[#061B3A]">
                  {isHighYield
                    ? "⭐ "
                    : isMnemonic
                    ? "💡 "
                    : isPearl
                    ? "🩺 "
                    : "📌 "}

                  {section.title}
                </h3>

                {section.content && (
                  <p className="mt-3 whitespace-pre-line leading-8 text-slate-700">
                    {section.content}
                  </p>
                )}

                {section.items?.length > 0 && (
                  <ul className="mt-4 space-y-2">

                    {section.items.map(
                      (item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex gap-3 leading-7 text-slate-700"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0F766E]" />

                          <span>
                            {item}
                          </span>
                        </li>
                      )
                    )}

                  </ul>
                )}

                {section.type === "image" &&
                  section.image_query && (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">

                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Visual yang disarankan
                      </p>

                      <p className="mt-2 font-bold text-slate-700">
                        {section.image_query}
                      </p>

                    </div>
                  )}

              </div>
            );
          }
        )}

        {/* QUIZ */}

        {aiSummary.quick_quiz.length > 0 && (
          <div className="rounded-[28px] bg-[#061B3A] p-6 text-white">

            <p className="text-sm font-black uppercase tracking-wider text-[#7DE3D5]">
              Quick Quiz
            </p>

            <h3 className="mt-2 text-xl font-black">
              Uji pemahamanmu
            </h3>

            <div className="mt-5 space-y-5">

              {aiSummary.quick_quiz.map(
                (quiz, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-white/10 p-5"
                  >

                    <p className="font-bold leading-7">
                      {index + 1}.{" "}
                      {quiz.question}
                    </p>

                    <div className="mt-3 space-y-2">

                      {quiz.options.map(
                        (option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="rounded-xl bg-white/10 px-4 py-2 text-sm"
                          >
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                            . {option}
                          </div>
                        )
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

          </div>
        )}

      </div>

    </div>

  </div>
)}

                {/* SOURCE */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Sumber File
                  </label>

                  <input
                    value={sourceFile}
                    onChange={(e) =>
                      setSourceFile(e.target.value)
                    }
                    placeholder="Contoh: Flora normal.docx"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                  />
                </div>

                {/* TOOLBAR */}
                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Isi Materi
                  </label>

                  <div className="overflow-hidden rounded-2xl border border-slate-200">

                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">

                      <button
                        type="button"
                        onClick={() => exec("bold")}
                        title="Bold"
                        className="rounded-lg p-2 text-slate-700 hover:bg-white"
                      >
                        <Bold size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => exec("italic")}
                        title="Italic"
                        className="rounded-lg p-2 text-slate-700 hover:bg-white"
                      >
                        <Italic size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => exec("underline")}
                        title="Underline"
                        className="rounded-lg p-2 text-slate-700 hover:bg-white"
                      >
                        <Underline size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          exec("backColor", "#FFF59D")
                        }
                        title="Highlight"
                        className="rounded-lg p-2 text-slate-700 hover:bg-white"
                      >
                        <Highlighter size={18} />
                      </button>

                      <label
                        title="Warna teks"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm font-black hover:bg-white"
                      >
                        A
                        <input
                          type="color"
                          onChange={handleColorChange}
                          className="absolute h-0 w-0 opacity-0"
                        />
                      </label>

                      <div className="mx-1 h-6 w-px bg-slate-200" />

                      <select
                        onChange={(e) =>
                          setHeading(e.target.value)
                        }
                        defaultValue="p"
                        className="rounded-lg border-0 bg-transparent px-2 py-2 text-sm font-bold text-slate-700 outline-none hover:bg-white"
                      >
                        <option value="p">
                          Normal
                        </option>
                        <option value="h1">
                          Heading 1
                        </option>
                        <option value="h2">
                          Heading 2
                        </option>
                        <option value="h3">
                          Heading 3
                        </option>
                      </select>

                      <div className="mx-1 h-6 w-px bg-slate-200" />

                      <button
                        type="button"
                        onClick={() =>
                          exec("insertUnorderedList")
                        }
                        title="Bullet List"
                        className="rounded-lg p-2 text-slate-700 hover:bg-white"
                      >
                        <List size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          exec("insertOrderedList")
                        }
                        title="Numbered List"
                        className="rounded-lg p-2 text-slate-700 hover:bg-white"
                      >
                        <ListOrdered size={18} />
                      </button>

                    </div>

                    {/* EDITABLE AREA */}
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning
                      className="min-h-[450px] p-6 text-[16px] leading-8 text-slate-700 outline-none"
                      data-placeholder="Tulis materi di sini..."
                    />

                  </div>

                </div>

                {/* PUBLISH */}
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4">

                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) =>
                      setPublished(e.target.checked)
                    }
                    className="h-5 w-5 accent-[#0F766E]"
                  />

                  <div>
                    <p className="font-bold text-slate-800">
                      Publish materi
                    </p>

                    <p className="text-sm text-slate-500">
                      Materi yang dipublish dapat dilihat
                      oleh pengguna.
                    </p>
                  </div>

                </label>

              </div>

              {/* FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-6 sm:flex-row sm:justify-end">

                <button
                  onClick={closeEditor}
                  className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  onClick={saveMaterial}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-5 py-3 font-bold text-white hover:bg-[#115E59]"
                >
                  <Save size={18} />
                  {editingId
                    ? "Simpan Perubahan"
                    : "Simpan Materi"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}