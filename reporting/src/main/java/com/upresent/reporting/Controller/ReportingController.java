package com.upresent.reporting.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/reporting")
public class ReportingController {

    @RequestMapping("/")
    public String index() {
        int a = Integer.MAX_VALUE;
        int[] ab =null;
        System.out.print(ab.length);
        
        return "Hello World";
    }
}
