"use client"

import { Fragment, useMemo } from "react"
import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  // --- LOGICAL GROUPING ---
  const { groupedBoxes, standaloneItems } = useMemo(() => {
    if (!items) return { groupedBoxes: [], standaloneItems: [] }

    const boxes: Record<string, HttpTypes.StoreCartLineItem[]> = {}
    const standalone: HttpTypes.StoreCartLineItem[] = []

    items.forEach((item) => {
      const boxId = (item.metadata as any)?.box_id
      if ((item.metadata as any)?.is_gift_box_item && boxId) {
        if (!boxes[boxId]) boxes[boxId] = []
        boxes[boxId].push(item)
      } else {
        standalone.push(item)
      }
    })

    return { 
      groupedBoxes: Object.values(boxes), 
      standaloneItems: standalone.sort((a, b) => 
        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
      ) 
    }
  }, [items])

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items ? (
            <>
              {/* 1. RENDER GIFT BOXES */}
              {groupedBoxes.map((box, idx) => (
                <Fragment key={`box-${idx}`}>
                  {/* Subtle Box Header Row */}
                  <Table.Row className="bg-amber-50/50 border-x-2 border-amber-200">
                    <Table.Cell colSpan={5} className="py-2 !pl-4">
                      <div className="flex items-center gap-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Mishminimals Premium Gift Box
                        </span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                  
                  {box.map((item) => (
                    <Table.Row key={item.id} className="border-x-2 border-amber-200 bg-amber-50/20">
                      <Item
                        item={item}
                        currencyCode={cart?.currency_code}
                      />
                    </Table.Row>
                  ))}
                  
                  {/* Visual Spacer after a box */}
                  <Table.Row className="h-4 border-t-2 border-amber-200"><Table.Cell colSpan={5} /></Table.Row>
                </Fragment>
              ))}

              {/* 2. RENDER STANDALONE ITEMS */}
              {standaloneItems.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code}
                />
              ))}
            </>
          ) : (
            repeat(5).map((i) => <SkeletonLineItem key={i} />)
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
