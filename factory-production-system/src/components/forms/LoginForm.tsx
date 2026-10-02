'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema, LoginSchema } from '@/lib/login-schema'

import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'

import { machines } from '@/mocks/machines'

export default function LoginForm() {
  const router = useRouter()

  const login = useAuthStore((state) => state.login)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      operatorCode: '',
      password: '',
      machineId: '',
    },
  })

  const onSubmit = async (data: LoginSchema) => {
    console.log(data)
    try {
      setLoading(true)
      setError('')

      const result = await authService.login(data)

      login(result.token, result.user, result.machineId)

      if (result.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/operator')
      }
    } catch (err) {
      setError('Invalid Operator Code or Password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          width: '100%',
          borderRadius: 4,
          boxShadow: 5,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Stack spacing={3}>
            <Stack spacing={2}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 60,
                  height: 60,
                }}
              >
                <LockOutlinedIcon />
              </Avatar>

              <h1>Factory System</h1>

              <Typography color="text.secondary">
                Production Monitoring
              </Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Controller
                  name="operatorCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Operator Code"
                      fullWidth
                      error={!!errors.operatorCode}
                      helperText={errors.operatorCode?.message}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      label="Password"
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  name="machineId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Machine</InputLabel>

                      <Select
                        {...field}
                        label="Machine"
                        error={!!errors.machineId}
                      >
                        {machines.map((machine) => (
                          <MenuItem key={machine.id} value={machine.id}>
                            {machine.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{
                    height: 50,
                    borderRadius: 2,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Login'
                  )}
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}
