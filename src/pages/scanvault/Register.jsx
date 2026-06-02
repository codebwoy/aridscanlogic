import { useState } from 'react'
import { toast } from 'sonner'
import { registerUser } from '@/lib/scanvault/auth'

export default function Register({ onSuccess, onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    try {
      onSuccess(await registerUser({ name, email, password }))
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    }
  }

  return (
    <div className="scanvault-shell flex min-h-full flex-col justify-center bg-[#0f0f0f] px-6 text-white">
      <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-bold sm:text-3xl">Create account</h1>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-h-[48px] w-full rounded-xl bg-white/10 px-4"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-[48px] w-full rounded-xl bg-white/10 px-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-[48px] w-full rounded-xl bg-white/10 px-4"
          minLength={8}
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="min-h-[48px] w-full rounded-xl bg-white/10 px-4"
          required
        />
        <button type="submit" className="min-h-[48px] w-full rounded-xl bg-[#007AFF] font-semibold">
          Register
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        Have an account?{' '}
        <button type="button" onClick={onLogin} className="text-[#007AFF]">
          Sign in
        </button>
      </p>
      </div>
    </div>
  )
}
