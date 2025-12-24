export type IReservation = {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: "approved" | "pending" | "rejected";
  price: string;
  cart_description: string;
  tran_ref: string;
  payment_method: string;
  card_type: string;
  card_scheme: string;
  payment_description: string;
  expiryMonth: string;
  expiryYear: string;
  car: {
    id: number;
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    phone: string;
  };
};
