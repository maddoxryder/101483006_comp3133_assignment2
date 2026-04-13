import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpHeaders } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const authLink = new ApolloLink((operation, forward) => {
        const token = localStorage.getItem('token') || '';

        operation.setContext({
          headers: new HttpHeaders().set(
            'Authorization',
            token ? `Bearer ${token}` : ''
          )
        });

        return forward(operation);
      });

      const http = httpLink.create({
        uri: 'http://localhost:8081/graphql'
      });

      return {
        link: authLink.concat(http),
        cache: new InMemoryCache()
      };
    })
  ]
};
