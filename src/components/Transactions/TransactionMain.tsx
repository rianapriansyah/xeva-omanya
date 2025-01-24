import React, { useEffect, useState } from 'react';
import  * as api from '../../services/api';
import SelectedProducts from './SelectedProducts';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TransactionMainRight from './TransactionMainRight';
import { Transaction, Category, TransactionDetail, Actions, Product } from '../../types/interfaceModel';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { Snackbar } from '@mui/material';
import { getAllProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';

const newTransactionObj:Transaction={
	id: 0,
	user_name: "",
	payment_method_id: 1,
	total_amount: 0,
	paid: false,
	table_no: "",
	guest_name: "",
	note: '',
	grand_total_amount: 0,
	discount: '',
	transaction_details: [],
	created_at: new Date,
	store_id:0
}

const TransactionMain: React.FC = () => {
	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const [selectedProducts, setSelectedProductsToTransDetails] = useState<TransactionDetail[]>([]);
	const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedTransaction, setTransaction] = useState<Transaction>(newTransactionObj);
	const [openSnack, setOpenSnack] = React.useState(false);
	const handleCloseSnack = () => setOpenSnack(false);
	const [postMessage, setPostMessage] = useState(""); // Modal state

	useEffect(() => {
		fetchStaticData();
	}, [selectedStore]);

	// Fetch static data
	const fetchStaticData = async () => {
		fetchProducts();
		fetchCategories();
	};

	const fetchProducts = async () => {
		const data = await getAllProducts(selectedStore?.id);
		const sortedProduct = data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
		setAvailableProducts(sortedProduct);
	};

	const fetchCategories = async () => {
		const data = await getAllCategories(selectedStore?.id);
		const sortedCategories = data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
		setCategories(sortedCategories);
		setCategories((categories) => [{id:999, name:"Clear", description:"", store_id:0}, ...categories ]);
	};

	// Handle action when selecting a parked transaction
	const handleSelectTransaction = (transaction: any) => {
		setTransaction(transaction)
		setSelectedProductsToTransDetails(transaction.transactionDetails.map((detail: any) => ({
			id: detail.productId,
			name: detail.productName, // Ensure product name is part of the API response
			price: detail.price,
			quantity: detail.quantity,
			transactionId:transaction.id
		})));
	};

	// Handle action when selecting a parked transaction
	const handleSelectTransactionWithAction = (transaction: any, action:Actions) => {
		switch(action){
			case Actions.Add:
				handleSelectTransaction(transaction);
				break;
			case Actions.Print:
				alert(action);
				break;
			case Actions.Delete:
				handleDeleteTransaction(transaction);
				break;
		}
	};

	const handleAddProduct = (product: Product) => {
		if(product.id===99999){
			return;
		}

		const existingProduct = selectedProducts.find((p) => p.id === product.id);
		if (existingProduct) {
			setSelectedProductsToTransDetails(
				selectedProducts.map((p) =>
					p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
				)
			);
		} else {
			setSelectedProductsToTransDetails([...selectedProducts, {
				...product, quantity: 1,
				transaction_id: 0,
				product_id: product.id,
				product_name: product.name,
				total: 0
			}]);
		}
	};

	const handleUpdateQuantity = (id: number, newQuantity: number) => {
		setSelectedProductsToTransDetails((prev) =>
			prev.map((product) =>
				product.id === id ?
				{ ...product,
					productId: product.product_id,
					quantity: newQuantity
				} : product
			).filter((product) => product.quantity > 0) // Remove products with zero quantity
		);
	};

	const handleCancelOrder = () => {
		setSelectedProductsToTransDetails([]);
		setTransaction(newTransactionObj);
		// setPaymentMethods([]);
	};

	const handleDeleteTransaction = async (transaction: Transaction) => {
		try {
				if (transaction.id === 0) {
						console.error('Error delete transaction:', transaction);
						return;
				} 
				await api.deleteTransaction(transaction.id);
				handleCancelOrder();
				triggerSnack(`Pesanan atas nama ${transaction.guest_name} dihapus!`);
		} catch (error) {
				console.error('Error delete product:', error);
				triggerSnack(`Terjadi kesalahan menghapus pesanan ${transaction.guest_name}`);
		}
	};

	const triggerSnack = (msg:string) => {
    setPostMessage(msg);
    openSnackNotification();
  };

	const openSnackNotification = () => {
    setOpenSnack(true);
  };

	return (
		<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey', borderRadius:"10px" }}>
			<Grid container spacing={2}>
				<Grid size={6}>
					<Stack spacing={2}>
						<SelectedProducts
							products={selectedProducts}
							selectedTransaction={selectedTransaction} // Pass the entire transaction object
							onUpdateQuantity={handleUpdateQuantity}
							onCancelOrder={handleCancelOrder}
						/>
					</Stack>
				</Grid>
				<Grid size={6}>
					<TransactionMainRight 
						onAddProduct={handleAddProduct} 
						availableProducts={availableProducts}
						categories={categories}
						onSelectTransaction={handleSelectTransactionWithAction}
					/>
				</Grid>
			</Grid>
			<Snackbar
				autoHideDuration={4000}
				anchorOrigin={{vertical: 'top', horizontal: 'center' }}
				open={openSnack}
				onClose={handleCloseSnack}
				message={postMessage}
			/>
		</Box>
	);
};

export default TransactionMain;
