import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/system';
import TableHead from '@mui/material/TableHead';
import { removeAssets } from '../../../store/assetsSlice';

const rows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  }
];

const AssetsTableHead = (props) => {
  const { selectedAssetIds } = props;
  const numSelected = selectedAssetIds.length;

  const [selectedAssetsMenu, setSelectedAssetsMenu] = useState(null);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  const openSelectedAssetsMenu = (event) => {
    setSelectedAssetsMenu(event.currentTarget);
  }

  const closeSelectedAssetsMenu = () => {
    setSelectedAssetsMenu(null);
  }

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        <TableCell padding="none" className="w-40 md:w-64 text-center z-99">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < props.rowCount}
            checked={props.rowCount !== 0 && numSelected === props.rowCount}
            onChange={props.onSelectAllClick}
          />
          {numSelected > 0 && (
            <Box
              className="flex items-center justify-center absolute w-64 top-0 ltr:left-0 rtl:right-0 mx-56 h-64 z-10 border-b-1"
              sx={{
                background: (theme) => theme.palette.background.paper,
              }}
            >
              <IconButton
                aria-owns={selectedAssetsMenu ? 'selectedAssetsMenu' : null}
                aria-haspopup="true"
                onClick={openSelectedAssetsMenu}
                size="large"
              >
                <Icon>more_horiz</Icon>
              </IconButton>
              <Menu
                id="selectedAssetsMenu"
                anchorEl={selectedAssetsMenu}
                open={Boolean(selectedAssetsMenu)}
                onClose={closeSelectedAssetsMenu}
              >
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      dispatch(removeAssets(selectedAssetIds));
                      props.onMenuItemClick();
                      closeSelectedAssetsMenu();
                    }}
                  >
                    <ListItemIcon className="min-w-40">
                      <Icon>delete</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}
        </TableCell>
        {rows.map((row) => {
          return (
            <TableCell
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default AssetsTableHead;
