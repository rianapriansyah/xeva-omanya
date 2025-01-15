﻿export interface TransactionDetailProduct {
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

export interface Product {
  id: number;
  transactionId:number;
  productId:number;
  name:string;
  price:number;
  quantity:number;
  total:number;
  kitchen:string;
  category:string;
  storeId:number;
}

export interface ProductPayload {
  id: number;
  name:string;
  price:number;
  kitchen:string;
  category:string;
  storeId:number;
}

export interface Category {
  id: number;
  name:string;
  description:string;
  storeId:number;
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
  Delete = "Hapus"
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