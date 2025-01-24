import { Transaction, TransactionDetail } from '../types/interfaceModel';
import supabase from '../utils/supabase'

export async function getAllTransactionsByPaidStatus(store_id:any, paid:boolean) {
  const { data, error } = await supabase.from('transactions').select('*, transaction_details (*)').eq('store_id', store_id).eq('paid', paid);
  if (error) throw new Error(error.message);
  return data;
}

export async function insertTransaction(transaction:Transaction, details:TransactionDetail[]) {
	const { data, error } = await supabase.rpc('insert_transaction_with_details', {
		_user_name: transaction.user_name,
		_payment_method_id: transaction.payment_method_id,
		_total_amount: transaction.total_amount,
		_grand_total_amount: transaction.grand_total_amount,
		_discount: transaction.discount,
		_store_id: transaction.store_id,
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