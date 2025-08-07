import BaseAPI from "@/api/baseAPIClass"

class orderHistoryAPI extends BaseAPI {}

export default function getOrderHistoryAPIInstance() {
  return new orderHistoryAPI(
    "student-order-history",
    {
      student: "",
      order_number__icontains: "",
      order_date__gte: "",
      order_date__lte: "",
      order_start_date__gte: "",
      order_start_date__lte: "",
      order_extra_data__icontains: "",
    },
    {
      order_number: "",
      order_date: null,
      order_start_date: null,
      order_extra_data: "",
    },
  )
}
