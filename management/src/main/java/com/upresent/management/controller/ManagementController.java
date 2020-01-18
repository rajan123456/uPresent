package com.upresent.management.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/management")
public class ManagementController {
    @RequestMapping("/")
    public String index() {
        return "Hello World";
    }
}
