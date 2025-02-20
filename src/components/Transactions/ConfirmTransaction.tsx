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
		Typography,
} from '@mui/material';
import { PaymentMethod } from '../../types/interfaceModel';

interface ConfirmTransactionProps {
	paymentMethods:PaymentMethod[];
	grandTotal:number;
	isModalOpen: boolean;
	paymentMethodId: number;
	onCloseModal: () => void;
	handleProceedTransaction: (isPaid: boolean, paymentMethodId:number) => void;
}

const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({
	paymentMethods,
	grandTotal,
	isModalOpen,
	paymentMethodId,
	onCloseModal,
	handleProceedTransaction,
}) => {
	const [cashAmount, setCashAmount] = useState(0); // State for cash input
	const [localPaymentMethod, setLocalPaymentMethod] = useState(paymentMethodId);

	// Inside ConfirmTransaction component
	useEffect(() => {
		setLocalPaymentMethod(paymentMethodId);
	}, [paymentMethodId]); // Dependencies: update when `paymentMethodId` or `paymentMethods` change

	const handlePaymentChange = (_event: React.MouseEvent<HTMLElement>, selectedMethod: number) => {
		if (selectedMethod !== null) {
			setLocalPaymentMethod(selectedMethod);
			// Reset cash input if payment method is not "Cash"
			if (selectedMethod !== 1) {
					setCashAmount(0);
			}
		}
	};

	const handleMoneyChipClick = (value: number) => {
		setCashAmount(value);
	};

	const disabledMoyeChip = (value: number) => {
		let disabled = false;
		if(localPaymentMethod!==1){
			disabled = true;
		}
		else if(value < grandTotal){
			disabled = true;
		}
		
		return disabled;
	};

if (!isModalOpen) return null;

	return (
		<Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
			<DialogTitle>
			Yang harus dibayar {new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(grandTotal)}
			<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
			{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(cashAmount)} {"- "}
			{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(grandTotal)} {" = "} 
			{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(cashAmount - grandTotal)}
				</Typography>
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
									onClick={() => handleMoneyChipClick(20000)} color="success" disabled={disabledMoyeChip(20000)} />
								<Chip label={new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(50000)} 
									onClick={() => handleMoneyChipClick(50000)} color="primary" disabled={localPaymentMethod!==1}/>
								<Chip label={new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(100000)} 
									onClick={() => handleMoneyChipClick(100000)} color="error" disabled={localPaymentMethod!==1}/>
								<Chip label="Uang Pas" 
									onClick={() => handleMoneyChipClick(grandTotal)} color="secondary" disabled={localPaymentMethod!==1}/>
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
