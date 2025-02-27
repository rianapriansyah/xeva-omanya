import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Paper, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Actions, PaymentMethod, Transaction } from '../../types/interfaceModel';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
// import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getAllTodayPaidTransactions } from '../../services/transactionService';

interface PaidTransactionsProps {
	paymentMethods:PaymentMethod[];
	onSelectTransaction: (transaction: Transaction, action:Actions) => void;
}

const PaidTransactions: React.FC<PaidTransactionsProps> = ({
	paymentMethods,
	onSelectTransaction
}) => {

	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const userRole = useSelector((state: RootState) => state.user.role); // Get the user's role from Redux
	const [paidTransactions, setPaidTransactions] = useState<Transaction[]>([]);
	let isFetching = false;

	useEffect(() => {
		fetchUnpaidTransaction();
	}, [selectedStore]);

	const fetchUnpaidTransaction = async () => {
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await getAllTodayPaidTransactions(selectedStore?.id);
		setPaidTransactions(data);
		isFetching = false;
	};

	
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

	return (
		<React.Fragment>
			<Stack direction={"row"}>
			<Typography variant="h5" gutterBottom>
				Transaksi Hari Ini
			</Typography>
			<Button >
				<RefreshIcon/>
			</Button>
			</Stack>
			<Box sx={{
					mb: 2,
					display: "flex",
					flexDirection: "column",
					height: 'inherit'
				// justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
				}}>
				<TableContainer component={Paper} sx={{ height: 600 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<StyledTableCell>Nama Pemesan</StyledTableCell>
								<StyledTableCell>Nominal</StyledTableCell>
								<StyledTableCell>Waktu Pesanan</StyledTableCell>
								<StyledTableCell>Yang Melayani</StyledTableCell>
								<StyledTableCell align="center">Aksi</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{paidTransactions.map((transaction) => (
							<StyledTableRow  key={transaction.id}>
								<StyledTableCell>
									{transaction.guest_name}
								<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Meja : {transaction.table_no}</Typography>
								</StyledTableCell>
								<StyledTableCell>
									{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(transaction.total_amount)}
									<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
										Pembayaran {paymentMethods.find((method)=>method.id===transaction.payment_method_id)?.name}</Typography>
								</StyledTableCell>
								<StyledTableCell>
									{new Intl.DateTimeFormat('id-ID', {dateStyle: 'medium',timeZone: 'Asia/Makassar',}).format(new Date(transaction.created_at))}
									<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>
									{new Intl.DateTimeFormat('id-ID', {timeStyle: 'long', timeZone: 'Asia/Makassar',}).format(new Date(transaction.created_at))}
									</Typography>
								</StyledTableCell>
								<StyledTableCell>
									{userRole}
								</StyledTableCell>
								<StyledTableCell align="center">
									<ToggleButtonGroup
									color="primary"
										size='small'
										exclusive
										aria-label="action button"
									>
										<ToggleButton value="enter" onClick={() => onSelectTransaction(transaction, Actions.Add)}>
											<SubdirectoryArrowLeftIcon />
										</ToggleButton>
										{/* <ToggleButton value="print" onClick={() => onSelectTransaction(transaction, Actions.Print)}>
											<LocalPrintshopIcon />
										</ToggleButton> */}
										{/* <ToggleButton value="delete" onClick={() => onSelectTransaction(transaction, Actions.Delete)}>
											<DeleteForeverIcon />
										</ToggleButton>        */}
									</ToggleButtonGroup>
								</StyledTableCell>
							</StyledTableRow >
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</React.Fragment>
	);
};

export default PaidTransactions;
