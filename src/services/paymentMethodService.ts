import supabase from '../utils/supabase'

export async function getAllPaymentMethods() {
  const { data, error } = await supabase.from('payment_methods').select('*').order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}