import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'buyer' | 'seller' | 'admin';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'buyer' | 'seller' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'buyer' | 'seller' | 'admin';
  }
}
