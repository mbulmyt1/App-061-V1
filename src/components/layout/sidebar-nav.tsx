"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
  onNavClick?: () => void
}

export function SidebarNav({
  className,
  items,
  onNavClick,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        // "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        "flex space-x-2 flex-col space-x-0 space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavClick}
          className={cn(
            "justify-start hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium",
            pathname === item.href
              ? "bg-muted text-foreground"
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}