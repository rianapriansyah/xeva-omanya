import React, { useEffect, useState } from 'react';
import { Avatar, Box, FormControl, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, SelectChangeEvent, styled, Typography } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import Grid from '@mui/material/Grid2'
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SavingsIcon from '@mui/icons-material/Savings';
import { Category, DashboardSummary, PaymentMethod, StaticFilter } from '../../types/interfaceModel';
import { getIncomeData, getTransactionsSummaryWithFilter } from '../../services/dashboardService';
import { getAllPaymentMethods } from '../../services/paymentMethodService';

import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { getAllCategories } from '../../services/categoryService';

const Dashboard: React.FC = () => {
	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
	const [dashboardData, setData] = useState<DashboardSummary>();
	const [incomeData, setIncomeData] = useState([]);
	const [productsSoldData, setProductSoldData] = useState<any>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [expanded, setExpanded] = React.useState<string | false>('');
	const [selectedFilter, setSelectedFilter] = useState<string>('today');
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	
	
	const fetchSummaryData = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
    const response = await getTransactionsSummaryWithFilter(storeId, filter);
		setData(response);
		isFetching = false;
	};

	const fetchPaymentMethods = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const response = await getAllPaymentMethods();
		setPaymentMethods(response);
		isFetching = false;
	};

	const fetchCategory = async () => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
		const data = await getAllCategories(selectedStore?.id);
		const sortedCategories = data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name));
		setCategories(sortedCategories);
		isFetching = false;
	};

	const fetchIncomeData = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
		let isFetching = false;
		if (isFetching) return; // Prevent fetch if already in progress
		isFetching = true;
    const response = await getIncomeData(storeId, filter);
		setIncomeData(response);
		isFetching = false;
	};

	const xAxisData = incomeData? incomeData.map((point:any) => new Date(point.transaction_date).getDate()) : []; // Extract dates
	const seriesData = incomeData? incomeData?.map((point:any) => point.total_income) : []; // Extract total income


	// const fetchProductsSold = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
  //   const response = await fetchProductsSoldData(storeId, filter, startDate, endDate);
	// 	setProductSoldData(response.data);
	// };
	
	useEffect(() => {
		fetchPaymentMethods();
		fetchSummaryData(selectedStore?.id, selectedFilter);
	}, [selectedStore, selectedFilter]);

	useEffect(() => {
		fetchIncomeData(selectedStore?.id, selectedFilter);
		// fetchTransactionData();
	}, [selectedStore, selectedFilter]);

	useEffect(() => {
		fetchCategory();
		// fetchTransactionData();
	}, [selectedStore, selectedFilter]);

	useEffect(() => {
		//fetchProductsSold(selectedStore?.id, selectedFilter);
		// fetchTransactionData();
	}, [selectedStore, selectedFilter]);

	const chartSetting = {
		series: [{ dataKey: 'quantitySold' }],
		height: 400,
	};

	const Accordion = styled((props: AccordionProps) => (
		<MuiAccordion disableGutters elevation={0} square {...props} />
	))(({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&::before': {
			display: 'none',
		},
	}));
	
	const AccordionSummary = styled((props: AccordionSummaryProps) => (
		<MuiAccordionSummary
			expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
			{...props}
		/>
	))(({ theme }) => ({
		backgroundColor: 'rgba(0, 0, 0, .03)',
		flexDirection: 'row-reverse',
		[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
			{
				transform: 'rotate(90deg)',
			},
		[`& .${accordionSummaryClasses.content}`]: {
			marginLeft: theme.spacing(1),
		},
		...theme.applyStyles('dark', {
			backgroundColor: 'rgba(255, 255, 255, .05)',
		}),
	}));
	
	const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
		padding: theme.spacing(2),
		borderTop: '1px solid rgba(0, 0, 0, .125)',
	}));

  const handleChange =
	(panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const handleFilterChange = async (e: SelectChangeEvent<string>) => {
    setSelectedFilter(e.target.value as string);
  };

	return (
		<Grid>
			<Box sx={{borderRadius:"10px", mb: 2, display: "flex", flexDirection: "column",height: "inherit"
				// justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
				}}>
				<Typography variant="h6" gutterBottom>
					Dashboard
				</Typography>
				<FormControl variant="outlined" style={{ marginBottom: '16px' }}>
        <InputLabel id="car-select-label">Pilih Filter</InputLabel>
        <Select
          labelId="car-select-label"
          id="car-select"
          value={selectedFilter}
          onChange={handleFilterChange}
          label="Terapkan Filter"
        >
          {StaticFilter.map((filter) => (
            <MenuItem key={filter.id} value={filter.key}>
              {filter.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
				<List sx={{ bgcolor: 'background.paper' }}>
					<ListItem
						key="1"
						secondaryAction={<React.Fragment>
							<Typography variant="button" gutterBottom>
								{dashboardData?.total_transactions}
							</Typography>
						</React.Fragment>}>
						<ListItemAvatar>
							<Avatar>
								<ShoppingCartIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Total Transaksi" />
					</ListItem>
					<ListItem
						key="2"
						secondaryAction={<React.Fragment>
							<Typography variant="button" gutterBottom>
							{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(Number(dashboardData?.total_income))}
							</Typography>
						</React.Fragment>}>
						<ListItemAvatar>
							<Avatar>
								<ShoppingCartIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Total Pemasukan" />
					</ListItem>
					<Accordion>
						<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
							<Typography component="span" sx={{ width: '90%' }}>
							Detail
							</Typography>
							<Typography component="span" sx={{ width: '90%' }}>
								{/* {data.value} */}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
						<List>
							{dashboardData?.details.map((payment) => (
								<ListItem
									key={payment.payment_method_id}
									secondaryAction={<React.Fragment>
										<Typography variant="button" gutterBottom>
										{new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR'}).format(payment.total_income)}	
										</Typography>
									</React.Fragment>}
								>
									<ListItemText primary={payment.payment_method_name} />
								</ListItem>
							))}
							</List>
						</AccordionDetails>
						</Accordion>
				</List>
			</Box>
			<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey', borderRadius:"10px" }}>
				<Grid container rowSpacing={1} spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 1, md: 12 }}>
				<Typography variant="h5" gutterBottom>
					Pendapatan
				</Typography>
				<LineChart 
					margin={{left: 70,right: 10,}}
					grid={{ vertical: true, horizontal: true }}
					xAxis={[{ data: xAxisData, scaleType: 'point', label:'tanggal',  }]}
					series={[{ data: seriesData }]}
					height={300}
					tooltip={{ trigger: 'item' }} 
				/>
				</Grid>
				<List>
					{categories.map((category)=>(
						 <Accordion expanded={expanded === category.name} onChange={handleChange(category.name)} key={category.id}>
							<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
								<Typography component="span">{category.name}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<BarChart
									margin={{ top: 5, right: 10, bottom: 80, left: 170}}
									dataset={productsSoldData.filter((x: { categoryName: string; })=>x.categoryName==category.name)}
									yAxis={[{ scaleType: 'band', dataKey: 'productName', tickPlacement:'middle'}]}
									layout='horizontal'
									barLabel="value"
									xAxis= {[{label: 'Terjual', tickLabelStyle:{fontSize:0}, disableTicks:true } ]}
									{...chartSetting}
								/>
							</AccordionDetails>
						</Accordion>
					))}
				</List>
				
				{/* <BarChart
						margin={{
							left: 170,
							right: 10,
						}}
					dataset={productsSoldData.filter((product)=>product.categoryName.toLowerCase().includes())}
					// yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
					yAxis={[{ scaleType: 'band', dataKey: 'productName' }]}
					layout='horizontal'
					{...chartSetting}
				/> */}
			</Box>
			<Offset />			
		</Grid>
	);
};

export default Dashboard;
