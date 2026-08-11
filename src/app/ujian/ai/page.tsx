"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

type AIConfig = {
  block?: string | null;
  topic?: string | null;
  category?: string | null;
  questionCount: number;
};

type QuestionItem = {
  id: string;
  question: string;
  image?: string | null;
  options?: string[] | null;
  answer?: number | null;
  essayAnswer?: string | null;
  discussion?: string | null;
  discussionImage?: string | null;
  topic?: string | null;
  block?: string | null;
};

type ResultStats = {
  total: number;
  correct: number;
  wrong: number;
  unanswered: number;
  score: number;
  status: "Lulus" | "Belum Lulus";
};

export default function AISimulationExamPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [config, setConfig] = useState<AIConfig | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, number>>({});

  const [essayAnswers, setEssayAnswers] = useState<
    Record<string, string>
  >({});

  const [submitted, setSubmitted] = useState(false);

  const [result, setResult] = useState<ResultStats | null>(null);

  const [showDiscussion, setShowDiscussion] =
    useState(false);

  const [discussionIndex, setDiscussionIndex] =
    useState(0);

  useEffect(() => {
    loadSimulation();
  }, []);

  // =========================================================
  // HELPER
  // =========================================================

  const normalizeText = (value?: string | null) => {
    return (value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  };

  // =========================================================
  // LOAD SIMULATION
  // =========================================================

  const loadSimulation = async () => {
    try {
      setLoading(true);
      setError("");

      // =====================================================
      // 1. CEK USER
      // =====================================================

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // =====================================================
      // 2. AMBIL CONFIG
      // =====================================================

      const savedConfig = localStorage.getItem(
        "ai_simulation_config"
      );

      if (!savedConfig) {
        setError(
          "Konfigurasi simulasi tidak ditemukan. Silakan mulai kembali dari halaman Simulasi AI."
        );

        setLoading(false);
        return;
      }

      let parsedConfig: AIConfig;

      try {
        parsedConfig = JSON.parse(savedConfig);
      } catch {
        setError(
          "Konfigurasi simulasi tidak valid. Silakan mulai kembali."
        );

        setLoading(false);
        return;
      }

      const requestedCount = Math.max(
        1,
        Number(parsedConfig.questionCount) || 0
      );

      parsedConfig = {
        ...parsedConfig,
        questionCount: requestedCount,
      };

      setConfig(parsedConfig);

      // =====================================================
      // 3. AMBIL BANK SOAL
      // =====================================================

      let query = supabase
        .from("questions")
        .select(
          `
            id,
            question,
            image,
            options,
            answer,
            essay_answer,
            discussion,
            discussion_image,
            topic,
            block,
            package_id,
            exam_packages!inner (
              category,
              status
            )
          `
        )
        .eq("exam_packages.status", "published");

      // =====================================================
      // 4. FILTER CATEGORY
      // =====================================================

      if (parsedConfig.category) {
        query = query.eq(
          "exam_packages.category",
          parsedConfig.category
        );
      }

      const {
        data: questionData,
        error: questionError,
      } = await query;

      if (questionError) {
        console.error(
          "AI SIMULATION QUESTION ERROR:",
          questionError
        );

        setError("Gagal mengambil bank soal.");
        setLoading(false);
        return;
      }

      if (!questionData || questionData.length === 0) {
        setError(
          "Belum ada bank soal published yang sesuai untuk simulasi ini."
        );

        setLoading(false);
        return;
      }

      // =====================================================
      // 5. NORMALISASI
      // =====================================================

      const normalizedQuestions: QuestionItem[] =
        questionData.map((q: any) => ({
          id: q.id,
          question: q.question,
          image: q.image || null,
          options: Array.isArray(q.options)
            ? q.options
            : null,
          answer:
            typeof q.answer === "number"
              ? q.answer
              : q.answer !== null &&
                q.answer !== undefined &&
                !Number.isNaN(Number(q.answer))
              ? Number(q.answer)
              : null,
          essayAnswer: q.essay_answer || null,
          discussion: q.discussion || null,
          discussionImage:
            q.discussion_image || null,
          topic: q.topic || null,
          block: q.block || null,
        }));

      // =====================================================
      // 6. FILTER ADAPTIF
      //
      // Prioritas:
      //
      // 1. block + topic
      // 2. block
      // 3. topic
      // 4. seluruh bank soal category
      //
      // AI TIDAK MEMBUAT SOAL BARU.
      // AI hanya memilih soal dari bank soal.
      // =====================================================

      const targetBlock = normalizeText(
        parsedConfig.block
      );

      const targetTopic = normalizeText(
        parsedConfig.topic
      );

      const exactMatches =
        targetBlock && targetTopic
          ? normalizedQuestions.filter(
              (q) =>
                normalizeText(q.block) ===
                  targetBlock &&
                normalizeText(q.topic) ===
                  targetTopic
            )
          : [];

      const blockMatches = targetBlock
        ? normalizedQuestions.filter(
            (q) =>
              normalizeText(q.block) ===
              targetBlock
          )
        : [];

      const topicMatches = targetTopic
        ? normalizedQuestions.filter(
            (q) =>
              normalizeText(q.topic) ===
              targetTopic
          )
        : [];

      let candidateQuestions: QuestionItem[];

      if (exactMatches.length > 0) {
        candidateQuestions = exactMatches;
      } else if (blockMatches.length > 0) {
        candidateQuestions = blockMatches;
      } else if (topicMatches.length > 0) {
        candidateQuestions = topicMatches;
      } else {
        candidateQuestions = normalizedQuestions;
      }

      // =====================================================
      // 7. ACAK
      // =====================================================

      const shuffle = <T,>(items: T[]) => {
        const result = [...items];

        for (
          let i = result.length - 1;
          i > 0;
          i--
        ) {
          const j = Math.floor(
            Math.random() * (i + 1)
          );

          [result[i], result[j]] = [
            result[j],
            result[i],
          ];
        }

        return result;
      };

      const shuffledCandidates =
        shuffle(candidateQuestions);

      // =====================================================
      // 8. PILIH SOAL SESUAI JUMLAH
      // =====================================================

      let selectedQuestions =
        shuffledCandidates.slice(0, requestedCount);

      // =====================================================
      // 9. JIKA SOAL FOKUS KURANG
      //
      // Tambahkan soal lain dari category yang sama.
      // =====================================================

      if (
        selectedQuestions.length <
        requestedCount
      ) {
        const selectedIds = new Set(
          selectedQuestions.map((q) => q.id)
        );

        const remainingQuestions =
          normalizedQuestions.filter(
            (q) => !selectedIds.has(q.id)
          );

        const additionalQuestions = shuffle(
          remainingQuestions
        ).slice(
          0,
          requestedCount -
            selectedQuestions.length
        );

        selectedQuestions = [
          ...selectedQuestions,
          ...additionalQuestions,
        ];
      }

      // =====================================================
      // 10. VALIDASI JUMLAH
      // =====================================================

      if (selectedQuestions.length === 0) {
        setError(
          "Tidak ada soal yang dapat digunakan untuk simulasi."
        );

        setLoading(false);
        return;
      }

      // =====================================================
      // 11. SIMPAN
      // =====================================================

      setQuestions(selectedQuestions);
      setCurrentIndex(0);
      setAnswers({});
      setEssayAnswers({});
      setSubmitted(false);
      setResult(null);
      setLoading(false);
    } catch (err) {
      console.error(
        "AI SIMULATION LOAD ERROR:",
        err
      );

      setError(
        "Terjadi kesalahan saat menyiapkan simulasi."
      );

      setLoading(false);
    }
  };

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const currentQuestion =
    questions[currentIndex];

  const selectedAnswer =
    currentQuestion
      ? answers[currentQuestion.id]
      : undefined;

  const currentEssayAnswer =
    currentQuestion
      ? essayAnswers[currentQuestion.id] || ""
      : "";

  // =========================================================
  // PROGRESS
  // =========================================================

  const answeredCount = useMemo(() => {
    let count = 0;

    questions.forEach((q) => {
      const isObjectiveAnswered =
        answers[q.id] !== undefined;

      const isEssayAnswered =
        Boolean(
          essayAnswers[q.id]?.trim()
        );

      if (
        isObjectiveAnswered ||
        isEssayAnswered
      ) {
        count++;
      }
    });

    return count;
  }, [questions, answers, essayAnswers]);

  // =========================================================
  // SELECT OBJECTIVE ANSWER
  // =========================================================

  const selectAnswer = (index: number) => {
    if (submitted || !currentQuestion) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: index,
    }));
  };

  // =========================================================
  // ESSAY ANSWER
  // =========================================================

  const changeEssayAnswer = (
    value: string
  ) => {
    if (submitted || !currentQuestion) {
      return;
    }

    setEssayAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const goNext = () => {
    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        currentIndex + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(
        currentIndex - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goToQuestion = (
    index: number
  ) => {
    setCurrentIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const submitSimulation = () => {
    if (submitted) {
      return;
    }

    const confirmSubmit =
      window.confirm(
        "Yakin ingin mengakhiri simulasi dan melihat hasil?"
      );

    if (!confirmSubmit) {
      return;
    }

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    questions.forEach((q) => {
      // ===================================================
      // OBJECTIVE
      // ===================================================

      if (
        q.options &&
        q.options.length > 0
      ) {
        const userAnswer =
          answers[q.id];

        if (
          userAnswer === undefined ||
          userAnswer === null
        ) {
          unanswered++;
          return;
        }

        if (
          q.answer !== null &&
          q.answer !== undefined &&
          userAnswer === q.answer
        ) {
          correct++;
        } else {
          wrong++;
        }

        return;
      }

      // ===================================================
      // ESSAY
      //
      // Untuk sekarang essay tidak otomatis dinilai.
      // ===================================================

      const essay =
        essayAnswers[q.id]?.trim();

      if (!essay) {
        unanswered++;
      } else {
        // Karena essay membutuhkan penilaian manual,
        // belum dihitung benar/salah otomatis.
        //
        // Tetap dianggap unanswered dari sisi
        // skor objektif.
        unanswered++;
      }
    });

    const total = questions.length;

    const score =
      total > 0
        ? Math.round(
            (correct / total) * 100
          )
        : 0;

    const status =
      score >= 70
        ? "Lulus"
        : "Belum Lulus";

    const finalResult: ResultStats = {
      total,
      correct,
      wrong,
      unanswered,
      score,
      status,
    };

    setResult(finalResult);
    setSubmitted(true);
    setShowDiscussion(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DISCUSSION
  // =========================================================

  const openDiscussion = (
    index: number
  ) => {
    setDiscussionIndex(index);
    setShowDiscussion(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeDiscussion = () => {
    setShowDiscussion(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main>
        <Navbar />

        <section style={styles.centerPage}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingIcon}>
              🤖
            </div>

            <h1 style={styles.loadingTitle}>
              AI sedang menyiapkan soal
            </h1>

            <p style={styles.loadingText}>
              Memilih soal dari bank soal
              berdasarkan materi yang perlu
              kamu latih...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <main>
        <Navbar />

        <section style={styles.centerPage}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>
              ⚠️
            </div>

            <h1 style={styles.errorTitle}>
              Simulasi tidak dapat dimulai
            </h1>

            <p style={styles.errorText}>
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/simulasi/ai";
              }}
              style={styles.backButton}
            >
              Kembali ke Simulasi AI
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =========================================================
  // NO QUESTION
  // =========================================================

  if (!currentQuestion) {
    return null;
  }

  // =========================================================
  // RESULT PAGE
  // =========================================================

  if (
    submitted &&
    result &&
    !showDiscussion
  ) {
    return (
      <main>
        <Navbar />

        <section style={styles.resultPage}>
          <div style={styles.resultContainer}>
            {/* HEADER */}

            <div style={styles.resultHeader}>
              <div style={styles.resultBadge}>
                🤖 SIMULASI ADAPTIF SELESAI
              </div>

              <h1 style={styles.resultTitle}>
                Hasil Simulasi
              </h1>

              <p style={styles.resultSubtitle}>
                Berikut hasil latihanmu berdasarkan
                soal yang dipilih AI dari bank soal.
              </p>
            </div>

            {/* SCORE */}

            <div style={styles.scoreCard}>
              <div style={styles.scoreLabel}>
                NILAI AKHIR
              </div>

              <div style={styles.scoreValue}>
                {result.score}
              </div>

              <div
                style={{
                  ...styles.statusBadge,
                  ...(result.status ===
                  "Lulus"
                    ? styles.statusPassed
                    : styles.statusFailed),
                }}
              >
                {result.status ===
                "Lulus"
                  ? "✓ LULUS"
                  : "✕ BELUM LULUS"}
              </div>

              <p style={styles.scoreInfo}>
                Passing grade: 70
              </p>
            </div>

            {/* STATISTICS */}

            <div style={styles.statisticsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  📚
                </div>

                <div style={styles.statValue}>
                  {result.total}
                </div>

                <div style={styles.statLabel}>
                  Total Soal
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  ✓
                </div>

                <div
                  style={{
                    ...styles.statValue,
                    color: "#166534",
                  }}
                >
                  {result.correct}
                </div>

                <div style={styles.statLabel}>
                  Benar
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  ✕
                </div>

                <div
                  style={{
                    ...styles.statValue,
                    color: "#B91C1C",
                  }}
                >
                  {result.wrong}
                </div>

                <div style={styles.statLabel}>
                  Salah
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>
                  —
                </div>

                <div
                  style={{
                    ...styles.statValue,
                    color: "#64748B",
                  }}
                >
                  {result.unanswered}
                </div>

                <div style={styles.statLabel}>
                  Belum Dijawab
                </div>
              </div>
            </div>

            {/* ADAPTIVE INFO */}

            <div style={styles.adaptiveCard}>
              <div style={styles.adaptiveIcon}>
                🤖
              </div>

              <div>
                <h3
                  style={
                    styles.adaptiveTitle
                  }
                >
                  Latihan Adaptif
                </h3>

                <p
                  style={
                    styles.adaptiveText
                  }
                >
                  Soal dipilih dari bank soal
                  berdasarkan materi yang
                  sedang kamu latih.
                </p>

                {config?.block && (
                  <div
                    style={
                      styles.adaptiveMeta
                    }
                  >
                    Blok:{" "}
                    <strong>
                      {config.block}
                    </strong>
                  </div>
                )}

                {config?.topic && (
                  <div
                    style={
                      styles.adaptiveMeta
                    }
                  >
                    Topik:{" "}
                    <strong>
                      {config.topic}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}

            <div style={styles.resultActions}>
              <button
                type="button"
                onClick={() => {
                  setShowDiscussion(true);
                  setDiscussionIndex(0);
                }}
                style={
                  styles.discussionButton
                }
              >
                📖 Lihat Pembahasan
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/simulasi/ai";
                }}
                style={
                  styles.secondaryResultButton
                }
              >
                ← Kembali ke Simulasi AI
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // =========================================================
  // DISCUSSION PAGE
  // =========================================================

  if (
    submitted &&
    result &&
    showDiscussion
  ) {
    const discussionQuestion =
      questions[discussionIndex];

    if (!discussionQuestion) {
      return null;
    }

    const userAnswer =
      answers[discussionQuestion.id];

    const correctAnswer =
      discussionQuestion.answer;

    return (
      <main>
        <Navbar />

        <section style={styles.discussionPage}>
          <div
            style={styles.discussionContainer}
          >
            {/* HEADER */}

            <div
              style={styles.discussionHeader}
            >
              <button
                type="button"
                onClick={
                  closeDiscussion
                }
                style={
                  styles.backDiscussionButton
                }
              >
                ← Kembali ke Hasil
              </button>

              <div
                style={
                  styles.discussionHeaderContent
                }
              >
                <div
                  style={
                    styles.resultBadge
                  }
                >
                  PEMBAHASAN
                </div>

                <h1
                  style={
                    styles.discussionTitle
                  }
                >
                  Pembahasan Soal
                </h1>

                <p
                  style={
                    styles.discussionSubtitle
                  }
                >
                  Soal{" "}
                  {discussionIndex + 1} dari{" "}
                  {questions.length}
                </p>
              </div>
            </div>

            {/* QUESTION NAV */}

            <div
              style={
                styles.discussionQuestionNav
              }
            >
              {questions.map(
                (q, index) => {
                  const answer =
                    answers[q.id];

                  const isCorrect =
                    q.options &&
                    q.answer !==
                      null &&
                    q.answer !==
                      undefined &&
                    answer === q.answer;

                  const isAnswered =
                    answer !==
                      undefined ||
                    Boolean(
                      essayAnswers[
                        q.id
                      ]?.trim()
                    );

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() =>
                        setDiscussionIndex(
                          index
                        )}
                      style={{
                        ...styles.discussionDot,
                        ...(index ===
                        discussionIndex
                          ? styles.discussionDotActive
                          : {}),
                        ...(isAnswered
                          ? isCorrect
                            ? styles.discussionDotCorrect
                            : styles.discussionDotWrong
                          : {}),
                      }}
                    >
                      {index + 1}
                    </button>
                  );
                }
              )}
            </div>

            {/* QUESTION CARD */}

            <div
              style={
                styles.discussionCard
              }
            >
              <div
                style={
                  styles.questionNumber
                }
              >
                SOAL{" "}
                {discussionIndex + 1}
              </div>

              <div
                style={
                  styles.questionText
                }
              >
                {discussionQuestion.question}
              </div>

              {/* IMAGE */}

              {discussionQuestion.image && (
                <div
                  style={
                    styles.imageWrapper
                  }
                >
                  <img
                    src={
                      discussionQuestion.image
                    }
                    alt="Gambar soal"
                    style={
                      styles.questionImage
                    }
                  />
                </div>
              )}

              {/* OPTIONS */}

              {discussionQuestion.options &&
                discussionQuestion.options
                  .length > 0 && (
                  <div
                    style={
                      styles.options
                    }
                  >
                    {discussionQuestion.options.map(
                      (
                        option,
                        index
                      ) => {
                        const isUserAnswer =
                          userAnswer ===
                          index;

                        const isCorrectAnswer =
                          correctAnswer ===
                          index;

                        let optionStyle =
                          styles.option;

                        if (
                          isCorrectAnswer
                        ) {
                          optionStyle = {
                            ...styles.option,
                            ...styles.optionCorrect,
                          };
                        } else if (
                          isUserAnswer
                        ) {
                          optionStyle = {
                            ...styles.option,
                            ...styles.optionWrong,
                          };
                        }

                        return (
                          <div
                            key={index}
                            style={
                              optionStyle
                            }
                          >
                            <span
                              style={{
                                ...styles.optionLetter,
                                ...(isCorrectAnswer
                                  ? styles.optionLetterCorrect
                                  : {}),
                                ...(isUserAnswer &&
                                !isCorrectAnswer
                                  ? styles.optionLetterWrong
                                  : {}),
                              }}
                            >
                              {String.fromCharCode(
                                65 +
                                  index
                              )}
                            </span>

                            <span
                              style={
                                styles.optionText
                              }
                            >
                              {option}
                            </span>

                            <span
                              style={
                                styles.optionResultLabel
                              }
                            >
                              {isCorrectAnswer
                                ? "✓ Jawaban benar"
                                : isUserAnswer
                                ? "✕ Jawaban kamu"
                                : ""}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

              {/* ESSAY */}

              {!discussionQuestion.options &&
                discussionQuestion.essayAnswer && (
                  <div
                    style={
                      styles.essayDiscussion
                    }
                  >
                    <div
                      style={
                        styles.essayDiscussionTitle
                      }
                    >
                      Jawaban kamu
                    </div>

                    <div
                      style={
                        styles.essayUserAnswer
                      }
                    >
                      {essayAnswers[
                        discussionQuestion.id
                      ]?.trim() ||
                        "Tidak dijawab"}
                    </div>

                    <div
                      style={
                        styles.essayDiscussionTitle
                      }
                    >
                      Kunci / Jawaban Referensi
                    </div>

                    <div
                      style={
                        styles.essayReference
                      }
                    >
                      {
                        discussionQuestion.essayAnswer
                      }
                    </div>
                  </div>
                )}
            </div>

            {/* DISCUSSION */}

            <div
              style={
                styles.explanationCard
              }
            >
              <div
                style={
                  styles.explanationHeader
                }
              >
                <span
                  style={
                    styles.explanationIcon
                  }
                >
                  💡
                </span>

                <div>
                  <div
                    style={
                      styles.explanationLabel
                    }
                  >
                    PEMBAHASAN
                  </div>

                  <h2
                    style={
                      styles.explanationTitle
                    }
                  >
                    Penjelasan Jawaban
                  </h2>
                </div>
              </div>

              {discussionQuestion.discussion ? (
                <div
                  style={
                    styles.explanationText
                  }
                >
                  {
                    discussionQuestion.discussion
                  }
                </div>
              ) : (
                <div
                  style={
                    styles.noDiscussion
                  }
                >
                  Pembahasan untuk soal ini
                  belum tersedia.
                </div>
              )}

              {discussionQuestion.discussionImage && (
                <div
                  style={
                    styles.imageWrapper
                  }
                >
                  <img
                    src={
                      discussionQuestion.discussionImage
                    }
                    alt="Gambar pembahasan"
                    style={
                      styles.questionImage
                    }
                  />
                </div>
              )}
            </div>

            {/* BOTTOM NAV */}

            <div
              style={
                styles.discussionNavigation
              }
            >
              <button
                type="button"
                disabled={
                  discussionIndex === 0
                }
                onClick={() => {
                  setDiscussionIndex(
                    discussionIndex - 1
                  );

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                style={{
                  ...styles.navButton,
                  opacity:
                    discussionIndex === 0
                      ? 0.4
                      : 1,
                }}
              >
                ← Soal Sebelumnya
              </button>

              {discussionIndex <
                questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setDiscussionIndex(
                      discussionIndex + 1
                    );

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  style={{
                    ...styles.navButton,
                    ...styles.nextButton,
                  }}
                >
                  Soal Berikutnya →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    closeDiscussion
                  }
                  style={{
                    ...styles.navButton,
                    ...styles.nextButton,
                  }}
                >
                  Kembali ke Hasil
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // =========================================================
  // EXAM PAGE
  // =========================================================

  return (
    <main>
      <Navbar />

      <section style={styles.examPage}>
        {/* TOP BAR */}

        <div style={styles.topBar}>
          <div>
            <div style={styles.aiLabel}>
              🤖 SIMULASI ADAPTIF
            </div>

            <h1 style={styles.examTitle}>
              {config?.topic ||
                config?.block ||
                "Latihan Adaptif"}
            </h1>

            {config?.block && (
              <p style={styles.examSubtitle}>
                Blok: {config.block}
              </p>
            )}
          </div>

          <div style={styles.progressBox}>
            <span
              style={styles.progressLabel}
            >
              Soal
            </span>

            <strong>
              {currentIndex + 1} /{" "}
              {questions.length}
            </strong>

            <span
              style={
                styles.answeredProgress
              }
            >
              {answeredCount} terjawab
            </span>
          </div>
        </div>

        {/* PROGRESS */}

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressBar,
              width: `${
                ((currentIndex + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

        {/* QUESTION */}

        <div style={styles.questionCard}>
          <div style={styles.questionNumber}>
            SOAL {currentIndex + 1}
          </div>

          <div style={styles.questionText}>
            {currentQuestion.question}
          </div>

          {/* IMAGE */}

          {currentQuestion.image && (
            <div style={styles.imageWrapper}>
              <img
                src={currentQuestion.image}
                alt="Gambar soal"
                style={styles.questionImage}
              />
            </div>
          )}

          {/* OPTIONS */}

          {currentQuestion.options &&
            currentQuestion.options.length >
              0 && (
              <div style={styles.options}>
                {currentQuestion.options.map(
                  (
                    option,
                    index
                  ) => {
                    const isSelected =
                      selectedAnswer ===
                      index;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          selectAnswer(
                            index
                          )
                        }
                        style={{
                          ...styles.option,
                          ...(isSelected
                            ? styles.optionSelected
                            : {}),
                        }}
                      >
                        <span
                          style={{
                            ...styles.optionLetter,
                            ...(isSelected
                              ? styles.optionLetterSelected
                              : {}),
                          }}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        <span
                          style={
                            styles.optionText
                          }
                        >
                          {option}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            )}

          {/* ESSAY */}

          {!currentQuestion.options &&
            currentQuestion.essayAnswer && (
              <div
                style={styles.essayBox}
              >
                <textarea
                  value={
                    currentEssayAnswer
                  }
                  onChange={(e) =>
                    changeEssayAnswer(
                      e.target.value
                    )
                  }
                  placeholder="Tulis jawaban kamu..."
                  style={styles.textarea}
                />
              </div>
            )}

          {/* TOPIC INFO */}

          {(currentQuestion.block ||
            currentQuestion.topic) && (
            <div
              style={styles.questionMeta}
            >
              {currentQuestion.block && (
                <span
                  style={
                    styles.questionMetaBadge
                  }
                >
                  {currentQuestion.block}
                </span>
              )}

              {currentQuestion.topic && (
                <span
                  style={
                    styles.questionMetaBadge
                  }
                >
                  {currentQuestion.topic}
                </span>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION */}

        <div style={styles.navigation}>
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0}
            style={{
              ...styles.navButton,
              opacity:
                currentIndex === 0
                  ? 0.4
                  : 1,
            }}
          >
            ← Sebelumnya
          </button>

          <div
            style={styles.questionDots}
          >
            {questions.map(
              (q, index) => {
                const isAnswered =
                  answers[q.id] !==
                    undefined ||
                  Boolean(
                    essayAnswers[
                      q.id
                    ]?.trim()
                  );

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() =>
                      goToQuestion(
                        index
                      )
                    }
                    style={{
                      ...styles.dot,
                      ...(index ===
                      currentIndex
                        ? styles.dotActive
                        : {}),
                      ...(isAnswered
                        ? styles.dotAnswered
                        : {}),
                    }}
                  >
                    {index + 1}
                  </button>
                );
              }
            )}
          </div>

          {currentIndex <
          questions.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              style={{
                ...styles.navButton,
                ...styles.nextButton,
              }}
            >
              Berikutnya →
            </button>
          ) : (
            <button
              type="button"
              onClick={
                submitSimulation
              }
              style={
                styles.submitButton
              }
            >
              ✓ Selesai & Lihat Hasil
            </button>
          )}
        </div>

        {/* ANSWER STATUS */}

        <div
          style={styles.answerSummary}
        >
          <div>
            <strong>
              {answeredCount}
            </strong>{" "}
            dari{" "}
            <strong>
              {questions.length}
            </strong>{" "}
            soal sudah dijawab
          </div>

          {answeredCount <
            questions.length && (
            <span
              style={
                styles.unansweredWarning
              }
            >
              Masih ada soal yang belum
              dijawab
            </span>
          )}
        </div>
      </section>
    </main>
  );
}

// ===========================================================
// STYLES
// ===========================================================

const styles: Record<
  string,
  CSSProperties
> = {
  centerPage: {
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },

  loadingCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "24px",
    padding: "42px",
    textAlign: "center",
    maxWidth: "500px",
    boxShadow:
      "0 20px 50px rgba(6,27,58,.08)",
  },

  loadingIcon: {
    fontSize: "42px",
    marginBottom: "18px",
  },

  loadingTitle: {
    color: "#061B3A",
    margin: "0 0 10px",
    fontSize: "26px",
  },

  loadingText: {
    color: "#64748B",
    lineHeight: 1.6,
    margin: 0,
  },

  errorCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "24px",
    padding: "42px",
    textAlign: "center",
    maxWidth: "560px",
    boxShadow:
      "0 20px 50px rgba(6,27,58,.08)",
  },

  errorIcon: {
    fontSize: "42px",
    marginBottom: "16px",
  },

  errorTitle: {
    color: "#061B3A",
    fontSize: "24px",
    margin:
      "0 0 10px",
  },

  errorText: {
    color: "#64748B",
    lineHeight: 1.6,
    margin:
      "0 0 24px",
  },

  backButton: {
    padding: "13px 22px",
    borderRadius: "12px",
    border: "none",
    background: "#061B3A",
    color: "#FFFFFF",
    fontWeight: 800,
    cursor: "pointer",
  },

  examPage: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left,#EEF6F3 0%,#F8FAFC 35%,#FFFFFF 100%)",
    padding:
      "40px 24px 70px",
  },

  topBar: {
    maxWidth: "1100px",
    margin:
      "0 auto 18px",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
  },

  aiLabel: {
    color: "#234F42",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "1px",
    marginBottom: "8px",
  },

  examTitle: {
    margin: 0,
    color: "#061B3A",
    fontSize: "28px",
    fontWeight: 900,
  },

  examSubtitle: {
    color: "#64748B",
    margin:
      "5px 0 0",
    fontSize: "14px",
  },

  progressBox: {
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "14px",
    padding:
      "12px 18px",
    display: "flex",
    flexDirection:
      "column",
    alignItems: "center",
    minWidth: "105px",
  },

  progressLabel: {
    color: "#94A3B8",
    fontSize: "11px",
    fontWeight: 800,
    textTransform:
      "uppercase",
  },

  answeredProgress: {
    color: "#64748B",
    fontSize: "11px",
    marginTop: "4px",
  },

  progressTrack: {
    maxWidth: "1100px",
    height: "7px",
    margin:
      "0 auto 24px",
    background: "#E2E8F0",
    borderRadius:
      "999px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg,#061B3A,#234F42)",
    borderRadius:
      "999px",
    transition:
      "width .25s ease",
  },

  questionCard: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "24px",
    padding: "34px",
    boxShadow:
      "0 18px 50px rgba(6,27,58,.06)",
  },

  questionNumber: {
    color: "#234F42",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "1px",
    marginBottom:
      "16px",
  },

  questionText: {
    color: "#061B3A",
    fontSize: "19px",
    lineHeight: 1.8,
    fontWeight: 600,
    whiteSpace:
      "pre-wrap",
  },

  imageWrapper: {
    marginTop: "24px",
    textAlign: "center",
  },

  questionImage: {
    maxWidth: "100%",
    maxHeight: "450px",
    objectFit: "contain",
    borderRadius: "14px",
    border:
      "1px solid #E2E8F0",
  },

  options: {
    display: "flex",
    flexDirection:
      "column",
    gap: "12px",
    marginTop: "30px",
  },

  option: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding:
      "15px 16px",
    borderRadius: "15px",
    border:
      "1px solid #E2E8F0",
    background: "#FFFFFF",
    cursor: "pointer",
    textAlign: "left",
    boxSizing:
      "border-box",
  },

  optionSelected: {
    border:
      "1px solid #234F42",
    background: "#EEF6F3",
  },

  optionCorrect: {
    border:
      "1px solid #16A34A",
    background: "#F0FDF4",
  },

  optionWrong: {
    border:
      "1px solid #DC2626",
    background: "#FEF2F2",
  },

  optionLetter: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "#F1F5F9",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    flexShrink: 0,
  },

  optionLetterSelected: {
    background: "#234F42",
    color: "#FFFFFF",
  },

  optionLetterCorrect: {
    background: "#16A34A",
    color: "#FFFFFF",
  },

  optionLetterWrong: {
    background: "#DC2626",
    color: "#FFFFFF",
  },

  optionText: {
    color: "#334155",
    fontSize: "15px",
    lineHeight: 1.6,
    flex: 1,
  },

  optionResultLabel: {
    fontSize: "12px",
    fontWeight: 800,
    color: "#64748B",
    whiteSpace:
      "nowrap",
  },

  essayBox: {
    marginTop: "30px",
  },

  textarea: {
    width: "100%",
    minHeight: "180px",
    padding: "16px",
    borderRadius: "14px",
    border:
      "1px solid #E2E8F0",
    resize: "vertical",
    fontSize: "15px",
    outline: "none",
    boxSizing:
      "border-box",
    color: "#061B3A",
    fontFamily:
      "inherit",
  },

  questionMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "24px",
  },

  questionMetaBadge: {
    display: "inline-flex",
    padding:
      "6px 10px",
    borderRadius: "999px",
    background: "#F1F5F9",
    color: "#64748B",
    fontSize: "11px",
    fontWeight: 800,
  },

  navigation: {
    maxWidth: "1100px",
    margin:
      "22px auto 0",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "14px",
  },

  navButton: {
    padding:
      "13px 20px",
    borderRadius: "13px",
    border:
      "1px solid #E2E8F0",
    background: "#FFFFFF",
    color: "#061B3A",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace:
      "nowrap",
  },

  nextButton: {
    background: "#061B3A",
    color: "#FFFFFF",
    border:
      "1px solid #061B3A",
  },

  submitButton: {
    padding:
      "13px 20px",
    borderRadius: "13px",
    border: "none",
    background: "#234F42",
    color: "#FFFFFF",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace:
      "nowrap",
  },

  questionDots: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    justifyContent:
      "center",
    maxWidth: "650px",
  },

  dot: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    border:
      "1px solid #E2E8F0",
    background: "#FFFFFF",
    color: "#64748B",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  dotActive: {
    background: "#061B3A",
    color: "#FFFFFF",
    border:
      "1px solid #061B3A",
  },

  dotAnswered: {
    border:
      "1px solid #234F42",
    background: "#EEF6F3",
  },

  answerSummary: {
    maxWidth: "1100px",
    margin:
      "18px auto 0",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "16px",
    padding:
      "14px 18px",
    borderRadius: "14px",
    background:
      "rgba(255,255,255,.8)",
    border:
      "1px solid #E2E8F0",
    color: "#64748B",
    fontSize: "13px",
  },

  unansweredWarning: {
    color: "#B45309",
    fontWeight: 800,
  },

  // =======================================================
  // RESULT
  // =======================================================

  resultPage: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left,#EEF6F3 0%,#F8FAFC 40%,#FFFFFF 100%)",
    padding:
      "50px 24px 80px",
  },

  resultContainer: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  resultHeader: {
    textAlign: "center",
    marginBottom:
      "28px",
  },

  resultBadge: {
    display:
      "inline-block",
    padding:
      "7px 12px",
    borderRadius:
      "999px",
    background: "#EEF6F3",
    color: "#234F42",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing:
      ".8px",
  },

  resultTitle: {
    color: "#061B3A",
    fontSize: "36px",
    fontWeight: 900,
    margin:
      "14px 0 8px",
  },

  resultSubtitle: {
    color: "#64748B",
    fontSize: "15px",
    lineHeight: 1.6,
    margin: 0,
  },

  scoreCard: {
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "26px",
    padding:
      "36px 24px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(6,27,58,.08)",
  },

  scoreLabel: {
    color: "#94A3B8",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing:
      "1.5px",
  },

  scoreValue: {
    color: "#061B3A",
    fontSize: "76px",
    lineHeight: 1,
    fontWeight: 950,
    margin:
      "15px 0 18px",
  },

  statusBadge: {
    display:
      "inline-flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    padding:
      "9px 16px",
    borderRadius:
      "999px",
    fontSize: "12px",
    fontWeight: 900,
  },

  statusPassed: {
    background: "#DCFCE7",
    color: "#166534",
  },

  statusFailed: {
    background: "#FEE2E2",
    color: "#B91C1C",
  },

  scoreInfo: {
    color: "#94A3B8",
    fontSize: "12px",
    margin:
      "14px 0 0",
  },

  statisticsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,1fr)",
    gap: "14px",
    marginTop: "18px",
  },

  statCard: {
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "18px",
    padding:
      "20px 14px",
    textAlign: "center",
  },

  statIcon: {
    fontSize: "18px",
    marginBottom:
      "8px",
  },

  statValue: {
    color: "#061B3A",
    fontSize: "28px",
    fontWeight: 900,
  },

  statLabel: {
    color: "#94A3B8",
    fontSize: "11px",
    fontWeight: 800,
    marginTop: "3px",
  },

  adaptiveCard: {
    marginTop: "18px",
    background:
      "linear-gradient(135deg,#061B3A,#234F42)",
    color: "#FFFFFF",
    borderRadius: "20px",
    padding:
      "22px 24px",
    display: "flex",
    gap: "16px",
    alignItems:
      "flex-start",
  },

  adaptiveIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    background:
      "rgba(255,255,255,.12)",
    display: "flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    flexShrink: 0,
    fontSize: "20px",
  },

  adaptiveTitle: {
    margin:
      "0 0 5px",
    fontSize: "16px",
  },

  adaptiveText: {
    margin:
      "0 0 8px",
    color:
      "rgba(255,255,255,.72)",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  adaptiveMeta: {
    display: "inline-block",
    marginRight:
      "12px",
    color:
      "rgba(255,255,255,.88)",
    fontSize: "12px",
  },

  resultActions: {
    display: "flex",
    gap: "12px",
    justifyContent:
      "center",
    marginTop: "24px",
    flexWrap: "wrap",
  },

  discussionButton: {
    padding:
      "14px 22px",
    borderRadius: "13px",
    border: "none",
    background: "#061B3A",
    color: "#FFFFFF",
    fontWeight: 900,
    cursor: "pointer",
  },

  secondaryResultButton: {
    padding:
      "14px 22px",
    borderRadius: "13px",
    border:
      "1px solid #E2E8F0",
    background: "#FFFFFF",
    color: "#061B3A",
    fontWeight: 800,
    cursor: "pointer",
  },

  // =======================================================
  // DISCUSSION
  // =======================================================

  discussionPage: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left,#EEF6F3 0%,#F8FAFC 40%,#FFFFFF 100%)",
    padding:
      "40px 24px 80px",
  },

  discussionContainer: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  discussionHeader: {
    marginBottom:
      "22px",
  },

  backDiscussionButton: {
    border: "none",
    background: "transparent",
    color: "#64748B",
    fontWeight: 800,
    cursor: "pointer",
    padding: 0,
    marginBottom:
      "20px",
  },

  discussionHeaderContent: {
    textAlign: "center",
  },

  discussionTitle: {
    margin:
      "12px 0 5px",
    color: "#061B3A",
    fontSize: "32px",
    fontWeight: 900,
  },

  discussionSubtitle: {
    margin: 0,
    color: "#64748B",
    fontSize: "13px",
  },

  discussionQuestionNav: {
    display: "flex",
    gap: "7px",
    flexWrap: "wrap",
    justifyContent:
      "center",
    marginBottom:
      "20px",
  },

  discussionDot: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    border:
      "1px solid #E2E8F0",
    background: "#FFFFFF",
    color: "#64748B",
    fontWeight: 800,
    cursor: "pointer",
  },

  discussionDotActive: {
    background: "#061B3A",
    color: "#FFFFFF",
    border:
      "1px solid #061B3A",
  },

  discussionDotCorrect: {
    border:
      "1px solid #16A34A",
  },

  discussionDotWrong: {
    border:
      "1px solid #DC2626",
  },

  discussionCard: {
    background: "#FFFFFF",
    border:
      "1px solid #E2E8F0",
    borderRadius: "24px",
    padding: "34px",
    boxShadow:
      "0 18px 50px rgba(6,27,58,.06)",
  },

  explanationCard: {
    marginTop: "18px",
    background: "#FFFFFF",
    border:
      "1px solid #D9E8E2",
    borderRadius: "24px",
    padding: "28px 30px",
    boxShadow:
      "0 14px 40px rgba(35,79,66,.06)",
  },

  explanationHeader: {
    display: "flex",
    gap: "14px",
    alignItems:
      "center",
    marginBottom:
      "20px",
  },

  explanationIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    background: "#EEF6F3",
    display: "flex",
    alignItems:
      "center",
    justifyContent:
      "center",
    fontSize: "20px",
  },

  explanationLabel: {
    color: "#234F42",
    fontSize: "10px",
    fontWeight: 900,
    letterSpacing:
      "1px",
  },

  explanationTitle: {
    margin:
      "3px 0 0",
    color: "#061B3A",
    fontSize: "21px",
    fontWeight: 900,
  },

  explanationText: {
    color: "#334155",
    fontSize: "15px",
    lineHeight: 1.8,
    whiteSpace:
      "pre-wrap",
  },

  noDiscussion: {
    color: "#94A3B8",
    fontSize: "14px",
    lineHeight: 1.6,
    padding:
      "10px 0",
  },

  essayDiscussion: {
    marginTop: "24px",
    display: "flex",
    flexDirection:
      "column",
    gap: "10px",
  },

  essayDiscussionTitle: {
    color: "#64748B",
    fontSize: "12px",
    fontWeight: 900,
    textTransform:
      "uppercase",
    letterSpacing:
      ".7px",
  },

  essayUserAnswer: {
    background: "#F8FAFC",
    border:
      "1px solid #E2E8F0",
    borderRadius: "13px",
    padding: "15px",
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.6,
    whiteSpace:
      "pre-wrap",
  },

  essayReference: {
    background: "#EEF6F3",
    border:
      "1px solid #D9E8E2",
    borderRadius: "13px",
    padding: "15px",
    color: "#234F42",
    fontSize: "14px",
    lineHeight: 1.6,
    whiteSpace:
      "pre-wrap",
  },

  discussionNavigation: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    gap: "14px",
    marginTop:
      "22px",
  },
};