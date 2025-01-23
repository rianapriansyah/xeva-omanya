export interface TransactionDetailProduct {
	id: number;
	transactionId:number;
	productId:number;
	name:string;
	price:number;
	quantity:number;
	total:number;
  kitchen:string;
  category:string;
}

export interface SelectedProduct {
  id: number;
  transaction_id:number;
  product_id:number;
  product_name:string;
  price:number;
  quantity:number;
  total:number;
  store_id:number;
}

export interface ProductPayload {
  id: number;
  name:string;
  price:number;
  category:string;
  kitchen:string;
  store_id:number;
}

export interface Category {
  id: number;
  name:string;
  description:string;
  store_id:number;
}

export interface Guest {
  id:number;
  name: string;
  table:string;
}

export interface Transaction {
  id: number;
  userId:string;
  paymentMethodId: number;
  totalAmount: number;
  paid: boolean;
  tableNo:string
  guestName:string
  note:string;
  grandTotalAmount:number;
  discount:string;
  transactionDetails: TransactionDetail[];
  createdAt:string;
}

export interface TransactionDetail {
	id: number;
	transactionId:number;
	productId:number;
  productName:string;
	name:string;
	quantity:number;
	price:number;
	total:number;
}

export enum Actions{
  Add = "Tambah",
  Edit = "Ubah",
  Delete = "Hapus",
  Print = "Cetak"
}

export interface User {
  id: number;
  name: string;
  role: string; // Add role field
}

export interface Income {
  date: string;
  totalIncome: number;
}

export const isToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);

  return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
  );
};

export const StaticFilter=[
  {
    id:"1",
    key:"today",
    value:"Hari Ini"
  },
  {
    id:"1",
    key:"thisweek",
    value:"Minggu Ini"
  },
  {
    id:"1",
    key:"thismonth",
    value:"Bulan Ini"
  },
  {
    id:"1",
    key:"thisyear",
    value:"Tahun Ini"
  },
  {
    id:"1",
    key:"all",
    value:"Sepanjang Waktu"
  },
]