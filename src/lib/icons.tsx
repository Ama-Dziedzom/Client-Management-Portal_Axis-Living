/**
 * Thin adapter: re-exports every icon used in the project as a drop-in
 * replacement for lucide-react. All components accept the same props
 * (className, size, strokeWidth) so zero JSX changes are needed.
 */
import React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    AlertCircleIcon        as _AlertCircle,
    ArrowDown01Icon        as _ArrowDown,
    ArrowLeft01Icon        as _ArrowLeft,
    ArrowRight01Icon       as _ArrowRight,
    BookMarkedIcon         as _BookMarked,
    BookOpen01Icon         as _BookOpen,
    Calendar01Icon         as _Calendar,
    CalendarDaysIcon       as _CalendarDays,
    CallIcon               as _Phone,
    Cancel01Icon           as _X,
    ChartIncreaseIcon      as _TrendingUp,
    CheckIcon              as _Check,
    CheckmarkCircle01Icon  as _CheckCircle2,
    Clock01Icon            as _Clock,
    CreditCardIcon         as _CreditCard,
    DashboardSquare01Icon  as _LayoutDashboard,
    Delete02Icon           as _Trash2,
    EyeIcon                as _Eye,
    EyeOffIcon             as _EyeOff,
    File01Icon             as _FileText,
    File02Icon             as _File,
    FolderKanbanIcon       as _FolderKanban,
    GlobeIcon              as _Globe,
    Image01Icon            as _Image,
    LayoutTable01Icon      as _Table,
    LinkSquare01Icon       as _ExternalLink,
    Loading02Icon          as _Loader2,
    LockIcon               as _Lock,
    Logout01Icon           as _LogOut,
    Mail01Icon             as _Mail,
    MapPinIcon             as _MapPin,
    Menu01Icon             as _Menu,
    Message01Icon          as _MessageSquare,
    Message02Icon          as _MessageCircle,
    Notification01Icon     as _Bell,
    AlertDiamondIcon       as _AlertTriangle,
    PencilEdit01Icon       as _Pencil,
    PencilEdit02Icon       as _Edit2,
    PlusSignIcon           as _Plus,
    ReceiptDollarIcon      as _Receipt,
    RefreshIcon            as _RefreshCw,
    SaveIcon               as _Save,
    Search01Icon           as _Search,
    SentIcon               as _Send,
    Settings01Icon         as _Settings,
    Shield01Icon           as _Shield,
    SparklesIcon           as _Sparkles,
    StarIcon               as _Star,
    Tag01Icon              as _Tag,
    ToggleOffIcon          as _ToggleLeft,
    ToggleOnIcon           as _ToggleRight,
    Upload01Icon           as _Upload,
    UserAdd01Icon          as _UserPlus,
    UserGroupIcon          as _Users,
    UserIcon               as _User,
    // additional icons
    CheckCheckIcon         as _CheckCheck,
    CheckListIcon          as _ListTodo,
    CircleIcon             as _Circle,
    DollarSignIcon         as _DollarSign,
    Download01Icon         as _Download,
    FilterIcon             as _Filter,
    InformationCircleIcon  as _Info,
    PrinterIcon            as _Printer,
    ShieldUserIcon         as _ShieldCheck,
    Building2Icon          as _Building2,
    ChevronUpIcon          as _ChevronUp,
    ArrowLeft02Icon        as _ChevronLeft,
    ColorsIcon             as _Palette,
    Copy01Icon             as _Copy,
    ComputerIcon           as _Monitor,
    MoonIcon               as _Moon,
    Sun01Icon              as _Sun,
} from '@hugeicons/core-free-icons'

// ─── Type ────────────────────────────────────────────────────────────────────

export type IconProps = {
    className?: string
    size?: number
    strokeWidth?: number
    color?: string
}

/** Drop-in replacement for the `LucideIcon` type */
export type LucideIcon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>

// ─── Factory ─────────────────────────────────────────────────────────────────

function icon(data: Parameters<typeof HugeiconsIcon>[0]['icon'], name: string): LucideIcon {
    const C = React.forwardRef<SVGSVGElement, IconProps>(
        ({ className, size = 20, strokeWidth = 1.5, color }, ref) => (
            <HugeiconsIcon
                ref={ref}
                icon={data}
                size={size}
                strokeWidth={strokeWidth}
                primaryColor={color ?? 'currentColor'}
                className={className}
            />
        )
    )
    C.displayName = name
    return C
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export const AlertCircle    = icon(_AlertCircle,    'AlertCircle')
export const AlertTriangle  = icon(_AlertTriangle,  'AlertTriangle')
export const ArrowLeft      = icon(_ArrowLeft,      'ArrowLeft')
export const ArrowRight     = icon(_ArrowRight,     'ArrowRight')
export const Bell           = icon(_Bell,           'Bell')
export const BookMarked     = icon(_BookMarked,     'BookMarked')
export const BookOpen       = icon(_BookOpen,       'BookOpen')
export const Calendar       = icon(_Calendar,       'Calendar')
export const CalendarDays   = icon(_CalendarDays,   'CalendarDays')
export const Check          = icon(_Check,          'Check')
export const CheckCircle2   = icon(_CheckCircle2,   'CheckCircle2')
export const ChevronDown    = icon(_ArrowDown,      'ChevronDown')
export const ChevronLeft    = icon(_ChevronLeft,    'ChevronLeft')
export const ChevronRight   = icon(_ArrowRight,     'ChevronRight')
export const Clock          = icon(_Clock,          'Clock')
export const CreditCard     = icon(_CreditCard,     'CreditCard')
export const Edit2          = icon(_Edit2,          'Edit2')
export const ExternalLink   = icon(_ExternalLink,   'ExternalLink')
export const Eye            = icon(_Eye,            'Eye')
export const EyeOff         = icon(_EyeOff,         'EyeOff')
export const File           = icon(_File,           'File')
export const FileText       = icon(_FileText,       'FileText')
export const FolderKanban   = icon(_FolderKanban,   'FolderKanban')
export const Globe          = icon(_Globe,          'Globe')
export const Image          = icon(_Image,          'Image')          // supports: Image as ImageIcon
export const ImageIcon      = icon(_Image,          'ImageIcon')
export const LayoutDashboard = icon(_LayoutDashboard, 'LayoutDashboard')
export const Loader2        = icon(_Loader2,        'Loader2')
export const Lock           = icon(_Lock,           'Lock')
export const LogOut         = icon(_LogOut,         'LogOut')
export const Mail           = icon(_Mail,           'Mail')
export const MapPin         = icon(_MapPin,         'MapPin')
export const Menu           = icon(_Menu,           'Menu')
export const MessageCircle  = icon(_MessageCircle,  'MessageCircle')
export const MessageSquare  = icon(_MessageSquare,  'MessageSquare')
export const Pencil         = icon(_Pencil,         'Pencil')
export const Phone          = icon(_Phone,          'Phone')
export const Plus           = icon(_Plus,           'Plus')
export const Receipt        = icon(_Receipt,        'Receipt')
export const RefreshCw      = icon(_RefreshCw,      'RefreshCw')
export const Save           = icon(_Save,           'Save')
export const SaveIcon       = icon(_Save,           'SaveIcon')       // for direct SaveIcon imports
export const Search         = icon(_Search,         'Search')
export const Send           = icon(_Send,           'Send')
export const Settings       = icon(_Settings,       'Settings')
export const Shield         = icon(_Shield,         'Shield')
export const Sparkles       = icon(_Sparkles,       'Sparkles')
export const Star           = icon(_Star,           'Star')
export const Table          = icon(_Table,          'Table')
export const Tag            = icon(_Tag,            'Tag')
export const ToggleLeft     = icon(_ToggleLeft,     'ToggleLeft')
export const ToggleRight    = icon(_ToggleRight,    'ToggleRight')
export const Trash2         = icon(_Trash2,         'Trash2')
export const TrendingUp     = icon(_TrendingUp,     'TrendingUp')
export const Upload         = icon(_Upload,         'Upload')
export const User           = icon(_User,           'User')
export const UserPlus       = icon(_UserPlus,       'UserPlus')
export const Users          = icon(_Users,          'Users')
export const X              = icon(_X,              'X')
export const CheckCheck     = icon(_CheckCheck,     'CheckCheck')
export const Circle         = icon(_Circle,         'Circle')
export const DollarSign     = icon(_DollarSign,     'DollarSign')
export const Download       = icon(_Download,       'Download')
export const Filter         = icon(_Filter,         'Filter')
export const Info           = icon(_Info,           'Info')
export const ListTodo       = icon(_ListTodo,       'ListTodo')
export const Printer        = icon(_Printer,        'Printer')
export const ShieldCheck    = icon(_ShieldCheck,    'ShieldCheck')
export const Building2      = icon(_Building2,      'Building2')
export const ChevronUp      = icon(_ChevronUp,      'ChevronUp')
export const Copy           = icon(_Copy,           'Copy')
export const Monitor        = icon(_Monitor,        'Monitor')
export const Moon           = icon(_Moon,           'Moon')
export const Palette        = icon(_Palette,        'Palette')
export const Sun            = icon(_Sun,            'Sun')
