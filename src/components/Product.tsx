import Image from "next/image";
import { Product as ProductTye } from "../actions/products";
import { addToCart } from "../actions/cart";
import { formatPrice } from "../lib/utils/formatPrice";
import Form from "next/form";
import AddToCartButton from "./AddToCartButton";

function Product({ product }: { product: ProductTye }) {
  return (
    <Form
      action={addToCart.bind(null, product.$id)}
      className="product-container"
    >
      <div className="product-image-container">
        <Image
          className="product-image"
          src={`/${product.image}`}
          alt={product.name}
          width={150}
          height={200}
        />
      </div>
      <div className="line-clamp-2 overflow-ellipsis">{product.name}</div>
      <div className="product-rating-container">
        <Image
          className="product-rating-stars"
          src={`/images/ratings/rating-${product.rating_stars * 10}.png`}
          alt={product.name}
          width={128}
          height={25}
        />
        <div className="product-rating-count link-primary">
          {product.rating_count}
        </div>
      </div>
      <div className="product-price">${formatPrice(product.priceCents)}</div>
      <div className="product-quantity-container">
        <select
          className="js-quantity-dropdown-${product.id}"
          defaultValue="1"
          name="quantity"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      {product.sizeChartLink || ""}
      <div className="product-spacer"></div>
      <AddToCartButton />
    </Form>
  );
}

export default Product;
