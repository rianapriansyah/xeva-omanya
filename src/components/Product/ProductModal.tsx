import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField  } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Category, Actions, ProductPayload } from '../../types/interfaceModel';


interface ProductModalProps {
	product:ProductPayload;
	categories:Category[];
	isModalOpen: boolean;
	action: Actions;
	onCloseModal: () => void;
	onSaveProduct: (product: ProductPayload) => void; // Callback for saving the product
	onDeleteProduct: (product: ProductPayload) => void; // Callback for saving the product
}

const ProductModal: React.FC<ProductModalProps> = ({
	product,
	categories,
	isModalOpen,
	action,
	onCloseModal,
	onSaveProduct,
	onDeleteProduct
}) => {

  const [localProduct, setLocalProduct] = useState<ProductPayload>(product); // Local state for the note

	useEffect(() => {
		setLocalProduct(product); // Update localProduct when the modal opens
	}, [product]);



	const handleChangeKitchen = (event: SelectChangeEvent) => {
    setLocalProduct({ ...localProduct, kitchen: event.target.value })
  };

	const handleChangeCategory = (event: SelectChangeEvent) => {
    setLocalProduct({ ...localProduct, category: event.target.value })
  };

	const handleAction = async () => {
		setLocalProduct(localProduct);
	
			if(action==Actions.Delete){
				onDeleteProduct(localProduct); // Call the save function passed from the parent
			}else{
				onSaveProduct(localProduct); // Call the save function passed from the parent
			}		
		};

return (
    <Dialog open={isModalOpen} onClose={onCloseModal} fullWidth={true}>
        <DialogTitle>{`${action.toString()} Produk`}</DialogTitle>
        <DialogContent>
				<Stack spacing={2}>
				<Stack spacing={2} direction="row">
						<TextField
							disabled={action==Actions.Delete}
							autoFocus
							required
							margin="dense"
							id="productName"
							name="productName"
							label="Product Name"
							type="text"
							fullWidth
							variant="standard"
							value={localProduct.name}
							onChange={(e: { target: { value: any; }; }) => setLocalProduct({ ...localProduct, name: e.target.value })}
						/>
						<TextField
							disabled={action==Actions.Delete}
							autoFocus
							required
							margin="dense"
							id="price"
							name="price"
							label="Price"
							type="text"
							fullWidth
							variant="standard"
							value={localProduct.price}
							onChange={(e: { target: { value: any; }; }) => setLocalProduct({ ...localProduct, price: e.target.value })}
						/>
					</Stack>
        	<Stack spacing={2} direction="row">
							<FormControl fullWidth variant="standard">
							<InputLabel id="kitchen-select-label" autoFocus>Kitchen</InputLabel>
								<Select
									disabled={action==Actions.Delete}
									required
									labelId="kitchen-select-label"
									id="kitchen-select-label"
									value={localProduct.kitchen}
								 	onChange={handleChangeKitchen}
									>
										<MenuItem value="food">Food</MenuItem>
										<MenuItem value="beverage">Beverage</MenuItem>
								</Select>
							</FormControl>
							<FormControl fullWidth variant="standard" >
							<InputLabel id="category-select-label" autoFocus>Category</InputLabel>
								<Select
									disabled={action==Actions.Delete}
									required
									labelId="category-select-label"
									id="category-select-label"
									value={localProduct.category}
								 	onChange={handleChangeCategory}
									>
										{categories.map((cat)=>
										<MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
									)}										
								</Select>
							</FormControl>
					</Stack>
				</Stack>
        </DialogContent>
        <DialogActions>
				<Button onClick={onCloseModal}>Cancel</Button>
        <Button onClick={()=>handleAction()}>{`${action.toString()} Produk`}</Button>
        </DialogActions>
    </Dialog>
	);
};

export default ProductModal;
