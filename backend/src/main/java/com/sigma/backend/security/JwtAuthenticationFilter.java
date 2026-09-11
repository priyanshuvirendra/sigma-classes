package com.sigma.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService
    ) {
        this.jwtService = jwtService;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path =
                request.getRequestURI();

        String authHeader =
                request.getHeader("Authorization");


        // DEBUG

        System.out.println(
                "========================================"
        );

        System.out.println(
                "JWT FILTER REQUEST: " +
                request.getMethod() +
                " " +
                path
        );

        System.out.println(
                "AUTH HEADER PRESENT: " +
                (authHeader != null)
        );


        // No token

        if (
                authHeader == null ||
                !authHeader.startsWith("Bearer ")
        ) {

            System.out.println(
                    "JWT FILTER: NO BEARER TOKEN"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        String token =
                authHeader.substring(7);


        try {

            boolean valid =
                    jwtService.isTokenValid(token);


            System.out.println(
                    "JWT VALID: " +
                    valid
            );


            if (valid) {

                String username =
                        jwtService.extractUsername(
                                token
                        );

                String role =
                        jwtService.extractRole(
                                token
                        );


                System.out.println(
                        "JWT USERNAME: " +
                        username
                );

                System.out.println(
                        "JWT ROLE: " +
                        role
                );


                if (
                        username != null &&
                        role != null
                ) {

                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" + role
                            );


                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    List.of(authority)
                            );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );


                    System.out.println(
                            "AUTHENTICATION SET: " +
                            authentication
                                    .getAuthorities()
                    );

                } else {

                    System.out.println(
                            "JWT ERROR: USERNAME OR ROLE IS NULL"
                    );
                }

            } else {

                System.out.println(
                        "JWT ERROR: TOKEN INVALID"
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT EXCEPTION: " +
                    e.getClass().getName()
            );

            System.out.println(
                    "JWT MESSAGE: " +
                    e.getMessage()
            );

            SecurityContextHolder
                    .clearContext();
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}