"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, ChevronDown, Key, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useModals } from "@/lib/contexts"
import type { Agent, ModelOption, CredentialFlags, Chat } from "@/lib/types"
import { agentModels, agentLabels, getModelLabel, hasCredentialsForModel, getDefaultAgent, getDefaultModelForAgent, ALL_AGENTS } from "@/lib/types"
import { AgentIcon } from "../icons/agent-icons"
import { MobileSelect } from "../ui/MobileBottomSheet"
import type { HighlightKey } from "../modals/SettingsModal"

// Trigger pill — matches Terragon's ResponsiveCombobox chip on a tighter scale.
const triggerClass =
  "inline-flex items-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring cursor-pointer"

// Menu item — matches Terragon's Select/Command item: check on selected, hover bg.
const itemClass =
  "relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-7 text-sm text-foreground outline-none hover:bg-accent hover:text-accent-foreground"

// =============================================================================
// AgentModelSelector - Dropdown selectors for agent and model
// =============================================================================

interface AgentModelSelectorProps {
  chat: Chat | null
  credentialFlags: CredentialFlags
  currentAgent: Agent
  currentModel: string
  onUpdateChat?: (updates: Partial<Chat>) => void
  showClaudeLimitDialog: () => void
  isMobile: boolean
  /** Called when a dropdown opens, so parent can close other dropdowns */
  onDropdownOpen?: () => void
  /** When true, close all dropdowns (controlled by parent) */
  closeDropdowns?: boolean
}

const agents = ALL_AGENTS

export function AgentModelSelector({
  chat,
  credentialFlags,
  currentAgent,
  currentModel,
  onUpdateChat,
  showClaudeLimitDialog,
  isMobile,
  onDropdownOpen,
  closeDropdowns,
}: AgentModelSelectorProps) {
  const modals = useModals()

  const [showAgentDropdown, setShowAgentDropdown] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [showAgentSheet, setShowAgentSheet] = useState(false)
  const [showModelSheet, setShowModelSheet] = useState(false)

  const availableModels = agentModels[currentAgent] ?? []
  const selectedModelConfig = availableModels.find(m => m.value === currentModel)
  const hasRequiredCredentials = selectedModelConfig
    ? hasCredentialsForModel(selectedModelConfig, credentialFlags, currentAgent)
    : true

  // Close dropdowns when parent requests it
  useEffect(() => {
    if (closeDropdowns) {
      setShowAgentDropdown(false)
      setShowModelDropdown(false)
    }
  }, [closeDropdowns])

  // Close dropdowns when clicking outside (desktop only)
  useEffect(() => {
    if (isMobile) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setShowAgentDropdown(false)
        setShowModelDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMobile])

  const handleAgentChange = useCallback((agent: Agent) => {
    setShowAgentDropdown(false)
    setShowAgentSheet(false)

    // Block switching to claude-code if daily limit is exceeded
    if (agent === "claude-code" && credentialFlags.CLAUDE_DAILY_LIMIT_EXCEEDED) {
      showClaudeLimitDialog()
      return
    }

    // Update chat's agent if possible
    if (chat && onUpdateChat) {
      const models = agentModels[agent] ?? []
      const newModel = models[0]?.value || currentModel
      onUpdateChat({ agent, model: newModel })

      // Check if the new model requires credentials we don't have
      const newModelConfig = models.find(m => m.value === newModel)
      if (newModelConfig && !hasCredentialsForModel(newModelConfig, credentialFlags, agent)) {
        // Open settings with the required key highlighted
        const requiredKey = newModelConfig.requiresKey
        if (requiredKey && requiredKey !== "none") {
          modals.openSettings(requiredKey as HighlightKey)
        }
      }
    }
  }, [chat, currentModel, credentialFlags, onUpdateChat, showClaudeLimitDialog, modals])

  const handleModelChange = useCallback((model: string) => {
    setShowModelDropdown(false)
    setShowModelSheet(false)
    if (chat && onUpdateChat) {
      onUpdateChat({ model })

      // Check if the new model requires credentials we don't have
      const newModelConfig = availableModels.find(m => m.value === model)
      if (newModelConfig && !hasCredentialsForModel(newModelConfig, credentialFlags, currentAgent)) {
        // Open settings with the required key highlighted
        const requiredKey = newModelConfig.requiresKey
        if (requiredKey && requiredKey !== "none") {
          modals.openSettings(requiredKey as HighlightKey)
        }
      }
    }
  }, [chat, availableModels, credentialFlags, currentAgent, onUpdateChat, modals])

  // Prepare agent options for mobile bottom sheet
  const agentOptions = agents.map(agent => ({
    value: agent,
    label: agentLabels[agent],
    icon: <AgentIcon agent={agent} className="h-5 w-5" />,
  }))

  // Prepare model options for mobile bottom sheet
  const modelOptions = availableModels.map((model: ModelOption) => {
    const modelHasCredentials = hasCredentialsForModel(model, credentialFlags, currentAgent)
    const needsKey = model.requiresKey !== "none" && !modelHasCredentials
    return {
      value: model.value,
      label: model.label,
      description: needsKey ? "Requires API key" : undefined,
      icon: needsKey ? <Key className="h-5 w-5 text-destructive" /> : undefined,
    }
  })

  if (isMobile) {
    return (
      <>
        {/* Agent selector - Mobile */}
        <button
          onClick={() => setShowAgentSheet(true)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title={agentLabels[currentAgent]}
        >
          <AgentIcon agent={currentAgent} className="h-4 w-4" />
          <span className="hidden @[18rem]/row2:inline">{agentLabels[currentAgent]}</span>
          <ChevronDown className="h-4 w-4 hidden @[18rem]/row2:block" />
        </button>

        {/* Model selector - Mobile */}
        <button
          onClick={() => setShowModelSheet(true)}
          className={cn(
            "flex items-center gap-1 text-sm transition-colors cursor-pointer",
            !hasRequiredCredentials ? "text-destructive hover:text-destructive" : "text-muted-foreground hover:text-foreground"
          )}
          title={getModelLabel(currentAgent, currentModel)}
        >
          {!hasRequiredCredentials && <Key className="h-4 w-4" />}
          <Cpu className="h-4 w-4 @[18rem]/row2:hidden" />
          <span className="hidden @[18rem]/row2:inline">{getModelLabel(currentAgent, currentModel)}</span>
          <ChevronDown className="h-4 w-4 hidden @[18rem]/row2:block" />
        </button>

        {/* Mobile Bottom Sheets */}
        <MobileSelect
          open={showAgentSheet}
          onClose={() => setShowAgentSheet(false)}
          title="Select Agent"
          options={agentOptions}
          value={currentAgent}
          onChange={(value) => handleAgentChange(value as Agent)}
        />
        <MobileSelect
          open={showModelSheet}
          onClose={() => setShowModelSheet(false)}
          title="Select Model"
          options={modelOptions}
          value={currentModel}
          onChange={handleModelChange}
        />
      </>
    )
  }

  // Desktop dropdowns
  return (
    <>
      {/* Agent selector - Desktop */}
      <div className="relative" data-dropdown>
        <button
          onClick={(e) => {
            e.stopPropagation()
            const opening = !showAgentDropdown
            setShowAgentDropdown(opening)
            setShowModelDropdown(false)
            if (opening) onDropdownOpen?.()
          }}
          className={triggerClass}
          title={agentLabels[currentAgent]}
        >
          <AgentIcon agent={currentAgent} className="size-3.5" />
          <span className="hidden @[32rem]:inline">
            {agentLabels[currentAgent]}
          </span>
          <ChevronDown className="size-3.5 opacity-50" />
        </button>
        {showAgentDropdown && (
          <div className="absolute bottom-full right-0 z-50 mb-1 w-44 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
            {agents.map((agent) => {
              const isSelected = agent === currentAgent
              return (
                <button
                  key={agent}
                  onClick={() => handleAgentChange(agent)}
                  className={itemClass}
                >
                  <span className="absolute left-2 flex size-3.5 items-center justify-center">
                    {isSelected && <Check className="size-3.5" />}
                  </span>
                  <AgentIcon agent={agent} className="size-3.5" />
                  <span>{agentLabels[agent]}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Model selector - Desktop */}
      <div className="relative" data-dropdown>
        <button
          onClick={(e) => {
            e.stopPropagation()
            const opening = !showModelDropdown
            setShowModelDropdown(opening)
            setShowAgentDropdown(false)
            if (opening) onDropdownOpen?.()
          }}
          className={cn(
            triggerClass,
            !hasRequiredCredentials &&
              "text-destructive hover:bg-destructive/10 hover:text-destructive"
          )}
          title={getModelLabel(currentAgent, currentModel)}
        >
          {!hasRequiredCredentials && <Key className="size-3.5" />}
          <Cpu className="size-3.5 @[32rem]:hidden" />
          <span className="hidden @[32rem]:inline">
            {getModelLabel(currentAgent, currentModel)}
          </span>
          <ChevronDown className="size-3.5 opacity-50" />
        </button>
        {showModelDropdown && (
          <div className="absolute bottom-full right-0 z-50 mb-1 max-h-64 w-56 overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
            {availableModels.map((model: ModelOption) => {
              const modelHasCredentials = hasCredentialsForModel(
                model,
                credentialFlags,
                currentAgent
              )
              const needsKey = model.requiresKey !== "none" && !modelHasCredentials
              const isSelected = model.value === currentModel
              return (
                <button
                  key={model.value}
                  onClick={() => handleModelChange(model.value)}
                  className={cn(itemClass, "justify-between")}
                >
                  <span className="absolute left-2 flex size-3.5 items-center justify-center">
                    {isSelected && <Check className="size-3.5" />}
                  </span>
                  <span className="truncate">{model.label}</span>
                  {needsKey && (
                    <Key className="size-3.5 shrink-0 text-destructive" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
