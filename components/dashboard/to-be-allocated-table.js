import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

let counter = 0;
function createData(name, loa, gate, eta, berth, sailTime, imp, exp) {
  counter += 1;
  return { id: counter, name, loa, gate, eta, berth, sailTime, imp, exp };
}


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'serial number', numeric: false, disablePadding: false, label: 'Serial number' },
  { id: 'vessel number', numeric: false, disablePadding: true, label: 'Vessel number' },
  { id: 'loa', numeric: false, disablePadding: false, label: 'LOA' },
  { id: 'gate', numeric: false, disablePadding: false, label: 'Gate' },
  { id: 'eta', numeric: false, disablePadding: false, label: 'ETA' },
  { id: 'estimated berth', numeric: false, disablePadding: true, label: 'Est. Berth' },
  { id: 'sail time', numeric: false, disablePadding: true, label: 'Est. Sailing time' },
  { id: 'imp', numeric: true, disablePadding: false, label: 'IMP' },
  { id: 'exp', numeric: true, disablePadding: false, label: 'EXP' },
];

class ToBeAllocatedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {/* <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell> */}
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

ToBeAllocatedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  lastUpdated: {
      minWidth: 280,
  },
  title: {
    flex: '0 0 auto',
  },
});

let ToBeAllocatedToolbar = props => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="title" id="tableTitle">
            Expected Vessels at Main Berth JNPCT
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : <div className={classes.lastUpdated}>Last Updated at :- 02-Jan-2018 14:00:00</div>}
      </div>
    </Toolbar>
  );
};

ToBeAllocatedToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

ToBeAllocatedToolbar = withStyles(toolbarStyles)(ToBeAllocatedToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class ToBeAllocatedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'preBerthTime',
    selected: [],
    data: [
      createData('H2350', 255, 'Open', '02-Jan-2018 13:40', 'B1', '03-Jan-2018 18:06', 67, 4.3),
      createData('H2371', 260, 'Open', '03-Jan-2018 12:24', 'B2', '04-Jan-2018 13:48', 1711, 1210),
      createData('H2394', 334.45, 'Open', '03-Jan-2018 13:40', 'B3', '04-Jan-2018 10:42	', 413, 347),
      createData('H2391', 222.14, 'Open', '04-Jan-2018 13:40', 'B1', '05-Jan-2018 04:54', 662, 792),
      createData('H2349', 260.65, 'Closed', '04-Jan-2018 15:40', 'B3', '06-Jan-2018 02:12', 1822, 347),
      createData('H2348', 339.62, 'Closed', '05-Jan-2018 07:36', 'B2', '06-Jan-2018 02:30', 782, 1084),
      createData('H2421', 259.94, 'Closed', '06-Jan-2018 04:40', 'B1', '06-Jan-2018 21:00', 731, 599),
      createData('H2373', 268.8, 'Closed', '06-Jan-2018 05:40', 'B3', '07-Jan-2018 11:15', 2345, 1182),
      createData('H2408', 268.8, 'Closed', '07-Jan-2018 13:40', 'B2', '07-Jan-2018 22:45', 975, 4.3),
      createData('H2390', 260.05, 'Closed', '07-Jan-2018 14:40', 'B1', '09-Jan-2018 04:12', 67, 1737),
    ],
    page: 0,
    rowsPerPage: 10,
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
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
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <ToBeAllocatedToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <ToBeAllocatedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell>
                        {n.id}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {n.name}
                      </TableCell>
                      <TableCell >{n.loa}</TableCell>
                      <TableCell >{n.gate}</TableCell>
                      <TableCell padding="none">{n.eta}</TableCell>
                      <TableCell padding="none">{n.berth}</TableCell>
                      <TableCell padding="none">{n.sailTime}</TableCell>
                      <TableCell numeric>{n.imp}</TableCell>
                      <TableCell numeric>{n.exp}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
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
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

ToBeAllocatedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ToBeAllocatedTable);