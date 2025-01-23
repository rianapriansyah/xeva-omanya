import React, { useEffect, useState } from 'react';
import  * as api from '../../services/api';
import SelectedProducts from './SelectedProducts';
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TransactionMainRight from './TransactionMainRight';
import { Transaction, SelectedProduct, Category, TransactionDetailProduct, Actions } from '../../types/interfaceModel';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { Snackbar } from '@mui/material';
import { getAllProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';

const newTransactionObj:Transaction={
	id: 0,
	userId: "",
	paymentMethodId: 1,
	totalAmount: 0,
	paid: false,
	tableNo: "",
	guestName: "",
	note: '',
	grandTotalAmount: 0,
	discount: '',
	transactionDetails: [],
	createdAt: ''
}

const TransactionMain: React.FC = () => {
	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const [selectedProducts, setSelectedProducts] = useState<TransactionDetailProduct[]>([]);
	const [availableProducts, setAvailableProducts] = useState<SelectedProduct[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [unpaidTransactions, setUnpaidTransactions] = useState<Transaction[]>([]);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [selectedTransaction, setTransaction] = useState<Transaction>({
		id: 0,
		userId: "",
		paymentMethodId: 1,
		totalAmount: 0,
		paid: false,
		tableNo: "",
		guestName: "",
		note: '',
		grandTotalAmount: 0,
		discount: '',
		transactionDetails: [],
		createdAt: ''
	});
	
	const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
	const [openSnack, setOpenSnack] = React.useState(false);
	const handleCloseSnack = () => setOpenSnack(false);
	const [postMessage, setPostMessage] = useState(""); // Modal state

	useEffect(() => {
		fetchStaticData();
	}, [selectedStore]);

	useEffect(() => {
		fetchTransactionData();
	}, [selectedStore]);

	// Fetch static data
	const fetchStaticData = async () => {
		fetchPaymentMethods();
		fetchProducts();
		fetchCategories();
	};

	// Fetch transaction data
	const fetchTransactionData = async () => {
		fetchUnpaidTransaction();
		fetchTodayPaidTransactions();
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

	// Fetch parked transactions
	const fetchUnpaidTransaction = async () => {
		try {
			const response = await api.fetchUnpaidTransaction(selectedStore?.id);
			const fetchedTransactions = response.data;
			setUnpaidTransactions(fetchedTransactions);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		}
	};

	// Fetch Paid transactions by todat
	const fetchTodayPaidTransactions = async () => {
		try {
			// const today = new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Makassar', year:'numeric', month:'2-digit',day:'2-digit'}).format(new Date());
			const today = new Date().toISOString().split('T')[0];
			console.log(today);
			const response = await api.fetchTransactionByDate(selectedStore?.id, today);
			setTransactions(response.data);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		}
	};

	// Fetch payment methods
	const fetchPaymentMethods = async () => {
		try {
			const response = await api.fetchPaymentMethods();
			setPaymentMethods(response.data);
		} catch (error) {
			console.error('Error fetching payment methods:', error);
		}
	};

	// Handle action when selecting a parked transaction
	const handleSelectTransaction = (transaction: any) => {
		setTransaction(transaction)
		setSelectedProducts(transaction.transactionDetails.map((detail: any) => ({
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

	const handleAddProduct = (product: any) => {
		if(product.id===99999){
			return;
		}

		const existingProduct = selectedProducts.find((p) => p.id === product.id);
		if (existingProduct) {
			setSelectedProducts(
				selectedProducts.map((p) =>
					p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
				)
			);
		} else {
			setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
		}
	};

	const handleUpdateQuantity = (id: number, newQuantity: number) => {
		setSelectedProducts((prev) =>
			prev.map((product) =>
				product.id === id ?
				{ ...product,
					productId: product.productId,
					quantity: newQuantity
				} : product
			).filter((product) => product.quantity > 0) // Remove products with zero quantity
		);
	};

	const handleCancelOrder = () => {
		setSelectedProducts([]);
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
				fetchTransactionData();
				handleCancelOrder();
				triggerSnack(`Pesanan atas nama ${transaction.guestName} dihapus!`);
		} catch (error) {
				console.error('Error delete product:', error);
				triggerSnack(`Terjadi kesalahan menghapus pesanan ${transaction.guestName}`);
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
							paymentMethods = {paymentMethods}
							refreshTransactions={fetchTransactionData} // Pass the function as a prop
						/>
					</Stack>
				</Grid>
				<Grid size={6}>
					<TransactionMainRight 
						onAddProduct={handleAddProduct} 
						availableProducts={availableProducts}
						categories={categories}
						transactions={transactions}
						unpaidTransactions={unpaidTransactions}
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
