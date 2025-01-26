import { Transaction, TransactionDetail } from '../types/interfaceModel';
import supabase from '../utils/supabase'

export async function getAllTodayPaidTransactions(store_id:any) {
  const { data, error } = await supabase.from('paid_transactions_today').select('*, transaction_details (*)').eq('store_id', store_id).order('created_at', {ascending:false});

	if (error) throw new Error(error.message);
  return data;
}

export async function getAllTodayUnpaidTransactions(store_id:any) {
  const { data, error } = await supabase.from('unpaid_transactions_today').select('*, transaction_details (*)').eq('store_id', store_id).order('created_at', {ascending:false});

	if (error) throw new Error(error.message);
  return data;
}

export async function insertTransaction(transaction:Transaction, details:TransactionDetail[]) {
	const { data, error } = await supabase.rpc('insert_transaction_with_details', {
		user_name: transaction.user_name,
		payment_method_id: transaction.payment_method_id,
		total_amount: transaction.total_amount,
		paid:transaction.paid,
		table_no:transaction.table_no,
		guest_name:transaction.guest_name,
		note:transaction.note,
		grand_total_amount: transaction.grand_total_amount,
		discount: transaction.discount,
		store_id: transaction.store_id,
		details: details,
	});

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTransaction(transaction:Transaction, details:TransactionDetail[]) {
	console.log(transaction.id);
	const { data, error } = await supabase.rpc('update_transaction_with_details', {
		_transaction_id : transaction.id,
		_user_name : transaction.user_name,
		_payment_method_id: transaction.payment_method_id,
		_total_amount: transaction.total_amount,
		_paid:transaction.paid,
		_note:transaction.note,
		_grand_total_amount: transaction.grand_total_amount,
		_discount: transaction.discount,
		_details: details,
	});

  if (error) throw new Error(error.message);
  return data;
}

export const getGrandTotal = (products:any, discount:any) => {
	const totalAmount = products.reduce((sum: number, product: { price: number; quantity: number; }) => sum + product.price * product.quantity, 0).toFixed(2);

	const intDisc = Number(discount);
	const discountPrice = (intDisc * totalAmount)/100
	const grandTotalAmount = totalAmount - discountPrice

	return grandTotalAmount;
};