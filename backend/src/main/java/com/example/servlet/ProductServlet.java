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

import com.example.model.Product;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/products")
public class ProductServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private List<Product> products;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        
        // Reload products from file to ensure the latest data is served
        loadProducts();
        
        ObjectMapper mapper = new ObjectMapper();
        resp.getWriter().write(mapper.writeValueAsString(products));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        ObjectMapper mapper = new ObjectMapper();
        Product product = mapper.readValue(req.getInputStream(), Product.class);

        products.add(product);
        resp.getWriter().write(mapper.writeValueAsString(product));

        saveProducts();
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");

        String productId = req.getParameter("id");
        products.removeIf(product -> product.getId() == Integer.parseInt(productId));

        resp.getWriter().write("{\"message\": \"Product removed\"}");

        saveProducts();
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }

    private void saveProducts() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Files.write(Paths.get("src/main/resources/products.json"), mapper.writeValueAsBytes(products));
            System.out.println("Products saved successfully to file.");
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Failed to save products to file.");
        }
    }

    private void loadProducts() {
        try {
            byte[] jsonData = Files.readAllBytes(Paths.get("src/main/resources/products.json"));
            ObjectMapper objectMapper = new ObjectMapper();
            products = objectMapper.readValue(jsonData, new TypeReference<List<Product>>() {});
            System.out.println("Products loaded successfully from file.");
        } catch (IOException e) {
            e.printStackTrace();
            products = new ArrayList<>();
            System.err.println("Failed to load products from file.");
        }
    }
}
