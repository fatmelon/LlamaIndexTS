import { AstraDBVectorStore } from "@llamaindex/astra";
import { CSVReader } from "@llamaindex/readers/csv";
import { storageContextFromDefaults, VectorStoreIndex } from "llamaindex";

const collectionName = "movie_reviews";

async function main() {
  try {
    const reader = new CSVReader(false);
    const docs = await reader.loadData("./data/movie_reviews.csv");

    const astraVS = new AstraDBVectorStore({ contentKey: "reviewtext" });
    await astraVS.createAndConnect(collectionName, {
      vector: { dimension: 1536, metric: "cosine" },
    });
    await astraVS.connect(collectionName);

    const ctx = await storageContextFromDefaults({ vectorStore: astraVS });
    const index = await VectorStoreIndex.fromDocuments(docs, {
      storageContext: ctx,
    });
  } catch (e) {
    console.error(e);
  }
}

void main();
