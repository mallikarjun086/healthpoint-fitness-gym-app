package com.healthpoint.service;

import com.healthpoint.entity.ClassBooking;
import com.healthpoint.entity.ClassSession;
import com.healthpoint.entity.User;
import com.healthpoint.repository.ClassBookingRepository;
import com.healthpoint.repository.ClassSessionRepository;
import com.healthpoint.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClassSessionService {

    private final ClassSessionRepository classSessionRepository;
    private final ClassBookingRepository classBookingRepository;
    private final UserRepository userRepository;

    public ClassSessionService(ClassSessionRepository classSessionRepository,
                               ClassBookingRepository classBookingRepository,
                               UserRepository userRepository) {
        this.classSessionRepository = classSessionRepository;
        this.classBookingRepository = classBookingRepository;
        this.userRepository = userRepository;
    }

    public List<ClassSession> getUpcomingSessions() {
        return classSessionRepository.findBySessionDateGreaterThanEqualOrderBySessionDateAscStartTimeAsc(LocalDate.now());
    }

    public List<ClassBooking> getUserBookings(Long userId) {
        return classBookingRepository.findByUserIdOrderByBookedAtDesc(userId);
    }

    @Transactional
    public ClassBooking bookSession(Long userId, Long classSessionId) {
        if (userId == null || classSessionId == null) {
            throw new IllegalArgumentException("User ID and Class Session ID must not be null");
        }
        ClassSession session = classSessionRepository.findById(classSessionId)
                .orElseThrow(() -> new RuntimeException("Class session not found"));

        Optional<ClassBooking> existing = classBookingRepository.findByUserIdAndClassSessionId(userId, classSessionId);
        if (existing.isPresent() && "CONFIRMED".equalsIgnoreCase(existing.get().getStatus())) {
            throw new RuntimeException("You are already enrolled in this class session");
        }

        if (session.getEnrolledCount() >= session.getCapacity()) {
            throw new RuntimeException("Class session is at maximum capacity");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ClassBooking booking = existing.orElse(new ClassBooking());
        booking.setUser(user);
        booking.setClassSession(session);
        booking.setStatus("CONFIRMED");
        booking.setBookedAt(LocalDateTime.now());

        session.setEnrolledCount(session.getEnrolledCount() + 1);
        classSessionRepository.save(session);

        return classBookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        if (bookingId == null) {
            throw new IllegalArgumentException("Booking ID must not be null");
        }
        ClassBooking booking = classBookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        ClassSession session = booking.getClassSession();
        if (session != null && session.getEnrolledCount() > 0) {
            session.setEnrolledCount(session.getEnrolledCount() - 1);
            classSessionRepository.save(session);
        }
        classBookingRepository.save(booking);
    }

    public ClassSession createSession(ClassSession session) {
        if (session == null) {
            throw new IllegalArgumentException("Session must not be null");
        }
        return classSessionRepository.save(session);
    }
}
