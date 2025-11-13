export interface PaymentRequestDTO {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}
