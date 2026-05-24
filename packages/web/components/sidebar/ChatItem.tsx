"use client"

import { useEffect, useRef, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  GitBranch,
  GitMerge,
  MoreHorizontal,
  Pencil,
  Pin,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { NEW_REPOSITORY } from "@/lib/types"
import type { Chat } from "@/lib/types"
import { useClickOutside } from "@/lib/hooks/useClickOutside"
import { Button } from "@/components/ui/button"
import {
  StatusIndicator,
  chatStatusToStatus,
} from "@/components/ui/status-pill"
import { AgentIcon } from "@/components/icons/agent-icons"
import { hasMergedSuccessfully } from "./utils"

export interface ChatItemProps {
  chat: Chat
  isActive: boolean
  collapsed: boolean
  isDeleting: boolean
  isUnseen: boolean
  depth?: number
  hasChildren?: boolean
  isExpanded?: boolean
  onToggleExpanded?: () => void
  onSelect: () => void
  onDelete: () => void
  onRename: (newName: string) => void
  onMerge?: () => void
  onRebase?: () => void
  // Drag-to-merge props (optional; when omitted, drag is disabled).
  isDragSource?: boolean
  isDropTarget?: boolean
  onDragStartRow?: () => void
  onDragEndRow?: () => void
  onDragEnterRow?: () => void
  onDragOverRow?: (e: React.DragEvent) => void
  onDragLeaveRow?: () => void
  onDropRow?: () => void
}

function formatRelativeTime(ts: number): string {
  const now = Date.now()
  const diff = Math.max(0, now - ts)
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d`
  const wk = Math.floor(day / 7)
  if (wk < 4) return `${wk}w`
  const mo = Math.floor(day / 30)
  if (mo < 12) return `${mo}mo`
  const yr = Math.floor(day / 365)
  return `${yr}y`
}

export function ChatItem({
  chat,
  isActive,
  collapsed,
  isDeleting,
  isUnseen,
  depth = 0,
  hasChildren = false,
  isExpanded = true,
  onToggleExpanded,
  onSelect,
  onDelete,
  onRename,
  onMerge,
  onRebase,
  isDragSource,
  isDropTarget,
  onDragStartRow,
  onDragEndRow,
  onDragEnterRow,
  onDragOverRow,
  onDragLeaveRow,
  onDropRow,
}: ChatItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const displayName = chat.displayName || "Untitled"

  const startEditing = () => {
    setEditName(displayName)
    setIsEditing(true)
    setMenuOpen(false)
  }

  const saveEdit = () => {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== displayName) {
      onRename(trimmed)
    }
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditName("")
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen)

  const indentPx = collapsed ? 0 : depth * 28
  const draggable = !!(
    onDragStartRow &&
    chat.branch &&
    chat.repo !== NEW_REPOSITORY
  )

  // Collapsed (rail) mode keeps the existing single-icon look.
  if (collapsed) {
    return (
      <div
        data-testid="chat-item"
        data-chat-id={chat.id}
        onClick={isDeleting ? undefined : onSelect}
        className={cn(
          "flex items-center justify-center rounded-md p-2 transition-colors select-none",
          isDeleting
            ? "cursor-not-allowed opacity-50"
            : isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        <AgentIcon agent={(chat.agent ?? "claude-code") as Parameters<typeof AgentIcon>[0]["agent"]} className="size-4" />
      </div>
    )
  }

  const status = chatStatusToStatus({
    status: chat.status,
    isUnseen,
    queuedCount: chat.queuedMessages?.length,
  })

  const hasMerged = hasMergedSuccessfully(chat.messages)
  const effectiveStatus = hasMerged && status === "complete" ? "complete" : status

  const repoShort =
    chat.repo === NEW_REPOSITORY
      ? "local"
      : (chat.repo.split("/").pop() ?? chat.repo)

  return (
    <div
      draggable={draggable}
      data-testid="chat-item"
      data-chat-id={chat.id}
      className={cn(
        "group relative select-none rounded-md transition-colors",
        isDeleting && "cursor-not-allowed opacity-50",
        !isDeleting &&
          (isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-sidebar-accent/50 text-sidebar-foreground"),
        menuOpen && "bg-sidebar-accent/50",
        isDragSource && "opacity-50",
        isDropTarget && "ring-2 ring-primary/60 bg-primary/10"
      )}
      style={indentPx ? { marginLeft: `${indentPx}px` } : undefined}
      onMouseDown={(e) => {
        if (e.detail >= 2) e.preventDefault()
      }}
      onDragStart={
        draggable
          ? (e) => {
              e.dataTransfer.effectAllowed = "move"
              try {
                e.dataTransfer.setData("text/plain", chat.id)
              } catch {}
              onDragStartRow?.()
            }
          : undefined
      }
      onDragEnd={draggable ? () => onDragEndRow?.() : undefined}
      onDragEnter={
        onDragEnterRow
          ? (e) => {
              e.preventDefault()
              onDragEnterRow()
            }
          : undefined
      }
      onDragOver={
        onDragOverRow
          ? (e) => {
              onDragOverRow(e)
              onDragEnterRow?.()
            }
          : undefined
      }
      onDragLeave={
        onDragLeaveRow
          ? (e) => {
              const related = e.relatedTarget as Node | null
              if (related && e.currentTarget.contains(related)) return
              onDragLeaveRow()
            }
          : undefined
      }
      onDrop={
        onDropRow
          ? (e) => {
              e.preventDefault()
              onDropRow()
            }
          : undefined
      }
      onClick={isDeleting ? undefined : onSelect}
      onDoubleClick={
        hasChildren && !isDeleting
          ? (e) => {
              e.stopPropagation()
              onToggleExpanded?.()
            }
          : undefined
      }
    >
      <div className="flex flex-col gap-0.5 px-2 py-1.5 pr-8">
        {/* Row 1: status + title (+ expander) */}
        <div className="flex items-center gap-1.5">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleExpanded?.()
              }}
              className="flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-sm text-foreground/80 hover:text-primary"
              aria-label={isExpanded ? "Collapse children" : "Expand children"}
            >
              {isExpanded ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
            </button>
          )}
          <div className="flex size-3 shrink-0 items-center justify-center">
            <StatusIndicator status={effectiveStatus} />
          </div>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit()
                if (e.key === "Escape") cancelEdit()
              }}
              onBlur={saveEdit}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 flex-1 rounded-sm border-0 bg-transparent px-1 text-sm font-medium outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder={displayName}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          ) : (
            <p
              className="min-w-0 flex-1 truncate text-sm font-medium"
              title={displayName}
            >
              {displayName}
            </p>
          )}
        </div>

        {/* Row 2: time · repo + agent icon */}
        <div className="flex items-center justify-between gap-2 pl-[18px]">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="shrink-0"
              title={new Date(chat.updatedAt).toLocaleString()}
            >
              {formatRelativeTime(chat.lastActiveAt ?? chat.updatedAt)}
            </span>
            {chat.branch && chat.repo !== NEW_REPOSITORY && (
              <>
                <span className="shrink-0">·</span>
                <span className="truncate font-mono" title={chat.branch}>
                  {chat.branch}
                </span>
              </>
            )}
            {chat.repo !== NEW_REPOSITORY && !chat.branch && (
              <>
                <span className="shrink-0">·</span>
                <span className="truncate" title={chat.repo}>
                  {repoShort}
                </span>
              </>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {chat.queuedMessages && chat.queuedMessages.length > 0 && (
              <span
                title={`${chat.queuedMessages.length} queued`}
                className="rounded-full bg-warning/15 px-1.5 text-[10px] font-medium text-warning"
              >
                {chat.queuedMessages.length}
              </span>
            )}
            <AgentIcon
              agent={(chat.agent ?? "claude-code") as Parameters<typeof AgentIcon>[0]["agent"]}
              className="size-3.5 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Action menu */}
      <div
        ref={menuRef}
        className={cn(
          "absolute right-0.5 top-1/2 -translate-y-1/2 transition-opacity",
          menuOpen ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100"
        )}
        onClick={(e) => e.preventDefault()}
      >
        <Button
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
          aria-label="Chat actions"
          className="size-6"
        >
          <MoreHorizontal className="size-3.5 text-muted-foreground" />
        </Button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-md">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent"
            >
              <Pin className="size-3.5" />
              Pin
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                startEditing()
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent"
            >
              <Pencil className="size-3.5" />
              Rename
            </button>
            {onMerge && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMerge()
                  setMenuOpen(false)
                }}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent"
              >
                <GitMerge className="size-3.5" />
                Merge
              </button>
            )}
            {onRebase && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRebase()
                  setMenuOpen(false)
                }}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent"
              >
                <GitBranch className="size-3.5" />
                Rebase
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
                setMenuOpen(false)
              }}
              disabled={isDeleting}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-accent disabled:cursor-not-allowed"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
