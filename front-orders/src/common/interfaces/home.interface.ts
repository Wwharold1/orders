export interface IListOrderResponse {
  data: IOrder[];
}

export interface IOrder {
  orderNumber: string
  customer: string
  orderDate: string
  total: number
  status: string
  createdByUserId: number
  createdAt: string
  deletedAt: any
  id: number
  domainEvents: any
}