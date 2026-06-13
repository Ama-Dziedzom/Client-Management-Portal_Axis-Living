'use client'

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, Image as ImageIcon, File, Loader2, CheckCircle2 } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
    onUpload: (file: File, meta: { name: string; caption?: string }) => Promise<void>
    title: string
    description?: string
    accept?: string
    maxSizeMB?: number
    showCaption?: boolean
    captionLabel?: string
}

type UploadState = 'idle' | 'selected' | 'uploading' | 'success' | 'error'

export function UploadModal({
    isOpen,
    onClose,
    onUpload,
    title,
    description,
    accept = '*',
    maxSizeMB = 25,
    showCaption = false,
    captionLabel = 'Caption',
}: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState('')
    const [caption, setCaption] = useState('')
    const [dragOver, setDragOver] = useState(false)
    const [uploadState, setUploadState] = useState<UploadState>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const isImage = (f: File) => f.type.startsWith('image/')

    const resetState = useCallback(() => {
        setFile(null)
        setPreview(null)
        setFileName('')
        setCaption('')
        setDragOver(false)
        setUploadState('idle')
        setErrorMessage('')
    }, [])

    const handleClose = () => {
        if (uploadState === 'uploading') return
        resetState()
        onClose()
    }

    const processFile = (f: File) => {
        const maxBytes = maxSizeMB * 1024 * 1024
        if (f.size > maxBytes) {
            setErrorMessage(`File exceeds ${maxSizeMB}MB limit`)
            setUploadState('error')
            return
        }

        setFile(f)
        setFileName(f.name.replace(/\.[^/.]+$/, ''))
        setUploadState('selected')
        setErrorMessage('')

        if (isImage(f)) {
            const reader = new FileReader()
            reader.onload = (e) => setPreview(e.target?.result as string)
            reader.readAsDataURL(f)
        } else {
            setPreview(null)
        }
    }

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault()
        setDragOver(false)
    }

    const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile) processFile(droppedFile)
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0]
        if (selected) processFile(selected)
        // Reset input so same file can be re-selected
        if (inputRef.current) inputRef.current.value = ''
    }

    const handleUpload = async () => {
        if (!file) return
        setUploadState('uploading')
        try {
            await onUpload(file, { name: fileName || file.name, caption: caption || undefined })
            setUploadState('success')
            setTimeout(() => {
                resetState()
                onClose()
            }, 800)
        } catch (err: any) {
            setErrorMessage(err?.message || 'Upload failed. Please try again.')
            setUploadState('error')
        }
    }

    const getFileIcon = () => {
        if (!file) return <Upload className="w-8 h-8" />
        if (isImage(file)) return <ImageIcon className="w-8 h-8" />
        if (file.type.includes('pdf')) return <FileText className="w-8 h-8" />
        return <File className="w-8 h-8" />
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-lg bg-surface rounded-3xl shadow-elevated border border-border overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                            <div>
                                <h2 className="font-heading text-lg font-semibold text-text-primary">{title}</h2>
                                {description && (
                                    <p className="text-sm text-text-secondary mt-0.5">{description}</p>
                                )}
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={uploadState === 'uploading'}
                                className="p-2 hover:bg-accent/10 rounded-xl transition-colors text-text-secondary hover:text-text-primary disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 space-y-5">
                            {/* Drop zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => uploadState !== 'uploading' && inputRef.current?.click()}
                                className={`
                                    relative flex flex-col items-center justify-center py-10 px-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
                                    ${dragOver
                                        ? 'border-primary bg-primary/5 scale-[1.01]'
                                        : uploadState === 'error'
                                            ? 'border-error/40 bg-error/5'
                                            : uploadState === 'selected' || uploadState === 'success'
                                                ? 'border-primary/30 bg-primary/5'
                                                : 'border-border hover:border-accent hover:bg-accent/5'
                                    }
                                `}
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept={accept}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {/* Preview or icon */}
                                {preview ? (
                                    <div className="w-28 h-28 rounded-xl overflow-hidden border border-border mb-4 shadow-soft">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                                        uploadState === 'selected' ? 'bg-primary/10 text-primary' : 'bg-accent/15 text-text-secondary'
                                    }`}>
                                        {getFileIcon()}
                                    </div>
                                )}

                                {file ? (
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-text-primary truncate max-w-xs">{file.name}</p>
                                        <p className="text-xs text-text-secondary mt-1">
                                            {formatFileSize(file.size)} · Click to change
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-text-primary">
                                            {dragOver ? 'Drop your file here' : 'Drag & drop or click to browse'}
                                        </p>
                                        <p className="text-xs text-text-secondary mt-1">
                                            Max {maxSizeMB}MB
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Error message */}
                            {errorMessage && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-error font-medium"
                                >
                                    {errorMessage}
                                </motion.p>
                            )}

                            {/* Name field */}
                            {file && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block text-sm font-semibold text-text-primary mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        placeholder="Enter a name for this file"
                                        className="input-field"
                                        disabled={uploadState === 'uploading'}
                                    />
                                </motion.div>
                            )}

                            {/* Caption field (for gallery) */}
                            {file && showCaption && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.2, delay: 0.05 }}
                                >
                                    <label className="block text-sm font-semibold text-text-primary mb-2">{captionLabel}</label>
                                    <input
                                        type="text"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="Optional caption"
                                        className="input-field"
                                        disabled={uploadState === 'uploading'}
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-background/50">
                            <button
                                onClick={handleClose}
                                disabled={uploadState === 'uploading'}
                                className="btn-ghost"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploadState === 'uploading' || uploadState === 'success'}
                                className="btn-primary min-w-[120px]"
                            >
                                {uploadState === 'uploading' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading…
                                    </>
                                ) : uploadState === 'success' ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Done!
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
