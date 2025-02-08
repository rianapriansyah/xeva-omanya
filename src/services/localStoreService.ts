import supabase from '../utils/supabase'

export async function getAllStores() {
  const { data, error } = await supabase.from('store').select('*').eq('is_active', true);
  if (error) throw new Error(error.message);
  return data;
}