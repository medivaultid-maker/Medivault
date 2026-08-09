
import Link from "next/link";
import InfoLayout from "../../../components/info/InfoLayout";
import InfoHero from "../../../components/info/InfoHero";

import {
  BookOpen,
  CheckCircle2,
  ShoppingCart,
} from "lucide-react";

export default function ParasitologiPage() {
  return (
    <InfoLayout>

      <InfoHero
        title="Parasitologi"
        subtitle="Rangkuman materi parasitologi yang disusun per bab untuk membantu memahami berbagai parasit dan penyakit yang ditimbulkannya dengan lebih mudah."
        icon={<BookOpen size={40} />}
      />

      <section className="mx-auto max-w-7xl px-6 pt-2 pb-10">
        <div className="mx-auto max-w-5xl">

          <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_14px_40px_rgba(6,27,58,0.06)] md:p-10">

            {/* PREVIEW */}
            <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-slate-50">
              <img
                src="/images/parasitologi-preview.png"
                alt="Preview Catatan Materi Parasitologi"
                className="w-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="mt-10">

              <h2 className="text-2xl font-black text-[#061B3A]">
                Catatan Materi — Parasitologi
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Catatan materi Parasitologi yang merangkum berbagai jenis
                parasit, siklus hidup, cara penularan, manifestasi klinis,
                diagnosis, serta konsep penting lainnya secara ringkas dan
                sistematis untuk membantu proses belajar dan persiapan ujian.
              </p>

              {/* BENEFITS */}
              <div className="mt-8 space-y-4">

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-1 shrink-0 text-[#0F766E]"
                  />

                  <p className="text-slate-600">
                    Materi disusun berdasarkan bab pembelajaran
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-1 shrink-0 text-[#0F766E]"
                  />

                  <p className="text-slate-600">
                    Rangkuman parasit, siklus hidup, dan penyakit secara ringkas
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-1 shrink-0 text-[#0F766E]"
                  />

                  <p className="text-slate-600">
                    Membantu memahami diagnosis dan konsep klinis sebelum ujian
                  </p>
                </div>

              </div>

              {/* PRICE */}
              <div className="mt-10 border-t border-slate-100 pt-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Harga
                    </p>

                    <p className="mt-1 text-3xl font-black text-[#061B3A]">
                      Rp25.000
                    </p>
                  </div>

                  <Link
                    href="GANTI_DENGAN_LINK_LYNK_ID"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0F766E] px-7 py-4 font-extrabold text-white shadow-[0_18px_40px_rgba(15,118,110,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0D665F]"
                  >
                    <ShoppingCart size={19} />
                    Beli Catatan
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

    </InfoLayout>
  );
}

