"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, MapPin } from "lucide-react"
import { Location } from "@/app/types/trip"

interface SortableItineraryProps {
  locations: Location[]
  onReorder?: (locations: Location[]) => void
  onDelete?: (locationId: string) => void
}

interface SortableItemProps {
  location: Location
  index: number
  onDelete?: (locationId: string) => void
}

function SortableItem({ location, index, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: location.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 transition-colors ${
        isDragging ? "shadow-lg border-gray-400 bg-white z-10" : "hover:border-gray-300"
      }`}
    >
      {/* drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
        aria-label="drag to reorder"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      {/* order number */}
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-white text-xs font-medium shrink-0">
        {index + 1}
      </div>

      {/* location details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {location.locationTitle}
        </p>
        <p className="text-xs text-muted-foreground">
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      </div>

      {/* delete button */}
      {onDelete && (
        <button
          onClick={() => onDelete(location.id)}
          className="p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded transition-colors"
          aria-label="delete location"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default function SortableItinerary({
  locations: initialLocations,
  onReorder,
  onDelete
}: SortableItineraryProps) {
  const [locations, setLocations] = useState(initialLocations)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setLocations((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        onReorder?.(newItems)
        return newItems
      })
    }
  }

  const handleDelete = (locationId: string) => {
    const newLocations = locations.filter(loc => loc.id !== locationId)
    setLocations(newLocations)
    onDelete?.(locationId)
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">no locations in your itinerary yet</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={locations.map(loc => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {locations.map((location, index) => (
            <SortableItem
              key={location.id}
              location={location}
              index={index}
              onDelete={onDelete ? handleDelete : undefined}
            />
          ))}
        </div>
      </SortableContext>

      <div className="pt-3 text-xs text-muted-foreground text-center">
        drag to reorder • {locations.length} {locations.length === 1 ? "location" : "locations"}
      </div>
    </DndContext>
  )
}
