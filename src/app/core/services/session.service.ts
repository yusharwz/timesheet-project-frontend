import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { JwtClaims } from "../../shared/models/jwt-claims.model";
import { UserInfo } from "../../shared/models/user-info.model";


@Injectable({
  providedIn: "root",
})
export class SessionService {
  constructor(private readonly storage: Storage = sessionStorage) {}
  set(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  get(key: string): string | null {
    return this.storage.getItem(key);
  }

  clearSession(): void {
    this.storage.clear()
  }

  isAuthenticated(): boolean {
    return (
      this.isTokenValid(this.get('token')) &&
      this.isTokenExpired(this.get('token'))
    )
  }

  private isTokenValid(token: string | null): boolean {
    return token ? token.split('.').length === 3 : false
  }

  private isTokenExpired(token: string | null): boolean {
    try {
      const { exp } = this.getJwtClaims(token) || { exp: null }
      return !!exp && Date.now() < exp * 1000
    } catch {
      return false
    }
  }

  private getJwtClaims(token: string | null): JwtClaims | null {
    return token ? jwtDecode<JwtClaims>(token) : null
  }

  public getUserInfo(): UserInfo | null {
    const { id, email, username, roles } = this.getJwtClaims(this.get('token')) || {}
    return id && email && username && roles ? { id, email, username, roles } : null
  }
}
