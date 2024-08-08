package com.example.restea.teatime.validation;

import com.example.restea.teatime.dto.TeatimeCreationRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDateTime;

public class BroadcastDateAfterEndDateValidator implements
        ConstraintValidator<BroadcastDateAfterEndDate, TeatimeCreationRequest> {
    @Override
    public boolean isValid(TeatimeCreationRequest dto, ConstraintValidatorContext context) {
        LocalDateTime endDate = dto.getEndDate();
        LocalDateTime broadcastDate = dto.getBroadcastDate();

        if (endDate == null || broadcastDate == null) {
            return true;
        }

        return broadcastDate.isAfter(endDate);
    }
}
