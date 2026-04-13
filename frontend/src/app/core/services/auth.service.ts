import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { LOGIN_QUERY, SIGNUP_MUTATION } from '../../graphql/operations';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  signup(input: { username: string; email: string; password: string }): Observable<any> {
    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables: { input },
      errorPolicy: 'all'
    }).pipe(
      map((result: any) => {
        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }

        const payload = result.data?.signup;
        if (!payload) {
          throw new Error(result.errors?.[0]?.message || 'Signup failed');
        }

        if (payload.token) {
          localStorage.setItem('token', payload.token);
        }

        return payload;
      })
    );
  }

  login(input: { usernameOrEmail: string; password: string }): Observable<any> {
    return this.apollo.query({
      query: LOGIN_QUERY,
      variables: { input },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }).pipe(
      map((result: any) => {
        if (result.errors?.length) {
          throw new Error(result.errors[0].message);
        }

        const payload = result.data?.login;
        if (!payload) {
          throw new Error(result.errors?.[0]?.message || 'Login failed');
        }

        if (payload.token) {
          localStorage.setItem('token', payload.token);
        }

        return payload;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
