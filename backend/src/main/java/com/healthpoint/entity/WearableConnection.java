package com.healthpoint.entity;

import com.healthpoint.util.Aes256Converter;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "wearable_connections", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_wearable_provider", columnNames = {"user_id", "provider"})
})
@Data
public class WearableConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String provider; // 'APPLE_HEALTH', 'GOOGLE_FIT', 'WHOOP', 'OURA', 'GARMIN', 'SIMULATOR'

    @Column(name = "is_connected")
    private Boolean isConnected = true;

    @Convert(converter = Aes256Converter.class)
    @Column(name = "access_token_enc", columnDefinition = "TEXT")
    private String accessToken;

    @Convert(converter = Aes256Converter.class)
    @Column(name = "refresh_token_enc", columnDefinition = "TEXT")
    private String refreshToken;

    @Column(name = "sync_status")
    private String syncStatus = "SYNCED"; // 'SYNCED', 'PENDING', 'AUTH_EXPIRED', 'DISCONNECTED'

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt = LocalDateTime.now();

    @Column(name = "device_name")
    private String deviceName; // e.g. "Apple Watch Ultra 2", "Whoop 4.0 Strap", "Pixel Watch 2"

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
