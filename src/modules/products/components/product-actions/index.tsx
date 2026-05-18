"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

// --- CUSTOM MODULES ---
import JewelryBadges from "../jewelry-badges"
import { useGiftBoxStore } from "@lib/store/use-gift-box-store"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct & { 
    jewelry_specs?: {
      is_anti_tarnish?: boolean
      is_water_resistant?: boolean
      is_hypoallergenic?: boolean
      plating?: string
    }
  }
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)

  // --- GIFT BOX STATE ---
  const { addItem, items: boxItems } = useGiftBoxStore()
  const isInBox = useMemo(() => 
    boxItems.some((item) => item.id === product.id), 
  [boxItems, product.id])

  // Preselect options if only 1 variant exists
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // --- RESTORED URL SYNC LOGIC ---
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString(), { scroll: false })
  }, [selectedVariant, isValidVariant, pathname, router, searchParams])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    return (selectedVariant?.inventory_quantity || 0) > 0
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })
    setIsAdding(false)
  }

  const handleAddToGiftBox = () => {
    if (selectedVariant) {
      addItem({
        id: product.id!,
        variant_id: selectedVariant.id!,
        title: product.title!,
        thumbnail: product.thumbnail,
      })
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        {/* Quality Signaling Header */}
        <JewelryBadges specs={product.jewelry_specs} />

        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              ))}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <div className="flex flex-col gap-y-3 mt-4">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant}
            variant="primary"
            className="w-full h-12 uppercase tracking-widest"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!selectedVariant && !options
              ? "Select variant"
              : !inStock || !isValidVariant
              ? "Out of stock"
              : "Add to cart"}
          </Button>

          {/* Custom Gift Box Curation Action */}
          <Button
            onClick={handleAddToGiftBox}
            disabled={!selectedVariant || isInBox || !!disabled || !inStock}
            variant="secondary"
            className={`w-full h-12 uppercase tracking-widest border-2 transition-all duration-200 ${
              isInBox 
                ? "border-green-500 text-green-600 bg-green-50" 
                : "border-amber-400 text-amber-900 hover:bg-amber-50"
            }`}
          >
            {isInBox ? "✓ Added to Box" : "Add to Custom Gift Box"}
          </Button>

          <p className="text-[10px] text-center text-gray-400 uppercase tracking-[0.1em] font-medium">
            {boxItems.length < 3 
              ? `Collect ${3 - boxItems.length} more pieces for Premium Packaging` 
              : "✨ Premium Packaging Unlocked"}
          </p>
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
