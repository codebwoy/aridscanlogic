import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { listFolders, saveFolder, listDocuments } from '@/lib/scanvault/store'
import { canCreateFolder } from '@/lib/scanvault/limits'

const COLORS = ['#007AFF', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6']

export default function FoldersTab({ user, onOpenFolder, onUpgrade }) {
  const [folders, setFolders] = useState(listFolders())
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📂')
  const [color, setColor] = useState(COLORS[0])

  const refresh = () => setFolders(listFolders())

  const create = () => {
    const check = canCreateFolder(user)
    if (!check.ok) {
      toast.error(check.message)
      onUpgrade?.()
      return
    }
    if (!name.trim()) return
    saveFolder({ name: name.trim(), emoji, color })
    setName('')
    setCreating(false)
    refresh()
    toast.success('Folder created')
  }

  const docsInFolder = (folderId) => listDocuments().filter((d) => d.folderId === folderId)

  const folderSize = (folderId) => {
    const docs = docsInFolder(folderId)
    return docs.reduce((s, d) => s + (d.fileSizeBytes || 0), 0)
  }

  return (
    <div className="px-4 pb-4">
      <div className="safe-top mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Folders</h1>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex min-h-[48px] items-center gap-1 rounded-xl bg-[#007AFF] px-3 text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>
      {creating && (
        <div className="mb-4 space-y-2 rounded-xl bg-white/5 p-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            className="w-full rounded-lg bg-black/30 px-3 py-2 text-sm"
          />
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="w-16 rounded-lg bg-black/30 px-3 py-2 text-center text-xl"
          />
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full ${color === c ? 'ring-2 ring-white' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button type="button" onClick={create} className="w-full rounded-xl bg-[#007AFF] py-2 text-sm">
            Create
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {folders.map((f) => {
          const count = docsInFolder(f.id).length
          const size = folderSize(f.id)
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onOpenFolder?.(f)}
              className="rounded-xl bg-white/5 p-4 text-left"
              style={{ borderLeft: `4px solid ${f.color}` }}
            >
              <span className="text-2xl">{f.emoji}</span>
              <p className="mt-2 font-medium">{f.name}</p>
              <p className="text-xs text-slate-500">
                {count} docs · {(size / 1024).toFixed(0)} KB
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
