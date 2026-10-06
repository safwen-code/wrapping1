'use client'

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'

const products = [
  {
    number: 'PRD001',
    height: 378,
    big: 380,
    small: 255,
    status: 'CONFIRM',
    operator: 'Ahmed',
    created: '06:15',
  },
  {
    number: 'PRD002',
    height: 377,
    big: 379,
    small: 256,
    status: 'BIG',
    operator: 'Ahmed',
    created: '06:22',
  },
  {
    number: 'PRD003',
    height: 379,
    big: 381,
    small: 254,
    status: 'SMALL',
    operator: 'Ahmed',
    created: '06:30',
  },
]

export default function OperatorPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* OPERATOR HEADER */}
        <Card>
          <CardContent>
            <div>
              <Stack spacing={1}>
                <div style={{ flex: 'row', alignItems: 'center' }}>
                  <h1>Wrapping 1</h1>

                  <Chip label="ACTIVE" color="success" size="small" />
                </div>
              </Stack>

              <Box>
                <h1>Ahmed</h1>

                <Typography color="text.secondary">ID: op001</Typography>
              </Box>
            </div>
          </CardContent>
        </Card>

        {/* PRODUCTION */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              {/* TITLE + BUTTON */}
              <div
                style={{
                  flex: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h1>Production</h1>

                <Button variant="contained" startIcon={<AddIcon />}>
                  Add Product
                </Button>
              </div>

              {/* PRODUCTS TABLE */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Number</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Height</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Big</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Small</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Operator</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Created</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.number} hover>
                        <TableCell>{product.number}</TableCell>

                        <TableCell>{product.height}</TableCell>

                        <TableCell>{product.big}</TableCell>

                        <TableCell>{product.small}</TableCell>

                        <TableCell>
                          <Chip
                            label={product.status}
                            size="small"
                            color={
                              product.status === 'CONFIRM'
                                ? 'success'
                                : product.status === 'BIG'
                                ? 'warning'
                                : 'error'
                            }
                          />
                        </TableCell>

                        <TableCell>{product.operator}</TableCell>

                        <TableCell>{product.created}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}
