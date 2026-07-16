import { Bell, Menu, UserCircle2 } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold md:text-xl">
          Inventory Management
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />
        <UserCircle2 size={34} />
      </div>
    </header>
  );
}
