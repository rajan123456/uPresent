package com.upresent.user.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/user")
public class UserController {

    @RequestMapping("/")
    public String index() {
        return "Hello World";
    }
}
