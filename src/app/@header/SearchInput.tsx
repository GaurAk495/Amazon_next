"use client";

import { useEffect, useState } from "react";
import { getProducts } from "../../actions/products";
import Image from "next/image";
import { useRouter } from "next/navigation";

function SearchInput() {
  const [input, setInput] = useState("");
  const [list, setList] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    const handler = setTimeout(() => {
      if (input) {
        (async () => {
          const products = await getProducts(input);
          const names = products.map((product) => product.name);
          setList(names);
        })();
      } else {
        setList([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [input]);

  const clearState = () => {
    router.push(`?query=${input}`);
    setInput("");
    setList([]);
  };

  return (
    <>
      <input
        className="search-bar js-search-bar bg-white text-zinc-700"
        type="text"
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        placeholder="Search"
        name="query"
      />
      <button
        className="search-button js-search-button"
        type="submit"
        onClick={clearState}
      >
        <Image
          className="search-icon w-auto h-auto"
          alt="search-icon"
          width={120}
          height={40}
          src="/images/icons/search-icon.png"
        />
      </button>
      {list.length > 0 && (
        <div className="absolute top-[100%] left-0 right-0 bg-white text-zinc-800 rounded-b-sm p-4 space-y-2">
          {list.map((item) => (
            <div key={item} className="border-b">
              {item}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SearchInput;
