import React, { useEffect, useState } from 'react';
import {
    Grid2 as Grid,
    Box,
    TextField,
    Button,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Stack,
    styled,
		tableCellClasses,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    createProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../../services/api';
import { ProductModal, CategoryModal } from '..';
import { RootState } from '../../services/store';
import { Product, Category, Actions } from '../../types/interfaceModel';
import { useSelector } from 'react-redux';
import { NumericFormat } from 'react-number-format';

const emptyProduct: Product = {
	id: 0,
	transactionId:0,
	productId:0,
	name:"",
	price:0,
	quantity:0,
	total:0,
	kitchen:"",
	category:"",
	storeId:0
};

const emptyCategory:Category={
	id: 0,
  name:"",
  description:""
};

const ProductList: React.FC = () => {
	const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [isProductModalOpen, setProductModalState] = useState(false); // Product Modal state
	const [isCategoryModalOpen, setCategoryModalState] = useState(false); // Category Modal state
	const [selectedProduct, setSelectedProduct] = useState<Product>(emptyProduct);
	const [action, setAction] = useState<Actions>(Actions.Add);
	const [selectedCategory, setSelectedCategory] = useState<Category>(emptyCategory);
	const [postMessage, setMessage] = useState(""); 
	const [openSnack, setOpenSnack] = React.useState(false);
	const handleCloseSnack = () => setOpenSnack(false);

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true);
			handleFetchProduct();
			handleFetchCategory();
			setLoading(false);
		};

		loadProducts();
	}, [selectedStore]);

	const handleSaveCategory = async (category: Category) => {
		try {
			let message = "";
				if (category.id === 0) {
						// New Category
						await createCategory(category);
						message = "Dibuat!";
				} else {
						// Update Existing Category
						await updateCategory(category.id, category);
						message = "Diubah!";
				}
				handleFetchCategory(); // Refresh the Category list
				setCategoryModalState(false); // Close the modal
				triggerSnack(`${category.name} ${message}`);
		} catch (error) {
				console.error('Kesalahan dalam menyimpan: ', error);
				triggerSnack(`Kesalahan dalam menyimpan-${category.name}`);
		}
	};

	const handleDeleteCategory = async (category: Category) => {
		try {
				if (category.id === 0) {
						console.error('Kesalahan dalam menghapus:', category);
						triggerSnack(`Kesalahan dalam menghapus:-${category.name}`);
						return;
				} 
				await deleteCategory(category.id);
				handleFetchCategory(); // Refresh the Category list
				setCategoryModalState(false); // Close the modal
				triggerSnack(`${category.name} Dihapus!`);
		} catch (error) {
				console.error('Kesalahan dalam menghapus:', error);
				triggerSnack(`Kesalahan dalam menghapus:-${category.name}`);
		}
	};

	const handleSaveProduct = async (product: Product) => {
		product.storeId = selectedStore?.id ?? 1;
		try {
			let message = "";
				if (product.id === 0) {
						// New Product
						await createProduct(product);
						message = "Dibuat!";
				} else {
						// Update Existing Product
						await updateProduct(product.id, product);
						message = "Diubah!";
				}
				handleFetchProduct(); // Refresh the product list
				setProductModalState(false); // Close the modal
				triggerSnack(`${product.name} ${message}`);
		} catch (error) {
				console.error('Error saving product:', error);
				triggerSnack(`Error saving product-${product.name}`);
		}
	};

	const handleDeleteProduct = async (product: Product) => {
		product.storeId = selectedStore?.id ?? 1;
		try {
				if (product.id === 0) {
						// New Product
						console.error('Error delete product:', product);
						triggerSnack(`Error delete product-${product.name}`);
						return;
				} 
				await deleteProduct(product.id);
				handleFetchProduct(); // Refresh the product list
				setProductModalState(false); // Close the modal
				triggerSnack(`${product.name} Deleted!`);
		} catch (error) {
				console.error('Error delete product:', error);
				triggerSnack(`Error delete product-${product.name}`);
		}
	};

	const handleFetchProduct = async () => {
		try {
			const data = await fetchProducts(selectedStore?.id);
			const sortedProduct = data.data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
			setProducts(sortedProduct);
		} catch (error) {
			console.error('Error fetching products:', error);
			triggerSnack('Kesalahan dalam mengambil data produk');
		}
	};

	const handleFetchCategory = async () => {
		try {
			const data = await fetchCategories();
			const sortedCategories = data.data.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name))
			setCategories(sortedCategories);
		} catch (error) {
			console.error('Error fetching categories:', error);
			alert(error);
			triggerSnack('Kesalahan dalam mengambil data kategori');
		}
	};

	if (loading) return <p>Loading...</p>;

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

	const openProductModal = (product:Product, action:Actions) => {
		setAction(action);
		setSelectedProduct(product);
    setProductModalState(true);
  };

	const openCategoryModal = (category:Category, action:Actions) => {
		setAction(action);
		setSelectedCategory(category);
    setCategoryModalState(true);
  };

	const closeProductModal = () => {
		handleFetchProduct();
    setProductModalState(false);
  };

	const closeCategoryModal = () => {
		handleFetchCategory();
    setCategoryModalState(false);
  };

	const triggerSnack = (msg:string) => {
    setMessage(msg);
    setOpenSnack(true);
  };

	return (
		<Grid>
		<Box component="section" sx={{ flexGrow:1, p: 2, border: '1px dashed grey', borderRadius:"10px" }}>
			<Grid container rowSpacing={1} spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 1, md: 12 }}>
				<Grid size={6}>
				<Stack spacing={2}>
					<Typography variant="h4" gutterBottom>
							Produk
					</Typography>
					<Button onClick={()=>{openProductModal(emptyProduct, Actions.Add);}} variant="contained">Tambah Produk Baru</Button>
					<TextField id="outlined-basic" label="Search products..." variant="outlined" onChange={(e) => setSearchQuery(e.target.value)}/>
					<Stack direction={"row"} spacing={2}>
						<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Toko : {selectedStore?.name}
						</Typography>
						<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>Total Produk :{' '}
							{products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase())).length}
						</Typography>
					</Stack>
					<Box sx={{
						mb: 2,
						display: "flex",
						flexDirection: "column",
						height: "inherit"
						// justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
						}}>
						<TableContainer component={Paper}>
							<Table size='small'>
								<TableHead>
									<TableRow>
										<StyledTableCell>Nama Produk</StyledTableCell>
										<StyledTableCell>Harga</StyledTableCell>
										<StyledTableCell>Kategori</StyledTableCell>
										<StyledTableCell>Store</StyledTableCell>
										<StyledTableCell align="right">Aksi</StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
								{products.filter((product) =>
											product.name.toLowerCase().includes(searchQuery.toLowerCase())
										).map((product) => (
									<StyledTableRow  key={product.id}>
										<StyledTableCell>
											{product.name}
										<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 12, fontStyle: 'italic' }}>{product.kitchen}</Typography>
										</StyledTableCell>
										<StyledTableCell>
											<NumericFormat value={product.price} displayType="text" thousandSeparator="." decimalSeparator="," prefix={'IDR '}/>
										</StyledTableCell>
										<StyledTableCell>
											{product.category}
										</StyledTableCell>
										<StyledTableCell>
											{selectedStore?.name}
										</StyledTableCell>
										<StyledTableCell align="right">
											<ToggleButtonGroup
											color="primary"
												size='small'
												exclusive
												aria-label="action button"
											>                   
												<ToggleButton value="update" onClick={() => openProductModal(product, Actions.Edit)}>
													<EditIcon  />
												</ToggleButton>
												<ToggleButton value="delete" onClick={() => openProductModal(product, Actions.Delete)}>
													<DeleteIcon  />
												</ToggleButton>
											</ToggleButtonGroup>
										</StyledTableCell>
									</StyledTableRow >
									))}
								</TableBody>
							</Table>
						</TableContainer>
        	</Box>
					</Stack>
				</Grid>
				<Grid size={6}>
				<Stack spacing={2}>
					<Typography variant="h4" gutterBottom>
						Kategori
					</Typography>
					<Stack spacing={3}>
						<Button onClick={()=>openCategoryModal(emptyCategory, Actions.Add)} variant="contained">Buat Kategori Baru</Button>
					</Stack>
					<Box sx={{
						mb: 2,
						display: "flex",
						flexDirection: "column",
						height: "inherit"
					// justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
					}}>
          <TableContainer component={Paper}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Nama Kategori</StyledTableCell>
                  <StyledTableCell align="left">Deskripsi</StyledTableCell>
                  <StyledTableCell align="right">Aksi</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {categories.sort().map((category) => (
                <StyledTableRow  key={category.id}>
                  <StyledTableCell align="left">
                    {category.name}
										<Typography variant="body2" sx={{ color: 'text.primary', fontSize: 11, fontStyle: 'italic' }}>Total Product di toko {selectedStore?.name} :{' '}
											{products.filter((product) => product.category.toLowerCase().includes(category.name.toLowerCase())).length}
										</Typography>
                  </StyledTableCell>
									<StyledTableCell align="left">
                    {category.description}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <ToggleButtonGroup
                    color="primary"
                      size='small'
                      exclusive
                      aria-label="action button"
                    >                   
                      <ToggleButton value="update" onClick={() => openCategoryModal(category, Actions.Edit)}>
                        <EditIcon  />
                      </ToggleButton>
											<ToggleButton value="delete" onClick={() => openCategoryModal(category, Actions.Delete)}>
                        <DeleteIcon  />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </StyledTableCell>
                </StyledTableRow >
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
				</Stack>
				</Grid>
			</Grid>
			<ProductModal 
				product={selectedProduct}
				categories={categories}
				isModalOpen={isProductModalOpen} 
				onCloseModal={() => closeProductModal()}	
				onSaveProduct={handleSaveProduct} // Callback for saving product
				onDeleteProduct={handleDeleteProduct} // Callback for saving product
				action={action}
			/>
			<CategoryModal
				category={selectedCategory}
				isModalOpen={isCategoryModalOpen} 
				onCloseModal={() => closeCategoryModal()}	
				onSaveCategory={handleSaveCategory} // Callback for saving product
				onDeleteCategory={handleDeleteCategory} // Callback for saving product
				action={action}
			/>
			<Snackbar
        autoHideDuration={4000}
        anchorOrigin={{vertical: 'top', horizontal: 'center' }}
        open={openSnack}
        onClose={handleCloseSnack}
        message={postMessage}
      />
		</Box>
		</Grid>
	);
};

export default ProductList;
