'use client';

import { PaletteIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { useColor } from '@/contexts/ColorProvider';

interface ColorPickerProps {
  className?: string;
}

const colors = [
  { label: 'Zinc', value: 'zinc' },
  { label: 'Slate', value: 'slate' },
  { label: 'Stone', value: 'stone' },
  { label: 'Gray', value: 'gray' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Orange', value: 'orange' },
  { label: 'Green', value: 'green' },
  { label: 'Blue', value: 'blue' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Violet', value: 'violet' },
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
          <PaletteIcon className="size-3" />
          <span className="sr-only">Set theme color</span>
        </Button>
      </DropdownMenuTrigger>
      <ColorPickerDropdown />
    </DropdownMenu>
  );
}
