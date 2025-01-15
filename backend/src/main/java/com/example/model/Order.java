package com.example.model;

import java.util.List;

public class Order {
    private String id;
    private String username;
    private String address;
    private List<Product> products;
    private String paymentMethod;

    public Order() {}

    public Order(String id, String username, String address, List<Product> products, String paymentMethod) {
        this.id = id;
        this.username = username;
        this.address = address;
        this.products = products;
        this.paymentMethod = paymentMethod;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}