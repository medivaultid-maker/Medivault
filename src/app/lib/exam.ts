import { supabase } from "./supabase";

/* ==========================
   PROFILE
========================== */

export async function getUserToken(userId: string) {
  return await supabase
    .from("profiles")
    .select("token")
    .eq("id", userId)
    .single();
}

export async function updateUserToken(
  userId: string,
  token: number
) {
  return await supabase
    .from("profiles")
    .update({ token })
    .eq("id", userId);
}

/* ==========================
   PACKAGE
========================== */

export async function getPackages() {
  return await supabase
    .from("exam_packages")
    .select("*")
    .eq("status", "published");
}

/* ==========================
   QUESTIONS
========================== */

export async function getQuestions(packageId: string) {
  return await supabase
    .from("questions")
    .select("*")
    .eq("package_id", packageId)
    .order("order_no");
}

/* ==========================
   ATTEMPT
========================== */

export async function createAttempt(
  userId: string,
  packageId: string
) {
  return await supabase
    .from("exam_attempts")
    .insert({
      user_id: userId,
      package_id: packageId,
      score: 0,
      passing_grade: 70,
      correct_count: 0,
      wrong_count: 0,
      unanswered_count: 0,
      doubt_count: 0,
      total_questions: 0,
      duration: 0,
      status: "ongoing",
    })
    .select()
    .single();
}

export async function getHistory(userId: string) {
  return await supabase
    .from("exam_attempts")
    .select(`
      id,
      package_id,
      score,
      status,
      created_at,
      exam_packages (
        title,
        category
      )
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });
}

/* ==========================
   SESSION
========================== */

export async function getActiveSession(
  userId: string,
  packageId: string
) {
  return await supabase
    .from("exam_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("package_id", packageId)
    .eq("finished", false)
    .maybeSingle();
}

export async function createSession(
  userId: string,
  packageId: string,
  attemptId: string,
  duration: number
) {
  return await supabase
    .from("exam_sessions")
    .insert({
      user_id: userId,
      package_id: packageId,
      attempt_id: attemptId,
      duration,
      finished: false,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();
}

export async function finishSession(
  attemptId: string
) {
  return await supabase
    .from("exam_sessions")
    .update({
      finished: true,
    })
    .eq("attempt_id", attemptId);
}

export async function startExam(
  item: any,
  setToken: (token: number) => void
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("Silakan login.");
    return;
  }

  // ==========================================
  // 1. AMBIL PROFILE USER
  // ==========================================

  const { data: profile, error: profileError } =
    await getUserToken(user.id);

  if (profileError || !profile) {
    console.error(profileError);
    alert("Profil tidak ditemukan.");
    return;
  }

  // ==========================================
  // 2. CEK SESSION AKTIF
  // ==========================================

  const {
    data: activeSession,
    error: sessionError,
  } = await getActiveSession(user.id, item.id);

  if (sessionError) {
    console.error(sessionError);
    alert("Gagal mengecek sesi ujian.");
    return;
  }

  // ==========================================
  // 3. KALAU MASIH ADA SESSION
  // → LANJUTKAN ATTEMPT LAMA
  // ==========================================

  if (activeSession) {
    localStorage.setItem(
      "medivault_attempt_id",
      activeSession.attempt_id
    );

    window.location.href = `/ujian/${item.id}`;
    return;
  }

  // ==========================================
  // 4. CEK TOKEN
  // ==========================================

  if (profile.token < item.tokenCost) {
    alert("Token tidak cukup.");
    return;
  }

  // ==========================================
  // 5. BUAT ATTEMPT
  // ==========================================

  const {
    data: attempt,
    error: attemptError,
  } = await createAttempt(
    user.id,
    item.id
  );

  if (attemptError || !attempt) {
    console.error(attemptError);
    alert("Gagal membuat attempt.");
    return;
  }

  // ==========================================
  // 6. BUAT SESSION
  // ==========================================

  const {
    data: session,
    error: createSessionError,
  } = await createSession(
    user.id,
    item.id,
    attempt.id,
    item.duration
  );

  if (createSessionError || !session) {
    console.error(createSessionError);

    // rollback attempt
    await supabase
      .from("exam_attempts")
      .delete()
      .eq("id", attempt.id);

    alert("Gagal membuat sesi ujian.");
    return;
  }

  // ==========================================
  // 7. POTONG TOKEN
  // ==========================================

  const newToken =
    profile.token - item.tokenCost;

  const {
    error: tokenError,
  } = await updateUserToken(
    user.id,
    newToken
  );

  if (tokenError) {
    console.error(tokenError);

    // rollback session
    await supabase
      .from("exam_sessions")
      .delete()
      .eq("attempt_id", attempt.id);

    // rollback attempt
    await supabase
      .from("exam_attempts")
      .delete()
      .eq("id", attempt.id);

    alert("Gagal memproses token.");
    return;
  }

  // ==========================================
  // 8. SIMPAN ATTEMPT ID
  // ==========================================

  localStorage.setItem(
    "medivault_attempt_id",
    attempt.id
  );

  setToken(newToken);

  // ==========================================
  // 9. MASUK UJIAN
  // ==========================================

  window.location.href =
    `/ujian/${item.id}`;
}
