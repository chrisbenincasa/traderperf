import {
  Box,
  Breadcrumbs,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { toUnit } from 'dinero.js';
import _ from 'lodash';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTradeAsync,
  selectTradeDetail,
  selectTradeDetailLoading,
} from '../../features/executionsSlice';
import { toUsdFormat } from '../../util/dineroUtil';

const TradeDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch();
  const tradeLoading = useSelector(selectTradeDetailLoading);
  const tradeDetail = useSelector(selectTradeDetail);

  useEffect(() => {
    if (!_.isUndefined(id)) {
      const normalizedId = parseInt(_.isArray(id) ? id[0] : id);
      dispatch(getTradeAsync({ id: normalizedId }));
    }
  }, [id]);

  const executionTableData = useMemo(() => {
    if (!tradeDetail || tradeDetail.executions.length === 0) {
      return [];
    }

    let position = tradeDetail.executions[0].quantity;
    return _.map(tradeDetail.executions, (exec, i) => {
      if (i > 0) {
        position += exec.quantity;
      }
      return {
        key: exec.timestamp.toISO(),
        quantity: exec.quantity,
        timestamp: exec.timestamp.toISO(),
        price: toUsdFormat(exec.pps),
        position,
      };
    });
  }, [tradeDetail]);

  return (
    <Box>
      <Breadcrumbs>
        <Link href="/trades" passHref>
          <MuiLink color="inherit">MUI</MuiLink>
        </Link>
      </Breadcrumbs>
      {tradeLoading || !tradeDetail ? (
        <LinearProgress />
      ) : (
        <Box>
          <Typography variant="h2">{tradeDetail?.symbol}</Typography>
          <List>
            <ListItem disablePadding>
              <ListItemText
                primary={`Opened: ${tradeDetail.executions[0].timestamp.toISO()}`}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary={`Closed P/L: ${toUsdFormat(tradeDetail.closedPl)}`}
              />
            </ListItem>
          </List>
          <Typography variant="h4">Executions</Typography>
          <Table component={Paper}>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Position</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {executionTableData.map((row) => (
                <TableRow
                  key={row.key}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.timestamp}
                  </TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">{row.position}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default TradeDetailPage;
