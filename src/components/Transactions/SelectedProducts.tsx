import React, { useState } from 'react';
import ConfirmTransaction from './ConfirmTransaction';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TextField, ToggleButtonGroup, ToggleButton, tableCellClasses, TableHead, SpeedDial, SpeedDialAction, Snackbar, Grid2 as Grid } from '@mui/material';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PrinterService from '../../services/printerService';
import { styled } from '@mui/material/styles';
import PercentIcon from '@mui/icons-material/Percent';
import Typography from '@mui/material/Typography';
import PrintIcon from '@mui/icons-material/Print';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { NumericFormat } from 'react-number-format';
import NoteModal from './NoteModal';
import SaveIcon from '@mui/icons-material/Save';
import DiscountModal from './DiscountModal';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { PaymentMethod, Transaction, TransactionDetail } from '../../types/interfaceModel';
import AppsIcon from '@mui/icons-material/Apps';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { getGrandTotal, insertTransaction, updateTransaction } from '../../services/transactionService';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import TransactionSummaryText from '../common/TransactionSummaryText';


interface SelectedProductsProps {
  products: TransactionDetail[];
  paymentMethods:PaymentMethod[];
  selectedTransaction:Transaction;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onCancelOrder: () => void;
}

const SelectedProducts: React.FC<SelectedProductsProps> = ({
  products,
  paymentMethods,
  selectedTransaction,
  onUpdateQuantity,
  onCancelOrder
}) => {
  const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
  const userRole = useSelector((state: RootState) => state.user.role); // Get the user's role from Redux
  const printerService = new PrinterService();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isNoteModalOpen, setNoteModalState] = useState(false); // Modal state
  const [isDiscModalOpen, setDiscountModalState] = useState(false); // Modal state
  const [tableNo, setTableNo] = useState(selectedTransaction.table_no); // Default from transaction
  const [guestName, setGuestName] = useState(selectedTransaction.guest_name); // Default from transaction
  const [paymentMethodId, setPaymentMethod] = useState(selectedTransaction.payment_method_id); // Selected payment method
  const [disc, setDiscount] = useState(""); // Modal state
  const [postMessage, setPostMessage] = useState(""); // Modal state
  const [note, setTransactionNote] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseSnack = () => setOpenSnack(false);

  const handlePrint = async () => {
    try {
      triggerSnack("Mencetak");
      await printerService.connect();

      const details = {
          shopName: String(selectedStore?.name),
          guestName: selectedTransaction.guest_name,
          selectedProducts: products.map((detail:any) => ({
            name: detail.product_name,   // Assuming 'productName' exists in the transaction details
            quantity: detail.quantity, // Quantity of the product
            price: detail.price, // Price of the product
            total: detail.price * detail.quantity
          })),
          paid: selectedTransaction?.paid ? "-- Lunas --" : "-- Belum Bayar --",
          discount:disc,
          cashierName: userRole,
          paymentMethod: selectedTransaction?.paid ? paymentMethods.find((method)=>method.id===selectedTransaction.payment_method_id)?.name : ""
      };

      console.log(details);
      await printerService.printReceipt(details);
      triggerSnack('Receipt printed successfully!')
    } catch (error) {
      console.error('Error:', error);
      alert(error);
      triggerSnack('Failed to print the receipt.');
    }
  };

  const onClearProductsAndTransactions = () => {
    onCancelOrder();
    setGuestName("");
    setTableNo("");
    setTransactionNote("");
    setDiscount("");
  };

  const handleUpdateTransactionNote = (newNote: string) => {
    setTransactionNote(newNote);
    setNoteModalState(false);
  };

  const handleUpdateTransactionDiscount = (newDiscount: string) => {
    setDiscount(newDiscount);
    setDiscountModalState(false);
  };

  const getDiscount = (products:any) => {
    const totalAmount = products.reduce((sum: number, product: { price: number; quantity: number; }) => sum + product.price * product.quantity, 0).toFixed(2);
    const intDisc = Number(disc);
    const discountPrice = (intDisc * totalAmount)/100
    return discountPrice;
  };

  const getTotalPerProduct = (price:number, qty:number) => {
    return price * qty;
  };

  const triggerSnack = (msg:string) => {
    setPostMessage(msg);
    openSnackNotification();
  };

  const setPaymentMethodAndProceedTransaction  = async (paid: boolean, payment_method_id:number) => {
    console.log(payment_method_id);
    setPaymentMethod(payment_method_id);
    handleProceedTransaction(paid, payment_method_id);
  };

  const handleProceedTransaction = async (paid: boolean, payment_method_id:number) => {
    if(selectedTransaction.id===0 && (tableNo===""||guestName==="")){
      triggerSnack("Silakan lengkapi nomor meja dan nama pemesan");
      return;
    }

    if(!paid && selectedTransaction.paid){
      triggerSnack("Silakan tekan tombol hijau untuk melakukan perubahan transaksi yang sudah terbayar");
      return;
    }

    const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity,0);
    const discount = Number(disc);
    let grand_total_amount = totalAmount;
    if(discount > 0){
      const discountPrice = (discount * totalAmount)/100;
      grand_total_amount = totalAmount - discountPrice;
    }

    const transaction:Transaction = {
      user_name: userRole,
      payment_method_id: payment_method_id,
      total_amount: totalAmount,
      paid: paid,
      table_no: selectedTransaction?.table_no||tableNo,
      guest_name: selectedTransaction?.guest_name||guestName,
      note: note,
      grand_total_amount: selectedTransaction?.grand_total_amount||grand_total_amount,
      discount: String(discount),
      transaction_details: [],
      created_at: new Date,
      store_id: selectedStore?.id,
      id: selectedTransaction?.id||0
    };

    try {
      let response;
      if (selectedTransaction?.id) {
        // Update existing transaction
        response = await updateTransaction(transaction, products).then(()=>handlePrint());
        triggerSnack('Transaksi Berhasil Diubah!');
      } else {
        // Create new transaction
        response = await insertTransaction(transaction, products).then(()=>handlePrint());
        triggerSnack('Transaksi Berhasil Dibuat!');
      }

      console.log('Transaction Response:', response);
      setIsModalOpen(false);
      onClearProductsAndTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      triggerSnack('Failed to save transaction. Please try again.');
    }
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

  const actions = [
    { icon: <PrintIcon />, name: 'Print', action:"Print" },
    { icon: <EditNoteIcon />, name: 'Note', action:"Note" },
    { icon: <PercentIcon />, name: 'Disc' , action:"Disc" },
    { icon: <SaveIcon />, name: 'Save as unpaid', action:"Save"  },
    { icon: <DeleteSweepIcon />, name: 'Cancel Order',action:"Cancel"  },
  ];

  const handleActions = (param:string) => {
    handleClose();
    switch(param) {
      case 'Print':
        return handlePrint();;
      case 'Note':
        return setNoteModalState(true);
      case 'Disc':
        return setDiscountModalState(true);;
      case 'Save':
        return handleProceedTransaction(false, 1);;
      case 'Cancel':
        return onClearProductsAndTransactions();
    }
  };

  const [openSnack, setOpenSnack] = React.useState(false);

  const openSnackNotification = () => {
    setOpenSnack(true);
  };

  const proceedTransaction = () => {
    // if(selectedTransaction.id===0 && (tableNo===""&&guestName==="")){
    //   triggerSnack("Silakan masukkan nomor meja dan nama pemesan, dan pilih produk yang akan di pesan!");
    //   return;
    // }

    setIsModalOpen(true);
  };

  return (
    <Box>
        <Button variant="contained" onClick={()=>onClearProductsAndTransactions()}>Pesanan Baru</Button>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <TextField
            required
            margin="dense"
            id="tableNo"
            name="tableNo"
            label="Table No:"
            type="text"
            variant="standard"
            value={selectedTransaction?.table_no || tableNo}
            disabled={selectedTransaction?.table_no!==""}
            onChange={(e) => setTableNo(e.target.value)}
          />
          <TextField
            margin="dense"
            id="guestName"
            name="guestName"
            label="Guest Name:"
            type="text"
            variant="standard"
            value={selectedTransaction?.guest_name || guestName}
            disabled={selectedTransaction?.guest_name!==""}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </Stack>
        <Box>
        <Grid container rowSpacing={1}>
          <TransactionSummaryText 
            note={note} 
            totalItems={products.reduce((sum, product) => sum + product.quantity, 0)} 
            discount={disc} 
            total={products.reduce((sum: number, product: { price: number; quantity: number; }) => sum + product.price * product.quantity, 0)} 
            grandTotal={getGrandTotal(products, disc)} 
            discountPrice={getDiscount(products)}            
          />
        </Grid>
        </Box>
        <Box sx={{
            mb: 2,
            display: "flex",
            flexDirection: "column",
            height: 400
          // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
          }}>
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Product Name</StyledTableCell>
                  <StyledTableCell align="right">Qtx x Price</StyledTableCell>
                  <StyledTableCell align="right">Total Price</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {products.map((product) => (
                <StyledTableRow key={product.id}>
                  <StyledTableCell>
                    {product.product_name}
                  <Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>{product.id}</Typography>
                  </StyledTableCell>
                  <StyledTableCell align="right">{product.quantity} x 
                    <NumericFormat value={product.price} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' '}/>
                  </StyledTableCell>
                  <StyledTableCell align="right"><NumericFormat value={getTotalPerProduct(product.price, product.quantity)} displayType="text" thousandSeparator="." decimalSeparator="," prefix={'IDR '}/></StyledTableCell>
                  <StyledTableCell align="center">
                    <ToggleButtonGroup
                    color="primary"
                      size='small'
                      exclusive
                      aria-label="action button"
                    >
                      <ToggleButton value="up" onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}>
                        <ArrowCircleUpIcon />
                      </ToggleButton>
                      <ToggleButton value="down" onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}>
                        <ArrowCircleDownIcon />
                      </ToggleButton>                      
                      <ToggleButton value="delete" onClick={() => onUpdateQuantity(product.id, product.quantity = 0)}>
                        <DeleteOutlineIcon />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </StyledTableCell>
                </StyledTableRow >
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        
        <Stack direction="row" spacing={2} >
          <SpeedDial
            ariaLabel="SpeedDial tooltip action"
            icon={<AppsIcon />}
            openIcon={<AppRegistrationIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction='right'
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {handleActions(action.action);}}
                tooltipPlacement='top'
              />
            ))}
          </SpeedDial>
        </Stack>
        <Button
          size='large'
          variant="contained"
          color="success"
          // disabled={!isTransactionCompleted}
          onClick={() => { proceedTransaction();}}
          startIcon={<ShoppingCartCheckoutIcon />}>
          <NumericFormat value={getGrandTotal(products, disc)} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' IDR '}/>
          </Button>
      </Stack>
      {/* ConfirmTransaction Modal */}
      <ConfirmTransaction
        grandTotal={getGrandTotal(products, disc)}
        isModalOpen={isModalOpen}
        paymentMethods={paymentMethods}
        paymentMethodId={paymentMethodId}
        onCloseModal={() => setIsModalOpen(false)}
        handleProceedTransaction={setPaymentMethodAndProceedTransaction}
      />

      <NoteModal
        note={note}
        isModalOpen={isNoteModalOpen}
        onCloseModal={() => setNoteModalState(false)} // Close modal handler
        onSaveNote={handleUpdateTransactionNote} // Update the note in the parent component's state
      />

      <DiscountModal
        discount={disc}
        isModalOpen={isDiscModalOpen}
        onCloseModal={() => setDiscountModalState(false)} // Close modal handler
        onSaveDiscount={handleUpdateTransactionDiscount} // Update the note in the parent component's state
      />

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

export default SelectedProducts;
