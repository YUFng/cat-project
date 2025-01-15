package com.example.servlet;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.example.model.Order;
import com.example.model.Cart;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebServlet("/orders")
public class OrderServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private List<Order> orders;
    private CartServlet cartServlet;

    public OrderServlet() {
        try {
            // Read orders from JSON file
            byte[] jsonData = Files.readAllBytes(Paths.get("src/main/resources/orders.json"));
            ObjectMapper objectMapper = new ObjectMapper();
            orders = objectMapper.readValue(jsonData, new TypeReference<List<Order>>() {
            });
        } catch (IOException e) {
            e.printStackTrace();
            orders = new ArrayList<>();
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

        // Get the cart for the user and transfer products to the order
        Cart cart = cartServlet.getCart(order.getUsername());
        if (cart != null) {
            order.setProducts(cart.getProducts());
        }

        orders.add(order);
        saveOrders();

        // Clear the cart for the user
        cartServlet.clearCart(order.getUsername());

        response.getWriter()
                .write("{\"message\": \"Order saved successfully\", \"orderId\": \"" + order.getId() + "\"}");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");

        String username = request.getParameter("username");
        if (username != null) {
            List<Order> userOrders = orders.stream()
                    .filter(order -> order.getUsername().equals(username))
                    .collect(Collectors.toList());
            response.getWriter().write(new ObjectMapper().writeValueAsString(userOrders));
        } else {
            response.getWriter().write(new ObjectMapper().writeValueAsString(orders));
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
}