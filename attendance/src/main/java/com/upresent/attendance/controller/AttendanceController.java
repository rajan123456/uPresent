package com.upresent.attendance.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @RequestMapping("/")
    public String index() {
        return "Hello World";
    }
}
