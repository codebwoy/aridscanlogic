import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  BarChart3,
  ChevronRight,
  LogOut,
  RefreshCw,
  Search,
  Users,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import BrandLogo from '@/components/shared/BrandLogo'
import { BRAND_SUITE_NAME } from '@/lib/brand'
import { clearAdminSecret } from '@/lib/activity/trackActivity'
import {
  fetchAdminActivity,
  fetchAdminStats,
  fetchAdminUserDetail,
  fetchAdminUsers,
} from '@/lib/admin/adminApi'

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'activity', label: 'Activity', icon: Activity },
]

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return String(value)
  }
}

function formatAction(action) {
  return action?.replace(/\./g, ' · ') || '—'
}

function UserDetailPanel({ userId, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAdminUserDetail(userId)
      .then((data) => {
        if (!cancelled) setDetail(data)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [userId])

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-lg flex-col border-l border-slate-700 bg-[#0f172a] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">User detail</p>
            <p className="font-semibold text-white">{detail?.email || userId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading && <p className="text-sm text-slate-400">Loading…</p>}
          {!loading && detail && (
            <>
              <section className="grid grid-cols-2 gap-3">
                <StatCard label="Records" value={detail.recordCount} />
                <StatCard
                  label="Last activity"
                  value={formatDate(detail.recentActivity?.[0]?.created_at || detail.lastRecordAt)}
                />
              </section>

              <section>
                <h3 className="mb-2 text-sm font-semibold text-slate-300">Profile</h3>
                <dl className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">User ID</dt>
                    <dd className="truncate font-mono text-xs text-slate-300">{detail.userId}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="text-slate-200">{detail.email || '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Signed up</dt>
                    <dd className="text-slate-200">{formatDate(detail.signedUpAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Last sign-in</dt>
                    <dd className="text-slate-200">{formatDate(detail.lastSignInAt)}</dd>
                  </div>
                </dl>
              </section>

              {detail.entities?.length > 0 && (
                <section>
                  <h3 className="mb-2 text-sm font-semibold text-slate-300">Entities</h3>
                  <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/50">
                    {detail.entities.map((row) => (
                      <li key={row.entity_type} className="flex items-center justify-between px-4 py-3 text-sm">
                        <span className="text-slate-300">{row.entity_type}</span>
                        <span className="font-mono text-brand-400">{row.count}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {detail.recentActivity?.length > 0 && (
                <section>
                  <h3 className="mb-2 text-sm font-semibold text-slate-300">Recent activity</h3>
                  <ul className="space-y-2">
                    {detail.recentActivity.slice(0, 15).map((ev) => (
                      <li
                        key={ev.id}
                        className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-brand-300">{formatAction(ev.action)}</span>
                          <span className="text-slate-500">{formatDate(ev.created_at)}</span>
                        </div>
                        {ev.entity_type && (
                          <p className="mt-1 text-slate-500">
                            {ev.entity_type}
                            {ev.entity_id ? ` · ${ev.entity_id.slice(0, 12)}…` : ''}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard({ onExit }) {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState({ users: [], total: 0 })
  const [activity, setActivity] = useState({ events: [], total: 0 })
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsData, usersData, activityData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers({ search: search.trim() }),
        fetchAdminActivity({ limit: 40 }),
      ])
      setStats(statsData)
      setUsers(usersData)
      setActivity(activityData)
    } catch (err) {
      toast.error(err.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    loadData()
  }, [loadData])

  const entityMax = useMemo(() => {
    if (!stats?.entityTotals?.length) return 1
    return Math.max(...stats.entityTotals.map((r) => r.count), 1)
  }, [stats])

  const handleLogout = () => {
    clearAdminSecret()
    onExit?.()
  }

  return (
    <div className="safe-top flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#0a0f1a] text-slate-100">
      <header className="shrink-0 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold">{BRAND_SUITE_NAME}</p>
              <p className="text-[11px] text-brand-400">Admin Console</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                App
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 px-4 pb-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === id
                  ? 'bg-brand-600/20 text-brand-300'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total users" value={stats?.totalUsers ?? '—'} sub="Distinct user IDs in DB" />
              <StatCard label="Active (24h)" value={stats?.activeLast24h ?? '—'} sub="Users with recent events" />
              <StatCard label="Events (7d)" value={stats?.activityEvents7d ?? '—'} sub="Tracked activities" />
              <StatCard
                label="Registered"
                value={stats?.registeredUsers ?? '—'}
                sub="Supabase auth.users (if available)"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="premium-card p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Entity totals
                </h2>
                {!stats?.entityTotals?.length && (
                  <p className="text-sm text-slate-500">No synced records yet.</p>
                )}
                <ul className="space-y-3">
                  {stats?.entityTotals?.map((row) => (
                    <li key={row.entity_type}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-slate-300">{row.entity_type}</span>
                        <span className="font-mono text-slate-400">{row.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-brand-500/80"
                          style={{ width: `${(row.count / entityMax) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="premium-card p-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Top actions (7 days)
                </h2>
                {!stats?.topActions7d?.length && (
                  <p className="text-sm text-slate-500">No activity logged yet.</p>
                )}
                <ul className="divide-y divide-slate-800">
                  {stats?.topActions7d?.map((row) => (
                    <li key={row.action} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-slate-300">{formatAction(row.action)}</span>
                      <span className="rounded-full bg-slate-800 px-2.5 py-0.5 font-mono text-xs text-brand-300">
                        {row.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-white">Users</h2>
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by email or user ID…"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Records</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Events</th>
                    <th className="px-4 py-3 font-medium">Last seen</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {!users.users?.length && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No users found. Users appear after Supabase sync or activity tracking.
                      </td>
                    </tr>
                  )}
                  {users.users?.map((user) => (
                    <tr key={user.user_id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{user.email || user.user_id}</p>
                        {user.email && (
                          <p className="font-mono text-[11px] text-slate-500">{user.user_id}</p>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 font-mono text-slate-300 md:table-cell">
                        {user.record_count}
                      </td>
                      <td className="hidden px-4 py-3 font-mono text-slate-300 lg:table-cell">
                        {user.activity_count}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(user.last_seen_at)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user.user_id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-brand-400 hover:bg-brand-950/50"
                        >
                          Details
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500">{users.total} user(s) total</p>
          </div>
        )}

        {tab === 'activity' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Activity feed</h2>
            <ul className="space-y-2">
              {!activity.events?.length && (
                <li className="rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-8 text-center text-sm text-slate-500">
                  No activity events yet.
                </li>
              )}
              {activity.events?.map((ev) => (
                <li
                  key={ev.id}
                  className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-brand-300">{formatAction(ev.action)}</p>
                    <p className="text-xs text-slate-500">
                      {ev.email || ev.user_id}
                      {ev.entity_type ? ` · ${ev.entity_type}` : ''}
                    </p>
                  </div>
                  <time className="text-xs text-slate-500">{formatDate(ev.created_at)}</time>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500">{activity.total} event(s) total</p>
          </div>
        )}
      </main>

      {selectedUser && (
        <UserDetailPanel userId={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}
