import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
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
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import ConfirmModal from 'app/shared-components/ConfirmModal';
import { removeInstruments } from '../../../store/instrumentsSlice';

const rows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'currency',
    align: 'left',
    disablePadding: false,
    label: 'Currency',
    sort: true,
  },
  {
    id: 'serviceFrequency',
    align: 'left',
    disablePadding: false,
    label: 'Service Frequency',
    sort: true,
  },
  {
    id: 'pricingTZ',
    align: 'left',
    disablePadding: false,
    label: 'Pricing TZ',
    sort: true,
  },
  {
    id: 'pricingTime',
    align: 'left',
    disablePadding: false,
    label: 'Pricing Time',
    sort: true,
  }
];

const InstrumentsTableHead = (props) => {
  const { selectedInstrumentIds } = props;
  const numSelected = selectedInstrumentIds.length;

  const [selectedInstrumentsMenu, setSelectedInstrumentsMenu] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState('');

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  const openSelectedInstrumentsMenu = (event) => {
    setSelectedInstrumentsMenu(event.currentTarget);
  }

  const closeSelectedInstrumentsMenu = () => {
    setSelectedInstrumentsMenu(null);
  }

  const checkInstruments = async (selectedIds) => {
    try {
      const response = await axios.post('/api/instrument/check', { items: selectedIds });
      const data = response.data;
      
      return data.related;

    } catch (err) {
      console.log(err);
    }
  }
  
  const handleRemoveInstruments = async () => {
    if(!selectedInstrumentIds) return;

    try {
      const checkRelated = await checkInstruments(selectedInstrumentIds);
      if(checkRelated > 0) {
        setConfirmMsg('Instrument types has ' + checkRelated + ' related trades.');
        setShowConfirmModal(true);
        return;
      }

      // dispatch(removeInstruments(selectedInstrumentIds));
      // props.onMenuItemClick();
      // closeSelectedInstrumentsMenu();
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
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
                  aria-owns={selectedInstrumentsMenu ? 'selectedInstrumentsMenu' : null}
                  aria-haspopup="true"
                  onClick={openSelectedInstrumentsMenu}
                  size="large"
                >
                  <Icon>more_horiz</Icon>
                </IconButton>
                <Menu
                  id="selectedInstrumentsMenu"
                  anchorEl={selectedInstrumentsMenu}
                  open={Boolean(selectedInstrumentsMenu)}
                  onClose={closeSelectedInstrumentsMenu}
                >
                  <MenuList>
                    <MenuItem
                      onClick={() => handleRemoveInstruments()}
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

      <ConfirmModal
        title={''}
        open={showConfirmModal}
        setOpen={setShowConfirmModal}
        handleClickOk={() => {
          dispatch(removeInstruments(selectedInstrumentIds));
          props.onMenuItemClick();
          closeSelectedInstrumentsMenu();
        }}
      >
        <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
            {confirmMsg}
        </Typography>
        <Typography variant="subtitle1" textAlign={'center'} display={'block'} component={'span'}>
            Are you sure to proceed?
        </Typography>
      </ConfirmModal>
    </>
  );
}

export default InstrumentsTableHead;
