package com.example.servlet;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/user")
public class UserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);

        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> requestBody = mapper.readValue(request.getInputStream(), new TypeReference<Map<String, String>>() {});
        String username = requestBody.get("username");
        String password = requestBody.get("password");

        // Authentication logic
        if ("admin".equals(username) && "admin123".equals(password)) {
            response.getWriter().write("{\"message\": \"User authenticated\", \"userType\": \"admin\"}");
        } else if ("user".equals(username) && "user123".equals(password)) {
            response.getWriter().write("{\"message\": \"User authenticated\", \"userType\": \"user\"}");
        } else {
            response.getWriter().write("{\"message\": \"Authentication failed\"}");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Example response for GET request
        String jsonResponse = "{\"message\": \"This endpoint is for user authentication. Please use POST method.\"}";
        response.getWriter().write(jsonResponse);
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
}