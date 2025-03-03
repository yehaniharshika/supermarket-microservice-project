const express = require("express");

const { Eureka } = require("eureka-js-client");

const app = express();
const port = 3001;

const router = express.Router();

// Inventory Service Route
router.get("/inventory", (req, res) => {
    res.json({
        items: ["Milk", "Eggs", "Bread"],
        message: "Welcome to the Inventory Service",
    });
});

app.use("/inventory-service", router);

// Eureka Client Configuration
const eurekaClient = new Eureka({
    instance: {
        instanceId: "inventory-service",
        app: "INVENTORY-SERVICE",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        port: {
            $: port,   // Ensure it matches app's running port
            "@enabled": true,
        },
        vipAddress: "inventory-service",
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn",
        },
    },
    eureka: {
        host: "localhost",
        port: 8761,
    },
});

// Start Express Server
app.listen(port, () => {
    console.log(`Inventory service running at http://localhost:${port}`);

    // Start Eureka Client
    eurekaClient.start((error) => {
        if (error) {
            console.error("Eureka registration failed:", error);
        } else {
            console.log("Eureka registration successful!");
        }
    });

});
