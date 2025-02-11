package com.example.ECommerce.Project.V1.V1.Repository;

import com.example.ECommerce.Project.V1.Model.SizeChart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SizeChartRepository extends JpaRepository<SizeChart, Integer> {
}
