package com.example.servlet;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.model.Cart;
import com.example.model.Order;
import com.example.model.Product;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/orders")
public class OrderServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final CartServlet cartServlet;
    private List<Order> orders;
    private List<Product> products;
    private final Object lock = new Object();

    public OrderServlet() {
        try {
            // Read orders from JSON file
            byte[] jsonData = Files.readAllBytes(Paths.get("src/main/resources/orders.json"));
            ObjectMapper objectMapper = new ObjectMapper();
            orders = objectMapper.readValue(jsonData, new TypeReference<List<Order>>() {});

            // Read products from JSON file
            byte[] productData = Files.readAllBytes(Paths.get("src/main/resources/products.json"));
            products = objectMapper.readValue(productData, new TypeReference<List<Product>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            orders = new ArrayList<>();
            products = new ArrayList<>();
        }
        cartServlet = new CartServlet();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        ObjectMapper mapper = new ObjectMapper();
        Order order = mapper.readValue(request.getInputStream(), Order.class);

        // Generate a unique order ID
        order.setId(UUID.randomUUID().toString());

        // Get the cart for the session and transfer products to the order
        String sessionId = request.getSession().getId();
        Cart cart = cartServlet.getCart(sessionId);
        if (cart != null) {
            order.setProducts(cart.getProducts());
        }

        synchronized (lock) { // Synchronize inventory updates
            for (Product orderedProduct : order.getProducts()) {
                for (Product p : products) {
                    if (p.getId() == orderedProduct.getId()) {
                        if (p.getInventory() >= orderedProduct.getQuantity()) {
                            p.setInventory(p.getInventory() - orderedProduct.getQuantity());
                            System.out.println("Deducted inventory for product ID: " + p.getId() + ", new inventory: " + p.getInventory());
                        } else {
                            System.err.println("Insufficient inventory for product ID: " + p.getId());
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            response.getWriter().write("Insufficient inventory for product ID: " + p.getId());
                            return;
                        }
                        break;
                    }
                }
            }
            saveProducts(); // Save changes to file
        }

        orders.add(order);
        saveOrders();

        // Clear the cart for the session
        cartServlet.clearCart(sessionId);

        response.getWriter()
                .write("{\"message\": \"Order saved successfully\", \"orderId\": \"" + order.getId() + "\"}");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");

        response.getWriter().write(new ObjectMapper().writeValueAsString(orders));
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow requests from this origin
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials
    }

    private void saveOrders() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Files.write(Paths.get("src/main/resources/orders.json"), mapper.writeValueAsBytes(orders));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void saveProducts() {
        synchronized (lock) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String jsonContent = mapper.writeValueAsString(products);
                System.out.println("Saving products to file: " + jsonContent); // Debugging log
                Files.write(Paths.get("src/main/resources/products.json"), jsonContent.getBytes());
                System.out.println("Products saved successfully to file.");
            } catch (IOException e) {
                e.printStackTrace();
                System.err.println("Failed to save products to file.");
            }
        }
    }
}