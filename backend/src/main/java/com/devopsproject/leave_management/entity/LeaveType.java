package com.devopsproject.leave_management.entity;

import java.util.Arrays;
import java.util.Optional;

public enum LeaveType {

    ANNUAL_LEAVE("Annual Leave", 14),
    CASUAL_LEAVE("Casual Leave", 7),
    SICK_LEAVE("Sick Leave", 10),
    UNPAID_LEAVE("Unpaid Leave", null);

    private final String displayName;
    private final Integer defaultQuota;

    LeaveType(String displayName, Integer defaultQuota) {
        this.displayName = displayName;
        this.defaultQuota = defaultQuota;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Integer getDefaultQuota() {
        return defaultQuota;
    }

    public boolean isUnlimited() {
        return defaultQuota == null;
    }

    public static Optional<LeaveType> fromString(String text) {
        if (text == null || text.isBlank()) {
            return Optional.empty();
        }

        String clean = text.trim();

        return Arrays.stream(values())
                .filter(lt -> lt.name().equalsIgnoreCase(clean)
                        || lt.displayName.equalsIgnoreCase(clean)
                        || (clean.equalsIgnoreCase("ANNUAL") && lt == ANNUAL_LEAVE)
                        || (clean.equalsIgnoreCase("CASUAL") && lt == CASUAL_LEAVE)
                        || (clean.equalsIgnoreCase("SICK") && lt == SICK_LEAVE)
                        || (clean.equalsIgnoreCase("UNPAID") && lt == UNPAID_LEAVE))
                .findFirst();
    }
}
