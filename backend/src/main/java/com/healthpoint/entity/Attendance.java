package com.healthpoint.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "attendance_date")
    private LocalDate attendanceDate = LocalDate.now();
    
    @Column(name = "check_in_time")
    private LocalDateTime checkInTime = LocalDateTime.now();

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    private String status = "PRESENT"; // PRESENT, LATE, EXCUSED

    @Column(name = "branch_name")
    private String branchName = "Main Flagship";

    // Helper getter/setter for compatibility
    public LocalDate getCheckInDate() {
        return attendanceDate;
    }
    public void setCheckInDate(LocalDate date) {
        this.attendanceDate = date;
    }
}

