import type { ReactNode } from 'react';
export default function GridShell({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gap: 12 }}>{children}</div>;
}
