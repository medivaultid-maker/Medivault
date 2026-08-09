import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const summarySchema = {
  type: Type.OBJECT,

  properties: {
    title: {
      type: Type.STRING,
    },

    introduction: {
      type: Type.STRING,
    },

    sections: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          type: {
            type: Type.STRING,

            enum: [
              "concept",
              "key_points",
              "high_yield",
              "comparison",
              "mnemonic",
              "clinical_pearl",
              "algorithm",
              "image",
            ],
          },

          title: {
            type: Type.STRING,
          },

          content: {
            type: Type.STRING,
          },

          items: {
            type: Type.ARRAY,

            items: {
              type: Type.STRING,
            },
          },

          image_query: {
            type: Type.STRING,
          },
        },

        required: [
          "type",
          "title",
          "content",
          "items",
          "image_query",
        ],
      },
    },

    quick_quiz: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          question: {
            type: Type.STRING,
          },

          options: {
            type: Type.ARRAY,

            items: {
              type: Type.STRING,
            },
          },

          answer: {
            type: Type.STRING,
          },

          explanation: {
            type: Type.STRING,
          },
        },

        required: [
          "question",
          "options",
          "answer",
          "explanation",
        ],
      },
    },
  },

  required: [
    "title",
    "introduction",
    "sections",
    "quick_quiz",
  ],
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      text,
      title,
      subject,
    } = body;

    if (!text?.trim()) {
      return NextResponse.json(
        {
          error:
            "Materi tidak boleh kosong.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
Kamu adalah AI editor materi kedokteran
untuk platform belajar bernama MediVault.

Tugas kamu adalah mengubah materi mentah
menjadi rangkuman kedokteran yang:

- akurat
- mudah dipahami mahasiswa kedokteran
- ringkas tetapi tetap lengkap
- terstruktur
- enak dipelajari
- fokus pada konsep penting
- memiliki high-yield points
- memiliki mnemonic jika relevan
- memiliki clinical pearl jika relevan
- memiliki perbandingan jika relevan
- memiliki algoritma jika relevan
- memberikan rekomendasi visual jika relevan

Jangan mengarang informasi medis.

Jika informasi tidak tersedia dalam materi,
jangan membuat fakta spesifik yang tidak diperlukan.

Gunakan bahasa Indonesia.

Buat struktur rangkuman yang terasa seperti
catatan belajar mahasiswa kedokteran yang
rapi, modern, menarik, dan mudah dibaca.

JUDUL AWAL:
${title || "Tidak ada"}

MATA KULIAH:
${subject || "Kedokteran"}

MATERI MENTAH:
${text}
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",

        contents: prompt,

        config: {
          responseMimeType:
            "application/json",

          responseSchema:
            summarySchema,
        },
      });

    const output =
      response.text;

    if (!output) {
      throw new Error(
        "Gemini tidak memberikan hasil."
      );
    }

    const summary =
      JSON.parse(output);

    return NextResponse.json({
      summary,
    });

  } catch (error) {

    console.error(
      "GEMINI SUMMARY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal membuat rangkuman AI.",
      },
      {
        status: 500,
      }
    );
  }
}