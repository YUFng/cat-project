package com.example.servlet;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/user/address")
public class AddressServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Map<String, String> userAddresses;

    public AddressServlet() {
        try {
            // Read addresses from JSON file
            byte[] jsonData = Files.readAllBytes(Paths.get("src/main/resources/addresses.json"));
            ObjectMapper objectMapper = new ObjectMapper();
            userAddresses = objectMapper.readValue(jsonData, new TypeReference<Map<String, String>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            userAddresses = new HashMap<>();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> addressData = mapper.readValue(request.getInputStream(), new TypeReference<Map<String, String>>() {});

        String username = addressData.get("username");
        String address = addressData.get("address");

        userAddresses.put(username, address);
        saveAddresses();

        response.getWriter().write("{\"message\": \"Address saved successfully\"}");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(userAddresses));
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

    private void saveAddresses() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Files.write(Paths.get("src/main/resources/addresses.json"), mapper.writeValueAsBytes(userAddresses));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}