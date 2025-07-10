"use server";
import { deliveryOptions, DeliveryType } from "../constant/delivery";
import { products } from "../constant/products";
import { createAdminClient } from "../server/appwrite";
import { appwrite } from "../server/appwriteKeys";

export async function insertProducts() {
  const databaseId = appwrite.databaseId as string;
  const collectionId = appwrite.productCollectionId as string;

  const { databases } = await createAdminClient();

  // Transform products data for bulk creation
  const productDocuments = products.map((product) => ({
    name: product.name,
    image: product.image,
    rating_stars: product.rating.stars,
    rating_count: product.rating.count,
    priceCents: product.priceCents,
    type: product.type || "default",
    keywords: product.keywords || [],
    sizeChartLink: product.sizeChartLink || "",
  }));

  const batchSize = 5; // Process 5 documents at a time
  const delay = 500; // 500ms delay between batches
  const results = [];
  const errors = [];

  try {
    // Process in batches to avoid rate limiting
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const batchDocuments = productDocuments.slice(i, i + batchSize);

      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
          products.length / batchSize
        )}`
      );

      // Create promises for current batch
      const batchPromises = batch.map((product, index) =>
        databases
          .createDocument(
            databaseId,
            collectionId,
            product.id,
            batchDocuments[index]
          )
          .catch((error) => ({
            error: true,
            productId: product.id,
            message: error.message,
            code: error.code || "unknown",
          }))
      );

      // Execute current batch
      const batchResults = await Promise.all(batchPromises);

      // Separate successful inserts from errors
      const successfulInserts = batchResults.filter((result) => !result.error);
      const batchErrors = batchResults.filter((result) => result.error);

      results.push(...successfulInserts);
      errors.push(...batchErrors);

      // Add delay between batches (except for the last batch)
      if (i + batchSize < products.length) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    console.log(`Inserted ${results.length} documents successfully`);
    if (errors.length > 0) {
      console.error(`Failed to insert ${errors.length} documents:`, errors);
    }

    return {
      total: results.length,
      documents: results,
      errors: errors,
      summary: {
        successful: results.length,
        failed: errors.length,
        totalAttempted: products.length,
      },
    };
  } catch (err) {
    console.error("Error in bulk insert operation:", err);
    throw err;
  }
}

export async function insertDelivery() {
  const databaseId = appwrite.databaseId as string;
  const collectionId = appwrite.deliveryCollectionId as string;
  const { databases } = await createAdminClient();

  const bulkCreateDocuments = async (
    databaseId: string,
    collectionId: string,
    documents: DeliveryType[]
  ) => {
    try {
      const promises = documents.map((doc) =>
        databases.createDocument(databaseId, collectionId, String(doc.$id), {
          days: doc.days,
          priceCents: doc.priceCents,
        })
      );

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error("Bulk create failed:", error);
      throw error;
    }
  };

  bulkCreateDocuments(databaseId, collectionId, deliveryOptions)
    .then((results) => console.log("Created documents:", results))
    .catch((error) => console.error("Error:", error));
}
