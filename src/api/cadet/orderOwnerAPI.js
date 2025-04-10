import BaseAPI from "@/api/baseAPIClass"

class OrderOwnerAPI extends BaseAPI {}

export default function getOrderOwnerAPIInstance() {
  return new OrderOwnerAPI(
    "order-owner",
    { order_owner__icontains: "" },
    { order_owner: "" },
  )
}
