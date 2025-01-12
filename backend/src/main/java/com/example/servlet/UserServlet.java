package com.example.servlet;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class UserServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> requestBody = mapper.readValue(request.getInputStream(), new TypeReference<Map<String, String>>() {});
        String username = requestBody.get("username");
        String password = requestBody.get("password");
        
        // Authentication logic
        if ("admin".equals(username) && "admin123".equals(password)) {
            response.getWriter().write("User authenticated: " + username);
        } else {
            response.getWriter().write("Authentication failed");
        }    }
}