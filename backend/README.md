# Simple Tomcat Application

This is a simple backend test application built using Apache Tomcat without the Spring framework. The application includes a servlet for handling product data and a basic frontend interface.

## Project Structure

```
simple-tomcat-app
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           ├── servlet
│   │   │           │   └── ProductServlet.java
│   │   │           └── model
│   │   │               └── Product.java
│   │   ├── resources
│   │   │   └── META-INF
│   │   │       └── context.xml
│   │   └── webapp
│   │       ├── WEB-INF
│   │       │   ├── web.xml
│   │       │   └── lib
│   │       └── index.html
├── pom.xml
└── README.md
```

## Setup Instructions

1. **Prerequisites**: Ensure you have Java and Apache Tomcat installed on your machine.

2. **Clone the Repository**: Clone this repository to your local machine.

3. **Build the Project**: Navigate to the project directory and run the following command to build the project using Maven:
   ```
   mvn clean install
   ```

4. **Deploy the Application**: Copy the generated WAR file from the `target` directory to the `webapps` folder of your Tomcat installation.

5. **Start Tomcat**: Start the Tomcat server. You can do this by running the `startup.sh` (Linux/Mac) or `startup.bat` (Windows) script located in the `bin` directory of your Tomcat installation.

6. **Access the Application**: Open a web browser and navigate to `http://localhost:8080/simple-tomcat-app` to access the application.

## Usage Guidelines

- The application provides a simple interface to manage product data.
- You can interact with the `ProductServlet` to perform operations such as adding and retrieving products.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.