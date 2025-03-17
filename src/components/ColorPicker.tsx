'use client';

import { PaletteIcon } from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { cn } from '@/shadcn/lib/utils';

import { useColor } from '@/contexts/ColorProvider';

interface ColorPickerProps {
  className?: string;
}

const colors = [
  { label: 'Neutral', value: 'neutral' },
  { label: 'Stone', value: 'stone' },
  { label: 'Zinc', value: 'zinc' },
  { label: 'Gray', value: 'gray' },
  { label: 'Slate', value: 'slate' },
  // { label: 'Orange', value: 'orange' },
  // { label: 'Green', value: 'green' },
  // { label: 'Blue', value: 'blue' },
  // { label: 'Yellow', value: 'yellow' },
  // { label: 'Violet', value: 'violet' },
];

export default function ColorPickerDropdown() {
  const { setColor } = useColor();

  return (
    <DropdownMenuContent align="end">
      {colors.map((color) => (
        <DropdownMenuItem key={`color-${color.value}`} onClick={() => setColor(color.value)}>
          {color.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  );
}

export function ColorPicker({ className }: ColorPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('p size-8', className)}>
          <PaletteIcon />
          <span className="sr-only">Set theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <ColorPickerDropdown />
    </DropdownMenu>
  );
}
