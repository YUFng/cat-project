package com.example.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class ClientHandler implements Runnable {
    private final Socket clientSocket;

    public ClientHandler(Socket clientSocket) {
        this.clientSocket = clientSocket;
    }

    @Override
    public void run() {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true)) {
            String line;
            StringBuilder request = new StringBuilder();
            while ((line = in.readLine()) != null) {
                if (line.isEmpty()) break;
                request.append(line).append("\n");
            }
            String requestLine = request.toString().split("\n")[0];
            String path = requestLine.split(" ")[1];

            String response;
            if (path.equals("/admin")) {
                response = "<html><body><h1>Admin Dashboard</h1></body></html>";
            } else if (path.equals("/user")) {
                response = "<html><body><h1>User Dashboard</h1></body></html>";
            } else {
                response = "<html><body><h1>Welcome to the E-Commerce Website</h1></body></html>";
            }

            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: text/html");
            out.println("Content-Length: " + response.length());
            out.println();
            out.println(response);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}