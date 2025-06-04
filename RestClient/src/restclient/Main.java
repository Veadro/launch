package restclient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Very small console interface to the REST client.
 * Commands roughly follow the Android client actions.
 */
public class Main {
    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.err.println("Usage: java restclient.Main <serverBaseUrl>");
            return;
        }
        LaunchRestClient client = new LaunchRestClient(args[0]);
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        System.out.println("Enter commands: location, build, launch or quit");
        String line;
        while ((line = in.readLine()) != null) {
            String[] parts = line.trim().split("\\s+");
            if (parts.length == 0) continue;
            String cmd = parts[0];
            try {
                switch (cmd) {
                    case "location":
                        if (parts.length == 4) {
                            int playerId = Integer.parseInt(parts[1]);
                            double lat = Double.parseDouble(parts[2]);
                            double lon = Double.parseDouble(parts[3]);
                            System.out.println(client.updateLocation(playerId, lat, lon));
                        } else {
                            System.out.println("usage: location <playerId> <lat> <lon>");
                        }
                        break;
                    case "build":
                        if (parts.length == 3) {
                            int playerId = Integer.parseInt(parts[1]);
                            String type = parts[2];
                            System.out.println(client.buildStructure(playerId, type));
                        } else {
                            System.out.println("usage: build <playerId> <type>");
                        }
                        break;
                    case "launch":
                        if (parts.length == 8) {
                            int playerId = Integer.parseInt(parts[1]);
                            int siteId = Integer.parseInt(parts[2]);
                            int slot = Integer.parseInt(parts[3]);
                            boolean track = Boolean.parseBoolean(parts[4]);
                            double lat = Double.parseDouble(parts[5]);
                            double lon = Double.parseDouble(parts[6]);
                            int target = Integer.parseInt(parts[7]);
                            System.out.println(client.launchMissile(playerId, siteId, slot, track, lat, lon, target));
                        } else {
                            System.out.println("usage: launch <playerId> <siteId> <slot> <track> <lat> <lon> <target>");
                        }
                        break;
                    case "quit":
                        return;
                    default:
                        System.out.println("Unknown command");
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
    }
}
