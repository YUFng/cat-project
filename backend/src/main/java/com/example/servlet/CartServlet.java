package com.example.servlet;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    private Map<String, Cart> userCarts = new HashMap<>();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        ObjectMapper mapper = new ObjectMapper();
        String username = request.getParameter("username");
        Product product = mapper.readValue(request.getInputStream(), Product.class);

        if (username == null || username.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Username is required");
            return;
        }

        userCarts.putIfAbsent(username, new Cart(username, new ArrayList<>()));
        userCarts.get(username).getProducts().add(product);

        response.getWriter().write("Product " + product.getId() + " added to cart for user " + username + ".");
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        String username = request.getParameter("username");
        String productId = request.getParameter("productId");

        if (username == null || username.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Username is required");
            return;
        }

        if (userCarts.containsKey(username)) {
            Cart cart = userCarts.get(username);
            cart.setProducts(cart.getProducts().stream()
                    .filter(product -> product.getId() != Integer.parseInt(productId))
                    .collect(Collectors.toList()));
            response.getWriter().write("Product " + productId + " removed from cart for user " + username + ".");
        } else {
            response.getWriter().write("No cart found for user " + username + ".");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        String username = request.getParameter("username");

        if (username == null || username.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Username is required");
            return;
        }

        if (userCarts.containsKey(username)) {
            response.getWriter().write(new ObjectMapper().writeValueAsString(userCarts.get(username).getProducts()));
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

    public Cart getCart(String username) {
        return userCarts.get(username);
    }

    public void clearCart(String username) {
        userCarts.remove(username);
    }
}