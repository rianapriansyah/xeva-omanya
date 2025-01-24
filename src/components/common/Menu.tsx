import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedStore } from '../../services/storeSlice';
import { MenuList } from '@mui/material';
import { useEffect, useState } from 'react';
import { RootState } from '../../services/store';
import { getAllStores } from '../../services/localStoreService';

// const availableStores = [{id:1, name:"Xeva"},{id:2, name:"Omanya"}];

export default function BasicMenu() {
  const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
  const [availableStores, setAvailableStores] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenu, setSelectedMenu]=useState(selectedStore?.name);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const handleStoreSelect = (store: typeof availableStores[0]) => {
      handleClose();
      dispatch(setSelectedStore(store));
  };

  const fetchStores = async () => {
    const data = await getAllStores();
    setAvailableStores(data);
  };

  useEffect(() => {
    fetchStores();
  }, [selectedStore]);
  
  return (
    <React.Fragment>
      <Button 
        onClick={handleClick}
        >
        Store
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
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
        {availableStores.map((store)=>(
          <MenuList key={store.id}>
            <MenuItem onClick={()=>{handleStoreSelect(store);setSelectedMenu(store.name);}} 
              selected={selectedMenu===store.name}
            >{store.name}</MenuItem>
          </MenuList >
        ))}
      </Menu>
    </React.Fragment>
  );
}