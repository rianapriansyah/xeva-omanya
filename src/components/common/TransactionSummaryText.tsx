import { Grid2 as Grid, Typography  } from '@mui/material';
import React from 'react';
import { NumericFormat } from 'react-number-format';


interface TransactionSummaryTextProps {
	note:string;
	totalItems:number;
	discount:string;
	total:number;
	grandTotal:number;
	discountPrice:number;
}

const TransactionSummaryText: React.FC<TransactionSummaryTextProps> = ({
	note,
	totalItems,
	discount,
	discountPrice,
	total,
	grandTotal
}) => {

return (
    <React.Fragment>
			<Grid size={6}>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Note : {note}</Typography>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Total Items :{' '}{totalItems}
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Disc : {discount} % =
					<NumericFormat value={discountPrice} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' IDR '}/>
					</Typography>            
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Total :
						<NumericFormat value={total} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' IDR '}/>
					</Typography>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Gr. Total :
						<NumericFormat value={grandTotal} displayType="text" thousandSeparator="." decimalSeparator="," prefix={' IDR '}/>
					</Typography>
				</Grid>
				<Grid size={6}>
					<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic', textAlign:'right' }}>Cashier : chaotic_noobz</Typography>
				</Grid>
		</React.Fragment>
	);
};

export default TransactionSummaryText;
