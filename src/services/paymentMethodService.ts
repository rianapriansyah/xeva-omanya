import supabase from '../utils/supabase'

export async function getAllPaymentMethods() {
  const { data, error } = await supabase.from('payment_methods').select('*').eq('is_active', true).order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}