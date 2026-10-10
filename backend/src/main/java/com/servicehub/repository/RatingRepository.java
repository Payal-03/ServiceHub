package com.servicehub.repository;

import com.servicehub.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    boolean existsByRequest_RequestIdAndReviewerUser_UserId(Long requestId, Long reviewerUserId);

    Optional<Rating> findByRequest_RequestIdAndReviewerUser_UserId(Long requestId, Long reviewerUserId);

    List<Rating> findByRequest_RequestId(Long requestId);

    List<Rating> findByRevieweeUser_UserIdOrderByCreatedAtDesc(Long revieweeUserId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.revieweeUser.userId = :revieweeUserId")
    Double calculateAverageScoreByUserId(@Param("revieweeUserId") Long revieweeUserId);

    long countByRevieweeUser_UserId(Long revieweeUserId);
}
