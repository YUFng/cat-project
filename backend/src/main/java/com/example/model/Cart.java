package com.example.model;

import java.util.List;

public class Cart {
    private String username;
    private List<Product> products;

    public Cart() {
    }

    public Cart(String username, List<Product> products) {
        this.username = username;
        this.products = products;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}