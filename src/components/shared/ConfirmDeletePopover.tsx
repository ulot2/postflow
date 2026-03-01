import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeletePopoverProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

export function ConfirmDeletePopover({
  children,
  onConfirm,
}: ConfirmDeletePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side="top"
        align="center"
        className="w-auto p-3 bg-white border-[#e0dbd3] shadow-lg rounded-xl flex flex-col gap-3"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 shrink-0">
            <Trash2 className="h-4 w-4 text-red-600" />
          </div>
          <p className="text-sm font-semibold text-[#0f0f0f]">Delete post?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 border-[#e0dbd3] text-[#6b6b6b] hover:bg-[#f0ebe1] hover:text-[#0f0f0f]"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              setIsOpen(false);
            }}
            className="h-8 bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
