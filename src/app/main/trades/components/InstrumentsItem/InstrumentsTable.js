import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Icon from '@mui/material/Icon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { getInstruments, selectInstruments } from '../../../store/instrumentsSlice';
import InstrumentsTableHead from './InstrumentsTableHead';
import FuseModal from 'app/shared-components/FuseModal';
import InstrumentForm from './InstrumentForm';

const InstrumentsTable = (props) => {
  const dispatch = useDispatch();
  const instruments = useSelector(({ main }) => main.instruments.items);
  const searchText = useSelector(({ main }) => main.instruments.searchText);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(instruments);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState();
  const [openNewInstrumentModal, setOpenNewInstrumentModal] = useState(false);
  const [order, setOrder] = useState({
    direction: 'asc',
    _id: null,
  });

  useEffect(() => {
    dispatch(getInstruments()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(instruments, (item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
      );
      setPage(0);
    } else {
      setData(instruments);
    }
  }, [instruments, searchText]);

  function handleRequestSort(event, property) {
    const _id = property;
    let direction = 'desc';

    if (order._id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      _id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n._id));
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function handleRowClick(item) {
    setSelectedItem(item)
    setOpenNewInstrumentModal(true)
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return <FuseLoading />;
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="textSecondary" variant="subtitle1">
          There are no instruments!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <InstrumentsTableHead
            selectedInstrumentIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {_.orderBy(
              data,
              [
                (o) => {
                  switch (order._id) {
                    default: {
                      return o[order._id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                const isSelected = selected.indexOf(n._id) !== -1;
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n._id}
                    selected={isSelected}
                    onClick={(event) => handleRowClick(n)}
                  >
                    <TableCell className="w-40 md:w-64 text-center" padding="none">
                      <Checkbox
                        checked={isSelected}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => handleCheck(event, n._id)}
                      />
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row">
                      {n.name}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="flex-shrink-0 border-t-1"
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Instrument Modal */}
      <FuseModal
        title={'Edit Instrument Type'}
        openModal={openNewInstrumentModal}
        closeModal={() => setOpenNewInstrumentModal(false)}
      >
        <InstrumentForm 
          item={selectedItem}
          closeModal={() => setOpenNewInstrumentModal(false)} 
        />
      </FuseModal>
    </div>
  );
}

export default withRouter(InstrumentsTable);
