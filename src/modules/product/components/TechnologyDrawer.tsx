import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { GetProductResponse } from "../services/getProduct"
import { X } from "lucide-react"
import { forwardRef, useImperativeHandle, ForwardedRef, useRef } from "react"
import { useDisclosure } from "@/hooks/use-disclosure"
import TechnologySlide from "./TechnologySlide"

interface Props {
  data: GetProductResponse["attribute_items"]
}

export interface TechDrawerRef {
  onOpen: () => void
}

function TechnologyDrawer({ data }: Props, ref: ForwardedRef<TechDrawerRef>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const techContentRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    onOpen,
  }))

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader className="flex flex-row items-center justify-between border-b">
          <DrawerTitle className="text-lg">Thông số kỹ thuật</DrawerTitle>
          <DrawerDescription>{null}</DrawerDescription>
          <DrawerClose asChild className="cursor-pointer" data-vaul-no-drag>
            <X />
          </DrawerClose>
        </DrawerHeader>
        <div className="sticky top-0 border-b">
          <div className="px-4">
            <TechnologySlide data={data} />
          </div>
        </div>
        <div
          id="tech-content"
          ref={techContentRef}
          className="scrollbar-none flex flex-col overflow-y-scroll px-5 pb-15"
        >
          {data.map((att, idx) => (
            <div id={`item-${idx}`} key={idx} className="pt-5 select-text">
              <div className="mb-2.5 text-base font-semibold">
                <span data-vaul-no-drag>{att.group_name}</span>
              </div>
              <Table>
                <TableBody className="[&_tr:last-child]:border-b">
                  {att.attributes.map((attribute, index) => (
                    <TableRow key={index} className="border-dashed">
                      <TableCell className="text-muted-foreground w-2/5 py-1.5 font-medium whitespace-normal">
                        <span data-vaul-no-drag>{attribute.name}</span>
                      </TableCell>
                      <TableCell className="w-full py-1.5 whitespace-pre-wrap">
                        <span data-vaul-no-drag>{attribute.value}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
          <div>
            <div style={{ height: "524px" }}></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default forwardRef(TechnologyDrawer)
