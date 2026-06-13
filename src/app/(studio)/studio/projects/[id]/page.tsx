'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { studioSupabase as supabase } from '@/lib/supabase'
import { 
    ProjectWithDetails,
    ProjectStatus,
    TimelineStage,
    GalleryImage,
    Document
} from '@/types/database'
import { Loader2 } from '@/lib/icons'
import toast from 'react-hot-toast'
import { logger } from '@/lib/logger'
import { UploadModal } from '@/components/shared/UploadModal'

// Sub-components
import { ProjectHeader } from './_components/ProjectHeader'
import { EditProjectDetails } from './_components/EditProjectDetails'
import { ProjectTabs } from './_components/ProjectTabs'
import { OverviewTab } from './_components/OverviewTab'
import { TimelineTab } from './_components/TimelineTab'
import { GalleryTab } from './_components/GalleryTab'
import { DocumentsTab } from './_components/DocumentsTab'

export default function StudioProjectDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [project, setProject] = useState<ProjectWithDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [isEditingInfo, setIsEditingInfo] = useState(false)

    // Upload modal state
    const [showGalleryUpload, setShowGalleryUpload] = useState(false)
    const [showDocumentUpload, setShowDocumentUpload] = useState(false)
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)

    useEffect(() => {
        if (id) fetchProject()
    }, [id])

    const fetchProject = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*, timeline_stages(*), documents(*), gallery(*)')
                .eq('id', id as string)
                .single()

            if (error) throw error
            setProject(data as ProjectWithDetails)
        } catch (error) {
            logger.error('Studio', 'Error fetching project', error)
            toast.error('Failed to load project details')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateProject = async (formData: any) => {
        try {
            const { error } = await supabase
                .from('projects')
                .update(formData)
                .eq('id', id as string)

            if (error) throw error
            
            toast.success('Project updated')
            setProject(prev => prev ? { ...prev, ...formData } : null)
            setIsEditingInfo(false)
        } catch (error) {
            logger.error('Studio', 'Update error', error)
            toast.error('Failed to update project')
        }
    }

    const handleDeleteProject = async () => {
        if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return
        
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id as string)

            if (error) throw error
            toast.success('Project deleted')
            router.push('/studio/projects')
        } catch (error) {
            logger.error('Studio', 'Delete error', error)
            toast.error('Failed to delete project')
        }
    }

    // Placeholder handlers for timeline (to be implemented)
    const handleAddStage = () => toast('Add stage feature coming soon')
    const handleEditStage = (stage: TimelineStage) => toast('Edit stage feature coming soon')
    const handleDeleteStage = (stageId: string) => toast('Delete stage feature coming soon')

    // ─── Gallery Handlers ─────────────────────────────────────────────
    const handleUploadPhoto = () => setShowGalleryUpload(true)

    const handleGalleryUpload = async (file: File, meta: { name: string; caption?: string }) => {
        const projectId = id as string
        const ext = file.name.split('.').pop() || 'jpg'
        const storagePath = `${projectId}/${Date.now()}-${meta.name.replace(/\s+/g, '_')}.${ext}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('Gallery')
            .upload(storagePath, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError

        // Get the public URL
        const { data: urlData } = supabase.storage.from('Gallery').getPublicUrl(storagePath)
        const imageUrl = urlData.publicUrl

        // Get current max display_order
        const currentImages = project?.gallery || []
        const maxOrder = currentImages.reduce((max, img) => Math.max(max, img.display_order || 0), 0)

        // Insert into gallery table
        const { data: newImage, error: dbError } = await supabase
            .from('gallery')
            .insert({
                project_id: projectId,
                image_url: imageUrl,
                caption: meta.caption || null,
                display_order: maxOrder + 1,
            })
            .select()
            .single()

        if (dbError) throw dbError

        // Update local state
        setProject(prev => prev ? {
            ...prev,
            gallery: [...(prev.gallery || []), newImage as GalleryImage]
        } : null)

        toast.success('Photo uploaded!')
    }

    const handleEditPhoto = (image: GalleryImage) => {
        const newCaption = window.prompt('Edit caption:', image.caption || '')
        if (newCaption === null) return // cancelled

        supabase
            .from('gallery')
            .update({ caption: newCaption })
            .eq('id', image.id)
            .then(({ error }) => {
                if (error) {
                    logger.error('Studio', 'Update caption error', error)
                    toast.error('Failed to update caption')
                    return
                }
                toast.success('Caption updated')
                setProject(prev => prev ? {
                    ...prev,
                    gallery: (prev.gallery || []).map(img =>
                        img.id === image.id ? { ...img, caption: newCaption } : img
                    )
                } : null)
            })
    }

    const handleDeletePhoto = async (imageId: string) => {
        if (!window.confirm('Delete this photo?')) return

        try {
            // Find the image to get its storage path
            const image = project?.gallery?.find(img => img.id === imageId)

            // Delete from database
            const { error } = await supabase
                .from('gallery')
                .delete()
                .eq('id', imageId)

            if (error) throw error

            // Try to delete from storage (extract path from URL)
            if (image?.image_url) {
                const urlParts = image.image_url.split('/storage/v1/object/public/Gallery/')
                if (urlParts[1]) {
                    await supabase.storage.from('Gallery').remove([urlParts[1]])
                }
            }

            // Update local state
            setProject(prev => prev ? {
                ...prev,
                gallery: (prev.gallery || []).filter(img => img.id !== imageId)
            } : null)

            toast.success('Photo deleted')
        } catch (error) {
            logger.error('Studio', 'Delete photo error', error)
            toast.error('Failed to delete photo')
        }
    }

    // ─── Documents Handlers ───────────────────────────────────────────
    const handleAddDocument = () => setShowDocumentUpload(true)

    const handleDocumentUpload = async (file: File, meta: { name: string; caption?: string }) => {
        const projectId = id as string
        const ext = file.name.split('.').pop() || 'pdf'
        const storagePath = `${projectId}/${Date.now()}-${meta.name.replace(/\s+/g, '_')}.${ext}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('Documents')
            .upload(storagePath, file, { cacheControl: '3600', upsert: false })

        if (uploadError) throw uploadError

        // Get the public URL
        const { data: urlData } = supabase.storage.from('Documents').getPublicUrl(storagePath)
        const fileUrl = urlData.publicUrl

        // Insert into documents table
        const { data: newDoc, error: dbError } = await supabase
            .from('documents')
            .insert({
                project_id: projectId,
                name: meta.name || file.name,
                file_url: fileUrl,
                file_type: file.type || null,
                file_size: String(file.size),
            })
            .select()
            .single()

        if (dbError) throw dbError

        // Update local state
        setProject(prev => prev ? {
            ...prev,
            documents: [...(prev.documents || []), newDoc as Document]
        } : null)

        toast.success('Document uploaded!')
    }

    const handleDeleteDocument = async (docId: string) => {
        if (!window.confirm('Delete this document?')) return

        try {
            // Find the doc to get its storage path
            const doc = project?.documents?.find(d => d.id === docId)

            // Delete from database
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', docId)

            if (error) throw error

            // Try to delete from storage
            if (doc?.file_url) {
                const urlParts = doc.file_url.split('/storage/v1/object/public/Documents/')
                if (urlParts[1]) {
                    await supabase.storage.from('Documents').remove([urlParts[1]])
                }
            }

            // Update local state
            setProject(prev => prev ? {
                ...prev,
                documents: (prev.documents || []).filter(d => d.id !== docId)
            } : null)

            toast.success('Document deleted')
        } catch (error) {
            logger.error('Studio', 'Delete document error', error)
            toast.error('Failed to delete document')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin opacity-40" />
            </div>
        )
    }

    if (!project) {
        return (
            <div className="text-center py-20">
                <p className="text-text-secondary">Project not found</p>
                <button onClick={() => router.push('/studio/projects')} className="btn-ghost mt-4">
                    Back to Projects
                </button>
            </div>
        )
    }

    return (
        <div className="pb-20">
            <ProjectHeader 
                project={project} 
                onEdit={() => setIsEditingInfo(!isEditingInfo)} 
                onDelete={handleDeleteProject} 
            />

            <EditProjectDetails 
                isOpen={isEditingInfo}
                onClose={() => setIsEditingInfo(false)}
                onSave={handleUpdateProject}
                initialData={{
                    title: project.title,
                    location: project.location || '',
                    status: project.status,
                    description: project.description || ''
                }}
            />

            <ProjectTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
            />

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'overview' && <OverviewTab project={project} />}
                {activeTab === 'timeline' && (
                    <TimelineTab 
                        stages={project.timeline_stages || []} 
                        onAddStage={handleAddStage}
                        onEditStage={handleEditStage}
                        onDeleteStage={handleDeleteStage}
                    />
                )}
                {activeTab === 'gallery' && (
                    <GalleryTab 
                        images={project.gallery || []} 
                        onUpload={handleUploadPhoto}
                        onEdit={handleEditPhoto}
                        onDelete={handleDeletePhoto}
                    />
                )}
                {activeTab === 'documents' && (
                    <DocumentsTab 
                        documents={project.documents || []} 
                        onAdd={handleAddDocument}
                        onDelete={handleDeleteDocument}
                    />
                )}
            </motion.div>

            {/* Gallery Upload Modal */}
            <UploadModal
                isOpen={showGalleryUpload}
                onClose={() => setShowGalleryUpload(false)}
                onUpload={handleGalleryUpload}
                title="Upload Photo"
                description="Add a photo to the project gallery"
                accept="image/*"
                maxSizeMB={10}
                showCaption={true}
                captionLabel="Photo Caption"
            />

            {/* Document Upload Modal */}
            <UploadModal
                isOpen={showDocumentUpload}
                onClose={() => setShowDocumentUpload(false)}
                onUpload={handleDocumentUpload}
                title="Upload Document"
                description="Share drawings, contracts, or proposals"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.dwg,.dxf,.ai,.psd,.eps,.svg"
                maxSizeMB={25}
                showCaption={false}
            />
        </div>
    )
}
