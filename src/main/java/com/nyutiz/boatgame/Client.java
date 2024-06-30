package com.nyutiz.boatgame;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class Client {

    static String server = "http://localhost:8080/api/update";


    public static void main(String[] args) {
        String boatName = "GABIGABOCHE";

        Scanner sc = new Scanner(System.in);
        System.out.print("Command : ");
        while(sc.hasNextLine()) {
            String line = sc.nextLine();
            sendPost(line);
            System.out.print("Command : ");
        }
    }

    public static void sendPost(String text) {
        try {
            URL url = new URL(server);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "text/plain");
            conn.setDoOutput(true);
            byte[] requestBody = text.getBytes(StandardCharsets.UTF_8);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(requestBody);
            }
            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                System.out.println("Requête POST envoyée avec succès.");
            } else {
                System.out.println("Erreur lors de l'envoi de la requête : " + responseCode);
            }

            conn.disconnect();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

}
