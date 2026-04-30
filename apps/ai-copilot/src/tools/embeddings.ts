import { OpenAIEmbeddings } from "@langchain/openai";

let embedder: OpenAIEmbeddings | null = null;

function getEmbedder(): OpenAIEmbeddings {
  if (!embedder) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY no configurada");
    embedder = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
    });
  }
  return embedder;
}

export async function embedText(text: string): Promise<number[]> {
  return getEmbedder().embedQuery(text);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  return getEmbedder().embedDocuments(texts);
}
