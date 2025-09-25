import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-3">
          <Logo className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-foreground">ThreadPilot</span>
        </Link>
      </div>
    </header>
  );
}
