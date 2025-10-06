"use client";

import { useState } from "react";
import {
  Sidebar,
  SidebarBody,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import ProfileDropdown from "@/components/misc/profile-dropdown";

interface ChatSidebarProps {
  user: { name: string; email: string; avatar?: string };
  conversations: Array<{
    id: string;
    title: string;
    lastMessage: string;
  }>;
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onLogout: () => void;
}

export default function ChatSidebar({
  user,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onLogout,
}: ChatSidebarProps) {
  const [open, setOpen] = useState(false);


  return (
    <Sidebar
      open={open}
      setOpen={setOpen}
      className="flex-shrink-0"
    >
      <SidebarBody
        open={open}
        setOpen={setOpen}
        className={cn(
          "justify-between gap-4 p-3 h-full flex flex-col transition-colors duration-500 ease-out",
          open ? "bg-neutral-900" : "bg-neutral-600"
        )}
      >
        <div className="flex flex-1 flex-col overflow-hidden transition-all duration-500 ease-out">
          <SidebarLogo open={open} setOpen={setOpen} />

          {/* New Chat Button */}
          <div className="mt-4">
            <Button
              onClick={onNewConversation}
              className={cn(
                "w-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] text-white hover:bg-neutral-700 rounded-lg text-sm font-medium flex-shrink-0",
                open ? "justify-start gap-2 px-3 py-2 text-left bg-neutral-800 border border-neutral-700" : "justify-center p-2 bg-transparent border-none"
              )}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={cn(
                  "shrink-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  open ? "h-3 w-3" : "h-5 w-5" 
                )}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                <path d="M16 5l3 3" />
              </svg>
              {open && <span className="text-neutral-300 font-medium">New Chat</span>}
            </Button>
          </div>

          {/* Recent Chats Section */}
          <div className="mt-4 flex flex-col flex-1 min-h-0 gap-1 transition-all duration-500 ease-out">
            {open ? (
              <>
                <div className="px-2 py-1 flex-shrink-0">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Recents
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar min-h-0">
                  {conversations && conversations.length > 0 ? (
                    conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => onSelectConversation(conversation.id)}
                      className={cn(
                        "flex items-center rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] text-left w-full gap-3 px-3 py-2 flex-shrink-0",
                        activeConversationId === conversation.id
                          ? "bg-neutral-800 text-neutral-100"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-700"
                      )}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 8l0 4l2 2" /><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" /></svg>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-neutral-200">
                          {conversation.title}
                        </p>
                      </div>
                    </button>
                  ))
                  ) : (
                    <div className="px-2 py-2 text-center text-xs text-neutral-500">
                      No conversations yet
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex justify-center p-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-md text-white transition-colors duration-300 ease-in-out">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 8l0 4l2 2" /><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" /></svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className={cn(
          "transition-all duration-500 ease-out flex-shrink-0",
          !open && "flex justify-center w-full"
        )}>
          <ProfileDropdown
            data={{
              name: user.name,
              email: user.email,
              avatar: user.avatar || undefined,
            }}
            showUserDetails={open}
            side="top"
            align={open ? "center" : "start"}
            sideOffset={8}
            alignOffset={open ? 0 : 20}
            onSignOut={onLogout}
            className={cn(
              "transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex-shrink-0",
              !open && "w-fit"
            )}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const SidebarLogo = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Logo
      collapsed={!open}
      showText={open}
      onClick={() => setOpen(!open)}
      variant="sidebar"
      className={cn(
        "w-full flex-shrink-0",
        open ? "justify-start" : "justify-center"
      )}
    />
  );
};
