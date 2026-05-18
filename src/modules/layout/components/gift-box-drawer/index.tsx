"use client"

import { useGiftBoxStore } from "@lib/store/use-gift-box-store"
import { Button } from "@modules/common/components/ui"
import Image from "next/image"
import { useState } from "react"

export default function GiftBoxDrawer({cartId }: {cartId?: string}) {
  const { items, clearBox } = useGiftBoxStore()

  const [isFinishing, setIsFinishing] = useState(false)
  
  if (items.length === 0) return null

  const handleFinalize = async () => {
    if (!cartId || items.length < 3) return

    setIsFinishing(true)

    try {
      // Calling the custom API route we created for the workflow
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/gift-box`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: cartId,
          productIds: items.map((i) => i.variant_id),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to finalize gift box")
      }

      // Success: Clear the local store and let the cart update
      clearBox()
      // You might want to trigger a cart refresh or redirect here
      window.location.href = "/cart" 
      
    } catch (error) {
      console.error("Workflow Error:", error)
      // Add a toast notification here if you have one
    } finally {
      setIsFinishing(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl transform transition-all duration-300 ease-in-out p-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-x-6">
        
        {/* Thumbnails of Curation */}
        <div className="flex items-center gap-x-2 overflow-x-auto pb-1 no-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="relative w-12 h-12 flex-shrink-0 border border-gray-100 rounded-sm overflow-hidden bg-gray-50">
              {item.thumbnail ? (
                <Image 
                  src={item.thumbnail} 
                  alt={item.title} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              )}
            </div>
          ))}
          {items.length < 3 && (
            <div className="w-12 h-12 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-bold">
              +{3 - items.length}
            </div>
          )}
        </div>

        {/* Action Column */}
        <div className="flex flex-col items-end gap-y-1">
          <div className="flex items-center gap-x-4">
             <button 
              onClick={clearBox}
              disabled={isFinishing}
              className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline underline-offset-4"
            >
              Clear All
            </button>
            <Button 
              onClick={handleFinalize}
              isLoading={isFinishing}
              disabled={items.length < 3 || isFinishing}
              className={`h-10 px-8 uppercase tracking-widest text-[10px] font-bold transition-all ${
                items.length >= 3 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gray-100 text-gray-400 border border-gray-200'
              }`}
            >
              {items.length >= 3 ? "Finalize Gift Box" : `Add ${3 - items.length} More`}
            </Button>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-medium">
            {items.length >= 3 ? "✨ Premium packaging unlocked" : "Curate 3+ pieces for a luxury box"}
          </p>
        </div>

      </div>
    </div>
  )
}
