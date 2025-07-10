import Image from "next/image";
import { getOrderDetail } from "../../actions/order";
import { formateDate } from "../../lib/utils/formatDate";
import "../../styles/pages/tracking.css";
import Link from "next/link";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ "order-id": string; "orderitem-id": string }>;
}) {
  const { "order-id": orderId, "orderitem-id": orderitemid } =
    await searchParams;

  const orderDetail = await getOrderDetail(orderId, orderitemid);

  const orderTime = new Date(orderDetail.orderTime).getTime();
  const estimated = new Date(orderDetail.estimatedDeliveryTime).getTime();
  const now = Date.now();

  const progress = ((now - orderTime) / (estimated - orderTime)) * 100;

  return (
    <div className="tracking-main">
      <div className="order-tracking js-order-tracking">
        <Link className="back-to-orders-link link-primary" href="/orders">
          View all orders
        </Link>

        <div className="delivery-date">
          Arriving on {formateDate(orderDetail.estimatedDeliveryTime)}
        </div>

        <div className="product-info">{orderDetail.Product.name}</div>

        <div className="product-info">
          Quantity:
          {orderDetail.quantity}
        </div>

        <div className="relative w-80 h-60">
          <Image
            src={`/${orderDetail.Product.image}`}
            alt={orderDetail.Product.name}
            fill
            className="object-contain absolute"
          />
        </div>

        <div className="progress-labels-container">
          <div className="progress-label">Preparing</div>
          <div className="progress-label current-status">Shipped</div>
          <div className="progress-label">Delivered</div>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar js-progess-bar"
            style={{ width: progress }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default page;
