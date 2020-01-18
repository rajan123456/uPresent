package com.upresent.metrics.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/metrics")
public class MetricsController {

    @RequestMapping("/")
    public String index() {
        return "Hello World";
    }
}
