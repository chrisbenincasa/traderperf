import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import {
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Theme,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import React, { RefObject } from 'react';
import { useCallback, useEffect, useState } from 'react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import UploadIcon from '@mui/icons-material/Upload';

export const drawerWidth = 240;

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(6)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface MenuItemProps {
  readonly to: string;
  readonly primary?: string;
  readonly button?: boolean;
  readonly key?: string;
  readonly selected?: boolean;
  readonly listLength?: number;
  readonly onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  readonly children: React.ReactNode;
}

const MenuItemLink = (props: MenuItemProps) => {
  const { primary, to, selected, onClick, children } = props;

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
          {children}
          {props.children}
        </a>
      </Link>
    );
  });

  return (
    <ListItemButton
      color="inherit"
      selected={selected}
      onClick={onClick}
      href={to}
      component={ButtonLink}
    />
  );
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NavDrawer(props: Props) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(props.open);
  }, [props.open]);

  const setDrawerState = useCallback(
    (value: boolean) => {
      if (isOpen !== value) {
        setIsOpen(value);
      }
    },
    [isOpen]
  );

  const closeDrawer = useCallback(() => {
    console.log('hey');
    props.onClose();
  }, [props.onClose]);

  return (
    <Drawer
      anchor={'left'}
      open={props.open}
      onClose={() => setDrawerState(false)}
      variant="permanent"
    >
      <DrawerHeader>
        <IconButton onClick={() => closeDrawer()}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <MenuItemLink to="/trades">
          <ListItemIcon>
            <CompareArrowsIcon />
          </ListItemIcon>
          <ListItemText primary="Trades" />
        </MenuItemLink>
        <MenuItemLink to="/stats">
          <ListItemIcon>
            <QueryStatsIcon />
          </ListItemIcon>
          <ListItemText primary="Stats" />
        </MenuItemLink>
        <MenuItemLink to="/import">
          <ListItemIcon>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText primary="Import" />
        </MenuItemLink>
      </List>
    </Drawer>
  );
}
