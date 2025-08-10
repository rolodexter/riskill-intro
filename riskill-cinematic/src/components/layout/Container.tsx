import type { ReactNode } from 'react';
export default function Container({ children }: { children: ReactNode }) {
  return <div style={{ maxWidth: 1280, margin: '0 auto', padding: 16 }}>{children}</div>;
}
