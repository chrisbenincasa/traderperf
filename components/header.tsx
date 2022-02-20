import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar as MuiAppBar,
  Button,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { RefObject, useCallback, useState } from 'react';
import NavDrawer, { drawerWidth } from './navDrawer';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface MenuItemProps {
  readonly to: string;
  readonly primary?: string;
  readonly button?: boolean;
  readonly key?: string;
  readonly selected?: boolean;
  readonly listLength?: number;
  readonly onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const MenuItemLink = (props: MenuItemProps) => {
  const { primary, to, selected, onClick } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ButtonLink = React.forwardRef((props: any, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { onClick, href } = props;
    return (
      <Link href={href} passHref>
        <a
          onClick={onClick}
          ref={ref as RefObject<HTMLAnchorElement>}
          {...props}
        >
          {primary}
        </a>
      </Link>
    );
  });

  return (
    <Button
      color="inherit"
      selected={selected}
      onClick={onClick}
      href={to}
      component={ButtonLink}
    />
  );
};

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen]);

  return (
    <React.Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => toggleDrawer()}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TraderPerf
          </Typography>
          <MenuItemLink to="/trades" primary="Trades" />
          <MenuItemLink to="/stats" primary="Stats" />
          <MenuItemLink to="/import" primary="Import" />
        </Toolbar>
      </AppBar>
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </React.Fragment>
  );
};

export default Header;
