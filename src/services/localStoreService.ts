import supabase from '../utils/supabase'

export async function getAllStores() {
  const { data, error } = await supabase.from('store').select('*');
  if (error) throw new Error(error.message);
  return data;
}