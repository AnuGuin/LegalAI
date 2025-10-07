"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranslateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLanguageSelect?: (sourceLang: string, targetLang: string, sourceLabel: string, targetLabel: string) => void;
}

// Supported languages with their codes and display names
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "tam", name: "Tamil", nativeName: "தமிழ்" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
];

export function TranslateModal({ open, onOpenChange, onLanguageSelect }: TranslateModalProps) {
  const [sourceLang, setSourceLang] = useState<string>("");
  const [targetLang, setTargetLang] = useState<string>("");
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!sourceLang || !targetLang) {
      toast({
        variant: "destructive",
        title: "Missing Selection",
        description: "Please select both input and output languages.",
      });
      return;
    }

    if (sourceLang === targetLang) {
      toast({
        variant: "destructive",
        title: "Invalid Selection",
        description: "Input and output languages cannot be the same.",
      });
      return;
    }

    const sourceLangObj = SUPPORTED_LANGUAGES.find(lang => lang.code === sourceLang);
    const targetLangObj = SUPPORTED_LANGUAGES.find(lang => lang.code === targetLang);

    if (sourceLangObj && targetLangObj && onLanguageSelect) {
      onLanguageSelect(
        sourceLang, 
        targetLang, 
        sourceLangObj.name, 
        targetLangObj.name
      );
      onOpenChange(false);
      // Reset form
      setSourceLang("");
      setTargetLang("");
      
      toast({
        variant: "default",
        title: "Languages Selected",
        description: `Ready to translate from ${sourceLangObj.name} to ${targetLangObj.name}.`,
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form when closing
    setSourceLang("");
    setTargetLang("");
  };

  const getLanguageDisplay = (lang: typeof SUPPORTED_LANGUAGES[0]) => {
    return `${lang.name} - ${lang.nativeName}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 backdrop-blur-sm border border-zinc-400/60 dark:border-zinc-600/20 rounded-2xl shadow-[4px_8px_12px_2px_rgba(0,0,0,0.2)]"
        style={{ backgroundColor: 'rgb(53, 53, 53)' }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100">
            <Languages className="w-5 h-5 text-blue-400" />
            Select Translation Languages
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Language Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="source-lang" className="text-zinc-200">Input Language</Label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="border-zinc-600/40 bg-zinc-700/30 text-zinc-100">
                  <SelectValue placeholder="Select input language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {getLanguageDisplay(lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="target-lang" className="text-zinc-200">Output Language</Label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="border-zinc-600/40 bg-zinc-700/30 text-zinc-100">
                  <SelectValue placeholder="Select output language" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {getLanguageDisplay(lang)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Information message */}
          <div className="p-3 bg-zinc-700/30 rounded-2xl border border-zinc-600/30 ">
            <p className="text-sm text-zinc-300 text-center">
              After selecting languages, type your message in the chat input to translate it.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between pt-4 border-t border-zinc-600/20">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="rounded-xl border-zinc-600/40 bg-transparent text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100"
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleConfirm}
            disabled={!sourceLang || !targetLang}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Languages className="w-4 h-4 mr-2" />
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}