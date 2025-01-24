import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Stack,
    Button,
		Chip,
		ToggleButton,
		ToggleButtonGroup,
		Paper,
} from '@mui/material';
import { getAllPaymentMethods } from '../../services/paymentMethodService';

interface ConfirmTransactionProps {
	isModalOpen: boolean;
	paymentMethodId: number;
	onCloseModal: () => void;
	handleProceedTransaction: (isPaid: boolean, paymentMethodId:number) => void;
}

const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({
	isModalOpen,
	paymentMethodId,
	onCloseModal,
	handleProceedTransaction,
}) => {
	const [cashAmount, setCashAmount] = useState(0); // State for cash input
	const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
	const [localPaymentMethod, setLocalPaymentMethod] = useState(paymentMethodId);
	let isFetching = false;

	const handlePaymentChange = (_event: React.MouseEvent<HTMLElement>, selectedMethod: number) => {
		if (selectedMethod !== null) {
			setLocalPaymentMethod(selectedMethod);
			// Reset cash input if payment method is not "Cash"
			if (selectedMethod !== 1) {
					setCashAmount(0);
			}
		}
	};

	useEffect(() => {
		setLocalPaymentMethod(1);
		fetchPaymentMethods();
	}, []);

	// Fetch payment methods
	const fetchPaymentMethods = async () => {
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await getAllPaymentMethods();
		setPaymentMethods(data);
		isFetching = false;
	};

	const handleMoneyChipClick = (value: number) => {
		setCashAmount(value);
	//  setCashAmount((prev) => (prev === '' ? value : `${prev}${value}`));
};

if (!isModalOpen) return null;

	return (
		<Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
			<DialogTitle>
				{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(cashAmount)}
			</DialogTitle>
			<DialogContent>
				<Box>
					<Stack spacing={2}>
					<Paper elevation={0} sx={(theme) => ({
							display: 'flex',
							border: `1px solid ${theme.palette.divider}`,
							flexWrap: 'wrap',
						})}>
						<ToggleButtonGroup
								orientation="vertical"
								value={localPaymentMethod}
								exclusive
								onChange={handlePaymentChange}
								fullWidth
							>
							{paymentMethods.map((method) => (
								<ToggleButton value={method.id} aria-label="list" key={method.id} color='primary'>
										{method.name}
								</ToggleButton>
							))}
						</ToggleButtonGroup>
						</Paper>
						<Box>
            <Stack spacing={2}>            
            <Stack spacing={1} direction="row">
								<Chip label={new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(20000)} 
									onClick={() => handleMoneyChipClick(20000)} color="success" disabled={localPaymentMethod!==1} />
								<Chip label={new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(50000)} 
									onClick={() => handleMoneyChipClick(50000)} color="primary" disabled={localPaymentMethod!==1}/>
								<Chip label={new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(100000)} 
									onClick={() => handleMoneyChipClick(100000)} color="error" disabled={localPaymentMethod!==1}/>
								<Chip label="Uang Pas" 
									onClick={() => handleMoneyChipClick(99)} color="secondary" disabled={localPaymentMethod!==1}/>
							</Stack>
            </Stack>					
						</Box>
					</Stack>
				</Box>
				<DialogActions>
					<Button onClick={onCloseModal}>Cancel</Button>
					<Button type="submit" onClick={() => {
							handleProceedTransaction(true, localPaymentMethod);
						}}>Pembayaran Diterima</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmTransaction;
