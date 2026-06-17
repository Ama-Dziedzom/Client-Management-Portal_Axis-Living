'use client'

import { Toaster } from 'react-hot-toast'

export function ToasterProvider() {
    return (
        <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
                duration: 3500,
                style: {
                    fontFamily: 'var(--font-body, sans-serif)',
                    fontSize: '14px',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                    maxWidth: '360px',
                },
                success: {
                    style: {
                        background: '#f0f5f0',
                        color: '#2F402C',
                        border: '1px solid #c3d4c2',
                    },
                    iconTheme: {
                        primary: '#2F402C',
                        secondary: '#f0f5f0',
                    },
                },
                error: {
                    style: {
                        background: '#fef2f2',
                        color: '#991b1b',
                        border: '1px solid #fecaca',
                    },
                    iconTheme: {
                        primary: '#dc2626',
                        secondary: '#fef2f2',
                    },
                },
            }}
        />
    )
}
