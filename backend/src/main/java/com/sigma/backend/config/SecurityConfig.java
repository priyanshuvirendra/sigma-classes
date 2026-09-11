package com.sigma.backend.config;

import com.sigma.backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource,
            JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .sessionManagement(session -> session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/students/resend-verification",
                                "/api/students/forgot-password",
                                "/api/students/reset-password")
                        .permitAll()
                        // CORS preflight
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**")
                        .permitAll()

                        .requestMatchers("/api/students/change-password").hasRole("STUDENT")
                        // Student enquiry submission
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/enquiries")
                        .permitAll()

                        // Admin login
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login")
                        .permitAll()

                        // Student registration
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/students/register")
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/students/verify-email")
                        .permitAll()

                        // Student login
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/students/auth/login")
                        .permitAll()


                        // Student Google login
.requestMatchers(
        HttpMethod.POST,
        "/api/students/auth/google")
.permitAll()


// Admin-only APIs
.requestMatchers("/api/admin/**")
.hasRole("ADMIN")

// Student-only APIs
.requestMatchers("/api/student/**")
.hasRole("STUDENT")

// Faculty login
.requestMatchers(
        HttpMethod.POST,
        "/api/faculty/auth/login"
)
.permitAll()

// Faculty-only APIs
.requestMatchers("/api/faculty/**")
.hasRole("FACULTY")
                        // Existing enquiry management
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/enquiries/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/enquiries/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/enquiries/**")
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/courses/**")
                        .permitAll()
                        .requestMatchers("/api/students/profile").hasRole("STUDENT")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/youtube-content/**")
                        .permitAll()

                        .requestMatchers("/error").permitAll()
                        // Everything else


                            // Faculty setup - development only
.requestMatchers(
        HttpMethod.POST,
        "/api/setup/faculty"
)
.permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"));

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"));

        configuration.setAllowedHeaders(
                List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration);

        return source;
    }
}