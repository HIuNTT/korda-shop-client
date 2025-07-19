import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useCart } from "@/stores/cart"
import { CartProductVariant } from "@/types/cart"
import { Check, ChevronDown } from "lucide-react"
import { useMemo } from "react"
import { useReplaceCartItem } from "../services/replaceCartItem"
import { useDisclosure } from "@/hooks/use-disclosure"

interface Props {
  data: CartProductVariant[]
  activeId: number
  itemId: string
}

export default function VariantsPopover({ data, activeId, itemId }: Props) {
  const { updateCart, selectedIds, setPrices } = useCart()
  const { isOpen, onOpenChange, onClose } = useDisclosure()

  const replaceCartItem = useReplaceCartItem()

  const activeVariant = useMemo(() => data.find((item) => item.id === activeId), [activeId])

  const handleReplaceVariant = (variantId: number) => {
    if (activeId === variantId) return
    onClose()

    replaceCartItem.mutate(
      {
        item_id: itemId,
        new_variant_id: variantId,
        selected_ids: [...selectedIds],
      },
      {
        onSuccess: (data) => {
          if (data.products) {
            updateCart(data.products)
          }
          setPrices(data.prices)
        },
      },
    )
  }

  return (
    <div className="flex">
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            endContent={<ChevronDown />}
            className="text-sm"
          >{`Màu: ${activeVariant?.color}`}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[450px]" sideOffset={10} align="start">
          <div className="flex flex-wrap gap-3">
            {data.map((variant, idx) => (
              <button
                key={idx}
                className={cn(
                  "outline-border relative flex cursor-pointer items-center gap-2 rounded-sm border border-transparent px-2 py-1 text-center outline -outline-offset-1",
                  variant.id === activeId && "outline-primary overflow-hidden outline",
                )}
                onClick={() => handleReplaceVariant(variant.id)}
              >
                <img
                  width={32}
                  height={32}
                  className="max-h-8"
                  src={variant.image}
                  alt={variant.name}
                />
                <span className="text-sm font-medium">{variant.color}</span>
                {variant.id === activeId && (
                  <>
                    <span className="border-primary absolute top-0 right-0 h-0 w-0 border-t-16 border-l-16 border-l-transparent"></span>
                    <span className="text-primary-foreground absolute top-[0.5px] right-[0.5px]">
                      <Check width={8} height={8} />
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
