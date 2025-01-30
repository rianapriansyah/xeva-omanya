import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROLES } from '../constants/permissions';
import { RootState } from '../services/store';
import { Button, Menu, MenuItem } from '@mui/material';
import { setUserRole } from '../services/userSlice';

const RoleSelector: React.FC = () => {
    const role = useSelector((state: RootState) => state.user.role);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const dispatch = useDispatch();

    const handleChangeRole = (newRole: string) => {
        // dispatch({ type: 'SET_USER_ROLE', payload: newRole });
        dispatch(setUserRole(newRole));
        handleClose();
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <React.Fragment>
        <Button 
          size='small'
          onClick={handleClick}
          variant='outlined'
          >
          {role}
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
        {Object.values(ROLES).map((role) => (
          <MenuItem key={role} value={role} onClick={()=>handleChangeRole(role)} >
          {role}
        </MenuItem >
        ))}
      </Menu>
        </React.Fragment>
    );
};

export default RoleSelector;
