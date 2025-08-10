import { NavAccountItem } from "@/constants/navAccount"
import { Link, useLocation } from "react-router"

interface Props {
  items: NavAccountItem[]
}

export default function NavbarList({ items }: Props) {
  const { pathname } = useLocation()
  const checkIsActive = (href: string, item: NavAccountItem) =>
    href === item.url || href.startsWith(item.url)

  return (
    <div className="py-2 text-sm font-medium">
      {items.map((item, idx) => (
        <div
          key={idx}
          data-active={checkIsActive(pathname, item)}
          className="group data-[active=true]:border-primary data-[active=true]:text-primary data-[active=false]:hover:text-primary data-[active=false]:hover:border-primary border-l-2 border-transparent duration-300 hover:pl-1 data-[active=false]:hover:[background:linear-gradient(90deg,hsla(0,93%,94%,0.5),hsla(0,93%,94%,0))] data-[active=true]:[background:linear-gradient(90deg,hsla(0,93%,94%,0.5),hsla(0,93%,94%,0))]"
        >
          <Link to={item.url} className="flex items-center py-2.5 pr-2 pl-4">
            {item.iconOutline && (
              <item.iconOutline className="mr-3 size-5 group-hover:invisible group-hover:mr-0 group-hover:size-0 group-data-[active=true]:invisible group-data-[active=true]:mr-0 group-data-[active=true]:size-0" />
            )}
            {item.iconSolid && (
              <item.iconSolid className="invisible size-0 group-hover:visible group-hover:mr-3 group-hover:size-5 group-data-[active=true]:visible group-data-[active=true]:mr-3 group-data-[active=true]:size-5" />
            )}
            {item.title}
          </Link>
        </div>
      ))}
    </div>
  )
}
