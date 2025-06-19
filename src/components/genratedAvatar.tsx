import React from 'react'
import {createAvatar} from "@dicebear/core";
import {botttsNeutral, initials} from "@dicebear/collection";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface GeneratedAvatarProps {
    seed: string;
    className?: string;
    variant: "bottsNetutral" | "initials"
}

export default function GenratedAvatar({seed, className,variant}: GeneratedAvatarProps) {
    let avatar;

    if(variant === 'bottsNetutral'){
        avatar = createAvatar(botttsNeutral, {
            seed
        })
    }
    else{
        avatar = createAvatar(initials, {
            seed,
            fontWeight: 500,
            fontSize: 42
        })
    }


  return (
    <div>
        <Avatar className={cn(className)}>
            <AvatarImage src={avatar.toDataUri()} alt='Avatar'/>
            <AvatarFallback>
                {seed
                    .split(' ')
                    .map(word => word[0]?.toUpperCase())
                    .join('')
                    .slice(0, 2)}
            </AvatarFallback>
        </Avatar>
    </div>
  )
}
