package com.example.servlet;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
        response.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        
        try {
            User user = mapper.readValue(request.getInputStream(), User.class);
            String pathInfo = request.getPathInfo();
            
            if (pathInfo != null && pathInfo.endsWith("/login")) {
                String username = user.getUsername();
                String password = user.getPassword();
    
                boolean authenticated = users.stream()
                    .anyMatch(u -> u.getUsername().equals(username) && u.getPassword().equals(password));
                if (authenticated) {
                    User loggedInUser = users.stream()
                        .filter(u -> u.getUsername().equals(username))
                        .findFirst()
                        .get();
                    HttpSession session = request.getSession();
                    session.setAttribute("user", loggedInUser);
                    response.getWriter().write("{\"message\": \"Login successful\", \"userType\": \"" + loggedInUser.getUserType() + "\"}");
                } else {
                    response.getWriter().write("{\"message\": \"Authentication failed\"}");
                }
            } else {
                response.getWriter().write("{\"message\": \"Invalid request\"}");
            }
        } catch (IOException e) {
            response.getWriter().write("{\"message\": \"Error processing request\"}");
            e.printStackTrace();
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