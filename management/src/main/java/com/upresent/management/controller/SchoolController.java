package com.upresent.management.controller;

import com.upresent.management.entity.GeoFenceData;
import com.upresent.management.entity.SchoolData;
import com.upresent.management.service.SchoolService;
import com.upresent.management.utils.RestResponse;
import com.upresent.management.utils.RestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/manage/school")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;

    @PostMapping
    public ResponseEntity<RestResponse<String>> createSchool(
            @RequestBody SchoolData schoolInfo) {
        return RestUtils.successResponse(schoolService.createSchool(schoolInfo));
    }

    @PutMapping
    public ResponseEntity<RestResponse<String>> updateSchool(
            @RequestBody SchoolData schoolInfo) {
        return RestUtils.successResponse(schoolService.updateSchool(schoolInfo));
    }

    @DeleteMapping
    public ResponseEntity<RestResponse<String>> deleteSchool(
            @RequestParam String schoolCode, HttpServletRequest request) {
        return RestUtils.successResponse(schoolService.deleteSchool(request, schoolCode));
    }

    @GetMapping
    public ResponseEntity<RestResponse<SchoolData>> getSchool(
            @RequestParam String schoolCode) {
        return RestUtils.successResponse(schoolService.getSchool(schoolCode));
    }

    @GetMapping(path="/all")
    public ResponseEntity<RestResponse<List<SchoolData>>> getAllSchools() {
        return RestUtils.successResponse(schoolService.getAllSchools());
    }

    @GetMapping(path="/geo-fence")
    public ResponseEntity<RestResponse<GeoFenceData>> getGeoFence(@RequestParam String schoolCode) {
        return RestUtils.successResponse(schoolService.fetchGeoFence(schoolCode));
    }
}
