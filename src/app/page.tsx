import { Metadata } from "next";
import React from "react";
import { getProducts } from "../actions/products";
import Product from "../components/Product";
import "../styles/pages/amazon.css";

export const metadata: Metadata = {
  title: "Amazon Project",
};

async function page({
  searchParams,
}: {
  searchParams?: Promise<{ query: string }>;
}) {
  const { query } = searchParams ? await searchParams : { query: "" };
  const products = await getProducts(query && query);
  return (
    <>
      <div className="home-main">
        <div className="products-grid">
          {products.length > 0 &&
            products.map((product) => (
              <Product key={product.$id} product={product} />
            ))}
        </div>
      </div>
    </>
  );
}

export default page;
