import Header from '@/components/layout/header';
import { ThreadGenerator } from '@/components/thread-generator';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <Header />
      <main className="relative z-10 flex-1">
        <ThreadGenerator />
      </main>
    </div>
  );
}
