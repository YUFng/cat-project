package com.example.servlet;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.model.Cart;
import com.example.model.Product;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/cart")
public class CartServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final Map<String, Cart> userCarts = new HashMap<>();
    private List<Product> products;

    public CartServlet() {
        loadProducts();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> requestBody = mapper.readValue(request.getInputStream(), new TypeReference<Map<String, Object>>() {});
        String sessionId = request.getSession().getId();
        Product product = mapper.convertValue(requestBody.get("product"), Product.class);

        userCarts.putIfAbsent(sessionId, new Cart());
        userCarts.get(sessionId).addProduct(product);

        // Deduct inventory
        for (Product p : products) {
            if (p.getId() == product.getId()) {
                p.setInventory(p.getInventory() - 1);
                break;
            }
        }

        // Save the updated product list to the JSON file
        saveProducts();

        response.getWriter().write("Product " + product.getId() + " added to cart.");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        String sessionId = request.getSession().getId();
        String productId = request.getParameter("productId");

        if (productId == null) {
            // Clear the entire cart
            userCarts.remove(sessionId);
            response.getWriter().write("Cart cleared.");
        } else {
            // Remove a specific product from the cart
            if (userCarts.containsKey(sessionId)) {
                Cart cart = userCarts.get(sessionId);
                cart.removeProduct(Integer.parseInt(productId));

                // Restore inventory
                for (Product p : products) {
                    if (p.getId() == Integer.parseInt(productId)) {
                        p.setInventory(p.getInventory() + 1);
                        break;
                    }
                }

                // Save the updated product list to the JSON file
                saveProducts();

                response.getWriter().write("Product " + productId + " removed from cart.");
            } else {
                response.getWriter().write("No cart found.");
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        String sessionId = request.getSession().getId();

        if (userCarts.containsKey(sessionId)) {
            response.getWriter().write(new ObjectMapper().writeValueAsString(userCarts.get(sessionId).getProducts()));
        } else {
            response.getWriter().write("[]");
        }
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

    private void saveProducts() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Files.write(Paths.get("src/main/resources/products.json"), mapper.writeValueAsBytes(products));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void loadProducts() {
        try {
            byte[] jsonData = Files.readAllBytes(Paths.get("src/main/resources/products.json"));
            ObjectMapper objectMapper = new ObjectMapper();
            products = objectMapper.readValue(jsonData, new TypeReference<List<Product>>() {});
        } catch (IOException e) {
            e.printStackTrace();
            products = new ArrayList<>();
        }
    }

    public Cart getCart(String sessionId) {
        return userCarts.get(sessionId);
    }

    public void clearCart(String sessionId) {
        userCarts.remove(sessionId);
    }
}