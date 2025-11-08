export type UserRole = 'admin' | 'merchant' | 'beneficiary' | 'association';

export type AccountStatus = 'pending' | 'active' | 'inactive';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    status: AccountStatus;
    password?: string;
}