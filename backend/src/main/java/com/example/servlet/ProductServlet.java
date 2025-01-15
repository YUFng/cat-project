package com.example.servlet;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.model.Product;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/products")
public class ProductServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private List<Product> products;

    public ProductServlet() {
        try {
            // Read products from JSON file
            byte[] jsonData = Files.readAllBytes(Paths.get("src/main/resources/products.json"));
            ObjectMapper objectMapper = new ObjectMapper();
            products = objectMapper.readValue(jsonData, new TypeReference<List<Product>>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        resp.getWriter().write(mapper.writeValueAsString(products));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        // Read the request body
        ObjectMapper mapper = new ObjectMapper();
        Product product = mapper.readValue(req.getInputStream(), Product.class);

        // Add the product to the list
        products.add(product);

        // Write the response
        resp.getWriter().write(mapper.writeValueAsString(product));

        // Save the updated product list to the JSON file
        try {
            Files.write(Paths.get("src/main/resources/products.json"), mapper.writeValueAsBytes(products));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        // Get the product ID from the request
        String productId = req.getParameter("id");

        // Remove the product from the list
        products = products.stream()
                .filter(product -> product.getId() != Integer.parseInt(productId))
                .collect(Collectors.toList());

        // Write the response
        ObjectMapper mapper = new ObjectMapper();
        resp.getWriter().write("{\"message\": \"Product removed\"}");

        // Save the updated product list to the JSON file
        try {
            Files.write(Paths.get("src/main/resources/products.json"), mapper.writeValueAsBytes(products));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from this origin
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
    }
}