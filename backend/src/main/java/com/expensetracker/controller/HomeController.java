package com.expensetracker.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return """
            <!DOCTYPE html>
            <html>
              <head>
                <title>Personal Expense Management API</title>
                <style>
                  body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                  .card { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; max-width: 500px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                  h1 { color: #38bdf8; margin-top: 0; }
                  a { color: #60a5fa; text-decoration: none; }
                  .pill { display: inline-block; background: #0284c7; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; }
                </style>
              </head>
              <body>
                <div class="card">
                  <div class="pill">Backend Active (Spring Boot)</div>
                  <h1>Expense Tracker API</h1>
                  <p>Personal Expense Management System Backend is running smoothly.</p>
                  <p>Explore <a href="/api/health">/api/health</a> or <a href="/api/analytics/overview">/api/analytics/overview</a></p>
                </div>
              </body>
            </html>
            """;
    }
}
