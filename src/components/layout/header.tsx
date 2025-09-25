import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">ThreadPilot</span>
        </Link>
      </div>
    </header>
  );
}
