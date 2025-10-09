'use client';

import * as React from 'react';
import { MessageCircleDashedIcon} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';


const NorthStarIcon = ({ size = 16, ...props }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12h18" />
    <path d="M12 21v-18" />
    <path d="M7.5 7.5l9 9" />
    <path d="M7.5 16.5l9 -9" />
  </svg>
);

const RobotFaceIcon = ({ size = 16, ...props }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z" />
    <path d="M9 16c1 .667 2 1 3 1s2 -.333 3 -1" />
    <path d="M9 7l-1 -4" />
    <path d="M15 7l1 -4" />
    <path d="M9 12v-1" />
    <path d="M15 12v-1" />
  </svg>
);

const ShareIcon = ({ size = 16, ...props }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M8.7 10.7l6.6 -3.4" />
    <path d="M8.7 13.3l6.6 3.4" />
  </svg>
);

const TrashIcon = ({ size = 16, ...props }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 7l16 0" />
    <path d="M10 11l0 6" />
    <path d="M14 11l0 6" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
  </svg>
);

export interface ChatMode {
  value: string;
  label: string;
  description?: string;
}

export interface ChatModeSelectorProps extends React.HTMLAttributes<HTMLElement> {
  modes?: ChatMode[];
  defaultMode?: string;
  onModeChange?: (mode: string) => void;
  onTempChatClick?: () => void;
  variant?: 'default' | 'chat-selected';
  onShareClick?: () => void;
  onDeleteClick?: () => void;
}

const defaultChatModes: ChatMode[] = [
  {
    value: 'chat',
    label: 'Chat',
    description: 'Balanced chatbot experience with RAG capability',
  },
  {
    value: 'agentic',
    label: 'Agent',
    description: 'Multi-agent system tailored for legal professionals',
  },
];

export const ChatModeSelector = React.forwardRef<HTMLElement, ChatModeSelectorProps>(
  (
    {
      className,
      modes = defaultChatModes,
      defaultMode = 'chat',
      onModeChange,
      onTempChatClick,
      variant = 'default',
      onShareClick,
      onDeleteClick,
      ...props
    },
    ref
  ) => {
    const [selected, setSelected] = React.useState<string>(defaultMode);

    React.useEffect(() => {
      setSelected(defaultMode);
    }, [defaultMode]);

    const handleChange = (val: string) => {
      setSelected(val);
      if (onModeChange) onModeChange(val);
    };

    const selectedLabel =
      modes.find((m) => m.value === selected)?.label ?? 'Choose a chat mode';
    
    const selectedMode = modes.find((m) => m.value === selected);
    const IconComponent = selectedMode?.value === 'agentic' ? NorthStarIcon : RobotFaceIcon;

    return (
      <header
        ref={ref}
        className={cn('px-4 md:px-6 [&_*]:no-underline', className)}
        {...props}
      >
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Chat Mode Selector (controlled) */}
          <Select value={selected} onValueChange={handleChange} aria-label="Select chat mode">
            <SelectTrigger className="px-3 rounded-2xl [&>svg]:text-muted-foreground/80 [&>svg]:shrink-0 border-none shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0">
              <IconComponent size={16} aria-hidden="true" />
              <SelectValue asChild>
                <span className="ml-2">{selectedLabel}</span>
              </SelectValue>
            </SelectTrigger>

            <SelectContent 
              className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 backdrop-blur-sm border border-zinc-400/60 dark:border-zinc-600/20 rounded-2xl shadow-[4px_8px_12px_2px_rgba(0,0,0,0.2)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              style={{ backgroundColor: 'rgb(53, 53, 53)' }}
            >
              <SelectGroup>
                <SelectLabel className="ps-2">Chat Modes</SelectLabel>
                {modes.map((mode) => {
                  const ItemIcon = mode.value === 'agentic' ? NorthStarIcon : RobotFaceIcon;
                  return (
                    <SelectItem 
                      key={mode.value} 
                      value={mode.value}
                      className="hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 data-[highlighted]:bg-zinc-100/80 data-[highlighted]:dark:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                    >
                      <div className="flex items-start gap-2">
                        <ItemIcon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="flex flex-col">
                          <span>{mode.label}</span>
                          {mode.description ? (
                            <span className="text-muted-foreground text-xs">{mode.description}</span>
                          ) : null}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Right: Action buttons based on variant */}
          {variant === 'default' ? (
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground size-8 rounded-full shadow-none hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 data-[highlighted]:bg-zinc-100/80 data-[highlighted]:dark:bg-zinc-800/60 transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50 "
              aria-label="Temporary chat"
              onClick={(e) => {
                e.preventDefault();
                if (onTempChatClick) onTempChatClick();
              }}
            >
              <MessageCircleDashedIcon size={16} aria-hidden="true" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground size-8 rounded-full shadow-none hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 data-[highlighted]:bg-zinc-100/80 data-[highlighted]:dark:bg-zinc-800/60 transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50 "
                aria-label="Share chat"
                onClick={(e) => {
                  e.preventDefault();
                  if (onShareClick) onShareClick();
                }}
              >
                <ShareIcon size={16} aria-hidden="true" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground size-8 rounded-full shadow-none hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 data-[highlighted]:bg-zinc-100/80 data-[highlighted]:dark:bg-zinc-800/60 transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50 hover:text-red-500 dark:hover:text-red-400"
                aria-label="Delete chat"
                onClick={(e) => {
                  e.preventDefault();
                  if (onDeleteClick) onDeleteClick();
                }}
              >
                <TrashIcon size={16} aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
      </header>
    );
  }
);

ChatModeSelector.displayName = 'ChatModeSelector';