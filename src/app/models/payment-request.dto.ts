export interface PaymentRequestDTO {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string; // Ex: "12/28"
  cvv: string;
  saveCard: boolean;
}
