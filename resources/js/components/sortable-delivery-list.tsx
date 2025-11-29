import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableItem } from "./sortable-item"
import { Card } from "@/components/ui/card"

export function SortableDeliveryList({ items, setItems }: any) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i: any) => i.id === active.id)
      const newIndex = items.findIndex((i: any) => i.id === over.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <Card className="p-4 space-y-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item: any) => (
            <SortableItem key={item.id} id={item.id}>
              <div className="p-3 bg-muted rounded-md flex justify-between">
                <div>
                  <p className="font-semibold">{item.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{item.address}</p>
                </div>
                <span className="text-sm opacity-50">Drag</span>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </Card>
  )
}