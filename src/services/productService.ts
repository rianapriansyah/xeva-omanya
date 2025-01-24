import { Product } from '../types/interfaceModel';
import supabase from '../utils/supabase'

export async function getAllProducts(store_id:any) {
  const { data, error } = await supabase.from('products').select('*').eq('store_id', store_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function insertProduct(product:Product) {
  const { data, error } = await supabase.from('products').insert([
		{
			name:product.name, 
			price:product.price,
			category:product.category,
			kitchen:product.kitchen,
			store_id:product.store_id
		}
	]).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: number, product:Product) {
  const { data, error } = await supabase.from('products').update(
		{
		name:product.name, 
		price:product.price,
		category:product.category,
		kitchen:product.kitchen,
	}).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: number) {
	const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}