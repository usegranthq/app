'use client';

import { PaletteIcon } from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { cn } from '@/shadcn/lib/utils';

import { useColor } from '@/contexts/ColorProvider';

interface ColorPickerProps {
  className?: string;
}

type ColorPickerItemColor = {
  label: string;
  value: string;
  type: 'color';
};

type ColorPickerItemSeparator = {
  type: 'separator';
};

type ColorPickerItemLabel = {
  type: 'label';
  label: string;
};

type ColorPickerItem = ColorPickerItemColor | ColorPickerItemSeparator | ColorPickerItemLabel;

const colors: ColorPickerItem[] = [
  { type: 'color', label: 'Neutral', value: 'neutral' },
  { type: 'color', label: 'Orange', value: 'orange' },
  { type: 'separator' },
  { type: 'label', label: 'Modern' },
  { type: 'color', label: 'Solar Dusk', value: 'solar-dusk' },
  { type: 'color', label: 'Caffine', value: 'caffine' },
  { type: 'color', label: 'Claude', value: 'claude' },
  { type: 'color', label: 'Vercel', value: 'vercel' },
  { type: 'color', label: 'Cosmic Night', value: 'cosmic-night' },
];

export default function ColorPickerDropdown() {
  const { setColor } = useColor();

  return (
    <DropdownMenuContent align="end">
      {colors.map((color) => {
        if (color.type === 'separator') {
          return <DropdownMenuSeparator key={`separator-${color.type}`} />;
        }

        if (color.type === 'label') {
          return (
            <DropdownMenuLabel key={`label-${color.type}`} className="font-medium text-xs text-muted-foreground">
              {color.label}
            </DropdownMenuLabel>
          );
        }

        return (
          <DropdownMenuItem key={`color-${color.value}`} onClick={() => setColor(color.value)}>
            {color.label}
          </DropdownMenuItem>
        );
      })}
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
