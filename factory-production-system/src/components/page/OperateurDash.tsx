'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Alert,
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

import type { ArticleMeasurement } from '@/types/article'
import { useArticleStore } from '@/store/article.store'

import AddIcon from '@mui/icons-material/Add'

import ProductForm from '@/components/forms/ProductsForm'
import { useAuthStore } from '@/store/auth.store'
import { useProductStore } from '@/store/product.store'
import { machines } from '@/mocks/machines'
import { CreateProductInput } from '@/types/product'

type ProductFormData = Omit<CreateProductInput, 'number'>

export default function OperatorPage() {
  const router = useRouter()

  const [formOpen, setFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const user = useAuthStore((state) => state.user)
  const machineId = useAuthStore((state) => state.machineId)

  const products = useProductStore((state) => state.products)
  const loading = useProductStore((state) => state.loading)
  const storeError = useProductStore((state) => state.error)
  const loadProducts = useProductStore((state) => state.loadProducts)
  const addProduct = useProductStore((state) => state.addProduct)

  //article mesurement
  const formatMeasurement = (measurement: ArticleMeasurement | null) => {
    if (!measurement) return 'Not configured'

    return `${measurement.nominal} +${measurement.tolerancePlus}/-${measurement.toleranceMinus}`
  }

  const formatLimits = (measurement: ArticleMeasurement | null) => {
    if (!measurement) return '—'

    const minimum = measurement.nominal - measurement.toleranceMinus

    const maximum = measurement.nominal + measurement.tolerancePlus

    return `${minimum} – ${maximum}`
  }
  //article store

  const articles = useArticleStore((state) => state.articles)
  const selectedArticleRef = useArticleStore(
    (state) => state.selectedArticleRef,
  )
  const selectArticle = useArticleStore((state) => state.selectArticle)

  const selectedArticle = articles.find(
    (article) => article.reference === selectedArticleRef,
  )

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

  const handleAddProduct = async (data: ProductFormData) => {
    setFormError(null)

    const measurements = [
      data.dirtyHeight,
      data.dirtyWidth,
      data.cleanHeight,
      data.cleanWidth,
    ]

    if (measurements.some((value) => !Number.isFinite(value) || value <= 0)) {
      throw new Error('All measurements must be greater than zero.')
    }

    // Find the highest existing PRD number.
    const highestNumber = products.reduce((highest, product) => {
      const match = product.number.match(/^PRD-(\d+)$/)
      const number = match ? Number(match[1]) : 0

      return Math.max(highest, number)
    }, 1000)

    const nextNumber = `PRD-${String(highestNumber + 1).padStart(4, '0')}`

    try {
      await addProduct(
        {
          ...data,
          number: nextNumber,
        },
        machineId,
        user.id,
        user.name,
      )

      setFormOpen(false)
      setFormError(null)
    } catch {
      setFormError('Failed to add product. Please try again.')
      throw new Error('Failed to add product')
    }
  }

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* OPERATOR HEADER */}

        <Card>
          <CardContent>
            <div>
              {/* MACHINE */}
              <Box>
                <h4>{machine?.name ?? 'Wrapping'}</h4>

                <Chip
                  label="ACTIVE"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>

              {/* ARTICLE SELECT */}
              <FormControl sx={{ width: { xs: '100%', md: 260 } }} size="small">
                <InputLabel id="article-reference-label">
                  Article Reference
                </InputLabel>

                <Select
                  labelId="article-reference-label"
                  id="article-reference"
                  value={selectedArticleRef}
                  label="Article Reference"
                  onChange={(event) => selectArticle(event.target.value)}
                >
                  {articles.map((article) => (
                    <MenuItem key={article.id} value={article.reference}>
                      {article.reference}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* OPERATOR */}
              <Box>
                <h4>{user.name}</h4>

                <Typography color="text.secondary">
                  ID: {user.operatorCode}
                </Typography>
              </Box>
            </div>
          </CardContent>
        </Card>

        {/* mesurement header */}

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <h6>Article Specifications</h6>

              {!selectedArticle ? (
                <Alert severity="info">
                  Select an article reference to display its dimensions.
                </Alert>
              ) : (
                <>
                  <h1>Reference: {selectedArticle.reference}</h1>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {/* DIRTY SIDE */}
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <h1>Dirty Side</h1>

                      <Stack spacing={1}>
                        <Typography>
                          Height:{' '}
                          {formatMeasurement(selectedArticle.dirtySide.height)}
                        </Typography>

                        <Typography color="text.secondary">
                          Allowed range:{' '}
                          {formatLimits(selectedArticle.dirtySide.height)}
                        </Typography>

                        <Typography>
                          Width:{' '}
                          {formatMeasurement(selectedArticle.dirtySide.width)}
                        </Typography>

                        <Typography color="text.secondary">
                          Allowed range:{' '}
                          {formatLimits(selectedArticle.dirtySide.width)}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* CLEAN SIDE */}
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <h1>Clean Side</h1>

                      <Stack spacing={1}>
                        <Typography>
                          Height:{' '}
                          {formatMeasurement(selectedArticle.cleanSide.height)}
                        </Typography>

                        <Typography color="text.secondary">
                          Allowed range:{' '}
                          {formatLimits(selectedArticle.cleanSide.height)}
                        </Typography>

                        <Typography>
                          Width:{' '}
                          {formatMeasurement(selectedArticle.cleanSide.width)}
                        </Typography>

                        <Typography color="text.secondary">
                          Allowed range:{' '}
                          {formatLimits(selectedArticle.cleanSide.width)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  {[
                    selectedArticle.dirtySide.height,
                    selectedArticle.dirtySide.width,
                    selectedArticle.cleanSide.height,
                    selectedArticle.cleanSide.width,
                  ].some((measurement) => measurement === null) && (
                    <Alert severity="warning">
                      Some dimensions for this article are not configured yet.
                    </Alert>
                  )}
                </>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* PRODUCTION */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <div>
                <h1>Production</h1>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setFormError(null)
                    setFormOpen(true)
                  }}
                >
                  Add Product
                </Button>
              </div>

              {formError && <Alert severity="error">{formError}</Alert>}

              {storeError && <Alert severity="error">{storeError}</Alert>}

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
                            {product.big ? (
                              <Chip label="BIG" color="error" size="small" />
                            ) : (
                              '—'
                            )}
                          </TableCell>

                          <TableCell align="center">
                            {product.small ? (
                              <Chip
                                label="SMALL"
                                color="warning"
                                size="small"
                                sx={{
                                  color: 'warning.dark',
                                  fontWeight: 'bold',
                                }}
                              />
                            ) : (
                              '—'
                            )}
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

      {/* ADD PRODUCT MODAL */}
      <ProductForm
        open={formOpen}
        loading={loading}
        selectedArticle={selectedArticle ?? null}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAddProduct}
      />
    </Container>
  )
}
