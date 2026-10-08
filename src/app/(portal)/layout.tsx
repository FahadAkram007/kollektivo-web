import { SessionGate } from '@/features/portal/session-gate';

/** Every page behind sign-in: checks the session and loads the person's shops and companies. */
export default function PortalLayout({ children }: LayoutProps<'/'>) {
  return <SessionGate>{children}</SessionGate>;
}
