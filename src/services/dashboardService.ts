import supabase from '../utils/supabase'

export async function getTransactionsSummary(date_filter:string, store_id :any) {
  const { data, error } = await supabase.rpc('get_transaction_summary', {storeid :store_id, date_filter:date_filter });
  if (error) throw new Error(error.message);

  return data;
}

export async function getTransactionsSummaryWithFilter(store_id :any, date_filter:string) {
  const { data, error } = await supabase.rpc('get_dashboard_data_by_store', {store_id_filter :store_id, filter:date_filter, start_date_filter:new Date() });
  if (error) throw new Error(error.message);
  
  return data;
}

export async function getIncomeData(store_id :any, date_filter:string) {
  const { data, error } = await supabase.rpc('get_income_by_date', {store_id_filter :store_id, filter:date_filter, start_date_filter:new Date() });


  if (error) throw new Error(error.message);
  
  return data;
}

export async function getVTransactionsSummary(store_id :any, date_filter:string) {
  const { data, error } = await supabase.from('view_transaction_summary').select('*').eq('store_id',store_id).eq('filter', date_filter).single();
  if (error) throw new Error(error.message);
  
  return data;
}