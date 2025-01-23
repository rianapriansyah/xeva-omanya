import React, { useEffect, useState } from 'react';
import { Avatar, Box, FormControl, InputLabel, List, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, SelectChangeEvent, styled, Typography } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import Grid from '@mui/material/Grid2'
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { fetchCategories, fetchDashboardData, fetchIncome, fetchProductsSoldData } from '../../services';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SavingsIcon from '@mui/icons-material/Savings';
import FunctionsIcon from '@mui/icons-material/Functions';
import { Category, StaticFilter } from '../../types/interfaceModel';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

const Dashboard: React.FC = () => {
	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
	const [dashboardData, setData] = useState<any>([]);
	const [incomeData, setIncomeData] = useState([]);
	const [productsSoldData, setProductSoldData] = useState<any>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [expanded, setExpanded] = React.useState<string | false>('');
	const [selectedFilter, setSelectedFilter] = useState<string>('today');
	
	const fetchSummaryData = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
    const response = await fetchDashboardData(storeId, filter, startDate, endDate);
		const dashboardDataArray = mainInfo.map((info) => ({
			...info,
			value: response.data ? response.data[info.metric] || 0 : 0 // Update value from dashboardData
		}));

		setData(dashboardDataArray);
	};

	const fetchCategory = async () => {
			try {
				const data = await fetchCategories(selectedStore?.id);
				const sortedCategories = data.data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
				setCategories(sortedCategories);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};

	const fetchIncomeData = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
    const response = await fetchIncome(storeId, filter, startDate, endDate);
		setIncomeData(response.data);
	};

	const fetchProductsSold = async (storeId: any, filter: string, startDate?: string, endDate?: string) => {
    const response = await fetchProductsSoldData(storeId, filter, startDate, endDate);
		setProductSoldData(response.data);
	};
	
	useEffect(() => {
		fetchSummaryData(selectedStore?.id, selectedFilter);
		// fetchTransactionData();
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
		fetchProductsSold(selectedStore?.id, selectedFilter);
		// fetchTransactionData();
	}, [selectedStore, selectedFilter]);

	const xAxisData = incomeData.map((point:any) => new Date(point.date).getDate()); // Extract dates
	const seriesData = incomeData.map((point:any) => point.totalIncome); // Extract total income

	const mainInfo  = [
		{
			title: 'Total Transaksi',
			metric: "totalTransactions",
			value:0,
			icon : <ShoppingCartIcon />,
			prefix : ""
		},
		{
			title: 'Pemasukkan',
			metric: "totalIncome",
			value:0,
			icon : <SavingsIcon />,
			prefix : "IDR "
		},
		{
			title: 'Penjualan Rata-rata',
			metric: "averageSalePerTransaction",
			value:0,
			icon : <FunctionsIcon />,
			prefix : "IDR "
		},
		{
			title: 'cash',
			metric: "cash",
			value:0,
			icon : <FunctionsIcon />,
			prefix : "IDR "
		},
		{
			title: 'cashless',
			metric: "cashless",
			value:0,
			icon : <FunctionsIcon />,
			prefix : "IDR "
		}
	];

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

	const handleCarChange = async (e: SelectChangeEvent<string>) => {
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
				<FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
        <InputLabel id="car-select-label">Pilih Filter</InputLabel>
        <Select
          labelId="car-select-label"
          id="car-select"
          value={selectedFilter}
          onChange={handleCarChange}
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
				{dashboardData.map((data: any) => (
					<ListItem
						key={data.metric}
						secondaryAction={<React.Fragment>
							<Typography variant="button" gutterBottom>
								{`${data.prefix} ${data.value.toLocaleString("id-ID")}`}
							</Typography>
						</React.Fragment>}
					>
						<ListItemAvatar>
							<Avatar>
								{data.icon}
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={data.title} />
					</ListItem>
				))}
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
