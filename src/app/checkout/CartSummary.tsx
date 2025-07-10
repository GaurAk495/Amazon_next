import CartItem from "./CartItem";
import { cartType } from "../../actions/cart";

function CartSummary({ cartItems }: { cartItems: cartType[] }) {
  return (
    <>
      {cartItems.map((cartItem) => (
        <CartItem cartItem={cartItem} key={cartItem.$id} />
      ))}
    </>
  );
}

export default CartSummary;
