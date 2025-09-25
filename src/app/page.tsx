import Header from '@/components/layout/header';
import { ThreadGenerator } from '@/components/thread-generator';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <ThreadGenerator />
      </main>
    </div>
  );
}
