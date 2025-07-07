import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginInput = z.infer<typeof loginSchema>

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const [error, setError] = useState('')

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', data)
      console.log("🚀 ~ onSubmit ~ res:", res)
      const saveToken = localStorage.setItem('token',res.data.token.token)
      console.log(saveToken)
      window.location.reload()

     
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-20 p-6 border shadow rounded bg-white"
    >
      <h2 className="text-xl font-semibold mb-6">Login</h2>

      <div className="mb-4">
        <label className="block mb-1">Email or Username</label>
        <input
          {...register('identifier')}
          className="w-full px-3 py-2 border rounded"
          placeholder="example@example.com"
        />
        {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full px-3 py-2 border rounded"
          placeholder="********"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

export default LoginForm
