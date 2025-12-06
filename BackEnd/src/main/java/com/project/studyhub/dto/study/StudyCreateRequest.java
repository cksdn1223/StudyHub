package com.project.studyhub.dto.study;

import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.User;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

public record StudyCreateRequest(String title, String description, Integer maxMembers, String frequency, String duration, String[] tags, String address, String detailAddress, String detailLocation, double longitude, double latitude) {
    public static Study from(StudyCreateRequest request, User user) {
        final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Coordinate coordinate = new Coordinate(request.longitude, request.latitude);
        Point point = geometryFactory.createPoint(coordinate);

        return new Study(request.title, request.description, request.maxMembers, request.frequency, request.duration, request.address, request.detailAddress, request.detailLocation, point, user);
    }
}
