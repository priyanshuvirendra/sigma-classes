package com.sigma.backend.repository;

import com.sigma.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository
        extends JpaRepository<Course, Long> {

    List<Course> findByActiveTrue();

    @Query("""
    SELECT DISTINCT c
    FROM Course c
    JOIN c.faculty f
    WHERE f = :username
""")
List<Course> findCoursesByFacultyUsername(
        @Param("username") String username
);

}

