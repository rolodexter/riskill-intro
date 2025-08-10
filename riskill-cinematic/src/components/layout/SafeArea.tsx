import type { ReactNode } from 'react';
export default function SafeArea({ children }: { children: ReactNode }) {
  return <div style={{ minHeight: '100dvh' }}>{children}</div>;
}
