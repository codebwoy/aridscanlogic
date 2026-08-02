import { useState } from 'react'
import { toast } from 'sonner'
import { loginWithEmail, loginWithGoogle } from '@/lib/scanvault/auth'
import { BrandMark } from '@/components/shared/BrandLogo'
import { BRAND_SCANVAULT_NAME } from '@/lib/brand'

export default function Login({ onSuccess, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      onSuccess(await loginWithEmail(email, password))
    } catch {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="scanvault-shell flex h-full max-h-dvh flex-col justify-center overflow-y-auto overscroll-contain bg-[#0f0f0f] px-6 text-white">
      <div className="mx-auto w-full max-w-md">
      <BrandMark title={BRAND_SCANVAULT_NAME} subtitle="Sign in to your account" size={56} className="mb-2" />
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
        onClick={() => {
          toast.message('Demo only — not real Google sign-in')
          onSuccess(loginWithGoogle())
        }}
        className="mt-3 min-h-[48px] w-full rounded-xl border border-white/20 font-medium"
      >
        Continue with Google (demo)
      </button>
      <p className="mt-6 text-center text-sm text-slate-500">
        No account?{' '}
        <button type="button" onClick={onRegister} className="text-[#007AFF]">
          Register
        </button>
      </p>
      </div>
    </div>
  )
}
