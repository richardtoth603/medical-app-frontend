import { Button } from "@/components/ui/button";

export interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  title: string;
  items: NavItem[];
  onNavigate: (href: string) => void;
}

export function Navbar({ title, items, onNavigate }: NavbarProps) {
  return (
    <nav className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="space-x-4">
          {items.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              onClick={() => onNavigate(item.href)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
