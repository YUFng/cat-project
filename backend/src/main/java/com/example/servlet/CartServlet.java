package com.example.servlet;

import java.io.IOException;
import java.util.ArrayList;
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

@WebServlet("/cart")
public class CartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private List<Product> cart = new ArrayList<>();
    private List<Product> products = new ArrayList<>();

    @Override
    public void init() throws ServletException {
        super.init();
        // Load products from JSON file or database
        try {
            ObjectMapper mapper = new ObjectMapper();
            products = mapper.readValue(getClass().getClassLoader().getResourceAsStream("products.json"), new TypeReference<List<Product>>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        ObjectMapper mapper = new ObjectMapper();
        Product product = mapper.readValue(request.getInputStream(), Product.class);
        cart.add(product);
        response.getWriter().write("Product " + product.getId() + " added to cart.");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        String productId = request.getParameter("productId");
        cart = cart.stream().filter(product -> !product.getId().equals(productId)).collect(Collectors.toList());
        response.getWriter().write("Product " + productId + " removed from cart.");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.getWriter().write(new ObjectMapper().writeValueAsString(cart));
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from this origin
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
    }
}