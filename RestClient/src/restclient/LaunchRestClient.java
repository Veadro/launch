package restclient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

/**
 * Simple REST client for interacting with the Launch server.
 * Only supports a few commands for now, mirroring the Android client
 * behaviour.
 */
public class LaunchRestClient {
    private final String baseUrl;

    public LaunchRestClient(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    private String callEndpoint(String path, String query) throws IOException {
        URL url = new URL(baseUrl + path + (query != null ? "?" + query : ""));
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            return br.readLine();
        }
    }

    public String updateLocation(int playerId, double lat, double lon) throws IOException {
        String q = "playerId=" + playerId + "&lat=" + lat + "&lon=" + lon;
        return callEndpoint("/location", q);
    }

    public String buildStructure(int playerId, String type) throws IOException {
        String q = "playerId=" + playerId + "&type=" + URLEncoder.encode(type, "UTF-8");
        return callEndpoint("/build", q);
    }

    public String launchMissile(int playerId, int siteId, int slot, boolean tracking,
                               double lat, double lon, int target) throws IOException {
        String q = "playerId=" + playerId +
                   "&siteId=" + siteId +
                   "&slot=" + slot +
                   "&tracking=" + tracking +
                   "&lat=" + lat +
                   "&lon=" + lon +
                   "&target=" + target;
        return callEndpoint("/launch", q);
    }
}
