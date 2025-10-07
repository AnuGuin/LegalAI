"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  conversationTitle?: string;
}

export function DeleteConversationDialog({
  open,
  onOpenChange,
  onConfirm,
  conversationTitle,
}: DeleteConversationDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px] p-6 backdrop-blur-sm border border-zinc-400/60 dark:border-zinc-600/20 rounded-2xl shadow-[4px_8px_12px_2px_rgba(0,0,0,0.2)]"
        style={{ backgroundColor: 'rgb(53, 53, 53)' }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-red-600/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-zinc-100">
              Delete Conversation
            </DialogTitle>
          </div>
          <DialogDescription className="text-zinc-300 text-left pt-2">
            Are you sure you want to delete this conversation?
            <span className="block mt-2 text-zinc-400">
              This action cannot be undone. All messages in this conversation will be permanently deleted.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-zinc-600/40 bg-transparent text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100 px-6"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white border-0 px-6"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
