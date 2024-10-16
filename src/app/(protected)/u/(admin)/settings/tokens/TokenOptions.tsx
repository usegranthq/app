'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { deleteToken } from '@/actions/settings';
import { Token } from '@/types/app.types';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TokenOptions({ token }: { token: Token }) {
  const handleDelete = async () => {
    const error = await deleteToken(token.id);
    if (error) {
      toast.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="mr-4 size-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          Delete token
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
