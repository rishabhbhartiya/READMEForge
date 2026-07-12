'use client'

import { useState } from 'react'
import { useCompositeCart, paramsFromUrl } from '../lib/compositeCart'

/**
 * Drop this next to any builder's <AddButton /> (the "Add to README" one).
 * `url` should be the same fully-built absolute URL the builder already uses
 * for its live preview <img> — this button just reads params back out of it,
 * so no builder-specific param-building logic needs to be duplicated.
 */
export function AddToCompositeButton({
    type, label, url, width, height,
}: {
    type: string
    label: string
    url: string
    width: number
    height: number
}) {
    const { addItem } = useCompositeCart()
    const [added, setAdded] = useState(false)

    function handleClick() {
        addItem({ type, label, params: paramsFromUrl(url), width, height })
        setAdded(true)
        setTimeout(() => setAdded(false), 1400)
    }

    return (
        <button
            onClick={handleClick}
            title="Add to Composite"
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg font-mono text-[12px]
        border transition-all cursor-pointer
        ${added
                    ? 'border-[rgba(57,255,20,0.4)] bg-[rgba(57,255,20,0.08)] text-[#39ff14]'
                    : 'border-[rgba(120,140,200,0.2)] bg-[rgba(120,140,200,0.04)] text-[#7880a0] hover:text-[#e0e4f0] hover:border-[rgba(74,158,255,0.4)] hover:bg-[rgba(74,158,255,0.06)]'
                }`}
        >
            <span className="text-[15px] leading-none">{added ? '✓' : '+'}</span>
            <span className="hidden sm:inline">{added ? 'Added' : 'Composite'}</span>
        </button>
    )
}

/** Small cart-count badge for the Composite tab button in the tab bar */
export function CompositeCartBadge() {
    const { items } = useCompositeCart()
    if (items.length === 0) return null
    return (
        <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
      rounded-full bg-[#4a9eff] text-[#0a0a12] text-[10px] font-bold font-mono leading-none">
            {items.length}
        </span>
    )
}