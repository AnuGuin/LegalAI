"use client";

import { Paperclip, Send, X, File, FileText, Image, Languages } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api.service";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TranslateModal } from "../chat/translate-modal";

interface Tool {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    file: File;
}

interface AI_InputProps {
    onSendMessage?: (message: string, file?: File) => void | Promise<void>;
    mode?: 'chat' | 'agentic';
    disabled?: boolean;
    showModeIndicator?: boolean;
}

const tools: Tool[] = [
    {
        id: 'doc-generate',
        label: 'Doc Generate',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                <path d="M9 12h6" />
                <path d="M9 16h6" />
            </svg>
        )
    },
    {
        id: 'translate',
        label: 'Translate',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 6.371c0 4.418 -2.239 6.629 -5 6.629" />
                <path d="M4 6.371h7" />
                <path d="M5 9c0 2.144 2.252 3.908 6 4" />
                <path d="M12 20l4 -9l4 9" />
                <path d="M19.1 18h-6.2" />
                <path d="M6.694 3l.793 .582" />
            </svg>
        )
    }
];

// File validation constants
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif'
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export default function AI_Input({ onSendMessage, mode = 'chat', disabled = false, showModeIndicator = true }: AI_InputProps) {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 52,
        maxHeight: 200,
    });
    const [showTools, setShowTools] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
    const [translateLanguages, setTranslateLanguages] = useState<{
        sourceLang: string;
        targetLang: string;
        sourceName: string;
        targetName: string;
    } | null>(null);
    const [detectedLanguage, setDetectedLanguage] = useState<{
        language: string;
        display_name: string;
    } | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    // Debounced language detection for agentic mode
    useEffect(() => {
        // Only detect language in agentic mode and when there's text
        if (mode !== 'agentic' || !value.trim() || value.trim().length < 3) {
            setDetectedLanguage(null);
            return;
        }

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer for debounced detection
        debounceTimerRef.current = setTimeout(async () => {
            try {
                setIsDetecting(true);
                const response = await apiService.detectLanguage(value.trim());
                
                if (response.success && response.data) {
                    setDetectedLanguage(response.data);
                }
            } catch (error) {
                console.error('Language detection failed:', error);
                // Silently fail - don't show error to user for auto-detection
            } finally {
                setIsDetecting(false);
            }
        }, 800); 

        // Cleanup on unmount or value change
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [value, mode]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // Validate mode
        if (mode !== 'agentic') {
            toast({
                title: "File upload not available",
                description: "Please switch to Agentic mode to upload files.",
                variant: "destructive",
            });
            return;
        }

        // Process each file
        const validFiles: UploadedFile[] = [];
        const errors: string[] = [];

        Array.from(files).forEach(file => {
            // Validate file type
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                errors.push(`${file.name}: Invalid file type. Only PDF, DOC, DOCX, TXT, and images are allowed.`);
                return;
            }

            // Validate file size
                if (file.size > MAX_FILE_SIZE) {
                    errors.push(`${file.name}: File too large. Maximum size is ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB.`);
                return;
            }

            validFiles.push({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                type: file.type,
                file: file
            });
        });

        // Show errors if any
        if (errors.length > 0) {
            toast({
                title: "File validation failed",
                description: errors[0],
                variant: "destructive",
            });
        }

        // Add valid files (only allow one file at a time for backend compatibility)
        if (validFiles.length > 0) {
            // Only keep the first file since backend expects single file
            setUploadedFiles([validFiles[0]]);
            
            if (validFiles.length > 1) {
                toast({
                    title: "Multiple files selected",
                    description: "Only one file can be uploaded at a time. Using the first file.",
                    variant: "default",
                });
            }
        }
        
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (fileId: string) => {
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith('image/')) {
            return <Image className="w-6 h-6" />;
        } else if (fileType.includes('pdf') || fileType.includes('document')) {
            return <FileText className="w-6 h-6" />;
        }
        return <File className="w-6 h-6" />;
    };

    const handleSubmit = async () => {
        // Validate input
        if (!value.trim() && uploadedFiles.length === 0) return;
        
        // Validate file upload mode
        if (uploadedFiles.length > 0 && mode !== 'agentic') {
            toast({
                title: "File upload error",
                description: "Files can only be sent in Agentic mode.",
                variant: "destructive",
            });
            return;
        }

        if (disabled) return;

        // Prepare message content
        let messageContent = value.trim();
        
        // If translation languages are selected, format the message with translation request
        if (translateLanguages) {
            messageContent = `Please translate the following text from ${translateLanguages.sourceName} to ${translateLanguages.targetName}:\n\n${messageContent}`;
        }
        // Debug: log translation selection and final message content to help diagnose 422 errors
        console.log('AI Input - sending message', {
            mode,
            translateLanguages,
            messagePreview: messageContent && messageContent.length > 1000 ? messageContent.slice(0, 1000) + '... (truncated)' : messageContent,
            hasFile: uploadedFiles.length > 0
        });

        // Clear only the input text immediately for better UX
        setValue("");
        adjustHeight(true);
        
        // Clear uploaded files (for agentic mode)
        if (mode === 'agentic') {
            setUploadedFiles([]);
        }
        
        // Clear detected language on send
        setDetectedLanguage(null);
        
        // Then send the message
        if (onSendMessage) {
            // Send message with optional file (only first file)
            const fileToSend = uploadedFiles.length > 0 ? uploadedFiles[0].file : undefined;
            await onSendMessage(messageContent, fileToSend);
        }
        
        // Note: Keep selectedTool and translateLanguages intact so user can send multiple messages with same settings
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleContainerClick = () => {
        if (textareaRef.current && !disabled) {
            textareaRef.current.focus();
        }
    };

    const handleLanguageSelect = (sourceLang: string, targetLang: string, sourceName: string, targetName: string) => {
        setTranslateLanguages({
            sourceLang,
            targetLang,
            sourceName,
            targetName,
        });
        const translateTool = tools.find(t => t.id === 'translate');
        if (translateTool) {
            setSelectedTool(translateTool);
        }
    };

    return (
        <div className="w-full py-4 overflow-visible">
            <div className="relative max-w-xl w-full mx-auto overflow-visible">
                {/* Main container with extension for doc upload */}
                <div className={cn(
                    "relative ring-1 ring-black/10 dark:ring-white/10 transition-all duration-300 overflow-visible",
                    uploadedFiles.length > 0 ? "rounded-2xl" : "rounded-2xl",
                    isFocused && "ring-black/20 dark:ring-white/20",
                    disabled && "opacity-50 cursor-not-allowed"
                )}>
                    <div
                        role="textbox"
                        tabIndex={disabled ? -1 : 0}
                        aria-label="Search input container"
                        aria-disabled={disabled}
                        className={cn(
                            "relative flex flex-col transition-all duration-300 ease-in-out w-full text-left overflow-visible",
                            uploadedFiles.length > 0 ? "rounded-t-2xl" : "rounded-2xl",
                            disabled ? "cursor-not-allowed" : "cursor-text"
                        )}
                        onClick={handleContainerClick}
                        onKeyDown={(e) => {
                            if (!disabled && (e.key === "Enter" || e.key === " ")) {
                                handleContainerClick();
                            }
                        }}
                    >
                        <div className="overflow-y-auto max-h-[200px]">
                            <Textarea
                                id="ai-input"
                                value={value}
                                placeholder={
                                    mode === 'agentic' 
                                        ? "Ask Nyay Mitra Agent..." 
                                        : "Ask LegalAI..."
                                }
                                className="w-full rounded-2xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
                                ref={textareaRef}
                                disabled={disabled}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        if ((value.trim() || uploadedFiles.length > 0) && !disabled) {
                                            handleSubmit();
                                        }
                                    }
                                }}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                            />
                        </div>

                        <div className={cn(
                            "h-12 bg-black/5 dark:bg-white/5 transition-all duration-300",
                            uploadedFiles.length > 0 ? "rounded-b-none" : "rounded-b-2xl"
                        )}>
                            <div className="absolute left-3 bottom-3 flex items-center gap-2">
                                {mode === 'agentic' && (
                                    <label 
                                        className={cn(
                                            "rounded-lg p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative",
                                            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                        )}
                                        onClick={(e) => {
                                            if (disabled) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            disabled={disabled}
                                            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                                        />
                                        <Paperclip className="w-4 h-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors" />
                                        {uploadedFiles.length > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {uploadedFiles.length}
                                            </span>
                                        )}
                                    </label>
                                )}
                                
                                {/* Detected language indicator (Agentic mode only) */}
                                {mode === 'agentic' && detectedLanguage && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20"
                                    >
                                        <Languages className="w-3 h-3" />
                                        <span>{detectedLanguage.display_name}</span>
                                    </motion.div>
                                )}
                                
                                {/* Detecting indicator */}
                                {mode === 'agentic' && isDetecting && !detectedLanguage && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-1 px-2 py-1 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium border border-gray-500/20"
                                    >
                                        <Languages className="w-3 h-3 animate-pulse" />
                                        <span>Detecting...</span>
                                    </motion.div>
                                )}
                                
                                {/* Translation language indicator */}
                                {translateLanguages && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                                        <Languages className="w-3 h-3" />
                                        <span>{translateLanguages.sourceName} → {translateLanguages.targetName}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTranslateLanguages(null);
                                                if (selectedTool?.id === 'translate') {
                                                    setSelectedTool(null);
                                                }
                                            }}
                                            className="ml-1 hover:bg-blue-500/20 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                )}
                                
                                {mode === 'chat' && (
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu onOpenChange={setShowTools}>
                                            <DropdownMenuTrigger asChild disabled={disabled}>
                                                <button
                                                    type="button"
                                                    disabled={disabled}
                                                    className={cn(
                                                        "rounded-full transition-all flex items-center gap-2 px-1.5 py-1 border h-8",
                                                        selectedTool || showTools
                                                            ? "bg-sky-500/15 border-sky-400 text-sky-500"
                                                            : "bg-black/5 dark:bg-white/5 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white",
                                                        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                                    )}
                                                >
                                                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                                                        <motion.div
                                                            animate={{
                                                                rotate: showTools ? 180 : 0,
                                                                scale: showTools || selectedTool ? 1.1 : 1,
                                                            }}
                                                            whileHover={!disabled ? {
                                                                rotate: showTools ? 180 : 15,
                                                                scale: 1.1,
                                                                transition: {
                                                                    type: "spring",
                                                                    stiffness: 300,
                                                                    damping: 10,
                                                                },
                                                            } : {}}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 260,
                                                                damping: 25,
                                                            }}
                                                        >
                                                            {selectedTool ? selectedTool.icon : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className={cn(
                                                                        "w-4 h-4",
                                                                        showTools
                                                                            ? "text-sky-500"
                                                                            : "text-inherit"
                                                                    )}
                                                                >
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                    <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" />
                                                                </svg>
                                                            )}
                                                        </motion.div>
                                                    </div>
                                                    <AnimatePresence>
                                                        {(showTools || selectedTool) && (
                                                            <motion.span
                                                                initial={{ width: 0, opacity: 0 }}
                                                                animate={{
                                                                    width: "auto",
                                                                    opacity: 1,
                                                                }}
                                                                exit={{ width: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className={cn(
                                                                    "text-sm overflow-hidden whitespace-nowrap shrink-0",
                                                                    selectedTool || showTools ? "text-sky-500" : "text-inherit"
                                                                )}
                                                            >
                                                                {selectedTool ? selectedTool.label : "Tools"}
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                side="top"
                                                align="start"
                                                sideOffset={8}
                                                className="w-48 p-2 backdrop-blur-sm border border-zinc-400/60 dark:border-zinc-600/20 rounded-2xl shadow-[4px_8px_12px_2px_rgba(0,0,0,0.2)]"
                                                style={{ backgroundColor: 'rgb(53, 53, 53)' }}
                                            >
                                                <div className="space-y-1">
                                                    {tools.map((tool) => (
                                                        <DropdownMenuItem key={tool.id} asChild>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (tool.id === 'translate') {
                                                                        setSelectedTool(tool);
                                                                        setIsTranslateModalOpen(true);
                                                                        setShowTools(false);
                                                                    } else {
                                                                        setSelectedTool(tool);
                                                                        setShowTools(false);
                                                                    }
                                                                }}
                                                                className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                                                            >
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    {tool.icon}
                                                                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight whitespace-nowrap group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                                                                        {tool.label}
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </div>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        
                                        {selectedTool && (
                                            <motion.button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedTool(null);
                                                    if (selectedTool.id === 'translate') {
                                                        setTranslateLanguages(null);
                                                    }
                                                }}
                                                disabled={disabled}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ duration: 0.2, type: "spring", stiffness: 260, damping: 25 }}
                                                className={cn(
                                                    "w-6 h-6 rounded-2xl bg-zinc-200/80 dark:bg-zinc-700/80 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors flex items-center justify-center",
                                                    disabled && "cursor-not-allowed opacity-50"
                                                )}
                                            >
                                                <X className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                                            </motion.button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="absolute right-3 bottom-3">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={(!value.trim() && uploadedFiles.length === 0) || disabled}
                                    className={cn(
                                        "rounded-lg p-2 transition-colors",
                                        (value.trim() || uploadedFiles.length > 0) && !disabled
                                            ? "bg-sky-500/15 text-sky-500 cursor-pointer hover:bg-sky-500/25"
                                            : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 cursor-not-allowed"
                                    )}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Extended container for uploaded files */}
                    <AnimatePresence mode="wait">
                        {uploadedFiles.length > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-visible"
                            >
                                <div className="bg-transparent backdrop-blur-sm rounded-b-2xl overflow-visible">
                                    {/* Separator line */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent mx-4"></div>
                                    
                                    {/* Files container */}
                                    <div className="p-4 overflow-visible">
                                        <div className="flex flex-wrap gap-3">
                                            {uploadedFiles.map((file, index) => (
                                                <motion.div
                                                    key={file.id}
                                                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                                    transition={{ 
                                                        duration: 0.2, 
                                                        type: "spring", 
                                                        stiffness: 300, 
                                                        damping: 25,
                                                        delay: index * 0.05 
                                                    }}
                                                    className="relative group"
                                                >
                                                    {/* Tooltip on hover */}
                                                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]">
                                                        <div className="bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg">
                                                            {file.name}
                                                            <div className="text-[10px] opacity-70 mt-0.5">
                                                                {formatFileSize(file.size)}
                                                            </div>
                                                            {/* Tooltip arrow */}
                                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black dark:bg-white rotate-45"></div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* File square tile */}
                                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 dark:from-sky-500/20 dark:to-sky-500/10 hover:from-sky-500/20 hover:to-sky-500/10 dark:hover:from-sky-500/30 dark:hover:to-sky-500/20 border border-sky-500/20 dark:border-sky-500/30 flex items-center justify-center text-sky-500 dark:text-sky-400 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm">
                                                        {getFileIcon(file.type)}
                                                    </div>
                                                    
                                                    {/* Remove button (shows on hover) */}
                                                    <button
                                                        onClick={() => removeFile(file.id)}
                                                        disabled={disabled}
                                                        className={cn(
                                                            "absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 group-hover:scale-100",
                                                            disabled && "cursor-not-allowed"
                                                        )}
                                                    >
                                                        <X className="w-3 h-3 text-white" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mode indicator help text */}
                {showModeIndicator && (
                    <div className="mt-2 text-center">
                        <p className="text-xs text-black/50 dark:text-white/50">
                            {mode === 'agentic' 
                                ? "Agentic mode: AI with Document Analysis • Upload documents (PDF, DOC, TXT • Max 10MB)"
                                : "Chat mode: General conversation • With Added Tools"
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Translate Modal */}
            <TranslateModal
                open={isTranslateModalOpen}
                onOpenChange={setIsTranslateModalOpen}
                onLanguageSelect={handleLanguageSelect}
            />
        </div>
    );
}