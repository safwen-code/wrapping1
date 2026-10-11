'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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

import { useAuthStore } from '@/store/auth.store'
import { useProductStore } from '@/store/product.store'
import { machines } from '@/mocks/machines'

export default function OperatorPage() {
  const router = useRouter()

  const user = useAuthStore((state) => state.user)
  const machineId = useAuthStore((state) => state.machineId)

  const products = useProductStore((state) => state.products)
  const loadProducts = useProductStore((state) => state.loadProducts)
  const loading = useProductStore((state) => state.loading)

  useEffect(() => {
    if (!user || !machineId) {
      router.replace('/login')
      return
    }

    void loadProducts(machineId)
  }, [user, machineId, router, loadProducts])

  if (!user || !machineId) {
    return null
  }

  const machine = machines.find((item) => item.id === machineId)

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Operator and machine header */}
        <Card>
          <CardContent>
            <div>
              <Box>
                <div>
                  <h1>{machine?.name ?? 'Wrapping'}</h1>

                  <Chip label="ACTIVE" color="success" size="small" />
                </div>
              </Box>

              <Box>
                <h1>{user.name}</h1>

                <Typography color="text.secondary">
                  ID: {user.operatorCode}
                </Typography>
              </Box>
            </div>
          </CardContent>
        </Card>

        {/* Production table */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <div>
                <h1>Production</h1>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    // We will connect ProductForm here next.
                  }}
                >
                  Add Product
                </Button>
              </div>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Number</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Dirty Height</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Dirty Width</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Clean Height</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Clean Width</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Big</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Small</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Created</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {loading && products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          Loading products...
                        </TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No products found for this machine.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id} hover>
                          <TableCell>{product.number}</TableCell>
                          <TableCell>{product.dirtyHeight}</TableCell>
                          <TableCell>{product.dirtyWidth}</TableCell>
                          <TableCell>{product.cleanHeight}</TableCell>
                          <TableCell>{product.cleanWidth}</TableCell>

                          <TableCell align="center">
                            <Checkbox
                              checked={product.big}
                              disabled
                              size="small"
                            />
                          </TableCell>

                          <TableCell align="center">
                            <Checkbox
                              checked={product.small}
                              disabled
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={
                                product.status === 'CONFIRMED'
                                  ? 'CONFIRMED'
                                  : 'NOT CONFIRMED'
                              }
                              size="small"
                              color={
                                product.status === 'CONFIRMED'
                                  ? 'success'
                                  : 'warning'
                              }
                            />
                          </TableCell>

                          <TableCell>{formatTime(product.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
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
