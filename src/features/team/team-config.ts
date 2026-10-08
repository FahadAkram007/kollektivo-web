/** A person with portal access, as shop team and HR team both list them. */
export interface TeamMember {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  hasSignedIn: boolean;
  isYou: boolean;
}

export interface NewTeamMember {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface TeamRole {
  value: string;
  label: string;
  description: string;
}

/** What differs between the shop team and the HR team; the screens are the same. */
export interface TeamConfig {
  queryKey: readonly unknown[];
  list: () => Promise<TeamMember[]>;
  add: (member: NewTeamMember) => Promise<void>;
  remove: (userId: string) => Promise<void>;
  /** First = the default for new people. */
  roles: TeamRole[];
  listDescription: string;
  /** Shown when removing the last owner. */
  lastOwnerText: string;
}

export function roleLabel(config: TeamConfig, role: string): string {
  return config.roles.find((candidate) => candidate.value === role)?.label ?? role;
}
