package com.nyutiz.boatgame;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;

@RestController
@RequestMapping("/api")
public class ApiController {

    public Queue<String> newInfo = new LinkedList<>();
    public Map<String, String> boatMap = new HashMap<>();

    @Autowired
    private HttpServletRequest request;

    @GetMapping("/update")
    public String getUpdate() {
        if (!newInfo.isEmpty()) {
            return newInfo.poll();
        }
        return null;
    }


    @PostMapping("/update")
    public void postUpdate(@RequestBody String message) {
        String address = request.getRemoteAddr();
        String[] command = message.split(";");
        if (command.length >= 1) {
            if (boatMap.containsKey(address))
            {
                if (message.startsWith("MoveForward")) {
                    newInfo.add(address + ";MoveForward");
                }
                else if (message.startsWith("MoveBackward")) {
                    newInfo.add(address + ";MoveBackward");
                }
                else if (message.startsWith("RotateClockwise")) {
                    newInfo.add(address + ";RotateClockwise");
                }
                else if (message.startsWith("RotateCounterClockwise")) {
                    newInfo.add(address + ";RotateCounterClockwise");
                }
                else if (message.startsWith("ClearMove")) {
                    newInfo.add(address + ";ClearMove");
                }
                else if (message.startsWith("Shoot")) {
                    newInfo.add(address + ";Shoot");
                }
            }
            else {
                if (message.startsWith("CreateBoat")) {
                    String name = command[1];
                    boatMap.put(address, name);
                    newInfo.add(address + ";CreateBoat;" + name);
                }
            }

        }

        System.out.println(boatMap);
        System.out.println(newInfo);

        System.out.println("Message reçu depuis JavaScript : " + message);
    }



}