import { Category } from '../types/interfaceModel';
import supabase from '../utils/supabase'

export async function getAllCategories(store_id:any) {
  const { data, error } = await supabase.from('categories').select('*').eq('store_id', store_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function insertCategory(category:Category) {
  const { data, error } = await supabase.from('categories').insert([{name:category.name, description:category.description, store_id:category.store_id}]).select();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategory(id: number, category:Category) {
  const { data, error } = await supabase.from('categories').update({name:category.name, description:category.description}).eq('id', id);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(id: number) {
	const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
}