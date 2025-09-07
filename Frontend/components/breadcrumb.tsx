"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumb() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter(Boolean)

  const breadcrumbItems = [{ label: "Home", href: "/" }]

  // Build breadcrumb items based on path
  let currentPath = ""
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`

    let label = segment.charAt(0).toUpperCase() + segment.slice(1)

    // Custom labels for specific routes
    if (segment === "courses" && pathSegments[index + 1]) {
      label = "Courses"
    } else if (segment === "dashboard") {
      label = "Dashboard"
    } else if (segment === "admin") {
      label = "Admin Panel"
    } else if (segment === "login") {
      label = "Login"
    } else if (segment === "signup") {
      label = "Sign Up"
    }

    breadcrumbItems.push({
      label,
      href: currentPath,
    })
  })

  if (pathname === "/") return null

  return (
    <div className="bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center space-x-1 text-xs md:text-sm text-muted-foreground">
          <Link href="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-3 w-3 md:h-4 md:w-4" />
          </Link>
          {breadcrumbItems.slice(1).map((item, index) => (
            <div key={item.href} className="flex items-center space-x-1">
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              {index === breadcrumbItems.length - 2 ? (
                <span className="text-foreground font-medium truncate max-w-[100px] md:max-w-none">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors truncate max-w-[80px] md:max-w-none"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
