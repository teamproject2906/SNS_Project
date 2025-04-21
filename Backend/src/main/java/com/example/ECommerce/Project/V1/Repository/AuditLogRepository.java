package com.example.ECommerce.Project.V1.Repository;

import com.example.ECommerce.Project.V1.Model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {

}
