package com.example.servlet;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/user/*")
public class UserServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private List<User> users;

    public UserServlet() {
        try {
            // Read users from JSON file
            byte[] jsonData = Files.readAllBytes(Paths.get("src/main/resources/users.json"));
            ObjectMapper objectMapper = new ObjectMapper();
            users = objectMapper.readValue(jsonData, new TypeReference<List<User>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            users = new ArrayList<>();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        ObjectMapper mapper = new ObjectMapper();
        User user = mapper.readValue(request.getInputStream(), User.class);

        if (request.getPathInfo().endsWith("/signup")) {
            users.add(user);
            saveUsers();
            response.getWriter().write("{\"message\": \"User created successfully\"}");
        } else if (request.getPathInfo().endsWith("/login")) {
            boolean authenticated = users.stream()
                .anyMatch(u -> u.getUsername().equals(user.getUsername()) && u.getPassword().equals(user.getPassword()));
            if (authenticated) {
                String userType = users.stream()
                    .filter(u -> u.getUsername().equals(user.getUsername()))
                    .findFirst()
                    .get()
                    .getUserType();
                response.getWriter().write("{\"message\": \"Login successful\", \"userType\": \"" + userType + "\"}");
            } else {
                response.getWriter().write("{\"message\": \"Authentication failed\"}");
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(users));
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from this origin
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
    }

    private void saveUsers() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Files.write(Paths.get("src/main/resources/users.json"), mapper.writeValueAsBytes(users));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}