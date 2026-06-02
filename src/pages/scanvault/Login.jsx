import { useState } from 'react'
import { toast } from 'sonner'
import { loginWithEmail, loginWithGoogle } from '@/lib/scanvault/auth'

export default function Login({ onSuccess, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = (e) => {
    e.preventDefault()
    try {
      onSuccess(loginWithEmail(email, password))
    } catch {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="scanvault-shell flex min-h-full flex-col justify-center bg-[#0f0f0f] px-6 text-white">
      <h1 className="text-3xl font-bold">ScanVault</h1>
      <p className="mt-1 text-slate-400">Sign in to your account</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
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
          required
        />
        <button type="submit" className="min-h-[48px] w-full rounded-xl bg-[#007AFF] font-semibold">
          Sign in
        </button>
      </form>
      <button
        type="button"
        onClick={() => onSuccess(loginWithGoogle())}
        className="mt-3 min-h-[48px] w-full rounded-xl border border-white/20 font-medium"
      >
        Continue with Google
      </button>
      <p className="mt-6 text-center text-sm text-slate-500">
        No account?{' '}
        <button type="button" onClick={onRegister} className="text-[#007AFF]">
          Register
        </button>
      </p>
    </div>
  )
}
