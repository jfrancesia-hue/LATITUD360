import * as React from "react";
import { initials } from "@latitud360/shared";
import { cn } from "../lib/cn";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  const init = initials(name);
  return (
    <div
      className={cn(
        "shrink-0 rounded-pill bg-gradient-to-br from-naranja via-dorado to-turquesa p-[2px]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-pill object-cover bg-mina"
        />
      ) : (
        <div className="w-full h-full rounded-pill bg-mina flex items-center justify-center font-heading italic text-artico"
             style={{ fontSize: size * 0.42 }}>
          {init}
        </div>
      )}
    </div>
  );
}
