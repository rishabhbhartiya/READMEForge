// src/lib/compositeCart.tsx
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface CompositeCartItem {
    id: string
    /** Matches the /api/{type} route this component came from, e.g. 'card-glass', 'terminal', 'header' */
    type: string
    /** Human-readable label shown in the cart, e.g. "Glass Card — Repositories" */
    label: string
    /** Raw query params for this component (parsed straight from its builder's own URL) */
    params: Record<string, string>
    width: number
    height: number
}

interface CompositeCartContextValue {
    items: CompositeCartItem[]
    addItem: (item: Omit<CompositeCartItem, 'id'>) => void
    removeItem: (id: string) => void
    moveItem: (id: string, direction: 'up' | 'down') => void
    updateItemSize: (id: string, width: number, height: number) => void
    clearCart: () => void
}

const CompositeCartContext = createContext<CompositeCartContextValue | null>(null)

function genId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function CompositeCartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CompositeCartItem[]>([])

    const addItem = useCallback((item: Omit<CompositeCartItem, 'id'>) => {
        setItems(prev => [...prev, { ...item, id: genId() }])
    }, [])

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }, [])

    const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
        setItems(prev => {
            const idx = prev.findIndex(i => i.id === id)
            if (idx === -1) return prev
            const swapWith = direction === 'up' ? idx - 1 : idx + 1
            if (swapWith < 0 || swapWith >= prev.length) return prev
            const next = [...prev]
                ;[next[idx], next[swapWith]] = [next[swapWith], next[idx]]
            return next
        })
    }, [])

    const updateItemSize = useCallback((id: string, width: number, height: number) => {
        setItems(prev => prev.map(i => (i.id === id ? { ...i, width, height } : i)))
    }, [])

    const clearCart = useCallback(() => setItems([]), [])

    return (
        <CompositeCartContext.Provider value={{ items, addItem, removeItem, moveItem, updateItemSize, clearCart }}>
            {children}
        </CompositeCartContext.Provider>
    )
}

export function useCompositeCart() {
    const ctx = useContext(CompositeCartContext)
    if (!ctx) throw new Error('useCompositeCart must be used within a CompositeCartProvider')
    return ctx
}

/**
 * Helper every builder uses to turn its own fully-built URL (the same one
 * used for the live preview <img>) into a cart item — no need to duplicate
 * each builder's param-building logic.
 */
export function paramsFromUrl(url: string): Record<string, string> {
    const params: Record<string, string> = {}
    try {
        const u = new URL(url)
        u.searchParams.forEach((v, k) => { params[k] = v })
    } catch {
        // ignore malformed URLs
    }
    return params
}