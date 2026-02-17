import { Injectable } from '@angular/core';
import { User, MOCK_USERS } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [];

  public currentUser: User | null = null;

  constructor() {
    this.initUsers();
  }

  private initUsers() {
    this.users = [...MOCK_USERS];
    console.log('[AuthService] Initialized .');
  }

  get currentUserValue(): User | null {
    return this.currentUser;
  }

  login(email: string, password: string): boolean {
    console.log(`[AuthService] Login attempt for email: ${email}`);
    //sanitize input
    const normalizedEmail = email.trim().toLowerCase();

    const user = this.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password,
    );
    if (user) {
      this.currentUser = user;
      console.log('[AuthService] Login successful:', user);
      return true;
    }
    return false;
  }

  //accepts form data and handles User object creation
  register(userData: Partial<User>): boolean {
    console.log('[AuthService] Register attempt with data:', userData);

    const normalizedEmail = userData.email!.trim().toLowerCase();

    if (this.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return false;
    }

    const newUser: User = {
      userId: 'u' + crypto.randomUUID(),
      name: userData.name!,
      email: normalizedEmail,
      password: userData.password!,
      contactNumber: userData.contactNumber!,
      role: 'user',
      location: userData.location!,
    };

    this.users.push(newUser);

    this.currentUser = newUser;

    console.log('[AuthService] Registration successful. New user added.');
    return true;
  }

  logout() {
    console.log('[AuthService] Logging out user:', this.currentUser?.name);
    this.currentUser = null;
  }

  updateProfile(updatedUser: User) {
    console.log('[AuthService] Updating profile for user:', updatedUser.userId);
    this.users = this.users.map((u) => (u.userId === updatedUser.userId ? updatedUser : u));

    this.currentUser = updatedUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getUserName(userId: string): string {
    const u = this.users.find((user) => user.userId === userId);
    return u ? u.name : 'Guest User';
  }
}
