import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getCart } from "../../actions/cart";
import "../../styles/shared/amazon-header.css";
import SearchInput from "./SearchInput";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

async function page() {
  const cart = await getCart();
  return (
    <div className="amazon-header">
      <div className="amazon-header-left-section">
        <Link href="/" className="header-link">
          <Image
            className="amazon-logo"
            alt="amazon-logo"
            width={120}
            height={40}
            src="/images/amazon-logo-white.png"
          />
          <Image
            className="amazon-mobile-logo"
            alt="amazon-mobile-logo"
            width={120}
            height={40}
            src="/images/amazon-mobile-logo-white.png"
          />
        </Link>
      </div>

      <div className="amazon-header-middle-section relative">
        <SearchInput />
      </div>

      <div className="amazon-header-right-section">
        <Link className="orders-link header-link" href="/orders">
          <span className="returns-text">Returns</span>
          <span className="orders-text">& Orders</span>
        </Link>

        <Link className="cart-link header-link" href="/checkout">
          <Image
            className="cart-icon w-auto"
            alt="cart-icon"
            width={120}
            height={40}
            src="/images/icons/cart-icon.png"
          />
          <div className="cart-quantity js-cart-quantity"> {cart.length} </div>
          <div className="cart-text">Cart</div>
        </Link>
      </div>
      <div className="auth space-x-2 h-full flex items-center text-black ">
        <SignedOut>
          <SignInButton mode="redirect">
            <button className="bg-[#febd69] rounded-sm p-2">Sign In</button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-[#febd69] rounded-sm p-2">Sign Up</button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}

export default page;
