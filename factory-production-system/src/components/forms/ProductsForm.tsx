'use client'

import { useState } from 'react'

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Box,
  Divider,
  Alert,
} from '@mui/material'

import { CreateProductInput, ProductStatus } from '@/types/product'

type ProductFormData = Omit<CreateProductInput, 'number'>

interface ProductFormProps {
  open: boolean
  loading: boolean
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
}

const initialValues = {
  dirtyHeight: '',
  dirtyWidth: '',
  cleanHeight: '',
  cleanWidth: '',
  big: false,
  small: false,
  status: 'CONFIRMED' as ProductStatus,
}

export default function ProductForm({
  open,
  loading,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [submitError, setSubmitError] = useState('')
  const [dirtyHeight, setDirtyHeight] = useState('')
  const [dirtyWidth, setDirtyWidth] = useState('')
  const [cleanHeight, setCleanHeight] = useState('')
  const [cleanWidth, setCleanWidth] = useState('')
  const [big, setBig] = useState(false)
  const [small, setSmall] = useState(false)
  const [status, setStatus] = useState<ProductStatus>('CONFIRMED')

  const resetForm = () => {
    setDirtyHeight(initialValues.dirtyHeight)
    setDirtyWidth(initialValues.dirtyWidth)
    setCleanHeight(initialValues.cleanHeight)
    setCleanWidth(initialValues.cleanWidth)
    setBig(initialValues.big)
    setSmall(initialValues.small)
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

    const measurements = [
      Number(dirtyHeight),
      Number(dirtyWidth),
      Number(cleanHeight),
      Number(cleanWidth),
    ]

    if (
      [dirtyHeight, dirtyWidth, cleanHeight, cleanWidth].some(
        (value) => value.trim() === '',
      ) ||
      measurements.some((value) => !Number.isFinite(value) || value <= 0)
    ) {
      setSubmitError('All four measurements must be greater than zero.')
      return
    }

    try {
      await onSubmit({
        dirtyHeight: Number(dirtyHeight),
        dirtyWidth: Number(dirtyWidth),
        cleanHeight: Number(cleanHeight),
        cleanWidth: Number(cleanWidth),
        big,
        small,
        status,
      })

      resetForm()
      setSubmitError('')
    } catch {
      setSubmitError('Could not add the product. Please try again.')
    }
  }
  return (
    <>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Product</DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3} sx={{ pt: 1 }}>
              {/* DIRTY SIDE */}
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <h1>Dirty Side</h1>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Height"
                    type="number"
                    value={dirtyHeight}
                    onChange={(e) => setDirtyHeight(e.target.value)}
                    required
                    fullWidth
                    slotProps={{
                      htmlInput: { min: 0, step: 'any' },
                    }}
                  />

                  <TextField
                    label="Width"
                    type="number"
                    value={dirtyWidth}
                    onChange={(e) => setDirtyWidth(e.target.value)}
                    required
                    fullWidth
                    slotProps={{
                      htmlInput: { min: 0, step: 'any' },
                    }}
                  />
                </Stack>
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
                <h1>Clean Side</h1>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Height"
                    type="number"
                    value={cleanHeight}
                    onChange={(e) => setCleanHeight(e.target.value)}
                    required
                    fullWidth
                    slotProps={{
                      htmlInput: { min: 0, step: 'any' },
                    }}
                  />

                  <TextField
                    label="Width"
                    type="number"
                    value={cleanWidth}
                    onChange={(e) => setCleanWidth(e.target.value)}
                    required
                    fullWidth
                    slotProps={{
                      htmlInput: { min: 0, step: 'any' },
                    }}
                  />
                </Stack>
              </Box>

              <Divider />

              {/* BIG / SMALL */}
              <Box>
                <h1>Product Type</h1>

                <Stack direction="row" spacing={2}>
                  <FormControlLabel
                    label="Big"
                    control={
                      <Checkbox
                        checked={big}
                        onChange={(e) => setBig(e.target.checked)}
                      />
                    }
                  />

                  <FormControlLabel
                    label="Small"
                    control={
                      <Checkbox
                        checked={small}
                        onChange={(e) => setSmall(e.target.checked)}
                      />
                    }
                  />
                </Stack>
              </Box>

              {/* STATUS */}
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
              </FormControl>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
