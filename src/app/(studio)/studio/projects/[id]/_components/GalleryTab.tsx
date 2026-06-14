'use client'

import { Upload, Image as ImageIcon, Edit2, Trash2, ChevronLeft, ChevronRight } from '@/lib/icons'
import { GalleryImage } from '@/types/database'

interface GalleryTabProps {
    images: GalleryImage[]
    onUpload: () => void
    onEdit: (image: GalleryImage) => void
    onDelete: (id: string) => void
    onReorder: (id: string, direction: 'prev' | 'next') => void
}

export function GalleryTab({ images, onUpload, onEdit, onDelete, onReorder }: GalleryTabProps) {
    const sorted = [...images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-border">
                <div>
                    <h3 className="font-heading text-lg font-semibold">Visual Gallery</h3>
                    <p className="text-text-secondary text-sm">Upload and showcase project photos</p>
                </div>
                <button className="btn-primary" onClick={onUpload}>
                    <Upload className="w-4 h-4" /> Upload Photo
                </button>
            </div>

            {sorted.length === 0 ? (
                <div className="card-flat flex flex-col items-center justify-center py-20 text-center border-dashed border-2">
                    <ImageIcon className="w-12 h-12 text-accent/40 mb-4" />
                    <p className="text-text-secondary max-w-xs mx-auto">
                        No photos added to this project's gallery yet.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sorted.map((img, idx) => (
                        <div key={img.id} className="group relative aspect-square bg-accent/10 rounded-2xl overflow-hidden border border-border">
                            <img
                                src={img.image_url}
                                alt={img.caption || ''}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                {/* Reorder row */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onReorder(img.id, 'prev')}
                                        disabled={idx === 0}
                                        className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors disabled:opacity-30"
                                        title="Move left"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => onReorder(img.id, 'next')}
                                        disabled={idx === sorted.length - 1}
                                        className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors disabled:opacity-30"
                                        title="Move right"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                {/* Edit / Delete row */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(img)}
                                        className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                                        title="Edit caption"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(img.id)}
                                        className="p-2.5 bg-red-500/30 backdrop-blur-md rounded-full text-white hover:bg-red-500/50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            {img.caption && (
                                <div className="absolute bottom-3 left-3 right-3">
                                    <p className="text-[10px] text-white font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded w-fit truncate">
                                        {img.caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
