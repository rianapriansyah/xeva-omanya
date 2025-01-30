import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/Product/ProductList';
import TransactionMain from './components/Transactions/TransactionMain';
import Dashboard from './components/Dashboard/Dashboard';
import AppTheme from './theme/AppTheme';
import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, styled, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from 'react-redux';
import { RootState } from '../src/services/store'; // Import the state type
import Menu from './components/common/Menu';
import ProtectedRoute from './ProtectedRoute';
import { PERMISSIONS } from './constants/permissions';
import RoleSelector from './components/RoleSelector';

const Settings = () => <div>Settings Screen</div>;

interface ListItemLinkProps {
  icon?: React.ReactElement<unknown>;
  primary: string;
  to: string;
}

const menus  = [
  {
    title: 'Transaction',
    element: <TransactionMain />,
    path: '/',
    icon: <PointOfSaleIcon />,
    permission: PERMISSIONS.TRANSACTIONS,
    roles: ['admin', 'cashier'], // Allowed roles
  },
  {
    title: 'Product',
    element: <ProductList />,
    path: '/products',
    icon: <InventoryIcon />,
    permission: PERMISSIONS.TRANSACTIONS,
    roles: ['admin'], // Allowed roles
  },
  {
    title: 'Dashboard',
    element: <Dashboard />,
    path: '/dashboard',
    icon: <DashboardIcon />,
    permission: PERMISSIONS.TRANSACTIONS,
    roles: ['admin'], // Allowed roles
  },
  {
    title: 'Settings',
    element: <Settings />,
    path: '/settings',
    icon: <SettingsIcon />,
    permission: PERMISSIONS.TRANSACTIONS,
    roles: ['admin'], // Allowed roles
  }
];

const App: React.FC = () => {
  const selectedStore = useSelector((state: RootState) => state.store.selectedStore);
  const userRole = useSelector((state: RootState) => state.user.role); // Get the user's role from Redux
  const accessibleMenus = menus.filter((menu) => menu.roles.includes(userRole));
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu]=useState("");

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  function ListItemLink(props: ListItemLinkProps) {
    const { icon, primary, to } = props;
  
    return (
      <ListItemButton component={Link} to={to} onClick={()=>setSelectedMenu(primary)} selected={selectedMenu===primary}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItemButton>
    );
  }

  return (
    <AppTheme>
      <Router>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
            disabled={selectedStore?.name===""}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {selectedStore?.name}
          </Typography>
          <Stack spacing={2} direction="row">
          <RoleSelector />
          
          <Menu/>
          </Stack>
          
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {accessibleMenus.map((menu) => (
          <ListItem key={menu.title} disablePadding>
            <ListItemLink to={menu.path} primary={menu.title} icon={menu.icon} />
          </ListItem>
        ))}
        
      </List>
      
        </Box>
      </Drawer>
      <Offset />
      <Routes>
        {menus.map((menu) => (
            <Route key={menu.title} path={menu.path} element={
                <ProtectedRoute permission={menu.permission}>
                    {menu.element}
                </ProtectedRoute>
            } />
        ))}
      </Routes>
        {/* <Routes>
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/payment-method-management" element={<PaymentMethodManagement />} />
          <Route path="/transactions" element={<TransactionMain />} />
          <Route path="/history-transactions" element={<HistoryTransactions />} />
          <Route path="/" element={<div>Welcome to the Coffee Shop Management App</div>} />
        </Routes> */}
      </Router>
    </AppTheme>
  );
};

export default App;
