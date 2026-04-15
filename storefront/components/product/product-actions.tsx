'use client'

import { useMemo, useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Check, Loader2, Package, Flame, ShieldCheck, Clock } from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'
import Link from 'next/link'

interface ProductActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(variant: ProductVariantWithPrice | undefined): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

// Fake live visitor count for urgency
function useViewerCount(): number {
  const [count, setCount] = useState(23)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const delta = Math.random() > 0.5 ? 1 : -1
        return Math.min(42, Math.max(14, c + delta))
      })
    }, 4500)
    return () => clearInterval(interval)
  }, [])
  return count
}

// Countdown timer for "sale ends" urgency
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 47, s: 12 })
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) return { h: 2, m: 59, s: 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return timeLeft
}

const BUNDLE_HANDLE = 'gripforce-complete-training-set-all-5-levels'
const SINGLE_HANDLE = 'gripforce-silicone-resistance-ring'

export default function ProductActions({ product, variantExtensions }: ProductActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) {
          defaults[optionId] = opt.value
        }
      }
    }
    return defaults
  })

  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  const viewerCount = useViewerCount()
  const countdown = useCountdown()

  const isSingleProduct = product.handle === SINGLE_HANDLE

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return variants.find((v: ProductVariantWithPrice) => {
      if (!v.options) return false
      return v.options.every((opt: VariantOption) => {
        const optionId = opt.option_id || opt.option?.id
        if (!optionId) return false
        return selectedOptions[optionId] === opt.value
      })
    }) || variants[0]
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id ? variantExtensions?.[selectedVariant.id] : null
  const currentPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency = (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const manageInventory = ext?.manage_inventory ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock = manageInventory && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock = manageInventory && inventoryQuantity != null && inventoryQuantity > 0 && inventoryQuantity < 10

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    addItem(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          toast.success('Added to bag')
          const metaValue = toMetaCurrencyValue(currentPriceCents)
          trackAddToCart(product?.id || '', selectedVariant.id, quantity, currentPriceCents ?? undefined)
          trackMetaEvent('AddToCart', {
            content_ids: [selectedVariant.id],
            content_type: 'product',
            content_name: product?.title,
            value: metaValue,
            currency,
            contents: [{ id: selectedVariant.id, quantity, item_price: metaValue }],
            num_items: quantity,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to add to bag')
        },
      }
    )
  }

  const hasMultipleVariants = variants.length > 1

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="space-y-5">
      {/* Price */}
      <ProductPrice
        amount={currentPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Urgency — live viewers */}
      <div className="flex items-center gap-2 text-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(4,85%,50%)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(4,85%,50%)]" />
        </span>
        <span className="text-muted-foreground">
          <strong className="text-foreground">{viewerCount} people</strong> viewing this right now
        </span>
      </div>

      {/* Countdown timer */}
      <div className="flex items-center gap-3 bg-[hsl(4,85%,50%)]/8 border border-[hsl(4,85%,50%)]/20 px-4 py-3 rounded-sm">
        <Clock className="h-4 w-4 text-[hsl(4,85%,50%)] flex-shrink-0" />
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Sale ends in:</span>
          <span className="font-mono font-bold text-[hsl(4,85%,50%)]">
            {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
          </span>
        </div>
      </div>

      {/* Option Selectors */}
      {hasMultipleVariants && options.map((option: ProductOptionWithValues) => {
        const values = (option.values || []).map((v: string | ProductOptionValue) =>
          typeof v === 'string' ? v : v.value
        ).filter(Boolean) as string[]

        if (values.length <= 1 && (values[0] === 'One Size' || values[0] === 'Default')) {
          return null
        }

        const optionId = option.id
        const selectedValue = selectedOptions[optionId]

        return (
          <div key={optionId}>
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
              {option.title}
              {selectedValue && (
                <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                  — {selectedValue}
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = selectedValue === value

                const isAvailable = variants.some((v: ProductVariantWithPrice) => {
                  const hasValue = v.options?.some(
                    (o: VariantOption) => (o.option_id === optionId || o.option?.id === optionId) && o.value === value
                  )
                  if (!hasValue) return false
                  const vExt = variantExtensions?.[v.id]
                  if (!vExt?.manage_inventory) return true
                  return vExt.inventory_quantity == null || vExt.inventory_quantity > 0
                })

                // Map color dots for resistance levels
                const colorMap: Record<string, string> = {
                  'Extra Soft (Yellow)': 'bg-yellow-400',
                  'Soft (Green)': 'bg-green-500',
                  'Medium (Blue)': 'bg-blue-500',
                  'Hard (Red)': 'bg-red-500',
                  'Extra Hard (Black)': 'bg-gray-900',
                }
                const dotColor = colorMap[value]

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(optionId, value)}
                    disabled={!isAvailable}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm border transition-all ${
                      isSelected
                        ? 'border-[hsl(4,85%,50%)] bg-[hsl(4,85%,50%)]/5 font-semibold'
                        : isAvailable
                        ? 'border-border hover:border-[hsl(4,85%,50%)]'
                        : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                    }`}
                  >
                    {dotColor && (
                      <span className={`w-3 h-3 rounded-full ${dotColor} flex-shrink-0`} />
                    )}
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Low Stock Warning */}
      {isLowStock && (
        <div className="flex items-center gap-2 text-sm font-medium text-[hsl(4,85%,50%)]">
          <Flame className="h-4 w-4" />
          Only {inventoryQuantity} left in stock — order soon
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex gap-3">
        <div className="flex items-center border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-muted transition-colors"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-muted transition-colors"
            disabled={isOutOfStock || (inventoryQuantity != null && quantity >= inventoryQuantity)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingItem}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold uppercase tracking-wide transition-all ${
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : justAdded
              ? 'bg-green-700 text-white'
              : 'bg-[hsl(0,0%,8%)] text-white hover:bg-[hsl(0,0%,15%)]'
          }`}
        >
          {isAddingItem ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" />
              Added to Bag
            </>
          ) : isOutOfStock ? (
            'Sold Out'
          ) : (
            'Add to Bag'
          )}
        </button>
      </div>

      {/* Bundle upsell — only show on single product page */}
      {isSingleProduct && (
        <div className="border-2 border-[hsl(4,85%,50%)] rounded-sm overflow-hidden">
          <div className="bg-[hsl(4,85%,50%)] px-4 py-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-white flex-shrink-0" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              Best Value — Save 38%
            </span>
          </div>
          <div className="px-4 py-4 space-y-3 bg-[hsl(4,85%,50%)]/3">
            <div>
              <p className="font-bold text-sm">Upgrade to the Complete Training Set</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Get all 5 resistance levels + carry pouch for just $39.99 instead of buying 5 rings separately ($64.95).
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg">$39.99</span>
              <span className="text-sm text-muted-foreground line-through">$64.95</span>
              <span className="text-xs font-semibold text-[hsl(4,85%,50%)]">Save $24.96</span>
            </div>
            <Link
              href={`/products/${BUNDLE_HANDLE}`}
              className="flex items-center justify-center gap-2 w-full bg-[hsl(4,85%,50%)] text-white py-3 text-sm font-bold uppercase tracking-wide hover:bg-[hsl(4,85%,42%)] transition-colors"
            >
              Get Complete Set — All 5 Levels
              <Package className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Trust signals */}
      <div className="grid grid-cols-3 gap-3 pt-1 border-t">
        <div className="flex flex-col items-center text-center gap-1.5 pt-4">
          <ShieldCheck className="h-5 w-5 text-[hsl(4,85%,50%)]" strokeWidth={1.5} />
          <p className="text-[11px] font-semibold leading-tight">30-Day Money Back</p>
          <p className="text-[10px] text-muted-foreground">No questions asked</p>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5 pt-4">
          <svg className="h-5 w-5 text-[hsl(4,85%,50%)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <p className="text-[11px] font-semibold leading-tight">Free Shipping</p>
          <p className="text-[10px] text-muted-foreground">Orders over $35</p>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5 pt-4">
          <svg className="h-5 w-5 text-[hsl(4,85%,50%)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-[11px] font-semibold leading-tight">Secure Payment</p>
          <p className="text-[10px] text-muted-foreground">256-bit SSL</p>
        </div>
      </div>

      {/* Payment icons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {['VISA', 'MC', 'AMEX', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
          <span
            key={method}
            className="px-2 py-1 bg-muted border border-border text-[9px] font-bold text-muted-foreground rounded-sm tracking-wide"
          >
            {method}
          </span>
        ))}
      </div>
    </div>
  )
}
