"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

function AddToCartButton() {
  const { pending } = useFormStatus();
  const addtoCartDiv = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!pending || !addtoCartDiv.current) return;

    addtoCartDiv.current.style.opacity = "1";
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      addtoCartDiv.current!.style.opacity = "0";
    }, 1500);
  }, [pending]);
  return (
    <>
      <div className="added-to-cart" ref={addtoCartDiv}>
        <Image
          src="/images/icons/checkmark.png"
          alt="checkmark"
          className="w-auto"
          width={30}
          height={30}
        />
        Added
      </div>
      <button
        className="add-to-cart-button button-primary js-add-to-cart"
        disabled={pending}
      >
        Add to Cart
      </button>
    </>
  );
}

export default AddToCartButton;
