'use client'

import { useEffect, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import type { Article } from '@/types/article'
import type { CreateProductInput, ProductStatus } from '@/types/product'

type ProductFormData = Omit<CreateProductInput, 'number'>

interface ProductFormProps {
  open: boolean
  loading: boolean
  selectedArticle: Article | null
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
}

const initialValues = {
  dirtyHeight: '',
  dirtyWidth: '',
  cleanHeight: '',
  cleanWidth: '',
  status: 'CONFIRMED' as ProductStatus,
}

function MeasurementInput({
  label,
  value,
  onChange,
  nominal,
  tolerancePlus,
  toleranceMinus,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  nominal: number | undefined
  tolerancePlus: number | undefined
  toleranceMinus: number | undefined
}) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <div>
        <h6>{label}</h6>

        {nominal !== undefined && (
          <div>
            <h6>{nominal}</h6>

            <div>
              <Typography variant="caption" color="success.main">
                +{tolerancePlus ?? 0}
              </Typography>
              <Typography variant="caption" color="error.main">
                −{toleranceMinus ?? 0}
              </Typography>
            </div>
          </div>
        )}
      </div>

      <TextField
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        fullWidth
        slotProps={{
          htmlInput: { min: 0, step: 'any' },
        }}
      />
    </Box>
  )
}
export default function ProductForm({
  open,
  loading,
  selectedArticle,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [submitError, setSubmitError] = useState('')
  const [dirtyHeight, setDirtyHeight] = useState('')
  const [dirtyWidth, setDirtyWidth] = useState('')
  const [cleanHeight, setCleanHeight] = useState('')
  const [cleanWidth, setCleanWidth] = useState('')
  const [status, setStatus] = useState<ProductStatus>('CONFIRMED')

  const articleConfigured = Boolean(
    selectedArticle &&
      selectedArticle.dirtySide.height &&
      selectedArticle.dirtySide.width &&
      selectedArticle.cleanSide.height &&
      selectedArticle.cleanSide.width,
  )

  // Fill the inputs with the selected article's nominal dimensions.
  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      setDirtyHeight(
        selectedArticle?.dirtySide.height?.nominal.toString() ?? '',
      )
      setDirtyWidth(selectedArticle?.dirtySide.width?.nominal.toString() ?? '')
      setCleanHeight(
        selectedArticle?.cleanSide.height?.nominal.toString() ?? '',
      )
      setCleanWidth(selectedArticle?.cleanSide.width?.nominal.toString() ?? '')
      setStatus('CONFIRMED')
      setSubmitError('')
    }, 0)

    return () => clearTimeout(timer)
  }, [open, selectedArticle])

  const resetForm = () => {
    setDirtyHeight(initialValues.dirtyHeight)
    setDirtyWidth(initialValues.dirtyWidth)
    setCleanHeight(initialValues.cleanHeight)
    setCleanWidth(initialValues.cleanWidth)
    setStatus(initialValues.status)
    setSubmitError('')
  }

  const handleClose = () => {
    if (loading) return

    resetForm()
    onClose()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError('')

    if (!selectedArticle || !articleConfigured) {
      setSubmitError('Select an article with all four dimensions configured.')
      return
    }

    const values = [dirtyHeight, dirtyWidth, cleanHeight, cleanWidth]

    const measurements = values.map(Number)

    if (
      values.some((value) => value.trim() === '') ||
      measurements.some((value) => !Number.isFinite(value) || value <= 0)
    ) {
      setSubmitError('All four measurements must be greater than zero.')
      return
    }

    const checks = [
      {
        value: Number(dirtyHeight),
        spec: selectedArticle.dirtySide.height!,
      },
      {
        value: Number(dirtyWidth),
        spec: selectedArticle.dirtySide.width!,
      },
      {
        value: Number(cleanHeight),
        spec: selectedArticle.cleanSide.height!,
      },
      {
        value: Number(cleanWidth),
        spec: selectedArticle.cleanSide.width!,
      },
    ]

    const big = checks.some(
      ({ value, spec }) => value > spec.nominal + spec.tolerancePlus,
    )

    const small = checks.some(
      ({ value, spec }) => value < spec.nominal - spec.toleranceMinus,
    )

    const conform = checks.every(
      ({ value, spec }) =>
        value >= spec.nominal - spec.toleranceMinus &&
        value <= spec.nominal + spec.tolerancePlus,
    )

    try {
      await onSubmit({
        dirtyHeight: Number(dirtyHeight),
        dirtyWidth: Number(dirtyWidth),
        cleanHeight: Number(cleanHeight),
        cleanWidth: Number(cleanWidth),
        big,
        small,
        // An out-of-tolerance product cannot be marked confirmed.
        status: conform ? status : 'NOT_CONFIRMED',
      })

      resetForm()
    } catch {
      setSubmitError('Could not add the product. Please try again.')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add Product
        {selectedArticle ? ` — ${selectedArticle.reference}` : ''}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {!selectedArticle && (
              <Alert severity="info">
                Select an article reference on the dashboard first.
              </Alert>
            )}

            {selectedArticle && !articleConfigured && (
              <Alert severity="warning">
                This article does not have all four dimensions configured.
                Complete its specifications before adding products.
              </Alert>
            )}

            {submitError && <Alert severity="error">{submitError}</Alert>}

            {/* DIRTY SIDE */}
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Dirty Side
              </Typography>

              <MeasurementInput
                label="Height"
                value={dirtyHeight}
                onChange={setDirtyHeight}
                nominal={selectedArticle?.dirtySide.height?.nominal}
                tolerancePlus={selectedArticle?.dirtySide.height?.tolerancePlus}
                toleranceMinus={
                  selectedArticle?.dirtySide.height?.toleranceMinus
                }
              />

              <MeasurementInput
                label="Width"
                value={dirtyWidth}
                onChange={setDirtyWidth}
                nominal={selectedArticle?.dirtySide.width?.nominal}
                tolerancePlus={selectedArticle?.dirtySide.width?.tolerancePlus}
                toleranceMinus={
                  selectedArticle?.dirtySide.width?.toleranceMinus
                }
              />
            </Box>

            {/* CLEAN SIDE */}
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Clean Side
              </Typography>

              <MeasurementInput
                label="Height"
                value={cleanHeight}
                onChange={setCleanHeight}
                nominal={selectedArticle?.cleanSide.height?.nominal}
                tolerancePlus={selectedArticle?.cleanSide.height?.tolerancePlus}
                toleranceMinus={
                  selectedArticle?.cleanSide.height?.toleranceMinus
                }
              />

              <MeasurementInput
                label="Width"
                value={cleanWidth}
                onChange={setCleanWidth}
                nominal={selectedArticle?.cleanSide.width?.nominal}
                tolerancePlus={selectedArticle?.cleanSide.width?.tolerancePlus}
                toleranceMinus={
                  selectedArticle?.cleanSide.width?.toleranceMinus
                }
              />
            </Box>

            <Divider />

            <FormControl>
              <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>Status</FormLabel>

              <RadioGroup
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
              >
                <FormControlLabel
                  value="CONFIRMED"
                  control={<Radio />}
                  label="Confirm"
                />

                <FormControlLabel
                  value="NOT_CONFIRMED"
                  control={<Radio />}
                  label="Not Confirm"
                />
              </RadioGroup>

              <Typography variant="caption" color="text.secondary">
                Measurements outside the article tolerance are always saved as
                Not Confirmed.
              </Typography>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !articleConfigured}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
