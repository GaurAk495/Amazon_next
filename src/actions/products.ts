"use server";
import { Query } from "node-appwrite";
import { createAdminClient } from "../lib/server/appwrite";
import { appwrite } from "../lib/server/appwriteKeys";

export type Product = {
  $id: string;
  image: string;
  name: string;
  rating_stars: number;
  rating_count: number;
  priceCents: number;
  type?: string;
  keywords: string[];
  sizeChartLink?: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
};

type AppwriteListResponse<T> = {
  total: number;
  documents: T[];
};

type ProductListResponse = AppwriteListResponse<Product>;

export async function getProducts(query?: string) {
  const { databases } = await createAdminClient();

  const searchQueries = query
    ? [
        Query.or([
          Query.search("name", query),
          Query.contains("keywords", query),
        ]),
      ]
    : [];

  const res: ProductListResponse = await databases.listDocuments<Product>(
    appwrite.databaseId,
    appwrite.productCollectionId,
    searchQueries
  );

  return res.documents || [];
}
