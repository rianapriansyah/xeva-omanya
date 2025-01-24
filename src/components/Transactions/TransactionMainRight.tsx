import React from 'react';
import Box from '@mui/material/Box';
import { Tab, Tabs } from '@mui/material';
import AvailableProducts from './AvailableProducts';
import UnpaidTransactions from './UnpaidTransactions';
import { Transaction, Category, Actions, Product } from '../../types/interfaceModel';
import PaidTransactions from './PaidTransactions';

interface TransactionMainRightProps {
  availableProducts:Product[];
  categories:Category[];
	onAddProduct: (product: any) => void;
	onSelectTransaction: (transaction: Transaction, action:Actions) => void;
}

const TransactionMainRight: React.FC<TransactionMainRightProps> = ({
  availableProducts,
  categories,
  onAddProduct,
	onSelectTransaction
}) => {

	const [value, setValue] = React.useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

	interface TabPanelProps {
		children?: React.ReactNode;
		index: number;
		value: number;
	}

	function CustomTabPanel(props: TabPanelProps) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && <Box sx={{ marginTop:3 }}>{children}</Box>}
			</div>
		);
	}

	return (
		<React.Fragment>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable">
					<Tab label="Product Tersedia" />
					<Tab label="Transaksi Belum Terbayar" />
					<Tab label="Transaksi Hari Ini" />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
        <AvailableProducts
          availableProducts={availableProducts}
          categories={categories}
          onAddProduct={onAddProduct}
          />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<UnpaidTransactions
					onSelectTransaction={onSelectTransaction}
				/>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				<PaidTransactions
					onSelectTransaction={onSelectTransaction}
				/>
			</CustomTabPanel>
		</React.Fragment>
	);
};

export default TransactionMainRight;
