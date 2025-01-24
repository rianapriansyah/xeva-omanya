export interface TransactionDetail {
	id: number;
  transaction_id:number
	product_id:number;
	product_name:string;
	price:number;
	quantity:number;
	total:number;
  kitchen:string;
  category:string;
  store_id:number;
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

export interface Product {
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
  user_name:string;
  payment_method_id: number;
  total_amount: number;
  paid: boolean;
  table_no:string
  guest_name:string
  note:string;
  grand_total_amount:number;
  discount:string;
  transaction_details: TransactionDetail[];
  created_at:Date;
  store_id:number|undefined;
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
];