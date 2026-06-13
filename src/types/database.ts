// Database types mirroring the Supabase schema

export interface Client {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    address: string | null;
    active: boolean;
    created_at: string;
}

export interface StudioUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'designer';
    avatar_url: string | null;
    created_at: string;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'complete';

export interface Project {
    id: string;
    client_id: string;
    title: string;
    location: string | null;
    description: string | null;
    status: ProjectStatus;
    start_date: string | null;
    estimated_completion: string | null;
    cover_image_url: string | null;
    gallery_urls: string[];
    created_at: string;
    updated_at: string;
}

export type DocType = 'proposal' | 'contract' | 'drawing' | 'invoice' | 'other';

export interface GalleryImage {
    id: string;
    project_id: string;
    image_url: string;
    caption: string | null;
    display_order: number;
    created_at: string;
}

export type TimelineStatus = 'upcoming' | 'active' | 'complete';

export interface TimelineStage {
    id: string;
    project_id: string;
    stage_name: string;
    status: TimelineStatus;
    display_order: number;
    completed_at: string | null;
    notes: string | null;
}

export interface Document {
    id: string;
    project_id: string;
    name: string;
    file_url: string;
    file_type: string | null;
    file_size: string | null;
    size?: number | string | null; // Alias for consistency with some UI components
    uploaded_at: string;
}

export type SenderType = 'studio' | 'client';

export interface Message {
    id: string;
    project_id: string;
    sender_id?: string;
    sender_type: SenderType;
    sender_name: string;
    body: string;
    read: boolean;
    created_at: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface LineItem {
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
}

export interface Invoice {
    id: string;
    project_id: string;
    client_id: string;
    invoice_number: string;
    title: string;
    line_items: LineItem[];
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    tax?: number; // Alias for UI
    total: number;
    currency: string;
    status: InvoiceStatus;
    due_date: string | null;
    paid_at: string | null;
    paystack_reference: string | null;
    notes: string | null;
    created_at: string;
}

// ===== Bookings =====

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Booking {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    date: string;
    time: string;
    project_type: string | null;
    consultation_type: string | null;
    message: string | null;
    currency: string;
    amount: number | null;
    payment_reference: string | null;
    status: BookingStatus;
    created_at: string;
}

// ===== Website CMS Types =====

export interface WebsiteProject {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string | null;
    images: string[];
    featured: boolean;
    published: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface WebsitePost {
    id: string;
    title: string;
    slug: string;
    body: string | null;
    cover_image: string | null;
    published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface WebsitePricing {
    id: string;
    name: string;
    price: number | null;
    currency: string;
    description: string | null;
    features: string[];
    highlighted: boolean;
    display_order: number;
    created_at: string;
}

export interface WebsiteTestimonial {
    id: string;
    name: string;
    quote: string;
    project: string | null;
    avatar_url: string | null;
    featured: boolean;
    display_order: number;
    created_at: string;
}

export interface WebsiteSetting {
    id: string;
    key: string;
    value: string | null;
    updated_at: string;
}

export interface WebsiteLookbook {
    id: string;
    name: string;
    file_url: string;
    thumbnail_url: string | null;
    active: boolean;
    created_at: string;
}

// Extended types with relations
export interface ProjectWithDetails extends Project {
    timeline_stages?: TimelineStage[];
    documents?: Document[];
    messages?: Message[];
    invoices?: Invoice[];
    gallery?: GalleryImage[];
}
