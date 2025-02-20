import supabase from '../utils/supabase'

export async function getAllPaymentMethods() {
  const { data, error } = await supabase.from('payment_methods').select('*').eq('is_active', true).order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function getNameOfPaymentMethod(id:number) {
  const { data, error } = await supabase.from('payment_methods').select('name').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
}