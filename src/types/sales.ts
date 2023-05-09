export type PurchasedItems = {
  SaleDetailId: number;
  Id: number;
  IsService: boolean;
  BarcodeId: string | null;
  Description: string;
  ContractId: number | null;
  CategoryId: number;
  SubCategoryId: number;
  UnitPrice: number;
  Quantity: number;
  DiscountPercent: number;
  DiscountAmount: number;
  Tax1: number;
  Tax2: number;
  Tax3: number;
  Tax4: number;
  Tax5: number;
  TaxAmount: number;
  TotalAmount: number;
  Notes: string | null;
  Returned: boolean;
  PaymentRefId: number | null;
  ExpDate: string;
  ActiveDate: string;
  GiftCardBarcodeId: string | null;
};

export interface modifiedPurchasedItems extends PurchasedItems {
  clientId: string;
}

type SalesPayment = {
  Id: number;
  Amount: number;
  Method: number;
  Type: string;
  Notes: string;
  TransactionId: string | null;
};

type salesType = {
  Id: number;
  SaleDate: string;
  SaleTime: string;
  SaleDateTime: string;
  OriginalSaleDateTime: string;
  SalesRepId: number | null;
  ClientId: string;
  RecipientClientId: number | null;
  PurchasedItems: PurchasedItems[];
  LocationId: number;
  Payments: SalesPayment[];
};

export default salesType;
