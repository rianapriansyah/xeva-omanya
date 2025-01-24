import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
    Stack,
    Typography,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
		SelectChangeEvent,
		Chip,
		styled,
		ButtonBase,
		ImageList,
		ImageListItem,
		List,
} from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { Transaction } from '../../types/interfaceModel';

interface ConfirmTransactionProps {
	note:string;
	isModalOpen: boolean;
	selectedProducts: any[];
	selectedTransaction: Transaction | null; // Accept the entire transaction
	tableNo: string;
	guestName: string;
	paymentMethods: any[];
	paymentMethodId: number;
	onCloseModal: () => void;
	setTableNo: (value: string) => void;
	setGuestName: (value: string) => void;
	handlePaymentMethodChange: (id: number) => void;
	handleProceedTransaction: (isPaid: boolean) => void;
}

const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({
	isModalOpen,
	paymentMethods,
	paymentMethodId,
	onCloseModal,
	handlePaymentMethodChange,
	handleProceedTransaction,
}) => {
	if (!isModalOpen) return null;

	const [cashAmount, setCashAmount] = useState(""); // State for cash input
	const groupOfNumbers = [
		{label:"first", numbers:["1","2","3"]},
		{label:"second", numbers:["4","5","6"]},
		{label:"third", numbers:["7","8","9"]},
		{label:"last", numbers:["000", "0", "clear"]},
	];

	const handlePaymentChange = (event: SelectChangeEvent) => {
			const selectedMethod = Number(event.target.value);
			handlePaymentMethodChange(selectedMethod);
			// Reset cash input if payment method is not "Cash"
			if (selectedMethod !== paymentMethodId) {
					setCashAmount('');
			}
	};

	const handleNumberPadClick = (value: string) => {
		if(value==="clear"){
			handleClearCash();
			return;
		}

		if((value==="000"||value==="0") && cashAmount===""){
			return;
		}

		setCashAmount((prev) => (prev === '' ? value : `${prev}${value}`));
	};

	const handleMoneyChipClick = (value: string) => {
		setCashAmount("");
		setCashAmount((prev) => (prev === '' ? value : `${prev}${value}`));
};

	const handleClearCash = () => {
			setCashAmount('');
	};

	const ImageButton = styled(ButtonBase)(({ theme }) => ({
		position: 'relative',
		height: 100,
		[theme.breakpoints.down('sm')]: {
			width: '100% !important', // Overrides inline-style
			height: 100,
		},
		'&.Mui-focusVisible': {
			zIndex: 1,
			'& .MuiImageBackdrop-root': {
				opacity: 0.15,
			},
			'& .MuiImageMarked-root': {
				opacity: 0,
			},
			'& .MuiTypography-root': {
				border: '4px solid currentColor',
			},
		},
	}));

	const Image = styled('span')(({ theme }) => ({
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: theme.palette.common.white,
	}));

	const ImageBackdrop = styled('span')(({ theme }) => ({
		position: 'absolute',
		left: 1,
		right: 1,
		top: 3,
		bottom: 3,
		borderRadius:2,
		backgroundColor: theme.palette.common.black,
		opacity: 0.4,
		transition: theme.transitions.create('opacity'),
	}));

	return (
		<Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
			<DialogTitle>
			<NumericFormat value={cashAmount} displayType="input" thousandSeparator="." decimalSeparator="," prefix={'IDR '} customInput={TextField} disabled />
			</DialogTitle>
			<DialogContent>
				<Box>
					<Stack spacing={2}>
						<Box>
							<FormControl fullWidth>
								<InputLabel id="payment-method-label" variant="standard">Payment Method</InputLabel>
									<Select
										variant="standard"
										labelId="payment-method-label"
										id="payment-method-select"
										value={String(paymentMethodId)}
										onChange={handlePaymentChange}>
										{paymentMethods.map((method) => (
												<MenuItem key={method.id} value={method.id}>{method.name}</MenuItem>
										))}
								</Select>
							</FormControl>
						</Box>
						<Box>
            <Stack spacing={2}>
            
            <Stack spacing={1} direction="row">
								<Chip label="20.000" onClick={() => handleMoneyChipClick("20000")} color="success" disabled={paymentMethodId!==1} />
								<Chip label="50.000" onClick={() => handleMoneyChipClick("50000")} color="primary" disabled={paymentMethodId!==1}/>
								<Chip label="100.000" onClick={() => handleMoneyChipClick("100000")} color="error" disabled={paymentMethodId!==1}/>
							</Stack>
            </Stack>
						
							{/* <TextField
									label="Cash Amount"
									variant="outlined"
									fullWidth
									margin="normal"
									value={cashAmount}
									disabled /> */}
							
							<List>
								{groupOfNumbers.map((numbers) => (
									<ImageList cols={3} key={numbers.label}>
										{numbers.numbers.map((number) => (
										<ImageListItem key={number}>
											<ImageButton focusRipple disabled={paymentMethodId!==1} >
												<ImageBackdrop className="MuiImageBackdrop-root"  />
												<Image onClick={() => handleNumberPadClick(number)}>
													<Typography
														component="span"
														variant="subtitle1"
														color="inherit"
														sx={(theme) => ({
															position: 'relative',
															p: 4,
															pt: 2,
															pb: `calc(${theme.spacing(1)} + 6px)`,
														})}
													>
														{number}
													</Typography>
												</Image>
											</ImageButton>
									</ImageListItem>
								))}
									</ImageList>
								))}
							</List>
						</Box>
					</Stack>
				</Box>
				<DialogActions>
					<Button onClick={onCloseModal}>Cancel</Button>
					<Button onClick={() => handleProceedTransaction(false)}>Park</Button>
					<Button type="submit" onClick={() => {
							handleProceedTransaction(true);
						}}>Pembayaran Diterima</Button>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmTransaction;
