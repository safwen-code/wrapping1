'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <CardContent>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              {/* MACHINE */}
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary">
                  Machine
                </Typography>

                <h6 style={{ fontWeight: 'bold' }}>
                  {machine?.name ?? 'Wrapping'}
                </h6>

                <Box>
                  <Chip
                    label="ACTIVE"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Stack>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: 'none', md: 'block' } }}
              />

              {/* ARTICLE SELECT */}
              <FormControl
                size="small"
                sx={{
                  width: '100%',
                  maxWidth: { xs: '100%', md: 280 },
                }}
              >
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

              <Divider
                orientation="vertical"
                flexItem
                sx={{ display: { xs: 'none', md: 'block' } }}
              />

              {/* OPERATOR */}
              <Stack spacing={0.5}>
                <Typography variant="overline" color="text.secondary">
                  Operator
                </Typography>

                <h6 style={{ fontWeight: 'bold' }}>{user.name}</h6>

                <Typography variant="body2" color="text.secondary">
                  ID: {user.operatorCode}
                </Typography>
              </Stack>
            </div>
          </CardContent>
        </Card>
        {/* mesurement header */}

        {/* MEASUREMENT HEADER */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}
        >
          <CardContent>
            <Stack spacing={3}>
              {/* SECTION TITLE */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <h6 style={{ fontWeight: 'bold' }}>Article Specifications</h6>

                  <Typography variant="body2" color="text.secondary">
                    Dimensions and production overview
                  </Typography>
                </Box>

                {selectedArticle && (
                  <Chip
                    label={selectedArticle.reference}
                    color="primary"
                    variant="outlined"
                  />
                )}
              </div>

              {/* PRODUCTION STATISTICS */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, minmax(0, 1fr))',
                  },
                  gap: 2,
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'background.default',
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Total Products
                    </Typography>

                    <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                      {products.length}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Products loaded for this machine
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'warning.50',
                    borderColor: 'warning.light',
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Not Conformed
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="warning.dark"
                      sx={{ mt: 1 }}
                    >
                      {
                        products.filter(
                          (product) => product.status === 'NOT_CONFIRMED',
                        ).length
                      }
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Products requiring attention
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* ARTICLE DIMENSIONS */}
              {!selectedArticle ? (
                <Alert severity="info">
                  Select an article reference to display its dimensions.
                </Alert>
              ) : (
                <Stack spacing={2}>
                  <h6 style={{ fontWeight: 'bold' }}>
                    Reference: {selectedArticle.reference}
                  </h6>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, minmax(0, 1fr))',
                      },
                      gap: 2,
                    }}
                  >
                    {/* DIRTY SIDE */}
                    <Box
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        minWidth: 0,
                      }}
                    >
                      <h6 style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Dirty Side
                      </h6>

                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Height
                          </Typography>

                          <h6 style={{ fontWeight: 'medium' }}>
                            {formatMeasurement(
                              selectedArticle.dirtySide.height,
                            )}
                          </h6>

                          <Typography variant="caption" color="text.secondary">
                            Allowed range:{' '}
                            {formatLimits(selectedArticle.dirtySide.height)}
                          </Typography>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Width
                          </Typography>

                          <h6 style={{ fontWeight: 'medium' }}>
                            {formatMeasurement(selectedArticle.dirtySide.width)}
                          </h6>

                          <Typography variant="caption" color="text.secondary">
                            Allowed range:{' '}
                            {formatLimits(selectedArticle.dirtySide.width)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* CLEAN SIDE */}
                    <Box
                      sx={{
                        p: { xs: 2, sm: 2.5 },
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        minWidth: 0,
                      }}
                    >
                      <h6 style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Clean Side
                      </h6>

                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Height
                          </Typography>

                          <h6 style={{ fontWeight: 'medium' }}>
                            {formatMeasurement(
                              selectedArticle.cleanSide.height,
                            )}
                          </h6>

                          <Typography variant="caption" color="text.secondary">
                            Allowed range:{' '}
                            {formatLimits(selectedArticle.cleanSide.height)}
                          </Typography>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Width
                          </Typography>

                          <h6 style={{ fontWeight: 'medium' }}>
                            {formatMeasurement(selectedArticle.cleanSide.width)}
                          </h6>

                          <Typography variant="caption" color="text.secondary">
                            Allowed range:{' '}
                            {formatLimits(selectedArticle.cleanSide.width)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>

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
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* PRODUCTION header */}
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <h5 style={{ fontWeight: 'bold' }}>Production</h5>

                  <Typography variant="body2" color="text.secondary">
                    Manage and monitor production products
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setFormError(null)
                    setFormOpen(true)
                  }}
                  sx={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    borderRadius: 2,
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
