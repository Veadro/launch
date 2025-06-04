package launchserver.api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import launch.game.LaunchServerGame;
import launch.utilities.LaunchClientLocation;

public class LaunchRESTServer {
    private final LaunchServerGame game;
    private HttpServer server;

    public LaunchRESTServer(LaunchServerGame game) {
        this.game = game;
    }

    public void start(int port) throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/location", new LocationHandler());
        server.createContext("/build", new BuildHandler());
        server.createContext("/launch", new LaunchHandler());
        server.setExecutor(null);
        server.start();
    }

    private static Map<String, String> queryToMap(String query) {
        Map<String, String> result = new HashMap<>();
        if (query == null) {
            return result;
        }
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length > 1) {
                result.put(pair[0], pair[1]);
            }
        }
        return result;
    }

    private class LocationHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = queryToMap(exchange.getRequestURI().getQuery());
            int playerId = Integer.parseInt(params.getOrDefault("playerId", "0"));
            double lat = Double.parseDouble(params.getOrDefault("lat", "0"));
            double lon = Double.parseDouble(params.getOrDefault("lon", "0"));
            LaunchClientLocation loc = new LaunchClientLocation(lat, lon, 0, "NETWORK");
            game.UpdatePlayerLocation(playerId, loc);
            writeResponse(exchange, "OK");
        }
    }

    private class BuildHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = queryToMap(exchange.getRequestURI().getQuery());
            int playerId = Integer.parseInt(params.getOrDefault("playerId", "0"));
            String type = params.get("type");
            boolean success = false;
            if ("missileSite".equals(type)) {
                success = game.ConstructMissileSite(playerId, false);
            } else if ("nuclearSite".equals(type)) {
                success = game.ConstructMissileSite(playerId, true);
            } else if ("samSite".equals(type)) {
                success = game.ConstructSAMSite(playerId);
            } else if ("sentryGun".equals(type)) {
                success = game.ConstructSentryGun(playerId);
            } else if ("oreMine".equals(type)) {
                success = game.ConstructOreMine(playerId);
            }
            writeResponse(exchange, success ? "OK" : "FAIL");
        }
    }

    private class LaunchHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, String> params = queryToMap(exchange.getRequestURI().getQuery());
            int playerId = Integer.parseInt(params.getOrDefault("playerId", "0"));
            int siteId = Integer.parseInt(params.getOrDefault("siteId", "0"));
            byte slot = (byte) Integer.parseInt(params.getOrDefault("slot", "0"));
            boolean tracking = Boolean.parseBoolean(params.getOrDefault("tracking", "false"));
            double lat = Double.parseDouble(params.getOrDefault("lat", "0"));
            double lon = Double.parseDouble(params.getOrDefault("lon", "0"));
            int target = Integer.parseInt(params.getOrDefault("target", "0"));
            boolean success = game.LaunchMissile(playerId, siteId, slot, tracking, (float) lat, (float) lon, target);
            writeResponse(exchange, success ? "OK" : "FAIL");
        }
    }

    private void writeResponse(HttpExchange exchange, String response) throws IOException {
        exchange.sendResponseHeaders(200, response.length());
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response.getBytes());
        }
    }
}
