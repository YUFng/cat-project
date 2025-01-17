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
    private final Object lock = new Object();

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
        int quantity = (int) requestBody.get("quantity");

        userCarts.putIfAbsent(sessionId, new Cart());
        Cart cart = userCarts.get(sessionId);
        product.setQuantity(quantity); // Set the quantity

        synchronized (lock) { // Synchronize inventory updates
            boolean productFound = false;
            for (Product p : products) {
                if (p.getId() == product.getId()) {
                    productFound = true;
                    if (p.getInventory() >= quantity) {
                        p.setInventory(p.getInventory() - quantity);
                        System.out.println("Deducted inventory for product ID: " + p.getId() + ", new inventory: " + p.getInventory());
                        saveProducts(); // Save changes to file
                    } else {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        response.getWriter().write("Insufficient inventory for product ID: " + p.getId());
                        return;
                    }
                    break;
                }
            }
            if (!productFound) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("Product not found for ID: " + product.getId());
                return;
            }
        }

        cart.addProduct(product);
        response.getWriter().write("Product " + product.getId() + " added to cart with quantity " + quantity);
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

                response.getWriter().write("Product " + productId + " removed from cart.");
            } else {
                response.getWriter().write("No cart found.");
            }
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        setCorsHeaders(response);
        String sessionId = request.getSession().getId();
        Cart cart = userCarts.get(sessionId);

        if (cart != null) {
            response.getWriter().write(new ObjectMapper().writeValueAsString(cart.getProducts()));
        } else {
            response.getWriter().write("[]");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from this origin
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
    }

    private void saveProducts() {
        synchronized (lock) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String jsonContent = mapper.writeValueAsString(products);
                System.out.println("Saving products to file: " + jsonContent); // Debugging log
                Files.createDirectories(Paths.get("src/main/resources"));
                Files.write(Paths.get("src/main/resources/products.json"), jsonContent.getBytes());
                System.out.println("Products saved successfully to file.");
            } catch (IOException e) {
                e.printStackTrace();
                System.err.println("Failed to save products to file.");
            }
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

    public Cart getCart(String sessionId) {
        return userCarts.get(sessionId);
    }

    public void clearCart(String sessionId) {
        userCarts.remove(sessionId);
    }
}
