import React, {  useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { ImageListItemBar, Menu, MenuItem, MenuList } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { NumericFormat } from 'react-number-format';
import { Product } from '../../types/interfaceModel';

interface Category {
  id: number;
  name:string;
}

interface AvailableProductsProps {
	availableProducts:Product[];
	categories:Category[];
	onAddProduct: (product: any) => void;
}

const AvailableProducts: React.FC<AvailableProductsProps> = ({
	availableProducts,
	categories,
	onAddProduct
}) => {

	const [searchQuery, setSearchQuery] = useState('');
	const ImageButton = styled(ButtonBase)(({ theme }) => ({
		position: 'relative',
		height: 150,
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
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: theme.palette.common.black,
		opacity: 0.4,
		transition: theme.transitions.create('opacity'),
	}));

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

	const filterFromCategory = (category: Category) => {
		handleClose();

		if(category.id===999){
			setSearchQuery("");
		}
		else{
			setSearchQuery(category.name);
		}
	};

	return (
		<React.Fragment>
			<Typography variant="h5" gutterBottom>
				Produk Tersedia
			</Typography>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
				slotProps={{
          paper: {
            style: {
              maxHeight: 48 * 5,
              width: '20ch',
            },
          },
        }}
			>
				{categories.map((category)=>(
					<MenuList key={category.id}>
						<MenuItem onClick={()=>filterFromCategory(category)}>{category.name}</MenuItem>
					</MenuList >
				))}
			</Menu>
			<Stack spacing={2}>
				<Stack spacing={2} direction="row">
					<Grid size={10}>
					<TextField id="outlined-basic" label="Search products..." variant="outlined" fullWidth onChange={(e) => setSearchQuery(e.target.value)}/>
					</Grid>
					<Grid size={2}>
					<IconButton aria-label="delete" size="large" onClick={handleClick}>
						<FilterAltIcon fontSize="inherit" />
					</IconButton>

					</Grid>
				</Stack>
				<Box sx={{
          mb: 2,
          display: "flex",
          flexDirection: "column",
          height: 500
         // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
        }}>
					<ImageList cols={3} rowHeight={'auto'}>
					{availableProducts.filter((product) =>
								product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
								product.category.toLowerCase().includes(searchQuery.toLowerCase())
							).map((product) => (
							<ImageListItem key={product.id}>
								<ImageButton focusRipple onClick={() => onAddProduct(product)}>
									<ImageBackdrop className="MuiImageBackdrop-root" />
									<Image>
										<Typography
											component="span"
											variant="subtitle2"
											color="inherit"
											sx={(theme) => ({
												position: 'relative',
												p: 4,
												pt: 2,
												pb: `calc(${theme.spacing(1)} + 6px)`,
											})}
										>
											{product.name}
										</Typography>
									</Image>
									<ImageListItemBar subtitle={
										<NumericFormat value={product.price} displayType="text" thousandSeparator="." decimalSeparator="," prefix={'IDR '}/>
									}/>
								</ImageButton>
							</ImageListItem>
						))}
					</ImageList>
				</Box>
			</Stack>
		</React.Fragment>
	);
};

export default AvailableProducts;
